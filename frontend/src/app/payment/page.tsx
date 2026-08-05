"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Check, CreditCard, Lock, Shield, Star, Award, Crown, ChevronLeft,
  Building2, Wallet, Smartphone,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { upgradeMembership } from "@/lib/auth-store";

// ── Plan configuration ────────────────────────────────────────────────────
const PLAN_CONFIG = {
  Gold: {
    name: "Gold",
    price: 999,
    period: "per month",
    description: "Most popular — for serious match seekers",
    color: "var(--primary)",
    gradient: "var(--gradient-hero)",
    icon: <Star size={22} />,
    features: [
      "Browse 25 Lakh+ profiles",
      "Unlimited interests",
      "30 contact reveals per month",
      "AI compatibility score for every match",
      "Priority profile listing",
      "Advanced search (25+ filters)",
      "See who viewed your profile",
      "Chat with all matched profiles",
    ],
  },
  Diamond: {
    name: "Diamond",
    price: 1999,
    period: "per month",
    description: "For premium match seekers",
    color: "hsl(253, 70%, 55%)",
    gradient: "linear-gradient(135deg, hsl(253,70%,45%) 0%, hsl(217,91%,55%) 100%)",
    icon: <Award size={22} />,
    features: [
      "Everything in Gold",
      "Unlimited contact reveals",
      "Unlimited interests",
      "First-page priority placement",
      "Verified badge prominence",
      "Video call request feature",
      "Exclusive Diamond-only matches",
      "Dedicated account manager",
    ],
  },
  Platinum: {
    name: "Platinum Concierge",
    price: 9999,
    period: "3 months",
    description: "White-glove matchmaking service",
    color: "#A07028",
    gradient: "linear-gradient(135deg, #E69C00 0%, #FFB703 100%)",
    icon: <Crown size={22} />,
    features: [
      "Everything in Diamond",
      "Dedicated human matchmaker",
      "Hand-curated match recommendations",
      "Background verification assistance",
      "Profile video introduction (2 mins)",
      "Priority 24/7 support",
      "Astrology compatibility check",
      "Offline meetup coordination",
      "Guaranteed 100 curated introductions",
    ],
  },
} as const;

type PlanKey = keyof typeof PLAN_CONFIG;

// ── Payment Methods ───────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  {
    id: "card",
    label: "Credit / Debit Card",
    icon: <CreditCard size={20} />,
    description: "Visa, Mastercard, RuPay",
  },
  {
    id: "upi",
    label: "UPI",
    icon: <Smartphone size={20} />,
    description: "Google Pay, PhonePe, BHIM",
  },
  {
    id: "netbanking",
    label: "Net Banking",
    icon: <Building2 size={20} />,
    description: "All major Indian banks",
  },
  {
    id: "wallet",
    label: "Wallets",
    icon: <Wallet size={20} />,
    description: "Paytm, Amazon Pay, Mobikwik",
  },
] as const;

// ── Field-level error type ────────────────────────────────────────────────
type FieldErrors = {
  cardNumber?: string;
  cardName?: string;
  expiry?: string;
  cvv?: string;
  upiId?: string;
  paymentMethod?: string;
};

// ── Validation helpers ────────────────────────────────────────────────────
function validateCardNumber(v: string): string {
  const digits = v.replace(/\s/g, "");
  if (!digits) return "Card number is required.";
  if (!/^\d+$/.test(digits)) return "Card number must contain only digits.";
  if (digits.length !== 16) return "Card number must be exactly 16 digits.";
  return "";
}

function validateCardName(v: string): string {
  if (!v.trim()) return "Name on card is required.";
  if (v.trim().length < 2) return "Please enter a valid name.";
  return "";
}

function validateExpiry(v: string): string {
  if (!v) return "Expiry date is required.";
  if (!/^\d{2}\/\d{2}$/.test(v)) return "Expiry must be in MM/YY format.";
  const [mm, yy] = v.split("/").map(Number);
  if (mm < 1 || mm > 12) return "Invalid month.";
  const now = new Date();
  const yr = now.getFullYear() % 100;
  const mo = now.getMonth() + 1;
  if (yy < yr || (yy === yr && mm < mo)) return "Card has expired.";
  return "";
}

function validateCvv(v: string): string {
  if (!v) return "CVV is required.";
  if (!/^\d{3,4}$/.test(v)) return "CVV must be 3 or 4 digits.";
  return "";
}

function validateUpiId(v: string): string {
  if (!v.trim()) return "UPI ID is required.";
  if (!v.includes("@")) return "Invalid UPI ID format. Example: name@upi";
  return "";
}

