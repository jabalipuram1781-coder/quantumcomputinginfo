import { NextResponse } from "next/server";

export const runtime = "edge";

async function verifyTurnstile(token: string) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey || secretKey === "PLACEHOLDER") {
    // Skip verification if secret key is not configured (development fallback)
    console.log("Turnstile SECRET_KEY not configured, skipping validation.");
    return true;
  }
  if (!token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
    });
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.error("Turnstile verification error:", err);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { email, turnstileToken } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Verify Turnstile Token
    const isHuman = await verifyTurnstile(turnstileToken);
    if (!isHuman) {
      return NextResponse.json({ error: "Turnstile verification failed" }, { status: 400 });
    }

    const kitApiKey = process.env.KIT_API_KEY;
    const kitFormId = process.env.KIT_FORM_ID;

    if (!kitApiKey || kitApiKey === "PLACEHOLDER" || !kitFormId || kitFormId === "PLACEHOLDER") {
      // Fallback: log subscription in console
      console.log(`[SUBSCRIBER LOG] Mock subscription for: ${email}`);
      return NextResponse.json({ success: true, message: "Subscription simulated (dev mode)" });
    }

    // Forward subscription to Kit (ConvertKit) API
    // Kit subscription endpoint: POST https://api.convertkit.com/v3/forms/<form_id>/subscribe
    const res = await fetch(`https://api.convertkit.com/v3/forms/${kitFormId}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: kitApiKey,
        email: email,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Kit API Error:", errorText);
      return NextResponse.json({ error: "Failed to subscribe to provider" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscription API handler error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
