import { PublicIcon, DefaultPublicLinkIcon } from "./public-icon";

export function LinkButton({ link }) {
  return (
    <a
      href={`/api/click?id=${link.id}`}
      rel="noopener noreferrer"
      className="flex w-full items-center gap-3 px-6 py-4 text-sm font-medium transition-all hover:scale-[1.02]"
      style={{
        backgroundColor: "var(--link-bg)",
        color: "var(--text)",
        border: "1px solid var(--link-border)",
        borderRadius: "var(--link-radius)",
        boxShadow: "var(--link-shadow)",
      }}
    >
      <span className="flex-shrink-0" style={{ color: "var(--text-secondary)" }}>
        {link.icon ? (
          <PublicIcon iconStr={link.icon} size={20} />
        ) : (
          <DefaultPublicLinkIcon size={20} />
        )}
      </span>
      <span className="flex-1 text-center">{link.title}</span>
      <span className="w-5 flex-shrink-0" />
    </a>
  );
}
