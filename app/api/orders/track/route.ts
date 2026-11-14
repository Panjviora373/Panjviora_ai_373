
import { createHash } from "crypto";
import { NextResponse } from "next/server";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function checkRateLimit(ip: string) {
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
        600,
      ]),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Rate limit service unavailable");
  }

  const data = await response.json();

  if (
    data.error ||
    !Number.isInteger(Number(data.result))
  ) {
    throw new Error("Rate limit check failed");
  }

  return Number(data.result);
}

export async function POST(request: Request) {
  try {
    const forwardedFor =
      request.headers.get("x-forwarded-for");

    const ip =
      request.headers.get("x-real-ip") ||
      forwardedFor?.split(",")[0]?.trim();

    if (!ip) {
      return NextResponse.json(
        { error: "Unable to verify request source." },
        { status: 400 }
      );
    }

    const attempts = await checkRateLimit(ip);

    if (attempts > 5) {
      return NextResponse.json(
        {
          error: "Too many tracking attempts. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "600",
          },
        }
      );
    }

    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request." },
        { status: 400 }
      );
    }

    const orderId =
      typeof body.order_id === "string"
        ? body.order_id.trim()
        : "";

    const customerPhone =
      typeof body.customer_phone === "string"
        ? body.customer_phone.trim()
        : "";

    if (
      !UUID_REGEX.test(orderId) ||
      !customerPhone ||
      customerPhone.length > 30
    ) {
      return NextResponse.json(
        {
          error: "Please enter a valid Order ID and phone number.",
        },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const secretKey =
      process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !secretKey) {
      return NextResponse.json(
        { error: "Order tracking service is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}&select=id,status,created_at,total_amount,customer_name,customer_phone,order_items(product_name,quantity,unit_price,subtotal)`,
      {
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Unable to check order right now. Please try again.",
        },
        { status: 500 }
      );
    }

    const orders = await response.json();
    const order = orders?.[0];

    if (!order || order.customer_phone !== customerPhone) {
      return NextResponse.json(
        {
          error: "Order not found. Please check your Order ID and phone number.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        order_id: order.id,
        status: order.status,
        created_at: order.created_at,
        total_amount: order.total_amount,
        customer_name: order.customer_name,
        items: order.order_items,
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: "Tracking service temporarily unavailable. Please try again.",
      },
      { status: 503 }
    );
  }
}
