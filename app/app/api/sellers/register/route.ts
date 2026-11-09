import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Database configuration missing" },
      { status: 500 }
    );
  }

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Please login before registering" },
      { status: 401 }
    );
  }

  try {
    const token = authorization.replace("Bearer ", "");

    const userResponse = await fetch(
      `${supabaseUrl}/auth/v1/user`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "Invalid login session" },
        { status: 401 }
      );
    }

    const user = await userResponse.json();
    const body = await request.json();

    const businessName = String(body.business_name || "").trim();
    const ownerName = String(body.owner_name || "").trim();
    const phone = String(body.phone || "").trim();
    const category = String(body.category || "").trim();
    const city = String(body.city || "").trim();

    if (
      !businessName ||
      !ownerName ||
      !phone ||
      !category ||
      !city
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/sellers`,
      {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          user_id: user.id,
          business_name: businessName,
          owner_name: ownerName,
          email: user.email,
          phone,
          category,
          city,
          status: "pending",
        }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            response.status === 409
              ? "You already have a seller account"
              : "Seller registration failed",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "Seller registration submitted successfully",
      seller: data[0],
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
