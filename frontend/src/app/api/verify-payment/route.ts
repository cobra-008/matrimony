import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { paymentConfirmationHtml, paymentConfirmationText } from "@/lib/email/templates";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_build");
const FROM = process.env.RESEND_FROM_EMAIL ?? "Elite Tamil Matrimony <admin@elitetamilmatrimony.com>";

// Plan config — single source of truth for this route
const PLAN_CONFIG = {
  Gold:     { period: "1 Month",  months: 1, features: ["Browse 25 Lakh+ profiles","Unlimited interests","30 contact reveals per month","AI compatibility score for every match","Priority profile listing","Advanced search (25+ filters)","See who viewed your profile","Chat with all matched profiles"] },
  Diamond:  { period: "1 Month",  months: 1, features: ["Everything in Gold","Unlimited contact reveals","First-page priority placement","Video call request feature","Exclusive Diamond-only matches","Dedicated account manager"] },
  Platinum: { period: "3 Months", months: 3, features: ["Everything in Diamond","Dedicated human matchmaker","Hand-curated match recommendations","Background verification assistance","Profile video introduction","Priority 24/7 support","Astrology compatibility check","Guaranteed 100 curated introductions"] },
} as const;

type PlanKey = keyof typeof PLAN_CONFIG;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      planKey,
      userId,
      userEmail,
      userName,
      amountPaid,
    } = body as {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
      planKey: string;
      userId?: string;
      userEmail?: string;
      userName?: string;
      amountPaid?: number;
    };

    // ── 1. Validate required fields ─────────────────────────────────────────
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing required payment fields." }, { status: 400 });
    }
    if (!planKey || !(planKey in PLAN_CONFIG)) {
      return NextResponse.json({ error: "Invalid or missing plan key." }, { status: 400 });
    }

    // ── 2. Verify Razorpay HMAC-SHA256 signature ────────────────────────────
    const keySecret = process.env.RAZORPAY_KEY_SECRET!;
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("[verify-payment] Signature mismatch — possible tampered request");
      return NextResponse.json({ error: "Payment signature verification failed." }, { status: 400 });
    }

    // ── 3. Update membership in Supabase using SERVICE ROLE (bypasses RLS) ──
    const plan = planKey as PlanKey;
    const planInfo = PLAN_CONFIG[plan];
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + planInfo.months);
    const expiryIso = expiry.toISOString();
    const now = new Date().toISOString();
    const pricePaidInr = amountPaid ? Math.round(amountPaid / 100) : 0;

    let dbError: string | null = null;
    let profileName = userName ?? "Member";
    let profileEmail = userEmail ?? null;

    if (userId) {
      // Try full membership update
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          is_premium:             true,
          membership_plan:        plan,
          membership_expiry:      expiryIso,
          membership_activated:   now,
          membership_price_paid:  pricePaidInr,
          membership_plan_period: planInfo.period,
          updated_at:             now,
        })
        .eq("id", userId);

      if (updateError) {
        console.error("[verify-payment] Full update failed:", updateError.message);
        // Fallback: try minimal update (in case membership_plan column doesn't exist yet)
        const { error: fallbackError } = await supabaseAdmin
          .from("profiles")
          .update({ is_premium: true, updated_at: now })
          .eq("id", userId);

        if (fallbackError) {
          console.error("[verify-payment] Fallback update also failed:", fallbackError.message);
          dbError = fallbackError.message;
        } else {
          console.warn("[verify-payment] Fallback (is_premium only) succeeded. Run SQL migration to add membership columns.");
        }
      } else {
        console.log(`[verify-payment] ✓ Membership upgraded to ${plan} for user ${userId}`);
      }

      // Also log transaction (non-fatal)
      supabaseAdmin.from("membership_transactions").insert({
        profile_id:       userId,
        plan,
        razorpay_payment_id,
        amount_paid_inr:  pricePaidInr,
        plan_period:      planInfo.period,
        activated_at:     now,
        expires_at:       expiryIso,
      }).then(({ error }) => {
        if (error) console.warn("[verify-payment] Transaction log failed (non-fatal):", error.message);
      });

      // Fetch profile details for confirmation email
      const { data: profileRow } = await supabaseAdmin
        .from("profiles")
        .select("name, email")
        .eq("id", userId)
        .single();
      if (profileRow?.name) profileName = profileRow.name;
      if (profileRow?.email && !profileRow.email.endsWith("@etm.app")) {
        profileEmail = profileRow.email;
      }
    }

    // ── 4. Send confirmation email (non-blocking) ───────────────────────────
    const recipientEmail = userEmail || profileEmail;
    if (recipientEmail && !recipientEmail.endsWith("@etm.app")) {
      const expiryStr = expiry.toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      });
      resend.emails.send({
        from: FROM,
        to: [recipientEmail],
        subject: `Payment Confirmed 🎉 — ${plan} Membership Active`,
        html: paymentConfirmationHtml({
          name: profileName,
          plan,
          amount: pricePaidInr,
          paymentId: razorpay_payment_id,
          planPeriod: planInfo.period,
          planFeatures: [...planInfo.features],
          expiryDate: expiryStr,
        }),
        text: paymentConfirmationText({
          name: profileName,
          plan,
          amount: pricePaidInr,
          paymentId: razorpay_payment_id,
          planPeriod: planInfo.period,
          expiryDate: expiryStr,
        }),
      }).catch((err: unknown) => {
        console.error("[verify-payment] Confirmation email failed:", err);
      });
    }

    // ── 5. Return success ───────────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      payment_id: razorpay_payment_id,
      plan,
      expiry: expiryIso,
      ...(dbError ? { db_warning: dbError } : {}),
    });
  } catch (err) {
    console.error("[verify-payment] Unhandled error:", err);
    return NextResponse.json(
      { error: "Payment verification failed. Please contact support." },
      { status: 500 }
    );
  }
}
