export function BarChart({ title, items, maxItems = 8 }) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">{title}</h3>
        <p className="py-4 text-center text-sm text-gray-400">No data yet</p>
      </div>
    );
  }

  const display = items.slice(0, maxItems);
  const max = Math.max(...display.map((d) => d.value));

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">{title}</h3>
      <div className="space-y-2">
        {display.map((item) => (
          <div key={item.label}>
            <div className="mb-0.5 flex items-center justify-between text-xs">
              <span className="truncate text-gray-700">{item.label}</span>
              <span className="ml-2 font-medium text-gray-500">{item.value}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{ width: `${max > 0 ? (item.value / max) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
