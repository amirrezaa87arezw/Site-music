"use client";

export default function DownloadLinks({ track, className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} onClick={(e) => e.stopPropagation()}>
      <a
        href={track.audioUrl}
        download
        className="focus-ring text-[11px] rounded-full border border-line px-2.5 py-1 text-bone/60 hover:text-bone hover:border-violet/50 transition-colors"
        title="دانلود کیفیت اصلی"
      >
        دانلود ۳۲۰
      </a>
      {track.audioUrl128 && (
        <a
          href={track.audioUrl128}
          download
          className="focus-ring text-[11px] rounded-full border border-line px-2.5 py-1 text-bone/60 hover:text-bone hover:border-violet/50 transition-colors"
          title="دانلود نسخه فشرده"
        >
          دانلود ۱۲۸
        </a>
      )}
    </div>
  );
}
