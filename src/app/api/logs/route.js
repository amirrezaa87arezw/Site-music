import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level");
  const take = Math.min(Number(searchParams.get("take")) || 100, 300);

  const logs = await prisma.log.findMany({
    where: level ? { level } : undefined,
    orderBy: { createdAt: "desc" },
    take
  });

  return NextResponse.json({ logs });
}