// ── Inline Error component ────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p style={{
      fontSize: "0.75rem",
      color: "#D32F2F",
      marginTop: "0.25rem",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {msg}
    </p>
  );
}

// ── Main payment form ─────────────────────────────────────────────────────
function PaymentForm({ planKey }: { planKey: PlanKey }) {
  const plan = PLAN_CONFIG[planKey];
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Format card number with spaces every 4 digits
  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  // Format expiry as MM/YY
  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  // Real-time field validation
  const handleCardNumberChange = (v: string) => {
    const formatted = formatCardNumber(v);
    setCardNumber(formatted);
    const err = validateCardNumber(formatted);
    setErrors((e) => ({ ...e, cardNumber: err || undefined }));
  };

  const handleCardNameChange = (v: string) => {
    setCardName(v);
    const err = validateCardName(v);
    setErrors((e) => ({ ...e, cardName: err || undefined }));
  };

  const handleExpiryChange = (v: string) => {
    const formatted = formatExpiry(v);
    setExpiry(formatted);
    const err = validateExpiry(formatted);
    setErrors((e) => ({ ...e, expiry: err || undefined }));
  };

  const handleCvvChange = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    setCvv(digits);
    const err = validateCvv(digits);
    setErrors((e) => ({ ...e, cvv: err || undefined }));
  };

  const handleUpiChange = (v: string) => {
    setUpiId(v);
    const err = validateUpiId(v);
    setErrors((e) => ({ ...e, upiId: err || undefined }));
  };

  const handleMethodSelect = (id: string) => {
    setPaymentMethod(id);
    setErrors((e) => ({ ...e, paymentMethod: undefined }));
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    const newErrors: FieldErrors = {};

    if (!paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method.";
    }

    if (paymentMethod === "card") {
      const cn = validateCardNumber(cardNumber);
      const nm = validateCardName(cardName);
      const ex = validateExpiry(expiry);
      const cv = validateCvv(cvv);
      if (cn) newErrors.cardNumber = cn;
      if (nm) newErrors.cardName = nm;
      if (ex) newErrors.expiry = ex;
      if (cv) newErrors.cvv = cv;
    }

    if (paymentMethod === "upi") {
      const ui = validateUpiId(upiId);
      if (ui) newErrors.upiId = ui;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    // ── OPTIMISTIC UPDATE: instantly reflect premium in UI ──────────────
    // Do this FIRST so the Navbar badge updates immediately even if DB fails
    if (user) {
      setUser({ ...user, isPremium: true, membershipPlan: planKey });
    }
    // Brief UX delay (simulated payment processing)
    await new Promise((r) => setTimeout(r, 1200));
    // ── PERSIST TO SUPABASE in background ──────────────────────────────
    if (user?.id) {
      upgradeMembership(user.id, planKey).then((upgraded) => {
        if (upgraded) setUser(upgraded); // sync with DB data if successful
      });
    }
    setSubmitting(false);
    setSuccess(true);
  };

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "0.6875rem 1rem",
    border: `1.5px solid ${hasError ? "#D32F2F" : "var(--border-color)"}`,
    borderRadius: "var(--radius-md)",
    fontSize: "0.875rem",
    fontFamily: "var(--font-sans)",
    color: "var(--text-dark)",
    background: "#fff",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    boxShadow: hasError ? "0 0 0 3px rgba(211,47,47,0.08)" : undefined,
  });

  const gst = Math.round(plan.price * 0.18);
  const total = plan.price + gst;

  if (success) {
    return (
      <div style={{
        background: "#fff",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-xl)",
        padding: "3rem 2rem",
        textAlign: "center",
        maxWidth: "480px",
        margin: "0 auto",
        boxShadow: "0 8px 32px rgba(107,26,42,0.12)",
      }}>
        {/* Animated success ring */}
        <div style={{
          width: "80px", height: "80px", borderRadius: "50%",
          background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.5rem",
          boxShadow: "0 4px 20px rgba(107,26,42,0.3)",
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: "0.5rem" }}>
          Payment Successful!
        </h2>
        {/* Plan badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: plan.gradient, color: "#fff",
          padding: "0.375rem 1.25rem", borderRadius: "var(--radius-full)",
          fontSize: "0.875rem", fontWeight: 700, margin: "0 auto 1rem",
        }}>
          {plan.icon}
          {plan.name} Member
        </div>
        <p style={{ color: "var(--text-medium)", marginBottom: "0.375rem", fontSize: "0.9375rem" }}>
          Your <strong>{plan.name}</strong> plan is now active.
        </p>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "2rem" }}>
          A confirmation has been sent to your registered email.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => router.push("/")}
            className="btn"
            style={{ border: "1.5px solid var(--primary)", color: "var(--primary)", background: "#fff" }}
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => router.push("/matches")}
            className="btn btn-primary"
            style={{ display: "inline-flex", justifyContent: "center" }}
          >
            Start Finding Matches
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr minmax(280px, 380px)",
        gap: "1.5rem",
        alignItems: "flex-start",
      }}
        className="payment-grid"
      >
        {/* ── Left: Payment Method ── */}
        <div>
          {/* Method selector */}
          <div style={{
            background: "#fff",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            marginBottom: "1.25rem",
          }}>
            <div style={{
              padding: "1rem 1.25rem",
              borderBottom: "1px solid var(--border-light)",
              fontWeight: 700,
              fontSize: "0.9375rem",
              color: "var(--text-dark)",
            }}>
              Select Payment Method
            </div>

            {errors.paymentMethod && (
              <div style={{ padding: "0.625rem 1.25rem 0" }}>
                <FieldError msg={errors.paymentMethod} />
              </div>
            )}

            <div style={{ padding: "0.75rem" }}>
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => handleMethodSelect(method.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.875rem",
                    padding: "0.875rem 1rem",
                    marginBottom: "0.5rem",
                    border: `1.5px solid ${paymentMethod === method.id ? "var(--primary)" : "var(--border-color)"}`,
                    borderRadius: "var(--radius-lg)",
                    background: paymentMethod === method.id ? "var(--primary-light)" : "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "var(--font-sans)",
                    transition: "all 0.15s",
                  }}
                  aria-pressed={paymentMethod === method.id}
                >
                  <div style={{
                    color: paymentMethod === method.id ? "var(--primary)" : "var(--text-medium)",
                    flexShrink: 0,
                  }}>
                    {method.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: paymentMethod === method.id ? "var(--primary)" : "var(--text-dark)",
                    }}>
                      {method.label}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {method.description}
                    </div>
                  </div>
                  <div style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    border: `2px solid ${paymentMethod === method.id ? "var(--primary)" : "var(--border-color)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {paymentMethod === method.id && (
                      <div style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "var(--primary)",
                      }} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Card details */}
          {paymentMethod === "card" && (
            <div style={{
              background: "#fff",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-xl)",
              padding: "1.25rem",
            }}>
              <h3 style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)", marginBottom: "1rem" }}>
                Card Details
              </h3>

              <div style={{ marginBottom: "1rem" }}>
                <label className="form-label">Card Number <span style={{ color: "var(--primary)" }}>*</span></label>
                <input
                  style={inputStyle(!!errors.cardNumber)}
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  inputMode="numeric"
                  autoComplete="cc-number"
                  aria-required="true"
                  aria-describedby={errors.cardNumber ? "card-number-error" : undefined}
                />
                <FieldError msg={errors.cardNumber} />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label className="form-label">Name on Card <span style={{ color: "var(--primary)" }}>*</span></label>
                <input
                  style={inputStyle(!!errors.cardName)}
                  type="text"
                  placeholder="Full name as on card"
                  value={cardName}
                  onChange={(e) => handleCardNameChange(e.target.value)}
                  autoComplete="cc-name"
                  aria-required="true"
                />
                <FieldError msg={errors.cardName} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label className="form-label">Expiry Date <span style={{ color: "var(--primary)" }}>*</span></label>
                  <input
                    style={inputStyle(!!errors.expiry)}
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    autoComplete="cc-exp"
                    aria-required="true"
                  />
                  <FieldError msg={errors.expiry} />
                </div>
                <div>
                  <label className="form-label">CVV <span style={{ color: "var(--primary)" }}>*</span></label>
                  <input
                    style={inputStyle(!!errors.cvv)}
                    type="password"
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) => handleCvvChange(e.target.value)}
                    autoComplete="cc-csc"
                    maxLength={4}
                    aria-required="true"
                  />
                  <FieldError msg={errors.cvv} />
                </div>
              </div>
            </div>
          )}

          {/* UPI details */}
          {paymentMethod === "upi" && (
            <div style={{
              background: "#fff",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-xl)",
              padding: "1.25rem",
            }}>
              <h3 style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)", marginBottom: "1rem" }}>
                UPI ID
              </h3>
              <div>
                <label className="form-label">Enter UPI ID <span style={{ color: "var(--primary)" }}>*</span></label>
                <input
                  style={inputStyle(!!errors.upiId)}
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => handleUpiChange(e.target.value)}
                  aria-required="true"
                />
                <FieldError msg={errors.upiId} />
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.375rem" }}>
                  Example: 9876543210@ybl or name@okaxis
                </p>
              </div>
            </div>
          )}

          {(paymentMethod === "netbanking" || paymentMethod === "wallet") && (
            <div style={{
              background: "#fff",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-xl)",
              padding: "1.5rem",
              textAlign: "center",
            }}>
              <Smartphone size={32} style={{ color: "var(--primary)", marginBottom: "0.75rem" }} />
              <p style={{ color: "var(--text-medium)", fontSize: "0.875rem" }}>
                You will be redirected to your {paymentMethod === "netbanking" ? "bank's website" : "wallet app"} to complete the payment securely.
              </p>
            </div>
          )}
        </div>

        {/* ── Right: Order Summary ── */}
        <div style={{
          background: "#fff",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          position: "sticky",
          top: "80px",
        }}>
          {/* Plan header */}
          <div style={{
            background: plan.gradient,
            padding: "1.5rem",
            color: "#fff",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-lg)",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {plan.icon}
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 600, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Selected Plan
                </div>
                <div style={{ fontSize: "1.125rem", fontWeight: 800 }}>{plan.name}</div>
              </div>
            </div>
            <div style={{ fontSize: "0.8125rem", opacity: 0.8 }}>{plan.description}</div>
          </div>

          {/* Features */}
          <div style={{ padding: "1rem 1.25rem" }}>
            <p style={{ fontWeight: 700, fontSize: "0.8125rem", color: "var(--text-dark)", marginBottom: "0.625rem" }}>
              What&apos;s included:
            </p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              {plan.features.map((f) => (
                <li key={f} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <Check size={13} style={{ color: "var(--success)", flexShrink: 0, marginTop: "2px", strokeWidth: 2.5 }} />
                  <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Price breakdown */}
          <div style={{
            padding: "0.875rem 1.25rem",
            borderTop: "1px solid var(--border-light)",
            borderBottom: "1px solid var(--border-light)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "0.375rem" }}>
              <span>Plan Price</span>
              <span>₹{plan.price.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "0.375rem" }}>
              <span>GST (18%)</span>
              <span>₹{gst.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "1rem", color: "var(--text-dark)", paddingTop: "0.375rem", borderTop: "1px solid var(--border-light)", marginTop: "0.375rem" }}>
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Pay CTA */}
          <div style={{ padding: "1rem 1.25rem" }}>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }} aria-hidden="true">
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Lock size={14} />
                  Pay ₹{total.toLocaleString("en-IN")} Securely
                </>
              )}
            </button>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", marginTop: "0.75rem" }}>
              <Shield size={12} style={{ color: "var(--success)" }} />
              <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
                256-bit SSL encrypted payment
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

// ── Page with Suspense wrapper ────────────────────────────────────────────
function PaymentPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planParam = searchParams.get("plan") as PlanKey | null;

  // Validate plan param
  const validPlan = planParam && planParam in PLAN_CONFIG ? planParam : null;

  if (!validPlan) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
        <p style={{ color: "var(--text-medium)", marginBottom: "1rem" }}>
          No valid plan selected. Please choose a plan from our membership page.
        </p>
        <button
          onClick={() => router.push("/membership")}
          className="btn btn-primary"
          style={{ display: "inline-flex", justifyContent: "center" }}
        >
          View Membership Plans
        </button>
      </div>
    );
  }

  const plan = PLAN_CONFIG[validPlan];

  return (
    <main style={{ background: "var(--bg-page)", minHeight: "calc(100vh - 120px)", padding: "2rem 0" }}>
      <div className="container">
        {/* Back button + header */}
        <div style={{ marginBottom: "1.75rem" }}>
          <button
            onClick={() => router.push("/membership")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-medium)",
              fontSize: "0.875rem",
              fontWeight: 600,
              fontFamily: "var(--font-sans)",
              marginBottom: "0.875rem",
              padding: 0,
            }}
          >
            <ChevronLeft size={16} />
            Back to Plans
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-dark)", margin: 0 }}>
              Complete Your {plan.name} Purchase
            </h1>
            <div style={{
              padding: "0.25rem 0.75rem",
              borderRadius: "var(--radius-full)",
              background: "var(--primary-light)",
              color: "var(--primary)",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}>
              {plan.period}
            </div>
          </div>
          <p style={{ color: "var(--text-medium)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            {plan.description}
          </p>
        </div>

        <PaymentForm planKey={validPlan} />
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "var(--text-medium)" }}>Loading...</p>
        </div>
      }>
        <PaymentPageInner />
      </Suspense>
      <Footer />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .payment-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
