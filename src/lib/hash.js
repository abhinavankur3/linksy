import { createHash } from "crypto";

function getDailySalt() {
  const date = new Date().toISOString().split("T")[0];
  return `linksy-salt-${date}`;
}

export function hashIp(ip) {
  const salt = getDailySalt();
  return createHash("sha256")
    .update(`${salt}:${ip}`)
    .digest("hex")
    .slice(0, 16);
}
