"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function SkullTilt({ className = "" }) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const springConfig = { stiffness: 120, damping: 18, mass: 0.6 };
  const sx = useSpring(mx, springConfig);
  const sy = useSpring(my, springConfig);

  const rotateY = useTransform(sx, [0, 1], [-16, 16]);
  const rotateX = useTransform(sy, [0, 1], [12, -12]);
  const translateX = useTransform(sx, [0, 1], [-14, 14]);
  const translateY = useTransform(sy, [0, 1], [-10, 10]);
  const glowX = useTransform(sx, [0, 1], ["20%", "80%"]);
  const glowY = useTransform(sy, [0, 1], ["20%", "80%"]);

  function handlePointerMove(e) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const point = e.touches ? e.touches[0] : e;
    const x = (point.clientX - rect.left) / rect.width;
    const y = (point.clientY - rect.top) / rect.height;
    mx.set(Math.min(1, Math.max(0, x)));
    my.set(Math.min(1, Math.max(0, y)));
  }

  function handleLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handlePointerMove}
      onMouseLeave={handleLeave}
      onTouchMove={handlePointerMove}
      onTouchEnd={handleLeave}
      className={`absolute inset-y-0 left-0 w-full md:w-[62%] ${className}`}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          transformStyle: "preserve-3d"
        }}
      >
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage: "url(/brand/hero-skull.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            maskImage: "linear-gradient(to left, black 55%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to left, black 55%, transparent 100%)"
          }}
          aria-hidden="true"
        />
        <motion.div
          className="pointer-events-none absolute inset-0 mix-blend-screen opacity-40"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,46,90,0.35), transparent 55%)`
            )
          }}
          aria-hidden="true"
        />
      </motion.div>
    </div>
  );
}
