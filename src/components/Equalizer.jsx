"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "./PlayerProvider";

const BAR_COUNT = 40;

export default function Equalizer({ className = "", barClassName = "" }) {
  const { analyserRef, isPlaying } = usePlayer();
  const containerRef = useRef(null);
  const barsRef = useRef([]);
  const rafRef = useRef(null);
  const idleTRef = useRef(0);

  useEffect(() => {
    const dataArray = new Uint8Array(32);

    function tick() {
      const bars = barsRef.current;
      const analyser = analyserRef.current;

      if (isPlaying && analyser) {
        analyser.getByteFrequencyData(dataArray);
        for (let i = 0; i < bars.length; i++) {
          const bin = dataArray[i % dataArray.length] / 255;
          const height = 8 + bin * 46;
          if (bars[i]) bars[i].style.height = `${height}%`;
        }
      } else {
        idleTRef.current += 0.05;
        for (let i = 0; i < bars.length; i++) {
          const wave = Math.sin(idleTRef.current + i * 0.5) * 0.5 + 0.5;
          const height = 6 + wave * 10;
          if (bars[i]) bars[i].style.height = `${height}%`;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, analyserRef]);

  return (
    <div ref={containerRef} className={`flex items-end gap-[3px] h-full ${className}`} aria-hidden="true">
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <span
          key={i}
          ref={(el) => (barsRef.current[i] = el)}
          className={`w-[3px] rounded-full bg-gradient-to-t from-violet to-crimson transition-[height] duration-75 ${barClassName}`}
          style={{ height: "8%" }}
        />
      ))}
    </div>
  );
}
