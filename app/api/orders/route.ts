
import { NextResponse } from "next/server";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    const body = await request.json();

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
      deliveryAddress.length > 1000
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

    const validItems = items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    for (const item of validItems) {
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
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !secretKey) {
      return NextResponse.json(
        { error: "Order service is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/rpc/create_guest_order`,
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
      return NextResponse.json(
        {
          error:
            "We could not place your order. Please check your cart and try again.",
        },
        { status: 400 }
      );
    }

    const orderId = await response.json();

    return NextResponse.json({
      success: true,
      order_id: orderId,
      message: "Your order has been placed successfully.",
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
