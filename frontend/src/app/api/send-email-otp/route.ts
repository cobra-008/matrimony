import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { generateOtp, storeOtp } from "@/lib/email/otp-store";
import { otpEmailHtml, otpEmailText } from "@/lib/email/templates";

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');
const FROM = process.env.RESEND_FROM_EMAIL ?? "Elite Tamil Matrimony <admin@elitetamilmatrimony.com>";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name } = body as { email: string; name?: string };

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Don't allow synthetic etm.app addresses
    if (email.toLowerCase().endsWith("@etm.app")) {
      return NextResponse.json({ error: "Please enter a real email address." }, { status: 400 });
    }

    // In development mode, if API key is missing or dummy, fallback to 123456
    const resendKey = process.env.RESEND_API_KEY;
    const isMock = !resendKey || resendKey === 're_dummy_key_for_build';
    
    const otp = isMock ? '123456' : generateOtp();
    await storeOtp(email, otp);

    const displayName = name || "there";
    
    if (isMock) {
      console.warn("[send-email-otp] Mock mode: No valid RESEND_API_KEY configured. OTP generated but not sent:", otp);
      return NextResponse.json({ success: true });
    }

    const { error } = await resend.emails.send({
      from: FROM,
      to: [email],
      subject: "Verify your email — Elite Tamil Matrimony",
      html: otpEmailHtml(displayName, otp),
      text: otpEmailText(displayName, otp),
    });

    if (error) {
      console.error("[send-email-otp] Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send OTP email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[send-email-otp] Unexpected error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
