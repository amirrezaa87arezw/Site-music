import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FIELD_MAP = {
  cover: { data: "coverData", mime: "coverMime" },
  audio: { data: "audioData", mime: "audioMime" },
  audio128: { data: "audio128Data", mime: "audio128Mime" }
};

export async function GET(_request, { params }) {
  const { id, kind } = params;
  const fields = FIELD_MAP[kind];
  if (!fields) {
    return NextResponse.json({ error: "نوع فایل نامعتبر است" }, { status: 400 });
  }

  const track = await prisma.track.findUnique({
    where: { id },
    select: { [fields.data]: true, [fields.mime]: true }
  });

  const data = track?.[fields.data];
  const mime = track?.[fields.mime];

  if (!track || !data) {
    return NextResponse.json({ error: "فایل پیدا نشد" }, { status: 404 });
  }

  return new NextResponse(data, {
    headers: {
      "Content-Type": mime || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
