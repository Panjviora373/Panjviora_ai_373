
import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

// Meta webhook verification
export async function GET(request: NextRequest) {
  console.log("[ALIQO WEBHOOK] GET verification request received");

  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (!verifyToken) {
    console.error("[ALIQO WEBHOOK] WHATSAPP_VERIFY_TOKEN missing");
    return new NextResponse("Webhook configuration missing", {
      status: 500,
    });
  }

  if (mode === "subscribe" && token === verifyToken && challenge) {
    console.log("[ALIQO WEBHOOK] GET verification successful");

    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  console.error("[ALIQO WEBHOOK] GET verification failed");

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
  console.log("[ALIQO WEBHOOK] POST request received");

  const appSecret = process.env.META_APP_SECRET;

  if (!appSecret) {
    console.error("[ALIQO WEBHOOK] META_APP_SECRET missing");

    return NextResponse.json(
      { error: "Webhook configuration missing" },
      { status: 500 }
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!isValidSignature(rawBody, signature, appSecret)) {
    console.error("[ALIQO WEBHOOK] Signature verification failed");

    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 }
    );
  }

  let body: unknown;

  try {
    body = JSON.parse(rawBody);
  } catch {
    console.error("[ALIQO WEBHOOK] Invalid JSON received");

    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  console.log("[ALIQO WEBHOOK] Event received and signature verified");

  return NextResponse.json({ received: true }, { status: 200 });
}
