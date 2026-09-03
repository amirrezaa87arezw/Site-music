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
    <header className="fixed top-0 inset-x-0 z-40">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4 md:px-8 md:py-6">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 shrink-0 rounded-full bg-brand-gradient flex items-center justify-center font-display text-sm">
            پ
          </span>
          <div className="leading-tight">
            <p className="font-display text-lg tracking-wide">PSYCHO</p>
            <p className="text-[11px] text-bone/50 hidden sm:block">ترپ و هیپ‌هاپ فارسی · تهران</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-bone/80">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className={`hover:text-bone transition-colors focus-ring ${i === 0 ? "text-crimson" : ""}`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          className="text-bone focus-ring rounded p-1"
          onClick={() => setOpen(true)}
          aria-label="باز کردن منو"
          aria-expanded={open}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
            aria-label="بستن منو"
          />
          <div
            className="absolute inset-y-0 left-0 w-full max-w-sm p-8 flex flex-col"
            style={{
              backgroundImage:
                "linear-gradient(to left, rgba(8,6,10,0.55), rgba(8,6,10,0.95) 65%), url(/brand/hero-skull.png)",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="بستن"
              className="focus-ring self-end mb-10 h-9 w-9 rounded-full border border-line flex items-center justify-center text-bone/70 hover:text-bone"
            >
              ✕
            </button>
            <nav className="flex flex-col gap-6 text-lg">
              {LINKS.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`focus-ring ${i === 0 ? "text-crimson" : "text-bone/85 hover:text-bone"}`}
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
