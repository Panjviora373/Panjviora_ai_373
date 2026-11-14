
import { createHash } from "crypto";

const WINDOW_SECONDS = 600;
const MAX_ATTEMPTS = 5;
const REDIS_TIMEOUT_MS = 5000;

type RateLimitResult = {
  allowed: boolean;
  retryAfter?: number;
};

async function checkRateLimit(
  ip: string,
  scope: "order-track" | "checkout"
): Promise<RateLimitResult> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!redisUrl || !redisToken) {
    throw new Error("Rate limit service not configured");
  }

  if (!ip || !ip.trim()) {
    throw new Error("Valid IP address required");
  }

  let endpoint: URL;

  try {
    endpoint = new URL(redisUrl);
  } catch {
    throw new Error("Invalid Upstash Redis REST URL");
  }

  if (endpoint.protocol !== "https:") {
    throw new Error("Upstash Redis URL must use HTTPS");
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

  let response: Response;

  try {
    response = await fetch(
      `${endpoint.origin}/`,
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
        signal: AbortSignal.timeout(REDIS_TIMEOUT_MS),
      }
    );
  } catch (error) {
    console.error("[rate-limit] Redis connection failed:", error);

    throw new Error("Rate limit service unavailable");
  }

  const responseText = await response.text();

  if (!response.ok) {
    console.error("[rate-limit] Redis HTTP error:", {
      status: response.status,
      response: responseText.slice(0, 500),
    });

    throw new Error(
      `Rate limit service unavailable (HTTP ${response.status})`
    );
  }

  let data: {
    result?: unknown;
    error?: string;
  };

  try {
    data = JSON.parse(responseText);
  } catch {
    console.error("[rate-limit] Invalid Redis JSON response");

    throw new Error("Invalid rate limit response");
  }

  if (data.error) {
    console.error("[rate-limit] Redis command error:", data.error);

    throw new Error("Rate limit command failed");
  }

  if (!Array.isArray(data.result) || data.result.length !== 2) {
    console.error("[rate-limit] Unexpected Redis result:", data.result);

    throw new Error("Rate limit check failed");
  }

  const count = Number(data.result[0]);
  const ttl = Number(data.result[1]);

  if (
    !Number.isSafeInteger(count) ||
    count < 1 ||
    !Number.isInteger(ttl) ||
    ttl < 0
  ) {
    console.error("[rate-limit] Invalid Redis values:", {
      count,
      ttl,
    });

    throw new Error("Invalid rate limit response");
  }

  return {
    allowed: count <= MAX_ATTEMPTS,
    retryAfter:
      count > MAX_ATTEMPTS
        ? Math.max(1, ttl)
        : undefined,
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
