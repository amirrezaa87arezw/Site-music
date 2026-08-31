"use client";

import { useEffect, useState } from "react";

export default function TracksAdminPage() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("Psycho");
  const [audio, setAudio] = useState(null);
  const [cover, setCover] = useState(null);

  async function loadTracks() {
    setLoading(true);
    const res = await fetch("/api/tracks");
    const data = await res.json();
    setTracks(data.tracks || []);
    setLoading(false);
  }

  useEffect(() => {
    loadTracks();
  }, []);

  async function handleUpload(e) {
    e.preventDefault();
    setError("");
    if (!audio || !cover) {
      setError("فایل صوتی و کاور هر دو الزامی هستند");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("title", title);
    fd.append("artist", artist);
    fd.append("audio", audio);
    fd.append("cover", cover);

    const res = await fetch("/api/tracks", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);

    if (!res.ok) {
      setError(data.error || "خطا در آپلود");
      return;
    }

    setTitle("");
    setArtist("Psycho");
    setAudio(null);
    setCover(null);
    e.target.reset();
    loadTracks();
  }

  async function handleDelete(id) {
    if (!confirm("این آهنگ برای همیشه حذف شود؟")) return;
    await fetch(`/api/tracks/${id}`, { method: "DELETE" });
    loadTracks();
  }

  async function toggleFeatured(track) {
    await fetch(`/api/tracks/${track.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !track.featured })
    });
    loadTracks();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">مدیریت موزیک‌ها</h1>
      <p className="text-sm text-[#f2eef7]/50 mb-8">آهنگ جدید اضافه کن یا آهنگ‌های موجود را مدیریت کن</p>

      <form
        onSubmit={handleUpload}
        className="rounded-2xl border border-[#241c2b] bg-[#0f0c13] p-6 mb-10 grid sm:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm mb-1.5 text-[#f2eef7]/70">عنوان آهنگ</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg bg-black/30 border border-[#241c2b] px-3.5 py-2.5 text-sm outline-none focus:border-[#8b2ff5]"
          />
        </div>
        <div>
          <label className="block text-sm mb-1.5 text-[#f2eef7]/70">نام هنرمند</label>
          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full rounded-lg bg-black/30 border border-[#241c2b] px-3.5 py-2.5 text-sm outline-none focus:border-[#8b2ff5]"
          />
        </div>
        <div>
          <label className="block text-sm mb-1.5 text-[#f2eef7]/70">فایل صوتی (mp3, wav, ...)</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudio(e.target.files?.[0] || null)}
            required
            className="w-full text-sm text-[#f2eef7]/70"
          />
        </div>
        <div>
          <label className="block text-sm mb-1.5 text-[#f2eef7]/70">تصویر کاور</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCover(e.target.files?.[0] || null)}
            required
            className="w-full text-sm text-[#f2eef7]/70"
          />
        </div>

        {error && <p className="sm:col-span-2 text-sm text-[#ff2e5a]">{error}</p>}

        <button
          type="submit"
          disabled={uploading}
          className="sm:col-span-2 rounded-lg bg-gradient-to-l from-[#8b2ff5] via-[#d4249e] to-[#ff2e5a] py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {uploading ? "در حال آپلود..." : "آپلود آهنگ"}
        </button>
      </form>

      <h2 className="text-lg font-bold mb-4">آهنگ‌های منتشر شده ({tracks.length})</h2>

      {loading ? (
        <p className="text-sm text-[#f2eef7]/50">در حال بارگذاری...</p>
      ) : (
        <div className="rounded-2xl border border-[#241c2b] bg-[#0f0c13] divide-y divide-[#241c2b]">
          {tracks.map((track) => (
            <div key={track.id} className="p-4 flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={track.coverUrl}
                alt={track.title}
                className="h-12 w-12 rounded-lg object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate">{track.title}</p>
                <p className="text-xs text-[#f2eef7]/45 truncate">
                  {track.artist} · {track.playCount} پخش
                </p>
              </div>
              <button
                onClick={() => toggleFeatured(track)}
                className={`text-xs rounded-full px-3 py-1.5 border ${
                  track.featured
                    ? "border-[#8b2ff5] text-[#c79bff]"
                    : "border-[#241c2b] text-[#f2eef7]/50"
                }`}
              >
                {track.featured ? "آخرین انتشار ★" : "تعیین به‌عنوان آخرین انتشار"}
              </button>
              <button
                onClick={() => handleDelete(track.id)}
                className="text-xs text-[#ff2e5a] hover:text-[#ff5478] shrink-0"
              >
                حذف
              </button>
            </div>
          ))}
          {tracks.length === 0 && (
            <p className="p-5 text-sm text-[#f2eef7]/50">هنوز آهنگی آپلود نشده.</p>
          )}
        </div>
      )}
    </div>
  );
}
