import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";

export function parseClickMetadata(request, ip) {
  const referrer = request.headers.get("referer") || null;
  const rawUa = request.headers.get("user-agent") || null;
  const acceptLang = request.headers.get("accept-language") || null;

  // Parse referrer domain and UTM params
  let referrerDomain = null;
  let utmSource = null;
  let utmMedium = null;
  let utmCampaign = null;

  if (referrer) {
    try {
      const url = new URL(referrer);
      referrerDomain = url.hostname.replace(/^www\./, "");
      utmSource = url.searchParams.get("utm_source") || null;
      utmMedium = url.searchParams.get("utm_medium") || null;
      utmCampaign = url.searchParams.get("utm_campaign") || null;
    } catch {
      // Invalid URL, keep nulls
    }
  }

  // Parse user agent
  let browser = null;
  let browserVersion = null;
  let os = null;
  let osVersion = null;
  let deviceType = null;
  let isBot = false;

  if (rawUa) {
    const parser = new UAParser(rawUa);
    const result = parser.getResult();

    browser = result.browser.name || null;
    browserVersion = result.browser.version || null;
    os = result.os.name || null;
    osVersion = result.os.version || null;

    const dtype = result.device.type;
    if (dtype === "mobile" || dtype === "tablet") {
      deviceType = dtype;
    } else if (/bot|crawler|spider|crawling/i.test(rawUa)) {
      deviceType = "bot";
      isBot = true;
    } else {
      deviceType = "desktop";
    }
  }

  // Parse primary language
  let language = null;
  if (acceptLang) {
    const primary = acceptLang.split(",")[0].split(";")[0].trim();
    if (primary) language = primary;
  }

  // Country: try proxy headers first, then fall back to geoip-lite
  let country =
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("x-real-country") ||
    null;

  if (!country && ip && ip !== "unknown") {
    const geo = geoip.lookup(ip);
    if (geo) country = geo.country;
  }

  return {
    referrer,
    referrerDomain,
    userAgent: rawUa,
    browser,
    browserVersion,
    os,
    osVersion,
    deviceType,
    language,
    country,
    utmSource,
    utmMedium,
    utmCampaign,
    isBot,
  };
}
