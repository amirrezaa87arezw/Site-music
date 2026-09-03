import { prisma } from "@/lib/prisma";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import MusicSection from "@/components/MusicSection";
import { AboutSection, ContactSection, Footer } from "@/components/AboutContact";

export const dynamic = "force-dynamic";

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

async function getTracks() {
  try {
    const tracks = await prisma.track.findMany({
      select: LIST_SELECT,
      orderBy: [{ order: "asc" }, { releaseDate: "desc" }]
    });
    return tracks.map(withUrls);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const tracks = await getTracks();
  const latestTrack = tracks.find((t) => t.featured) || tracks[0] || null;

  return (
    <main className="relative pb-28">
      <Nav />
      <Hero latestTrack={latestTrack} trackCount={tracks.length} />
      <MusicSection tracks={tracks} />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
