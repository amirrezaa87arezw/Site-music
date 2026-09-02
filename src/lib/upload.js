import { writeFile, mkdir } from "fs/promises";
import path from "path";

const AUDIO_EXT = [".mp3", ".wav", ".m4a", ".ogg"];
const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp"];

function safeExt(filename, allowed) {
  const ext = path.extname(filename || "").toLowerCase();
  return allowed.includes(ext) ? ext : null;
}

function randomName() {
  return (
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9)
  );
}

async function saveFile(file, subdir, allowedExt, maxBytes) {
  if (!file || typeof file === "string") {
    throw new Error("فایلی ارسال نشده است");
  }
  const ext = safeExt(file.name, allowedExt);
  if (!ext) {
    throw new Error("فرمت فایل مجاز نیست: " + file.name);
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > maxBytes) {
    throw new Error("حجم فایل بیشتر از حد مجاز است");
  }
  const dir = path.join(process.cwd(), "public", "uploads", subdir);
  await mkdir(dir, { recursive: true });
  const filename = randomName() + ext;
  await writeFile(path.join(dir, filename), buffer);
  return `/uploads/${subdir}/${filename}`;
}

export function saveAudioFile(file) {
  // حداکثر ۴۰ مگابایت برای فایل صوتی
  return saveFile(file, "audio", AUDIO_EXT, 40 * 1024 * 1024);
}

export function saveCoverFile(file) {
  // حداکثر ۸ مگابایت برای کاور
  return saveFile(file, "covers", IMAGE_EXT, 8 * 1024 * 1024);
}
