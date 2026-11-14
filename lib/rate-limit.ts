
import { createHash } from "crypto";

const WINDOW_SECONDS = 600;
const MAX_ATTEMPTS = 10;

export async function checkOrderTrackingLimit(
  identifier: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error("Rate limiter configuration missing");
  }

  const hash = createHash("sha256")
    .update(identifier)
    .digest("hex");

  const key = `aliqo:order-track:${hash}`;

  const script = `
    local count = redis.call('INCR', KEYS[1])
    if count == 1 then
      redis.call('EXPIRE', KEYS[1], ARGV[1])
    end
    return count
  `;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      "EVAL",
      script,
      "1",
      key,
      String(WINDOW_SECONDS),
    ]),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Rate limiter request failed");
  }

  const data = await response.json();
  const count = Number(data.result);

  if (!Number.isFinite(count)) {
    throw new Error("Invalid rate limiter response");
  }

  return {
    allowed: count <= MAX_ATTEMPTS,
    retryAfter: count > MAX_ATTEMPTS ? WINDOW_SECONDS : undefined,
  };
}
