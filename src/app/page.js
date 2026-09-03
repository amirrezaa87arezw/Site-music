import { prisma } from "@/lib/prisma";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import MusicSection from "@/components/MusicSection";
import { AboutSection, ContactSection, Footer } from "@/components/AboutContact";

export const dynamic = "force-dynamic";

async function getTracks() {
  try {
    return await prisma.track.findMany({
      orderBy: [{ order: "asc" }, { releaseDate: "desc" }]
    });
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
