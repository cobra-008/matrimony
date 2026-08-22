import { NextRequest, NextResponse } from "next/server";

// POST /api/verify-msg91-token
// Validates the JWT access_token returned by MSG91's verifyOtp() client method.
// Keeps the MSG91_AUTH_KEY server-side only — never exposed to the browser.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accessToken } = body as { accessToken?: string };

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required." },
        { status: 400 }
      );
    }

    const authKey = process.env.MSG91_AUTH_KEY;
    if (!authKey) {
      console.error("[verify-msg91-token] MSG91_AUTH_KEY is not set.");
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 }
      );
    }

    // Call MSG91's server-side verification endpoint
    const response = await fetch(
      "https://control.msg91.com/api/v5/widget/verifyAccessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          authkey: authKey,
          "access-token": accessToken,
        }),
      }
    );

    let data: Record<string, unknown>;
    try {
      data = await response.json();
    } catch {
      console.error("[verify-msg91-token] Non-JSON response from MSG91.");
      return NextResponse.json(
        { error: "Verification service returned an unexpected response." },
        { status: 502 }
      );
    }

    // MSG91 returns { type: "error", message: "..." } on failure
    if (!response.ok || data?.type === "error") {
      console.warn("[verify-msg91-token] MSG91 rejected token:", data);
      return NextResponse.json(
        { error: (data?.message as string) ?? "Token verification failed. Please try again." },
        { status: 400 }
      );
    }

    // Token is valid
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[verify-msg91-token] Unexpected error:", err);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
