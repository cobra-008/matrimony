import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/email/otp-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body as { email: string; otp: string };

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required." }, { status: 400 });
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ error: "OTP must be 6 digits." }, { status: 400 });
    }

    const result = verifyOtp(email, otp);

    if (!result.ok) {
      const messages: Record<string, string> = {
        not_found: "OTP not found. Please request a new one.",
        expired: "OTP has expired. Please request a new one.",
        mismatch: "Incorrect OTP. Please try again.",
        max_attempts: "Too many incorrect attempts. Please request a new OTP.",
      };
      return NextResponse.json(
        { error: messages[result.reason] ?? "OTP verification failed." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[verify-email-otp] Error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
