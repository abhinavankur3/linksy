const RESERVED_SLUGS = new Set([
  "admin",
  "login",
  "api",
  "profile",
  "links",
  "_next",
  "favicon.ico",
]);

export function isReservedSlug(slug) {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}

export function isValidSlug(slug) {
  if (isReservedSlug(slug)) return false;
  return /^[a-z0-9][a-z0-9-]{1,46}[a-z0-9]$/.test(slug);
}
