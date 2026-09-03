import { NextResponse } from "next/server";
import AdmZip from "adm-zip";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { logger } from "@/lib/logger";

/**
 * دانلود یک فایل بکاپ کامل: شامل اطلاعات دیتابیس (آهنگ‌ها با فایل‌های
 * صوتی/کاور به‌صورت base64 داخل خودشان، و ادمین‌ها). چون همه‌چیز الان در
 * دیتابیس Postgres ذخیره می‌شود (نه دیسک)، این بکاپ همه‌چیز لازم برای
 * بازسازی کامل سایت روی یک پروژه‌ی جدید Railway را دارد.
 */
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    const [tracks, admins] = await Promise.all([
      prisma.track.findMany(),
      prisma.admin.findMany()
    ]);

    const exportedTracks = tracks.map((t) => ({
      ...t,
      coverData: t.coverData ? Buffer.from(t.coverData).toString("base64") : null,
      audioData: t.audioData ? Buffer.from(t.audioData).toString("base64") : null,
      audio128Data: t.audio128Data ? Buffer.from(t.audio128Data).toString("base64") : null
    }));

    const zip = new AdmZip();
    zip.addFile(
      "db.json",
      Buffer.from(
        JSON.stringify(
          { exportedAt: new Date().toISOString(), tracks: exportedTracks, admins },
          null,
          2
        )
      )
    );

    const buffer = zip.toBuffer();
    await logger.info(
      "فایل بکاپ ساخته و دانلود شد",
      { tracks: tracks.length, admins: admins.length },
      admin.username
    );

    const filename = `psycho-backup-${new Date().toISOString().slice(0, 10)}.zip`;
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    });
  } catch (err) {
    await logger.error("خطا در ساخت بکاپ", { message: err.message }, admin.username);
    return NextResponse.json({ error: "خطا در ساخت فایل بکاپ" }, { status: 500 });
  }
}

/**
 * بازیابی از یک فایل بکاپ. ادمین‌ها بر اساس نام‌کاربری و آهنگ‌ها بر اساس
 * شناسه، merge می‌شوند (اگر از قبل وجود داشته باشند، به‌روزرسانی می‌شوند
 * وگرنه ساخته می‌شوند) - چیزی حذف نمی‌شود.
 */
export async function POST(request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("backup");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "فایل بکاپ ارسال نشده" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();

    const dbEntry = entries.find((e) => e.entryName === "db.json");
    if (!dbEntry) {
      return NextResponse.json({ error: "فایل بکاپ نامعتبر است (db.json پیدا نشد)" }, { status: 400 });
    }
    const { tracks = [], admins = [] } = JSON.parse(dbEntry.getData().toString("utf-8"));

    // بازگردانی ادمین‌ها (بر اساس نام‌کاربری - آپدیت یا ساخت)
    let restoredAdmins = 0;
    for (const a of admins) {
      if (!a.username || !a.passwordHash) continue;
      await prisma.admin.upsert({
        where: { username: a.username },
        update: { passwordHash: a.passwordHash, role: a.role || "ADMIN" },
        create: {
          username: a.username,
          passwordHash: a.passwordHash,
          role: a.role || "ADMIN"
        }
      });
      restoredAdmins++;
    }

    // بازگردانی آهنگ‌ها (بر اساس id - آپدیت یا ساخت)
    let restoredTracks = 0;
    for (const t of tracks) {
      if (!t.id || !t.title || !t.audioData || !t.coverData) continue;
      const data = {
        title: t.title,
        artist: t.artist,
        coverData: Buffer.from(t.coverData, "base64"),
        coverMime: t.coverMime,
        audioData: Buffer.from(t.audioData, "base64"),
        audioMime: t.audioMime,
        audio128Data: t.audio128Data ? Buffer.from(t.audio128Data, "base64") : null,
        audio128Mime: t.audio128Mime || null,
        featured: !!t.featured,
        order: t.order || 0,
        playCount: t.playCount || 0
      };
      await prisma.track.upsert({
        where: { id: t.id },
        update: data,
        create: { id: t.id, ...data }
      });
      restoredTracks++;
    }

    await logger.info(
      "بازیابی از فایل بکاپ انجام شد",
      { restoredTracks, restoredAdmins },
      admin.username
    );

    return NextResponse.json({ ok: true, restoredTracks, restoredAdmins });
  } catch (err) {
    await logger.error("خطا در بازیابی بکاپ", { message: err.message }, admin.username);
    return NextResponse.json({ error: err.message || "خطا در پردازش فایل بکاپ" }, { status: 500 });
  }
}
