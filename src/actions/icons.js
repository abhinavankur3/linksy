"use server";

import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";

// Build index on first call (cached in module scope)
let iconIndex = null;

function getIconIndex() {
  if (iconIndex) return iconIndex;

  const seen = new Set();
  iconIndex = [];

  function addIcon(prefix, icon) {
    const id = `${prefix}:${icon.iconName}`;
    if (seen.has(id)) return;
    seen.add(id);
    iconIndex.push({
      id,
      prefix,
      iconName: icon.iconName,
      label: icon.iconName
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      width: icon.icon[0],
      height: icon.icon[1],
      path: icon.icon[4],
    });
  }

  // Add brand icons
  for (const [key, icon] of Object.entries(fab)) {
    if (!icon?.iconName || key === "faFontAwesome") continue;
    addIcon("fab", icon);
  }

  // Add solid icons
  for (const [key, icon] of Object.entries(fas)) {
    if (!icon?.iconName) continue;
    addIcon("fas", icon);
  }

  return iconIndex;
}

export async function searchIcons(query) {
  if (!query || query.length < 2) return [];

  const index = getIconIndex();
  const q = query.toLowerCase();

  // Prioritize brand icons, then solid
  const results = index
    .filter(
      (icon) =>
        icon.iconName.includes(q) ||
        icon.label.toLowerCase().includes(q)
    )
    .sort((a, b) => {
      // Brands first
      if (a.prefix === "fab" && b.prefix !== "fab") return -1;
      if (a.prefix !== "fab" && b.prefix === "fab") return 1;
      // Exact prefix match first
      if (a.iconName.startsWith(q) && !b.iconName.startsWith(q)) return -1;
      if (!a.iconName.startsWith(q) && b.iconName.startsWith(q)) return 1;
      return 0;
    })
    .slice(0, 30);

  return results;
}

export async function getIconData(iconStr) {
  if (!iconStr) return null;
  const [prefix, iconName] = iconStr.split(":");
  if (!prefix || !iconName) return null;

  const index = getIconIndex();
  return index.find((i) => i.prefix === prefix && i.iconName === iconName) || null;
}
