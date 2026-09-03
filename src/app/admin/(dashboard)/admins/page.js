"use client";

import { useEffect, useState } from "react";

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admins");
    const data = await res.json();
    if (res.ok) setAdmins(data.admins || []);
    else setError(data.error || "خطا در دریافت لیست ادمین‌ها");
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const res = await fetch("/api/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role })
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error || "خطا در ایجاد ادمین");
      return;
    }
    setUsername("");
    setPassword("");
    setRole("ADMIN");
    load();
  }

  async function handleDelete(id) {
    if (!confirm("این ادمین حذف شود؟")) return;
    const res = await fetch(`/api/admins/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "خطا در حذف");
      return;
    }
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">مدیریت ادمین‌ها</h1>
      <p className="text-sm text-[#f2eef7]/50 mb-8">
        به‌عنوان مدیر اصلی می‌توانید ادمین جدید اضافه یا حذف کنید
      </p>

      <form
        onSubmit={handleCreate}
        className="rounded-2xl border border-[#241c2b] bg-[#0f0c13] p-6 mb-10 grid sm:grid-cols-3 gap-4 items-end"
      >
        <div>
          <label className="block text-sm mb-1.5 text-[#f2eef7]/70">نام کاربری</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full rounded-lg bg-black/30 border border-[#241c2b] px-3.5 py-2.5 text-sm outline-none focus:border-[#8b2ff5]"
          />
        </div>
        <div>
          <label className="block text-sm mb-1.5 text-[#f2eef7]/70">رمز عبور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg bg-black/30 border border-[#241c2b] px-3.5 py-2.5 text-sm outline-none focus:border-[#8b2ff5]"
          />
        </div>
        <div>
          <label className="block text-sm mb-1.5 text-[#f2eef7]/70">نقش</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg bg-black/30 border border-[#241c2b] px-3.5 py-2.5 text-sm outline-none focus:border-[#8b2ff5]"
          >
            <option value="ADMIN">ادمین معمولی</option>
            <option value="SUPER">مدیر اصلی</option>
          </select>
        </div>

        {error && <p className="sm:col-span-3 text-sm text-[#ff2e5a]">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="sm:col-span-3 rounded-lg bg-gradient-to-l from-[#8b2ff5] via-[#d4249e] to-[#ff2e5a] py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {submitting ? "در حال ایجاد..." : "افزودن ادمین"}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-[#f2eef7]/50">در حال بارگذاری...</p>
      ) : (
        <div className="rounded-2xl border border-[#241c2b] bg-[#0f0c13] divide-y divide-[#241c2b]">
          {admins.map((a) => (
            <div key={a.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm">{a.username}</p>
                <p className="text-xs text-[#f2eef7]/45">
                  {a.role === "SUPER" ? "مدیر اصلی" : "ادمین"} ·{" "}
                  {new Date(a.createdAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
              <button
                onClick={() => handleDelete(a.id)}
                className="text-xs text-[#ff2e5a] hover:text-[#ff5478]"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
