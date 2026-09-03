import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SECRET = process.env.SESSION_SECRET || "psycho-dev-secret-change-me";
const COOKIE_NAME = "psycho_session";
const MAX_AGE = 60 * 60 * 24 * 7; // یک هفته

export function hashPassword(plain) {
  return bcrypt.hashSync(plain, 10);
}

export function verifyPassword(plain, hash) {
  return bcrypt.compareSync(plain, hash);
}

export function signSession(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: MAX_AGE });
}

export function verifySessionToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export function setSessionCookie(token) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

/**
 * سشن جاری را از کوکی می‌خواند و در صورت معتبر بودن، ادمین را از دیتابیس برمی‌گرداند.
 * برای استفاده در Server Component ها و Route Handler ها.
 */
export async function getCurrentAdmin() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifySessionToken(token);
  if (!payload?.id) return null;
  const admin = await prisma.admin.findUnique({ where: { id: payload.id } });
  if (!admin) return null;
  return { id: admin.id, username: admin.username, role: admin.role };
}

export { COOKIE_NAME };
