"use client";

import { useState } from "react";

const LINKS = [
  { href: "#music", label: "موزیک‌ها" },
  { href: "#about", label: "درباره" },
  { href: "#contact", label: "ارتباط" }
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-30">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4 md:px-8 md:py-6">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-brand-gradient" />
          <span className="font-display text-lg tracking-wide">PSYCHO</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-bone/80">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-bone transition-colors focus-ring">
              {l.label}
            </a>
          ))}
        </div>

        <button
          className="md:hidden text-bone focus-ring rounded p-1"
          onClick={() => setOpen((o) => !o)}
          aria-label="باز کردن منو"
          aria-expanded={open}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden glass mx-4 rounded-2xl px-5 py-4 flex flex-col gap-4 text-sm">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-bone/85">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
