import { readFile, writeFile, mkdir, rm } from "fs/promises";
import path from "path";
import os from "os";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

ffmpeg.setFfmpegPath(ffmpegPath);

const AUDIO_EXT = [".mp3", ".wav", ".m4a", ".ogg"];
const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp"];

const AUDIO_MIME = {
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".m4a": "audio/mp4",
  ".ogg": "audio/ogg"
};
const IMAGE_MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

function safeExt(filename, allowed) {
  const ext = path.extname(filename || "").toLowerCase();
  return allowed.includes(ext) ? ext : null;
}

function randomName() {
  return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
}

/**
 * فایل آپلودی را می‌خواند و به‌صورت { buffer, mime } برمی‌گرداند
 * تا مستقیم در دیتابیس ذخیره شود (نه روی دیسک - چون دیسک روی Railway دائمی نیست).
 */
async function readUploadedFile(file, allowedExt, mimeMap, maxBytes) {
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
  return { buffer, mime: mimeMap[ext], ext };
}

export function readAudioFile(file) {
  // حداکثر ۴۰ مگابایت برای فایل صوتی
  return readUploadedFile(file, AUDIO_EXT, AUDIO_MIME, 40 * 1024 * 1024);
}

export function readCoverFile(file) {
  // حداکثر ۸ مگابایت برای کاور
  return readUploadedFile(file, IMAGE_EXT, IMAGE_MIME, 8 * 1024 * 1024);
}

/**
 * از روی بافر فایل صوتی اصلی، یک نسخه‌ی فشرده‌ی ۱۲۸kbps می‌سازد.
 * چون ffmpeg به مسیر فایل روی دیسک نیاز دارد، از یک فایل موقت (tmp) استفاده
 * می‌کنیم که فقط در طول همین درخواست وجود دارد و بعد پاک می‌شود - نیازی به
 * ذخیره‌ی دائمی ندارد چون فقط برای پردازش لحظه‌ای استفاده می‌شود.
 */
export function transcodeTo128(inputBuffer, inputExt) {
  return new Promise(async (resolve) => {
    const tmpDir = path.join(os.tmpdir(), "psycho-transcode-" + randomName());
    await mkdir(tmpDir, { recursive: true });
    const inPath = path.join(tmpDir, "in" + inputExt);
    const outPath = path.join(tmpDir, "out.mp3");

    async function cleanup() {
      await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
    }

    try {
      await writeFile(inPath, inputBuffer);
    } catch (err) {
      await cleanup();
      resolve(null);
      return;
    }

    ffmpeg(inPath)
      .audioBitrate(128)
      .audioCodec("libmp3lame")
      .format("mp3")
      .on("error", async (err) => {
        console.error("[FFMPEG_TRANSCODE_FAIL]", err.message);
        await cleanup();
        resolve(null);
      })
      .on("end", async () => {
        try {
          const outBuffer = await readFile(outPath);
          await cleanup();
          resolve({ buffer: outBuffer, mime: "audio/mpeg" });
        } catch {
          await cleanup();
          resolve(null);
        }
      })
      .save(outPath);
  });
}
