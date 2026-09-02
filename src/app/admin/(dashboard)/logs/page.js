"use client";

import { useEffect, useState } from "react";

const LEVELS = [
  { value: "", label: "همه" },
  { value: "INFO", label: "اطلاعات" },
  { value: "WARN", label: "هشدار" },
  { value: "ERROR", label: "خطا" }
];

const LEVEL_STYLE = {
  INFO: "text-[#7cd9a5] bg-[#7cd9a5]/10",
  WARN: "text-[#f5c257] bg-[#f5c257]/10",
  ERROR: "text-[#ff2e5a] bg-[#ff2e5a]/10"
};

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(true);

  async function load(selectedLevel) {
    setLoading(true);
    const qs = selectedLevel ? `?level=${selectedLevel}` : "";
    const res = await fetch(`/api/logs${qs}`);
    const data = await res.json();
    setLogs(data.logs || []);
    setLoading(false);
  }

  useEffect(() => {
    load(level);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">لاگ‌ها و دیباگ</h1>
      <p className="text-sm text-[#f2eef7]/50 mb-6">
        تمام رویدادهای مهم سایت (ورود، آپلود، خطاها) اینجا ثبت می‌شود
      </p>

      <div className="flex gap-2 mb-6">
        {LEVELS.map((l) => (
          <button
            key={l.value}
            onClick={() => setLevel(l.value)}
            className={`text-xs rounded-full px-4 py-2 border transition-colors ${
              level === l.value
                ? "border-[#8b2ff5] text-[#c79bff]"
                : "border-[#241c2b] text-[#f2eef7]/50"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-[#f2eef7]/50">در حال بارگذاری...</p>
      ) : (
        <div className="rounded-2xl border border-[#241c2b] bg-[#0f0c13] divide-y divide-[#241c2b] overflow-hidden">
          {logs.length === 0 && (
            <p className="p-5 text-sm text-[#f2eef7]/50">رویدادی یافت نشد.</p>
          )}
          {logs.map((log) => (
            <div key={log.id} className="p-4 text-sm">
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[11px] font-medium rounded-full px-2.5 py-0.5 ${
                    LEVEL_STYLE[log.level] || ""
                  }`}
                >
                  {log.level}
                </span>
                <span className="text-xs text-[#f2eef7]/40">
                  {new Date(log.createdAt).toLocaleString("fa-IR")}
                </span>
              </div>
              <p className="text-[#f2eef7]/85">{log.message}</p>
              {log.actor && <p className="text-xs text-[#f2eef7]/40 mt-1">توسط: {log.actor}</p>}
              {log.meta && (
                <pre className="mt-2 text-[11px] text-[#f2eef7]/40 bg-black/30 rounded-lg p-2 overflow-x-auto" dir="ltr">
                  {log.meta}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
