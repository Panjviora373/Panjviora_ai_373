
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      business_name,
      contact_name,
      email,
      title,
      description,
      category,
      offer_url,
      valid_until,
    } = body;

    const requiredFields = [
      business_name,
      contact_name,
      email,
      title,
      description,
      category,
    ];

    if (
      requiredFields.some(
        (value) => typeof value !== "string" || !value.trim()
      )
    ) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    const categories = [
      "Shopping",
      "Technology",
      "Education",
      "Lifestyle",
      "Fashion",
      "Food",
      "Travel",
      "Other",
    ];

    if (!categories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid deal category." },
        { status: 400 }
      );
    }

    if (
      business_name.trim().length < 2 ||
      business_name.trim().length > 150 ||
      contact_name.trim().length < 2 ||
      contact_name.trim().length > 100 ||
      email.trim().length > 254 ||
      title.trim().length < 3 ||
      title.trim().length > 150 ||
      description.trim().length < 5 ||
      description.trim().length > 2000
    ) {
      return NextResponse.json(
        { error: "Please check the length of your information." },
        { status: 400 }
      );
    }

    if (
      typeof offer_url === "string" &&
      offer_url.trim()
    ) {
      try {
        const parsedUrl = new URL(offer_url);
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          throw new Error("Invalid URL");
        }
      } catch {
        return NextResponse.json(
          { error: "Please enter a valid website URL." },
          { status: 400 }
        );
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/deals`,
      {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          business_name: business_name.trim(),
          contact_name: contact_name.trim(),
          email: email.trim().toLowerCase(),
          title: title.trim(),
          description: description.trim(),
          category,
          offer_url: offer_url?.trim() || null,
          valid_until: valid_until || null,
          status: "pending",
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to save your offer. Please try again." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Deal submitted for approval." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Database configuration missing" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/deals?select=id,business_name,title,description,category,offer_url,valid_until,created_at&status=eq.approved&order=created_at.desc`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to load deals" },
        { status: response.status }
      );
    }

    return NextResponse.json({ deals: data });
  } catch {
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }
}
