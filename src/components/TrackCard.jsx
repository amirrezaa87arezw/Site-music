"use client";

import { usePlayer } from "./PlayerProvider";

export default function TrackCard({ track }) {
  const { play, current, isPlaying } = usePlayer();
  const active = current?.id === track.id;

  return (
    <button
      onClick={() => play(track)}
      className="focus-ring group text-right glass rounded-2xl p-3 flex items-center gap-4 hover:border-violet/50 transition-colors w-full"
    >
      <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-panel">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={track.coverUrl} alt={track.title} className="h-full w-full object-cover" />
        <span
          className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity ${
            active && isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          {active && isPlaying ? (
            <span className="flex gap-0.5 items-end h-4">
              <span className="w-0.5 bg-crimson animate-pulse h-2" />
              <span className="w-0.5 bg-crimson animate-pulse h-4" />
              <span className="w-0.5 bg-crimson animate-pulse h-3" />
            </span>
          ) : (
            "▶"
          )}
        </span>
      </div>
      <div className="min-w-0">
        <p className={`font-display truncate ${active ? "text-gradient" : "text-bone"}`}>
          {track.title}
        </p>
        <p className="text-xs text-bone/50 truncate">{track.artist}</p>
      </div>
    </button>
  );
}
