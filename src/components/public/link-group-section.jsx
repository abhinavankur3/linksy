import { LinkButton } from "./link-button";

export function LinkGroupSection({ group }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: "color-mix(in srgb, var(--text) 6%, transparent)",
        border: "1px solid color-mix(in srgb, var(--text) 10%, transparent)",
      }}
    >
      <details open className="group">
        <summary
          className="flex cursor-pointer list-none items-center gap-2 pb-2 text-sm font-semibold"
          style={{ color: "var(--text)" }}
        >
          <svg
            className="h-4 w-4 transition-transform group-open:rotate-90"
            style={{ color: "var(--text-secondary)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
          {group.name}
        </summary>
        <div className="mt-1 space-y-3">
          {group.links.map((link) => (
            <LinkButton key={link.id} link={link} />
          ))}
        </div>
      </details>
    </div>
  );
}
