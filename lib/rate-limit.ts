
import { createHash } from "crypto";

const WINDOW_SECONDS = 600;
const MAX_ATTEMPTS = 5;

type RateLimitResult = {
  allowed: boolean;
  retryAfter?: number;
};

async function checkRateLimit(
  ip: string,
  scope: "order-track" | "checkout"
): Promise<RateLimitResult> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    throw new Error("Rate limit service not configured");
  }

  if (!ip || !ip.trim()) {
    throw new Error("Valid IP address required");
  }

  const ipHash = createHash("sha256")
    .update(ip.trim())
    .digest("hex");

  const key = `aliqo:${scope}:${ipHash}`;

  const script = `
    local current = redis.call("INCR", KEYS[1])
    if current == 1 then
      redis.call("EXPIRE", KEYS[1], ARGV[1])
    end
    local ttl = redis.call("TTL", KEYS[1])
    return {current, ttl}
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

  if (data.error || !Array.isArray(data.result)) {
    throw new Error("Rate limit check failed");
  }

  const count = Number(data.result[0]);
  const ttl = Number(data.result[1]);

  if (
    !Number.isInteger(count) ||
    count < 1 ||
    !Number.isInteger(ttl) ||
    ttl < 0
  ) {
    throw new Error("Invalid rate limit response");
  }

  return {
    allowed: count <= MAX_ATTEMPTS,
    retryAfter:
      count > MAX_ATTEMPTS ? Math.max(1, ttl) : undefined,
  };
}

export async function checkOrderTrackingLimit(
  ip: string
): Promise<RateLimitResult> {
  return checkRateLimit(ip, "order-track");
}

export async function checkCheckoutLimit(
  ip: string
): Promise<RateLimitResult> {
  return checkRateLimit(ip, "checkout");
}
