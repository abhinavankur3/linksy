export function StatCard({ label, value, subtitle }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && (
        <p className="mt-0.5 truncate text-xs text-gray-400">{subtitle}</p>
      )}
    </div>
  );
}
