
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: "Database configuration missing" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/sellers?select=business_name,category,city,created_at&status=eq.approved&order=created_at.desc&limit=100`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to load approved sellers" },
        { status: 500 }
      );
    }

    const sellers = await response.json();

    return NextResponse.json({ sellers });
  } catch {
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return NextResponse.json(
      { error: "Database configuration missing" },
      { status: 500 }
    );
  }

  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : "";

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify the Supabase user token
    const authResponse = await fetch(
      `${supabaseUrl}/auth/v1/user`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!authResponse.ok) {
      return NextResponse.json(
        { error: "Invalid or expired login session" },
        { status: 401 }
      );
    }

    const user = await authResponse.json();

    if (!user.id || !user.email) {
      return NextResponse.json(
        { error: "Verified user information is missing" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const businessName =
      typeof body.business_name === "string"
        ? body.business_name.trim()
        : "";

    const ownerName =
      typeof body.owner_name === "string"
        ? body.owner_name.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const category =
      typeof body.category === "string"
        ? body.category.trim()
        : "";

    const city =
      typeof body.city === "string"
        ? body.city.trim()
        : "";

    if (
      !businessName ||
      !ownerName ||
      !phone ||
      !category ||
      !city
    ) {
      return NextResponse.json(
        { error: "Please complete all seller details" },
        { status: 400 }
      );
    }

    if (
      businessName.length > 150 ||
      ownerName.length > 150 ||
      phone.length > 40 ||
      category.length > 100 ||
      city.length > 100
    ) {
      return NextResponse.json(
        { error: "One or more fields exceed the allowed length" },
        { status: 400 }
      );
    }

    // Insert using the authenticated user's JWT.
    // RLS verifies user_id, email and pending status.
    const insertResponse = await fetch(
      `${supabaseUrl}/rest/v1/sellers`,
      {
        method: "POST",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
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

    if (!insertResponse.ok) {
      const errorText = await insertResponse.text();

      let errorData: { code?: string; message?: string } = {};

      try {
        errorData = JSON.parse(errorText);
      } catch {
        // Keep the generic error below.
      }

      if (
        insertResponse.status === 409 ||
        errorData.code === "23505"
      ) {
        return NextResponse.json(
          { error: "A seller application already exists for this account" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          error:
            insertResponse.status === 401 ||
            insertResponse.status === 403
              ? "Seller registration is not authorized"
              : "Unable to submit seller application",
        },
        { status: insertResponse.status >= 400 &&
          insertResponse.status < 500
            ? insertResponse.status
            : 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Seller application submitted successfully",
        status: "pending",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Seller registration failed. Please try again." },
      { status: 500 }
    );
  }
}
