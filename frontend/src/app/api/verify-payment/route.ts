import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { upgradeMembership, fetchProfile } from "@/lib/auth-store";
import { paymentConfirmationHtml, paymentConfirmationText } from "@/lib/email/templates";

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');
const FROM = process.env.RESEND_FROM_EMAIL ?? "Elite Tamil Matrimony <admin@elitetamilmatrimony.com>";

// Plan config mirrored from payment page
const PLAN_CONFIG = {
  Gold: {
    period: "1 Month",
    features: [
      "Browse 25 Lakh+ profiles",
      "Unlimited interests",
      "30 contact reveals per month",
      "AI compatibility score for every match",
      "Priority profile listing",
      "Advanced search (25+ filters)",
    ],
  },
  Diamond: {
    period: "1 Month",
    features: [
      "Everything in Gold",
      "Unlimited contact reveals",
      "First-page priority placement",
      "Video call request feature",
      "Exclusive Diamond-only matches",
      "Dedicated account manager",
    ],
  },
  Platinum: {
    period: "3 Months",
    features: [
      "Everything in Diamond",
      "Dedicated human matchmaker",
      "Hand-curated match recommendations",
      "Background verification assistance",
      "Profile video introduction",
      "Priority 24/7 support",
    ],
  },
} as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, planKey, userId, userEmail, userName, amountPaid } = body as {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
      planKey: string;
      userId?: string;
      userEmail?: string;
      userName?: string;
      amountPaid?: number;
    };

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment fields." },
        { status: 400 }
      );
    }

    if (!planKey) {
      return NextResponse.json(
        { error: "Plan key is required." },
        { status: 400 }
      );
    }

    // HMAC-SHA256 signature verification
    const keySecret = process.env.RAZORPAY_KEY_SECRET!;
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("[verify-payment] Signature mismatch — possible tampered request");
      return NextResponse.json(
        { error: "Payment signature verification failed." },
        { status: 400 }
      );
    }

    // Signature valid — upgrade membership in Supabase if userId provided
    let profile = null;
    if (userId) {
      try {
        profile = await upgradeMembership(userId, planKey as "Gold" | "Diamond" | "Platinum");
      } catch (dbErr) {
        console.error("[verify-payment] DB upgrade failed:", dbErr);
      }
      // Fetch profile if upgrade didn't return it (for email data)
      if (!profile) {
        profile = await fetchProfile(userId).catch(() => null);
      }
    }

    // Send confirmation email (non-blocking — fire and forget)
    const recipientEmail = userEmail || profile?.email;
    const recipientName = userName || profile?.name || "Member";
    if (recipientEmail && !recipientEmail.endsWith("@etm.app")) {
      const planInfo = PLAN_CONFIG[planKey as keyof typeof PLAN_CONFIG];
      const months = planKey === "Platinum" ? 3 : 1;
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + months);
      const expiryStr = expiry.toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      });

      const planAmounts = { Gold: 1179, Diamond: 2359, Platinum: 11799 };
      const amount = amountPaid
        ? Math.round(amountPaid / 100)
        : planAmounts[planKey as keyof typeof planAmounts] ?? 0;

      resend.emails.send({
        from: FROM,
        to: [recipientEmail],
        subject: `Payment Confirmed 🎉 — ${planKey} Membership Active`,
        html: paymentConfirmationHtml({
          name: recipientName,
          plan: planKey,
          amount,
          paymentId: razorpay_payment_id,
          planPeriod: planInfo?.period ?? "1 Month",
          planFeatures: planInfo?.features ? [...planInfo.features] : [],
          expiryDate: expiryStr,
        }),
        text: paymentConfirmationText({
          name: recipientName,
          plan: planKey,
          amount,
          paymentId: razorpay_payment_id,
          planPeriod: planInfo?.period ?? "1 Month",
          expiryDate: expiryStr,
        }),
      }).catch((err: unknown) => {
        console.error("[verify-payment] Confirmation email failed:", err);
      });
    }

    return NextResponse.json({
      success: true,
      payment_id: razorpay_payment_id,
      plan: planKey,
    });
  } catch (err) {
    console.error("[verify-payment] Error:", err);
    return NextResponse.json(
      { error: "Payment verification failed. Please contact support." },
      { status: 500 }
    );
  }
}
