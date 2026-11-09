
import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = "aliqo37311011@gmail.com";

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("aliqo_admin_session")?.value;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!token || !url || !key) return null;

  try {
    const response = await fetch(`${url}/auth/v1/user`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const user = await response.json();

    if (user.email?.toLowerCase() !== ADMIN_EMAIL) {
      return null;
    }

    return { token, url, key };
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

  const response = await fetch(
    `${admin.url}/rest/v1/deals?select=*&order=created_at.desc`,
    {
      headers: {
        apikey: admin.key,
        Authorization: `Bearer ${admin.token}`,
      },
      cache: "no-store",
    }
  );

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
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

    if (
      !id ||
      !["pending", "approved", "rejected"].includes(status)
    ) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${admin.url}/rest/v1/deals?id=eq.${encodeURIComponent(String(id))}`,
      {
        method: "PATCH",
        headers: {
          apikey: admin.key,
          Authorization: `Bearer ${admin.token}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({ status }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Update failed" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Deal ID is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${admin.url}/rest/v1/deals?id=eq.${encodeURIComponent(String(id))}`,
      {
        method: "DELETE",
        headers: {
          apikey: admin.key,
          Authorization: `Bearer ${admin.token}`,
          Prefer: "return=representation",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 400 }
    );
  }
}
