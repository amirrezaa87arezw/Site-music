import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { saveAudioFile, saveCoverFile, transcodeTo128, urlToAbsolutePath } from "@/lib/upload";
import { logger } from "@/lib/logger";

export async function GET() {
  const tracks = await prisma.track.findMany({
    orderBy: [{ order: "asc" }, { releaseDate: "desc" }]
  });
  return NextResponse.json({ tracks });
}

export async function POST(request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString().trim();
    const artist = formData.get("artist")?.toString().trim() || "Psycho";
    const featured = formData.get("featured") === "true";
    const audioFile = formData.get("audio");
    const coverFile = formData.get("cover");

    if (!title) {
      return NextResponse.json({ error: "عنوان آهنگ الزامی است" }, { status: 400 });
    }
    if (!audioFile || typeof audioFile === "string") {
      return NextResponse.json({ error: "فایل صوتی الزامی است" }, { status: 400 });
    }
    if (!coverFile || typeof coverFile === "string") {
      return NextResponse.json({ error: "تصویر کاور الزامی است" }, { status: 400 });
    }

    const audioUrl = await saveAudioFile(audioFile);
    const coverUrl = await saveCoverFile(coverFile);

    // نسخه فشرده ۱۲۸kbps برای دانلود سریع‌تر - اگر ترنسکد شکست بخورد، مشکلی نیست
    const audioUrl128 = await transcodeTo128(urlToAbsolutePath(audioUrl));

    const track = await prisma.track.create({
      data: {
        title,
        artist,
        audioUrl,
        audioUrl128,
        coverUrl,
        featured,
        uploadedBy: admin.username
      }
    });

    await logger.info("آهنگ جدید آپلود شد", { trackId: track.id, title }, admin.username);

    return NextResponse.json({ ok: true, track });
  } catch (err) {
    await logger.error("خطا در آپلود آهنگ", { message: err.message }, admin.username);
    return NextResponse.json({ error: err.message || "خطای سرور" }, { status: 500 });
  }
}
