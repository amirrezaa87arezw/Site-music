"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در ورود");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد");
      setLoading(false);
    }
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-[#08060a] text-[#f2eef7] px-5"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-[#241c2b] bg-[#0f0c13] p-8"
      >
        <div className="flex items-center gap-2 mb-8">
          <span className="w-8 h-8 rounded-full bg-gradient-to-l from-[#8b2ff5] via-[#d4249e] to-[#ff2e5a]" />
          <span className="font-bold tracking-wide">PSYCHO ADMIN</span>
        </div>

        <label className="block text-sm mb-2 text-[#f2eef7]/70">نام کاربری</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 rounded-lg bg-black/30 border border-[#241c2b] px-4 py-2.5 text-sm outline-none focus:border-[#8b2ff5]"
          autoComplete="username"
          required
        />

        <label className="block text-sm mb-2 text-[#f2eef7]/70">رمز عبور</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 rounded-lg bg-black/30 border border-[#241c2b] px-4 py-2.5 text-sm outline-none focus:border-[#8b2ff5]"
          autoComplete="current-password"
          required
        />

        {error && <p className="text-sm text-[#ff2e5a] mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-l from-[#8b2ff5] via-[#d4249e] to-[#ff2e5a] py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "در حال ورود..." : "ورود به پنل مدیریت"}
        </button>
      </form>
    </div>
  );
}
