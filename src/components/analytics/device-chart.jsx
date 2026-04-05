const COLORS = {
  desktop: "bg-blue-500",
  mobile: "bg-emerald-500",
  tablet: "bg-amber-500",
  unknown: "bg-gray-300",
};

export function DeviceChart({ title, items }) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">{title}</h3>
        <p className="py-4 text-center text-sm text-gray-400">No data yet</p>
      </div>
    );
  }

  const total = items.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">{title}</h3>
      <div className="mb-3 flex h-3 overflow-hidden rounded-full bg-gray-100">
        {items.map((item) => (
          <div
            key={item.label}
            className={`${COLORS[item.label.toLowerCase()] || COLORS.unknown}`}
            style={{ width: `${total > 0 ? (item.value / total) * 100 : 0}%` }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${COLORS[item.label.toLowerCase()] || COLORS.unknown}`}
            />
            <span className="text-gray-700">{item.label}</span>
            <span className="text-gray-400">
              {total > 0 ? Math.round((item.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
