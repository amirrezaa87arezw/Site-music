import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin, hashPassword } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });

  const admins = await prisma.admin.findMany({
    select: { id: true, username: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" }
  });
  return NextResponse.json({ admins });
}

export async function POST(request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  if (admin.role !== "SUPER") {
    return NextResponse.json(
      { error: "فقط مدیر اصلی می‌تواند ادمین جدید اضافه کند" },
      { status: 403 }
    );
  }

  const { username, password, role } = await request.json();
  if (!username || !password || password.length < 6) {
    return NextResponse.json(
      { error: "نام کاربری و رمز عبور (حداقل ۶ کاراکتر) الزامی است" },
      { status: 400 }
    );
  }

  const exists = await prisma.admin.findUnique({ where: { username } });
  if (exists) {
    return NextResponse.json({ error: "این نام کاربری قبلاً ثبت شده" }, { status: 409 });
  }

  const newAdmin = await prisma.admin.create({
    data: {
      username,
      passwordHash: hashPassword(password),
      role: role === "SUPER" ? "SUPER" : "ADMIN",
      createdById: admin.id
    }
  });

  await logger.info(
    "ادمین جدید اضافه شد",
    { newAdmin: newAdmin.username, role: newAdmin.role },
    admin.username
  );

  return NextResponse.json({
    ok: true,
    admin: { id: newAdmin.id, username: newAdmin.username, role: newAdmin.role }
  });
}
