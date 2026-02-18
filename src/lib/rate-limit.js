const windowMs = 60_000; // 1 minute
const maxRequests = 30; // 30 clicks per minute per IP

const requests = new Map();

export function rateLimit(key) {
  const now = Date.now();
  const windowStart = now - windowMs;

  let timestamps = requests.get(key) || [];
  timestamps = timestamps.filter((t) => t > windowStart);

  if (timestamps.length >= maxRequests) {
    requests.set(key, timestamps);
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  requests.set(key, timestamps);

  // Periodic cleanup
  if (Math.random() < 0.01) {
    for (const [k, v] of requests) {
      const filtered = v.filter((t) => t > windowStart);
      if (filtered.length === 0) requests.delete(k);
      else requests.set(k, filtered);
    }
  }

  return { allowed: true, remaining: maxRequests - timestamps.length };
}
