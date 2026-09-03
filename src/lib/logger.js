import { prisma } from "./prisma";

/**
 * سیستم لاگ‌گیری مرکزی سایت.
 * هر رویداد مهم (لاگین، آپلود، خطا و ...) از اینجا رد می‌شود
 * و هم در دیتابیس ذخیره می‌شود (قابل مشاهده در پنل مدیریت > لاگ‌ها)
 * و هم در کنسول سرور چاپ می‌شود (قابل مشاهده در Railway Logs).
 */
async function write(level, message, meta, actor) {
  const line = `[${level}] ${message}${meta ? " | " + JSON.stringify(meta) : ""}`;
  if (level === "ERROR") console.error(line);
  else if (level === "WARN") console.warn(line);
  else console.log(line);

  try {
    await prisma.log.create({
      data: {
        level,
        message,
        meta: meta ? JSON.stringify(meta) : null,
        actor: actor || null
      }
    });
  } catch (err) {
    // اگر خود دیتابیس مشکل داشت، حداقل در کنسول ثبت شود
    console.error("[LOGGER_DB_FAIL]", err?.message);
  }
}

export const logger = {
  info: (message, meta, actor) => write("INFO", message, meta, actor),
  warn: (message, meta, actor) => write("WARN", message, meta, actor),
  error: (message, meta, actor) => write("ERROR", message, meta, actor)
};
