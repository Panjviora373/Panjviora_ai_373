
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
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
        { error: "Please login first" },
        { status: 401 }
      );
    }

    const token = authorization.replace("Bearer ", "");

    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    const user = await userResponse.json();
    const body = await request.json();

    const requiredFields = [
      "business_name",
      "owner_name",
      "phone",
      "category",
      "city",
    ];

    for (const field of requiredFields) {
      if (
        typeof body[field] !== "string" ||
        !body[field].trim()
      ) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const sellerResponse = await fetch(
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
          business_name: body.business_name.trim(),
          owner_name: body.owner_name.trim(),
          email: user.email,
          phone: body.phone.trim(),
          category: body.category.trim(),
          city: body.city.trim(),
          status: "pending",
        }),
        cache: "no-store",
      }
    );

    const sellerData = await sellerResponse.json();

    if (!sellerResponse.ok) {
      return NextResponse.json(
        {
          error:
            sellerData.message ||
            sellerData.details ||
            "Seller registration failed",
        },
        { status: sellerResponse.status }
      );
    }

    return NextResponse.json(
      {
        message: "Seller registration submitted successfully",
        seller: sellerData[0],
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
