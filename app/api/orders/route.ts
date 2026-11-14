
import { NextResponse } from "next/server";
import { checkCheckoutLimit } from "@/lib/rate-limit";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  let stage = "request_start";

  try {
    // 1. Rate limit
    stage = "rate_limit";

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip =
      request.headers.get("x-real-ip") ||
      forwardedFor?.split(",")[0]?.trim();

    if (!ip) {
      return NextResponse.json(
        { error: "Unable to verify request source." },
        { status: 400 }
      );
    }

    const rateLimit = await checkCheckoutLimit(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many checkout attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter ?? 600),
          },
        }
      );
    }

    // 2. Read request
    stage = "read_request";

    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const customerName =
      typeof body.customer_name === "string"
        ? body.customer_name.trim()
        : "";

    const customerPhone =
      typeof body.customer_phone === "string"
        ? body.customer_phone.trim()
        : "";

    const deliveryAddress =
      typeof body.delivery_address === "string"
        ? body.delivery_address.trim()
        : "";

    const items = body.items;

    if (
      !customerName ||
      customerName.length > 120 ||
      !customerPhone ||
      customerPhone.length > 30 ||
      !deliveryAddress ||
      deliveryAddress.length > 500
    ) {
      return NextResponse.json(
        { error: "Please enter valid customer details." },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      items.length > 30
    ) {
      return NextResponse.json(
        { error: "Your cart is empty or invalid." },
        { status: 400 }
      );
    }

    // 3. Validate cart
    stage = "validate_cart";

    const validItems: {
      product_id: string;
      quantity: number;
    }[] = [];

    for (const item of items) {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return NextResponse.json(
          { error: "Invalid cart item." },
          { status: 400 }
        );
      }

      if (
        typeof item.product_id !== "string" ||
        !UUID_REGEX.test(item.product_id) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 100
      ) {
        return NextResponse.json(
          { error: "Invalid product or quantity." },
          { status: 400 }
        );
      }

      validItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
      });
    }

    // 4. Check Supabase configuration
    stage = "check_environment";

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !secretKey) {
      console.error("[orders] Missing Supabase environment configuration.");

      return NextResponse.json(
        { error: "Order service is not configured." },
        { status: 500 }
      );
    }

    // 5. Call database function
    stage = "supabase_rpc";

    const response = await fetch(
      `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/rpc/create_guest_order`,
      {
        method: "POST",
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_customer_name: customerName,
          p_customer_phone: customerPhone,
          p_delivery_address: deliveryAddress,
          p_items: validItems,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("[orders] Supabase RPC failed:", {
        status: response.status,
        response: errorText.slice(0, 1000),
      });

      return NextResponse.json(
        { error: "We could not place your order. Please try again." },
        { status: 502 }
      );
    }

    // 6. Verify database response
    stage = "verify_rpc_response";

    const responseText = await response.text();

    let orderId: unknown;

    try {
      orderId = JSON.parse(responseText);
    } catch {
      console.error("[orders] Supabase returned invalid JSON:", {
        response: responseText.slice(0, 300),
      });

      return NextResponse.json(
        { error: "Order confirmation could not be verified." },
        { status: 502 }
      );
    }

    if (typeof orderId !== "string" || !UUID_REGEX.test(orderId)) {
      console.error("[orders] Supabase returned an invalid order ID.");

      return NextResponse.json(
        { error: "Order confirmation could not be verified." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        order_id: orderId,
        message: "Your order has been placed successfully.",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[orders] Request failed:", {
      stage,
      error:
        error instanceof Error
          ? error.message
          : String(error),
      stack:
        error instanceof Error
          ? error.stack
          : undefined,
    });

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 503 }
    );
  }
}
