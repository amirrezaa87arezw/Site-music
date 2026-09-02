"use client";

import { createContext, useContext, useRef, useState, useCallback } from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [current, setCurrent] = useState(null); // track object
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const play = useCallback((track) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (current?.id === track.id) {
      audio.play();
      setIsPlaying(true);
      return;
    }

    setCurrent(track);
    audio.src = track.audioUrl;
    audio.play();
    setIsPlaying(true);

    // ثبت پخش برای شمارنده
    fetch(`/api/tracks/${track.id}`, { method: "POST" }).catch(() => {});
  }, [current]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  }, [isPlaying, current]);

  const seek = useCallback((seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
  }, []);

  const value = {
    current,
    isPlaying,
    progress,
    duration,
    play,
    toggle,
    seek
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setIsPlaying(false)}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer باید داخل PlayerProvider استفاده شود");
  return ctx;
}
