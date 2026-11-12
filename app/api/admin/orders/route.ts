
import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = "aliqo37311011@gmail.com";

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("aliqo_admin_session")?.value;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!token || !url || !anonKey) return null;

  try {
    const response = await fetch(`${url}/auth/v1/user`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const user = await response.json();

    if (user.email?.toLowerCase() !== ADMIN_EMAIL) {
      return null;
    }

return { url, secretKey: secretKey || "" };
  } catch {
    return null;
  }
}

function isSameOrigin(request: NextRequest) {
  return request.headers.get("origin") === request.nextUrl.origin;
}

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request);

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
if (!admin.secretKey) {
  return NextResponse.json(
    { error: "SUPABASE_SECRET_KEY is missing." },
    { status: 500 }
  );
}
  try {
    const response = await fetch(
      `${admin.url}/rest/v1/orders?select=*,order_items(*)&order=created_at.desc`,
      {
        headers: {
          apikey: admin.secretKey,
          Authorization: `Bearer ${admin.secretKey}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not load orders." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { error: "Invalid request origin" },
      { status: 403 }
    );
  }

  const admin = await verifyAdmin(request);

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id, status } = await request.json();

    const allowedStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (
      typeof id !== "string" ||
      !uuidRegex.test(id) ||
      !allowedStatuses.includes(status)
    ) {
      return NextResponse.json(
        { error: "Invalid order ID or status." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${admin.url}/rest/v1/orders?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: {
          apikey: admin.secretKey,
          Authorization: `Bearer ${admin.secretKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({ status }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { error: "Order update failed." },
      { status: 400 }
    );
  }
}
