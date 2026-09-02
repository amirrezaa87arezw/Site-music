import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function DELETE(_request, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  if (admin.role !== "SUPER") {
    return NextResponse.json({ error: "فقط مدیر اصلی مجاز است" }, { status: 403 });
  }
  if (params.id === admin.id) {
    return NextResponse.json({ error: "نمی‌توانید حساب خودتان را حذف کنید" }, { status: 400 });
  }

  const target = await prisma.admin.findUnique({ where: { id: params.id } });
  if (!target) return NextResponse.json({ error: "ادمین پیدا نشد" }, { status: 404 });

  if (target.role === "SUPER") {
    const superCount = await prisma.admin.count({ where: { role: "SUPER" } });
    if (superCount <= 1) {
      return NextResponse.json(
        { error: "نمی‌توانید آخرین مدیر اصلی را حذف کنید" },
        { status: 400 }
      );
    }
  }

  await prisma.admin.delete({ where: { id: params.id } });
  await logger.warn("ادمین حذف شد", { removed: target.username }, admin.username);
  return NextResponse.json({ ok: true });
}
