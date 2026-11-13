
import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

// Meta webhook verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (!verifyToken) {
    return new NextResponse("Webhook configuration missing", {
      status: 500,
    });
  }

  if (
    mode === "subscribe" &&
    token === verifyToken &&
    challenge
  ) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return new NextResponse("Verification failed", {
    status: 403,
  });
}

// Verify Meta signature
function isValidSignature(
  rawBody: string,
  signature: string | null,
  appSecret: string
) {
  if (!signature?.startsWith("sha256=")) {
    return false;
  }

  const received = signature.slice(7);

  if (!/^[a-f0-9]{64}$/i.test(received)) {
    return false;
  }

  const expected = createHmac("sha256", appSecret)
    .update(rawBody)
    .digest("hex");

  return timingSafeEqual(
    Buffer.from(received, "hex"),
    Buffer.from(expected, "hex")
  );
}

// Receive WhatsApp events
export async function POST(request: NextRequest) {
  const appSecret = process.env.META_APP_SECRET;

  if (!appSecret) {
    return NextResponse.json(
      { error: "Webhook configuration missing" },
      { status: 500 }
    );
  }

  const rawBody = await request.text();

  const signature = request.headers.get("x-hub-signature-256");

  if (!isValidSignature(rawBody, signature, appSecret)) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 }
    );
  }

  let body: unknown;

  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  // WhatsApp events will be processed in the next integration step.
  console.log("ALIQO WhatsApp webhook event received");

  return NextResponse.json({ received: true }, { status: 200 });
}
