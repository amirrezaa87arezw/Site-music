import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signSession, setSessionCookie } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "نام کاربری و رمز عبور را وارد کنید" },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({ where: { username } });

    if (!admin || !verifyPassword(password, admin.passwordHash)) {
      await logger.warn("تلاش ناموفق برای ورود", { username });
      return NextResponse.json(
        { error: "نام کاربری یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    const token = signSession({ id: admin.id, role: admin.role });
    setSessionCookie(token);

    await logger.info("ورود موفق ادمین", { username }, admin.username);

    return NextResponse.json({
      ok: true,
      admin: { id: admin.id, username: admin.username, role: admin.role }
    });
  } catch (err) {
    await logger.error("خطا در فرآیند ورود", { message: err.message });
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
