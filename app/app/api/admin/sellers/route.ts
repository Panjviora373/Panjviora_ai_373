
import { NextRequest, NextResponse } from "next/server";

async function verifyAdmin(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const token = request.cookies.get("aliqo_admin_session")?.value;

  if (!supabaseUrl || !supabaseKey || !token) {
    return null;
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const user = await response.json();

  if (user.email !== "aliqo37311011@gmail.com") {
    return null;
  }

  return { supabaseUrl, supabaseKey, token };
}

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request);

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      `${admin.supabaseUrl}/rest/v1/sellers?select=*&order=created_at.desc`,
      {
        headers: {
          apikey: admin.supabaseKey,
          Authorization: `Bearer ${admin.token}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to load seller applications" },
        { status: response.status }
      );
    }

    return NextResponse.json({ sellers: data });
  } catch {
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const admin = await verifyAdmin(request);

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const userId = String(body.user_id || "").trim();
    const status = body.status;

    if (
      !userId ||
      !["approved", "rejected"].includes(status)
    ) {
      return NextResponse.json(
        { error: "Invalid seller ID or status" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${admin.supabaseUrl}/rest/v1/sellers?user_id=eq.${encodeURIComponent(userId)}`,
      {
        method: "PATCH",
        headers: {
          apikey: admin.supabaseKey,
          Authorization: `Bearer ${admin.token}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({ status }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to update seller status" },
        { status: response.status }
      );
    }

    if (!data.length) {
      return NextResponse.json(
        { error: "Seller not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Seller ${status} successfully`,
      seller: data[0],
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
