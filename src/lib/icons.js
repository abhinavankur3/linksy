// Domain-to-Font Awesome icon name mapping for auto-detection
// Format: { domain: { prefix: "fab"|"fas", iconName: "..." } }
const DOMAIN_ICON_MAP = {
  "instagram.com": { prefix: "fab", iconName: "instagram" },
  "youtube.com": { prefix: "fab", iconName: "youtube" },
  "youtu.be": { prefix: "fab", iconName: "youtube" },
  "twitter.com": { prefix: "fab", iconName: "x-twitter" },
  "x.com": { prefix: "fab", iconName: "x-twitter" },
  "facebook.com": { prefix: "fab", iconName: "facebook" },
  "fb.com": { prefix: "fab", iconName: "facebook" },
  "tiktok.com": { prefix: "fab", iconName: "tiktok" },
  "linkedin.com": { prefix: "fab", iconName: "linkedin" },
  "github.com": { prefix: "fab", iconName: "github" },
  "gitlab.com": { prefix: "fab", iconName: "gitlab" },
  "bitbucket.org": { prefix: "fab", iconName: "bitbucket" },
  "discord.com": { prefix: "fab", iconName: "discord" },
  "discord.gg": { prefix: "fab", iconName: "discord" },
  "reddit.com": { prefix: "fab", iconName: "reddit" },
  "twitch.tv": { prefix: "fab", iconName: "twitch" },
  "spotify.com": { prefix: "fab", iconName: "spotify" },
  "open.spotify.com": { prefix: "fab", iconName: "spotify" },
  "soundcloud.com": { prefix: "fab", iconName: "soundcloud" },
  "apple.com": { prefix: "fab", iconName: "apple" },
  "music.apple.com": { prefix: "fab", iconName: "itunes-note" },
  "pinterest.com": { prefix: "fab", iconName: "pinterest" },
  "snapchat.com": { prefix: "fab", iconName: "snapchat" },
  "whatsapp.com": { prefix: "fab", iconName: "whatsapp" },
  "wa.me": { prefix: "fab", iconName: "whatsapp" },
  "telegram.org": { prefix: "fab", iconName: "telegram" },
  "t.me": { prefix: "fab", iconName: "telegram" },
  "medium.com": { prefix: "fab", iconName: "medium" },
  "dev.to": { prefix: "fab", iconName: "dev" },
  "dribbble.com": { prefix: "fab", iconName: "dribbble" },
  "behance.net": { prefix: "fab", iconName: "behance" },
  "figma.com": { prefix: "fab", iconName: "figma" },
  "codepen.io": { prefix: "fab", iconName: "codepen" },
  "stackoverflow.com": { prefix: "fab", iconName: "stack-overflow" },
  "producthunt.com": { prefix: "fab", iconName: "product-hunt" },
  "mastodon.social": { prefix: "fab", iconName: "mastodon" },
  "threads.net": { prefix: "fab", iconName: "threads" },
  "bluesky.app": { prefix: "fab", iconName: "bluesky" },
  "bsky.app": { prefix: "fab", iconName: "bluesky" },
  "patreon.com": { prefix: "fab", iconName: "patreon" },
  "amazon.com": { prefix: "fab", iconName: "amazon" },
  "etsy.com": { prefix: "fab", iconName: "etsy" },
  "shopify.com": { prefix: "fab", iconName: "shopify" },
  "ebay.com": { prefix: "fab", iconName: "ebay" },
  "vimeo.com": { prefix: "fab", iconName: "vimeo-v" },
  "kickstarter.com": { prefix: "fab", iconName: "kickstarter" },
  "goodreads.com": { prefix: "fab", iconName: "goodreads" },
  "imdb.com": { prefix: "fab", iconName: "imdb" },
  "last.fm": { prefix: "fab", iconName: "lastfm" },
  "bandcamp.com": { prefix: "fab", iconName: "bandcamp" },
  "wordpress.com": { prefix: "fab", iconName: "wordpress" },
  "tumblr.com": { prefix: "fab", iconName: "tumblr" },
  "flickr.com": { prefix: "fab", iconName: "flickr" },
  "unsplash.com": { prefix: "fab", iconName: "unsplash" },
  "paypal.com": { prefix: "fab", iconName: "paypal" },
  "paypal.me": { prefix: "fab", iconName: "paypal" },
  "stripe.com": { prefix: "fab", iconName: "stripe" },
  "slack.com": { prefix: "fab", iconName: "slack" },
  "npm.js.com": { prefix: "fab", iconName: "npm" },
  "docker.com": { prefix: "fab", iconName: "docker" },
  "aws.amazon.com": { prefix: "fab", iconName: "aws" },
  "notion.so": { prefix: "fas", iconName: "n" },
  "notion.site": { prefix: "fas", iconName: "n" },
};

/**
 * Auto-detect icon from a URL's domain.
 * Returns a string like "fab:instagram" or "fas:link" or null.
 */
export function detectIconFromUrl(url) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    if (DOMAIN_ICON_MAP[hostname]) {
      const { prefix, iconName } = DOMAIN_ICON_MAP[hostname];
      return `${prefix}:${iconName}`;
    }
    // Try parent domain
    const parts = hostname.split(".");
    if (parts.length > 2) {
      const parent = parts.slice(-2).join(".");
      if (DOMAIN_ICON_MAP[parent]) {
        const { prefix, iconName } = DOMAIN_ICON_MAP[parent];
        return `${prefix}:${iconName}`;
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Parse an icon string like "fab:instagram" into { prefix, iconName }
 */
export function parseIconString(iconStr) {
  if (!iconStr) return null;
  const [prefix, iconName] = iconStr.split(":");
  if (!prefix || !iconName) return null;
  return { prefix, iconName };
}
