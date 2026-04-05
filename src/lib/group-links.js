export function organizeLinksIntoGroups(links, groups, ungroupedPosition = 0) {
  const ungrouped = links.filter((l) => !l.groupId);
  const grouped = groups
    .map((g) => ({
      ...g,
      links: links.filter((l) => l.groupId === g.id),
    }))
    .filter((g) => g.links.length > 0);

  // Build ordered sections array
  const sections = [];
  const allItems = [
    ...grouped.map((g) => ({ type: "group", position: g.position, data: g })),
  ];
  if (ungrouped.length > 0) {
    allItems.push({ type: "ungrouped", position: ungroupedPosition, data: ungrouped });
  }
  allItems.sort((a, b) => a.position - b.position);

  for (const item of allItems) {
    sections.push(item);
  }

  return { ungrouped, grouped, sections };
}
