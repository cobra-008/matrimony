import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, planKey, currency = "INR" } = body as {
      amount: number;
      planKey: string;
      currency?: string;
    };

    // Validate amount (Razorpay minimum is 100 paise = ₹1)
    if (!amount || typeof amount !== "number" || amount < 100) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum is 100 paise (₹1)." },
        { status: 400 }
      );
    }

    if (!planKey) {
      return NextResponse.json(
        { error: "Plan key is required." },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount), // ensure integer paise
      currency,
      receipt: `receipt_${planKey}_${Date.now()}`,
      notes: {
        plan: planKey,
      },
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err: unknown) {
    console.error("[create-order] Razorpay error:", err);

    // Handle Razorpay auth failures
    const error = err as { statusCode?: number; error?: { description?: string } };
    if (error?.statusCode === 401) {
      return NextResponse.json(
        { error: "Payment gateway authentication failed." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create payment order. Please try again." },
      { status: 500 }
    );
  }
}
