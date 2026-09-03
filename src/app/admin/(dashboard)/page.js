import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getStats() {
  const [trackCount, adminCount, errorLogCount, recentLogs] = await Promise.all([
    prisma.track.count(),
    prisma.admin.count(),
    prisma.log.count({ where: { level: "ERROR" } }),
    prisma.log.findMany({ orderBy: { createdAt: "desc" }, take: 6 })
  ]);
  return { trackCount, adminCount, errorLogCount, recentLogs };
}

const LEVEL_COLOR = {
  INFO: "text-[#7cd9a5]",
  WARN: "text-[#f5c257]",
  ERROR: "text-[#ff2e5a]"
};

export default async function DashboardHome() {
  const stats = await getStats();

  const cards = [
    { label: "تعداد آهنگ‌ها", value: stats.trackCount },
    { label: "تعداد ادمین‌ها", value: stats.adminCount },
    { label: "خطاهای ثبت‌شده", value: stats.errorLogCount }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">نمای کلی</h1>
      <p className="text-sm text-[#f2eef7]/50 mb-8">خلاصه‌ی وضعیت سایت سایکو</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-[#241c2b] bg-[#0f0c13] p-5">
            <p className="text-3xl font-bold">{c.value}</p>
            <p className="text-sm text-[#f2eef7]/50 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold mb-4">آخرین رویدادها</h2>
      <div className="rounded-2xl border border-[#241c2b] bg-[#0f0c13] divide-y divide-[#241c2b]">
        {stats.recentLogs.length === 0 && (
          <p className="p-5 text-sm text-[#f2eef7]/50">هنوز رویدادی ثبت نشده.</p>
        )}
        {stats.recentLogs.map((log) => (
          <div key={log.id} className="p-4 flex items-center justify-between text-sm">
            <div>
              <span className={`font-medium ${LEVEL_COLOR[log.level] || ""}`}>{log.level}</span>
              <span className="mr-3 text-[#f2eef7]/80">{log.message}</span>
            </div>
            <span className="text-xs text-[#f2eef7]/40">
              {new Date(log.createdAt).toLocaleString("fa-IR")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
