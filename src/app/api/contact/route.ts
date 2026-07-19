import { NextResponse } from "next/server";

export const runtime = "edge";

async function verifyTurnstile(token: string) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey || secretKey === "PLACEHOLDER") {
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
    const { name, email, subject, message, turnstileToken } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    // Verify Turnstile Token
    const isHuman = await verifyTurnstile(turnstileToken);
    if (!isHuman) {
      return NextResponse.json({ error: "Turnstile verification failed" }, { status: 400 });
    }

    // Log the contact form submission
    console.log("=== CONTACT FORM SUBMISSION ===");
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Subject: ${subject || "(None)"}`);
    console.log(`Message: ${message}`);
    console.log("===============================");

    return NextResponse.json({ success: true, message: "Message received successfully" });
  } catch (error) {
    console.error("Contact API handler error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
