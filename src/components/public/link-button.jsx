import { PublicIcon, DefaultPublicLinkIcon } from "./public-icon";

export function LinkButton({ link }) {
  return (
    <a
      href={`/api/click?id=${link.id}`}
      rel="noopener noreferrer"
      className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-6 py-4 text-sm font-medium text-gray-900 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]"
    >
      <span className="flex-shrink-0 text-gray-500">
        {link.icon ? (
          <PublicIcon iconStr={link.icon} size={20} />
        ) : (
          <DefaultPublicLinkIcon size={20} />
        )}
      </span>
      <span className="flex-1 text-center">{link.title}</span>
      {/* Invisible spacer for centering the title */}
      <span className="w-5 flex-shrink-0" />
    </a>
  );
}
