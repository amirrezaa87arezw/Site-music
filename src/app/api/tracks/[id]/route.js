import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function PATCH(request, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }
  const body = await request.json();
  const data = {};
  if (typeof body.title === "string") data.title = body.title.trim();
  if (typeof body.artist === "string") data.artist = body.artist.trim();
  if (typeof body.order === "number") data.order = body.order;
  if (typeof body.featured === "boolean") data.featured = body.featured;

  const track = await prisma.track.update({ where: { id: params.id }, data });
  await logger.info("آهنگ ویرایش شد", { trackId: params.id }, admin.username);
  return NextResponse.json({ ok: true, track });
}

export async function DELETE(_request, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }
  await prisma.track.delete({ where: { id: params.id } });
  await logger.warn("آهنگ حذف شد", { trackId: params.id }, admin.username);
  return NextResponse.json({ ok: true });
}

export async function POST(request, { params }) {
  // افزایش شمارنده پخش - عمومی، بدون نیاز به ورود
  if (params.id === "increment-noop") return NextResponse.json({ ok: true });
  try {
    const track = await prisma.track.update({
      where: { id: params.id },
      data: { playCount: { increment: 1 } }
    });
    return NextResponse.json({ ok: true, playCount: track.playCount });
  } catch {
    return NextResponse.json({ error: "آهنگ پیدا نشد" }, { status: 404 });
  }
}
