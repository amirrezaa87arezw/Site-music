"use client";

import { motion } from "framer-motion";
import { usePlayer } from "./PlayerProvider";
import Equalizer from "./Equalizer";
import SkullTilt from "./SkullTilt";

export default function Hero({ latestTrack, trackCount }) {
  const { play } = usePlayer();

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-28 md:pt-0">
      {/* آرت‌ورک پس‌زمینه - تعاملی، با حرکت موس/لمس زاویه‌اش تغییر می‌کند */}
      <SkullTilt />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/40" aria-hidden="true" />

      {/* گرادیان‌های محو برای عمق بیشتر */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-violet/25 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[28rem] h-[28rem] rounded-full bg-crimson/20 blur-[140px]" />

      <div className="relative z-10 max-w-6xl mx-auto w-full px-5 md:px-8 grid md:grid-cols-[1.3fr_0.7fr] gap-10 items-end pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-[11px] text-bone/60 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
            سایت رسمی
          </span>
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl leading-[0.9] text-gradient">
            سایکو
          </h1>

          <div className="h-8 w-full max-w-sm mt-4">
            <Equalizer />
          </div>

          <p className="mt-5 max-w-md text-bone/75 leading-7">
            صدای تاریک یک ذهن واقعی. موزیک هیپ‌هاپ و ترپ فارسی با هویتی که
            نمی‌شود نادیده گرفتش.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => latestTrack && play(latestTrack)}
              disabled={!latestTrack}
              className="focus-ring inline-flex items-center gap-3 rounded-full bg-brand-gradient px-6 py-3 text-sm font-medium shadow-glow transition-transform hover:scale-[1.03] disabled:opacity-40 disabled:hover:scale-100"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/25">
                ▶
              </span>
              همین حالا گوش بده
            </button>
            <a
              href="#music"
              className="focus-ring text-sm text-bone/70 hover:text-bone transition-colors"
            >
              {trackCount} آهنگ منتشر شده
            </a>
          </div>
        </motion.div>

        {latestTrack && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="glass rounded-3xl p-4 w-full max-w-xs mr-auto"
          >
            <p className="text-xs text-crimson mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
              آخرین انتشار
            </p>
            <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-panel">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={latestTrack.coverUrl}
                alt={latestTrack.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-display text-lg">{latestTrack.title}</p>
            <p className="text-sm text-bone/55 mb-4">{latestTrack.artist}</p>
            <button
              onClick={() => play(latestTrack)}
              className="focus-ring w-full rounded-full border border-line py-2.5 text-sm hover:border-violet/60 transition-colors"
            >
              پخش آهنگ
            </button>
          </motion.div>
        )}
      </div>

      {/* نوار اکولایزر پایین صفحه - مثل رفرنس، عریض و تمام‌صفحه */}
      <div className="absolute bottom-16 md:bottom-20 inset-x-0 h-10 px-5 md:px-8 z-10 opacity-70">
        <div className="max-w-6xl mx-auto h-full">
          <Equalizer />
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-bone/40 text-xs z-10">
        <span className="h-9 w-6 rounded-full border border-bone/25 flex items-start justify-center p-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-bone/50 animate-bounce" />
        </span>
        اسکرول کن
      </div>
    </section>
  );
}
