
import { createHash } from "crypto";

const WINDOW_SECONDS = 600;
const MAX_ATTEMPTS = 5;

export async function checkOrderTrackingLimit(
  ip: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    throw new Error("Rate limit service not configured");
  }

  const ipHash = createHash("sha256")
    .update(ip)
    .digest("hex");

  const key = `aliqo:order-track:${ipHash}`;

  const script = `
    local current = redis.call("INCR", KEYS[1])
    if current == 1 then
      redis.call("EXPIRE", KEYS[1], ARGV[1])
    end
    return current
  `;

  const response = await fetch(
    `${redisUrl.replace(/\/+$/, "")}/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        "EVAL",
        script,
        1,
        key,
        WINDOW_SECONDS,
      ]),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Rate limit service unavailable");
  }

  const data = await response.json();
  const count = Number(data.result);

  if (data.error || !Number.isInteger(count) || count < 1) {
    throw new Error("Rate limit check failed");
  }

  return {
    allowed: count <= MAX_ATTEMPTS,
    retryAfter: count > MAX_ATTEMPTS
      ? WINDOW_SECONDS
      : undefined,
  };
}
