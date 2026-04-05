"use client";

import { useRouter, useSearchParams } from "next/navigation";

const PRESETS = [
  { label: "Today", days: 0 },
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "All", days: null },
];

function toDateString(date) {
  return date.toISOString().split("T")[0];
}

export function DateRangePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  function navigate(newFrom, newTo) {
    const params = new URLSearchParams();
    if (newFrom) params.set("from", newFrom);
    if (newTo) params.set("to", newTo);
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
  }

  function handlePreset(days) {
    if (days === null) {
      navigate("", "");
    } else {
      const now = new Date();
      const start = new Date(now);
      start.setDate(start.getDate() - days);
      navigate(toDateString(start), toDateString(now));
    }
  }

  function isActivePreset(days) {
    if (days === null) return !from && !to;
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - days);
    return from === toDateString(start) && to === toDateString(now);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex gap-1">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => handlePreset(p.days)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isActivePreset(p.days)
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <input
          type="date"
          value={from}
          onChange={(e) => navigate(e.target.value, to)}
          className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-400">to</span>
        <input
          type="date"
          value={to}
          onChange={(e) => navigate(from, e.target.value)}
          className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
