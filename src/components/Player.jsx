"use client";

import { usePlayer } from "./PlayerProvider";

function formatTime(sec) {
  if (!sec || Number.isNaN(sec)) return "۰:۰۰";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function Player() {
  const { current, isPlaying, progress, duration, toggle, seek } = usePlayer();

  if (!current) return null;

  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 px-3 pb-3 md:px-6 md:pb-6">
      <div className="glass max-w-3xl mx-auto rounded-2xl px-4 py-3 flex items-center gap-4 shadow-glow">
        <div className="h-11 w-11 rounded-lg overflow-hidden shrink-0 bg-panel">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.coverUrl} alt={current.title} className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0 w-28 sm:w-40 shrink-0">
          <p className="text-sm truncate">{current.title}</p>
          <p className="text-xs text-bone/50 truncate">{current.artist}</p>
        </div>

        <button
          onClick={toggle}
          aria-label={isPlaying ? "توقف" : "پخش"}
          className="focus-ring h-9 w-9 shrink-0 rounded-full bg-brand-gradient flex items-center justify-center text-sm"
        >
          {isPlaying ? "❙❙" : "▶"}
        </button>

        <div className="hidden sm:flex flex-1 items-center gap-2 min-w-0">
          <span className="text-[11px] text-bone/45 w-9 text-left">{formatTime(progress)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            className="flex-1 accent-crimson h-1"
            aria-label="پیشرفت پخش"
          />
          <span className="text-[11px] text-bone/45 w-9">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
