import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";

// Server component — renders icon SVG inline with zero client JS
export function PublicIcon({ iconStr, size = 18, className = "" }) {
  if (!iconStr) return null;

  const [prefix, iconName] = iconStr.split(":");
  if (!prefix || !iconName) return null;

  // Convert "icon-name" to "faIconName" key format
  const faKey =
    "fa" +
    iconName
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("");

  const iconSet = prefix === "fab" ? fab : fas;
  const icon = iconSet[faKey];

  if (!icon) return null;

  const [width, height, , , path] = icon.icon;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${width} ${height}`}
      fill="currentColor"
      className={className}
      aria-label={icon.iconName}
    >
      <path d={typeof path === "string" ? path : path[0]} />
    </svg>
  );
}

// Default chain-link icon for links without a set icon
export function DefaultPublicLinkIcon({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
