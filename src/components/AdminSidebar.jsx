"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "نمای کلی", exact: true },
  { href: "/admin/tracks", label: "مدیریت موزیک‌ها" },
  { href: "/admin/admins", label: "مدیریت ادمین‌ها", superOnly: true },
  { href: "/admin/backup", label: "بکاپ" },
  { href: "/admin/logs", label: "لاگ‌ها" }
];

export default function AdminSidebar({ admin }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-full md:w-60 shrink-0 border-l border-[#241c2b] md:min-h-screen p-5 flex md:flex-col justify-between bg-[#0b090f]">
      <div className="w-full">
        <div className="flex items-center gap-2 mb-8">
          <span className="w-7 h-7 rounded-full bg-gradient-to-l from-[#8b2ff5] via-[#d4249e] to-[#ff2e5a]" />
          <span className="font-bold text-sm tracking-wide">PSYCHO ADMIN</span>
        </div>

        <nav className="flex md:flex-col gap-1.5 flex-wrap">
          {NAV.filter((item) => !item.superOnly || admin.role === "SUPER").map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3.5 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-gradient-to-l from-[#8b2ff5]/25 to-[#ff2e5a]/25 text-[#f2eef7]"
                    : "text-[#f2eef7]/55 hover:text-[#f2eef7] hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-6 md:mt-0 text-xs text-[#f2eef7]/50">
        <p className="mb-3">
          {admin.username} · {admin.role === "SUPER" ? "مدیر اصلی" : "ادمین"}
        </p>
        <button
          onClick={handleLogout}
          className="text-[#ff2e5a] hover:text-[#ff5478] transition-colors"
        >
          خروج از حساب
        </button>
      </div>
    </aside>
  );
}
