export function TimelineChart({ title, data }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">{title}</h3>
        <p className="py-8 text-center text-sm text-gray-400">No data yet</p>
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.value));
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <span className="text-xs text-gray-400">{total} total</span>
      </div>
      <div className="flex h-40 items-end gap-[2px]">
        {data.map((d) => (
          <div
            key={d.label}
            className="group relative flex flex-1 flex-col items-center justify-end"
          >
            <div className="absolute -top-6 hidden rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-white group-hover:block">
              {d.value}
            </div>
            <div
              className="w-full rounded-t bg-blue-500 transition-all hover:bg-blue-600"
              style={{
                height: `${max > 0 ? (d.value / max) * 100 : 0}%`,
                minHeight: d.value > 0 ? "2px" : "0",
              }}
            />
          </div>
        ))}
      </div>
      {data.length <= 31 && (
        <div className="mt-1 flex gap-[2px]">
          {data.map((d, i) => (
            <div
              key={d.label}
              className="flex-1 text-center text-[9px] text-gray-400"
            >
              {i === 0 || i === data.length - 1 || data.length <= 14
                ? (d.label || "").slice(5)
                : ""}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
