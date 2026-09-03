"use client";

import { createContext, useContext, useRef, useState, useCallback } from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const [current, setCurrent] = useState(null); // track object
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const ensureAnalyser = useCallback(() => {
    if (typeof window === "undefined" || !audioRef.current) return;
    if (audioCtxRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      const source = ctx.createMediaElementSource(audioRef.current);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
    } catch {
      // مرورگرهای قدیمی یا محدودیت‌های امنیتی - اکولایزر ساکت می‌ماند، پخش موزیک تحت تاثیر قرار نمی‌گیرد
    }
  }, []);

  const play = useCallback((track) => {
    const audio = audioRef.current;
    if (!audio) return;
    ensureAnalyser();
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }

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
  }, [current, ensureAnalyser]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    ensureAnalyser();
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  }, [isPlaying, current, ensureAnalyser]);

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
    seek,
    analyserRef
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
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
