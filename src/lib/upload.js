import { writeFile, mkdir } from "fs/promises";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

ffmpeg.setFfmpegPath(ffmpegPath);

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

export function urlToAbsolutePath(url) {
  return path.join(process.cwd(), "public", url.replace(/^\//, ""));
}

/**
 * از روی فایل صوتی اصلی (که به‌عنوان نسخه با کیفیت اصلی/۳۲۰ در نظر گرفته می‌شود)
 * یک نسخه‌ی فشرده‌شده‌ی ۱۲۸kbps می‌سازد تا کاربر بتواند حجم کمتری دانلود کند.
 * در صورت خطا در ترنسکد (مثلاً نبود ffmpeg)، null برمی‌گرداند و آپلود اصلی را فیل نمی‌کند.
 */
export function transcodeTo128(originalAbsolutePath, subdir = "audio") {
  return new Promise((resolve) => {
    const outName = randomName() + "-128.mp3";
    const outDir = path.join(process.cwd(), "public", "uploads", subdir);
    const outPath = path.join(outDir, outName);

    ffmpeg(originalAbsolutePath)
      .audioBitrate(128)
      .audioCodec("libmp3lame")
      .format("mp3")
      .on("error", (err) => {
        console.error("[FFMPEG_TRANSCODE_FAIL]", err.message);
        resolve(null);
      })
      .on("end", () => {
        resolve(`/uploads/${subdir}/${outName}`);
      })
      .save(outPath);
  });
}
