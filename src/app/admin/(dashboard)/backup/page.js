"use client";

import { useState } from "react";

export default function BackupPage() {
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  async function handleRestore(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!file) {
      setError("یک فایل بکاپ (zip) انتخاب کن");
      return;
    }
    setRestoring(true);
    const fd = new FormData();
    fd.append("backup", file);
    const res = await fetch("/api/backup", { method: "POST", body: fd });
    const data = await res.json();
    setRestoring(false);
    if (!res.ok) {
      setError(data.error || "خطا در بازیابی بکاپ");
      return;
    }
    setMessage(`بازیابی انجام شد: ${data.restoredTracks} آهنگ و ${data.restoredAdmins} ادمین.`);
    e.target.reset();
    setFile(null);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">پشتیبان‌گیری (بکاپ)</h1>
      <p className="text-sm text-[#f2eef7]/50 mb-8">
        قبل از تمام‌شدن ۳۰ روز رایگان ریلیوی، از اینجا بکاپ بگیر و روی اکانت/پروژه‌ی جدید بازیابی کن
      </p>

      <div className="rounded-2xl border border-[#241c2b] bg-[#0f0c13] p-6 mb-8">
        <h2 className="font-bold mb-2">دانلود بکاپ</h2>
        <p className="text-sm text-[#f2eef7]/55 mb-4">
          یک فایل zip شامل تمام آهنگ‌ها، فایل‌های صوتی/کاور و اکانت‌های ادمین دانلود می‌شود.
        </p>
        <a
          href="/api/backup"
          className="inline-block rounded-lg bg-gradient-to-l from-[#8b2ff5] via-[#d4249e] to-[#ff2e5a] px-5 py-2.5 text-sm font-medium"
        >
          دانلود فایل بکاپ
        </a>
      </div>

      <div className="rounded-2xl border border-[#241c2b] bg-[#0f0c13] p-6">
        <h2 className="font-bold mb-2">بازیابی بکاپ</h2>
        <p className="text-sm text-[#f2eef7]/55 mb-4">
          فایل zip بکاپ رو اینجا آپلود کن. آهنگ‌ها و ادمین‌های موجود آپدیت می‌شن، چیزی حذف نمی‌شه.
        </p>
        <form onSubmit={handleRestore} className="flex flex-col sm:flex-row gap-3">
          <input
            type="file"
            accept=".zip"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-sm text-[#f2eef7]/70 flex-1"
          />
          <button
            type="submit"
            disabled={restoring}
            className="rounded-lg border border-[#241c2b] px-5 py-2.5 text-sm hover:border-[#8b2ff5] transition-colors disabled:opacity-50"
          >
            {restoring ? "در حال بازیابی..." : "بازیابی از فایل"}
          </button>
        </form>
        {message && <p className="text-sm text-[#7cd9a5] mt-4">{message}</p>}
        {error && <p className="text-sm text-[#ff2e5a] mt-4">{error}</p>}
      </div>
    </div>
  );
}
