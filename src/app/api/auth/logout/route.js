import { NextResponse } from "next/server";
import { clearSessionCookie, getCurrentAdmin } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function POST() {
  const admin = await getCurrentAdmin();
  clearSessionCookie();
  if (admin) await logger.info("خروج ادمین", null, admin.username);
  return NextResponse.json({ ok: true });
}
