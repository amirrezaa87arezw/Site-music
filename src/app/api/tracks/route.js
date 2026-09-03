import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { readAudioFile, readCoverFile, transcodeTo128 } from "@/lib/upload";
import { logger } from "@/lib/logger";

const LIST_SELECT = {
  id: true,
  title: true,
  artist: true,
  coverMime: true,
  audioMime: true,
  audio128Mime: true,
  releaseDate: true,
  order: true,
  featured: true,
  playCount: true,
  createdAt: true
};

function withUrls(track) {
  return {
    ...track,
    coverUrl: `/api/files/${track.id}/cover`,
    audioUrl: `/api/files/${track.id}/audio`,
    audioUrl128: track.audio128Mime ? `/api/files/${track.id}/audio128` : null
  };
}

export async function GET() {
  const tracks = await prisma.track.findMany({
    select: LIST_SELECT,
    orderBy: [{ order: "asc" }, { releaseDate: "desc" }]
  });
  return NextResponse.json({ tracks: tracks.map(withUrls) });
}

export async function POST(request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString().trim();
    const artist = formData.get("artist")?.toString().trim() || "Psycho";
    const featured = formData.get("featured") === "true";
    const audioFile = formData.get("audio");
    const coverFile = formData.get("cover");

    if (!title) {
      return NextResponse.json({ error: "عنوان آهنگ الزامی است" }, { status: 400 });
    }
    if (!audioFile || typeof audioFile === "string") {
      return NextResponse.json({ error: "فایل صوتی الزامی است" }, { status: 400 });
    }
    if (!coverFile || typeof coverFile === "string") {
      return NextResponse.json({ error: "تصویر کاور الزامی است" }, { status: 400 });
    }

    const audio = await readAudioFile(audioFile);
    const cover = await readCoverFile(coverFile);

    // نسخه فشرده ۱۲۸kbps برای دانلود سریع‌تر - اگر ترنسکد شکست بخورد، مشکلی نیست
    const transcoded = await transcodeTo128(audio.buffer, audio.ext);

    const track = await prisma.track.create({
      data: {
        title,
        artist,
        audioData: audio.buffer,
        audioMime: audio.mime,
        coverData: cover.buffer,
        coverMime: cover.mime,
        audio128Data: transcoded?.buffer || null,
        audio128Mime: transcoded?.mime || null,
        featured,
        uploadedBy: admin.username
      },
      select: LIST_SELECT
    });

    await logger.info("آهنگ جدید آپلود شد", { trackId: track.id, title }, admin.username);

    return NextResponse.json({ ok: true, track: withUrls(track) });
  } catch (err) {
    await logger.error("خطا در آپلود آهنگ", { message: err.message }, admin.username);
    return NextResponse.json({ error: err.message || "خطای سرور" }, { status: 500 });
  }
}
