"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useMembership, clearCachedPlan } from "@/hooks/useMembership";
import {
  Check, Star, Sparkles, Phone, Award, Shield, Zap, Crown, ArrowRight, X,
  AlertTriangle, CalendarClock, Receipt, HelpCircle, MessageSquare, RefreshCw,
} from "lucide-react";

// ── Plan configuration (single source of truth) ──────────────────────────────
const PLANS = [
  {
    name: "Gold",
    label: "Gold – 3 months",
    price: "₹3,999",
    originalPrice: "₹5,500",
    discountPct: "20% OFF!",
    perMonth: "₹1333 per month",
    period: "3 months",
    description: "Valid for 3 months",
    colorAccent: "#C8973A",
    isGradient: true,
    gradientBg: "linear-gradient(135deg, #C8973A 0%, #E8C060 50%, #C8973A 100%)",
    highlight: false,
    cta: "Pay Now",
    href: "/payment?plan=Gold",
    icon: <Star size={24} />,
    features: [
      { text: "Valid for 3 months", included: true },
      { text: "View 40 Phone Nos", included: true },
      { text: "Send unlimited messages", included: true },
      { text: "Unlimited horoscope views", included: true },
      { text: "View verified profiles with photos", included: false },
    ],
  },
  {
    name: "PrimeGold",
    label: "Prime Gold – 3 months",
    price: "₹4,999",
    originalPrice: "₹7,900",
    discountPct: "32% OFF!",
    perMonth: "₹1666 per month",
    period: "3 months",
    description: "Valid for 3 months",
    colorAccent: "var(--primary)",
    isGradient: true,
    gradientBg: "var(--gradient-hero)",
    highlight: true,
    cta: "Pay Now",
    href: "/payment?plan=PrimeGold",
    icon: <Crown size={24} />,
    features: [
      { text: "Valid for 3 months", included: true },
      { text: "View unlimited Phone Nos*", included: true },
      { text: "Send unlimited messages", included: true },
      { text: "Unlimited horoscope views", included: true },
      { text: "View verified profiles with photos", included: true },
    ],
  },
  {
    name: "PrimeTillUMarry",
    label: "Prime – Till U Marry – 12 months",
    price: "₹8,999",
    originalPrice: "₹23,700",
    discountPct: "58% OFF!",
    perMonth: "₹750 per month",
    period: "12 months",
    description: "Longest validity plan",
    colorAccent: "#6B1A2A",
    isGradient: true,
    gradientBg: "linear-gradient(135deg, #6B1A2A 0%, #C8973A 100%)",
    highlight: false,
    isBestSeller: true,
    cta: "Pay Now",
    href: "/payment?plan=PrimeTillUMarry",
    icon: <Sparkles size={24} />,
    features: [
      { text: "Longest validity plan", included: true },
      { text: "View unlimited Phone Nos*", included: true },
      { text: "Send unlimited messages", included: true },
      { text: "Unlimited horoscope views", included: true },
      { text: "View verified profiles with photos", included: true },
    ],
  },
];

const PLAN_GRADIENT: Record<string, string> = {
  Gold: "linear-gradient(135deg, #C8973A 0%, #E8C060 50%, #C8973A 100%)",
  PrimeGold: "linear-gradient(135deg, #6B1A2A 0%, #C8973A 100%)",
  PrimeTillUMarry: "linear-gradient(135deg, #6B1A2A 0%, #C8973A 100%)",
};

const PLAN_ICON: Record<string, React.ReactNode> = {
  Gold: <Star size={28} />,
  PrimeGold: <Crown size={28} />,
  PrimeTillUMarry: <Sparkles size={28} />,
};

const COMPARISON_ROWS = [
  { feature: "Profile browsing", gold: "Unlimited", primeGold: "Unlimited", primeTillUMarry: "Unlimited" },
  { feature: "Phone No. reveals", gold: "40 numbers", primeGold: "Unlimited*", primeTillUMarry: "Unlimited*" },
  { feature: "Messages", gold: "Unlimited", primeGold: "Unlimited", primeTillUMarry: "Unlimited" },
  { feature: "Horoscope views", gold: "Unlimited", primeGold: "Unlimited", primeTillUMarry: "Unlimited" },
  { feature: "Verified profiles with photos", gold: false, primeGold: true, primeTillUMarry: true },
  { feature: "Validity", gold: "3 months", primeGold: "3 months", primeTillUMarry: "12 months" },
];

function CellValue({ val }: { val: boolean | string }) {
  if (typeof val === "boolean") {
    return val
      ? <Check size={16} style={{ color: "var(--success)", strokeWidth: 2.5 }} />
      : <X size={14} style={{ color: "var(--text-muted)", strokeWidth: 2 }} />;
  }
  return <span>{val}</span>;
}

// ── Active Plan Dashboard ────────────────────────────────────────────────────
function ActivePlanDashboard() {
  const { user, setUser, refresh } = useAuth();
  const { planName: hookPlanName, isPremium: hookIsPremium } = useMembership();
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  // Use hook-derived plan (authoritative — includes localStorage fallback)
  const plan = hookIsPremium ? hookPlanName : null;
  const planFeatures = PLANS.find(p => p.name === plan)?.features ?? [];
  const gradient = PLAN_GRADIENT[plan ?? "Gold"];
  const icon = PLAN_ICON[plan ?? "Gold"];

  const expiryDate = user?.membershipExpiry ? new Date(user.membershipExpiry) : null;
  const activatedDate = user?.membershipActivated ? new Date(user.membershipActivated) : null;
  const daysLeft = expiryDate
    ? Math.max(0, Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  // Check for expiry notification on mount
  useEffect(() => {
    if (!user?.id || !plan) return;
    if (daysLeft !== null && daysLeft <= 7 && daysLeft > 0) {
      fetch("/api/notify-expiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      }).catch(() => {});
    }
  }, [user?.id, plan, daysLeft]);

  const handleCancelPlan = async () => {
    if (!user?.id) return;
    setCancelling(true);
    setCancelError(null);
    try {
      const res = await fetch("/api/cancel-membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          userName: user.name,
          planName: plan,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to cancel membership.");
      // Update local state immediately
      if (user) {
        setUser({ ...user, isPremium: false, membershipPlan: null, membershipExpiry: undefined });
        clearCachedPlan(); // also clear localStorage cache

      }
      setCancelled(true);
      await refresh().catch(() => {});
    } catch (e: unknown) {
      setCancelError((e as Error).message);
    } finally {
      setCancelling(false);
      setShowCancelConfirm(false);
    }
  };

  if (cancelled) {
    return (
      <div style={{
        textAlign: "center", padding: "4rem 1rem", maxWidth: "560px", margin: "0 auto",
      }}>
        <div style={{
          width: "80px", height: "80px", borderRadius: "50%",
          background: "var(--bg-page)", border: "2px solid var(--border-color)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.5rem",
        }}>
          <Shield size={36} style={{ color: "var(--text-muted)" }} />
        </div>
        <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-dark)", marginBottom: "0.75rem" }}>
          Membership Cancelled
        </h2>
        <p style={{ color: "var(--text-medium)", marginBottom: "0.375rem", lineHeight: 1.65 }}>
          Your plan has been cancelled and your account has been reverted to the <strong>Free plan</strong>.
          All premium benefits have been removed immediately.
        </p>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "2rem" }}>
          A cancellation confirmation has been sent to your email.
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
            onClick={() => window.location.reload()}
            className="btn btn-primary"
            style={{ justifyContent: "center" }}
          >
            View Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 1rem 4rem" }}>

      {/* Expiry warning banner */}
      {daysLeft !== null && daysLeft <= 7 && daysLeft > 0 && (
        <div style={{
          background: "#FFF8E1", border: "1.5px solid #FFD54F", borderRadius: "var(--radius-lg)",
          padding: "0.875rem 1.25rem", marginBottom: "1.5rem",
          display: "flex", alignItems: "center", gap: "0.75rem",
        }}>
          <AlertTriangle size={18} style={{ color: "#E65100", flexShrink: 0 }} />
          <p style={{ fontSize: "0.875rem", color: "#7B5800", margin: 0, fontWeight: 600 }}>
            ⚠ Your {plan} plan expires in <strong>{daysLeft} day{daysLeft === 1 ? "" : "s"}</strong>
            {expiryDate && ` (${formatDate(expiryDate)})`}. Renew now to keep your benefits.
          </p>
          <button
            onClick={() => router.push(`/payment?plan=${plan}`)}
            className="btn btn-primary"
            style={{ marginLeft: "auto", flexShrink: 0, fontSize: "0.8125rem", padding: "0.5rem 1.25rem" }}
          >
            Renew
          </button>
        </div>
      )}

      {/* Plan card */}
      <div style={{
        borderRadius: "var(--radius-xl)", overflow: "hidden",
        boxShadow: "0 8px 40px rgba(107,26,42,0.18)", marginBottom: "1.75rem",
      }}>
        {/* Gradient header */}
        <div className="active-plan-card-header" style={{ background: gradient, padding: "2rem 2rem 1.75rem", color: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "var(--radius-lg)",
              background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center",
              justifyContent: "center", flexShrink: 0,
            }}>
              {icon}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, opacity: 0.85, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                Active Plan
              </div>
              <div className="active-plan-title" style={{ fontSize: "1.375rem", fontWeight: 900, lineHeight: 1.2, whiteSpace: "nowrap" }}>
                {plan} Member
              </div>
            </div>
            <div className="active-plan-badge" style={{
              marginLeft: "auto", background: "rgba(255,255,255,0.25)", borderRadius: "var(--radius-full)",
              padding: "0.35rem 0.875rem", fontSize: "0.8125rem", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0,
            }}>
              Active ✓
            </div>
          </div>

          {/* Key details row */}
          <div className="active-plan-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "0.875rem", background: "rgba(0,0,0,0.15)", borderRadius: "var(--radius-lg)",
            padding: "1rem 1.25rem",
          }}>
            {activatedDate && (
              <div>
                <div style={{ fontSize: "0.6875rem", opacity: 0.7, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                  Purchased On
                </div>
                <div style={{ fontWeight: 800, fontSize: "0.9375rem" }}>{formatDate(activatedDate)}</div>
              </div>
            )}
            {expiryDate && (
              <div>
                <div style={{ fontSize: "0.6875rem", opacity: 0.7, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                  Valid Until
                </div>
                <div style={{ fontWeight: 800, fontSize: "0.9375rem" }}>{formatDate(expiryDate)}</div>
              </div>
            )}
            {user?.membershipPlanPeriod && (
              <div>
                <div style={{ fontSize: "0.6875rem", opacity: 0.7, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                  Plan Duration
                </div>
                <div style={{ fontWeight: 800, fontSize: "0.9375rem" }}>{user.membershipPlanPeriod}</div>
              </div>
            )}
            {user?.membershipPricePaid && (
              <div>
                <div style={{ fontSize: "0.6875rem", opacity: 0.7, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                  Amount Paid
                </div>
                <div style={{ fontWeight: 800, fontSize: "0.9375rem" }}>₹{user.membershipPricePaid.toLocaleString("en-IN")}</div>
              </div>
            )}
            {daysLeft !== null && (
              <div>
                <div style={{ fontSize: "0.6875rem", opacity: 0.7, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                  Days Left
                </div>
                <div style={{
                  fontWeight: 900, fontSize: "1.125rem",
                  color: daysLeft <= 7 ? "#FFD54F" : "#fff",
                }}>
                  {daysLeft} days
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features included */}
        <div style={{ background: "#fff", padding: "1.5rem 2rem" }}>
          <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)", marginBottom: "1rem" }}>
            What&apos;s included in your plan
          </p>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.5rem",
          }}>
            {planFeatures.filter(f => f.included).map(feat => (
              <div key={feat.text} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <div style={{
                  width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0, marginTop: "1px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "hsl(142,71%,93%)",
                }}>
                  <Check size={11} style={{ color: "#2BA745", strokeWidth: 3 }} />
                </div>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                  {feat.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action cards */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem",
        marginBottom: "2rem",
      }}>
        {/* Renew / Upgrade */}
        {plan !== "Platinum" && (
          <div style={{
            background: "#fff", border: "1.5px solid var(--primary)", borderRadius: "var(--radius-xl)",
            padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.625rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)" }}>
              <RefreshCw size={18} />
              <span style={{ fontWeight: 700, fontSize: "0.9375rem" }}>
                {plan === "Gold" ? "Upgrade to Diamond" : "Renew Plan"}
              </span>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-medium)", margin: 0, lineHeight: 1.55 }}>
              {plan === "Gold"
                ? "Get unlimited contact reveals, video call requests & Diamond-exclusive matches."
                : "Extend your current plan before it expires to keep your premium features."}
            </p>
            <button
              onClick={() => router.push(`/payment?plan=${plan === "Gold" ? "Diamond" : plan}`)}
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: "auto" }}
            >
              {plan === "Gold" ? "Upgrade Now" : "Renew Now"}
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Contact support */}
        <div style={{
          background: "#fff", border: "1px solid var(--border-light)", borderRadius: "var(--radius-xl)",
          padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.625rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-dark)" }}>
            <MessageSquare size={18} />
            <span style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Contact Support</span>
          </div>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-medium)", margin: 0, lineHeight: 1.55 }}>
            Have questions about your plan or need billing help? Our team is here for you.
          </p>
          <Link
            href="/contact"
            className="btn"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "100%", marginTop: "auto",
              border: "1.5px solid var(--border-color)", color: "var(--text-secondary)",
              background: "#fff", textDecoration: "none",
            }}
          >
            <Phone size={14} style={{ marginRight: "6px" }} />
            Contact Us
          </Link>
        </div>

        {/* Help / FAQ */}
        <div style={{
          background: "#fff", border: "1px solid var(--border-light)", borderRadius: "var(--radius-xl)",
          padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.625rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-dark)" }}>
            <HelpCircle size={18} />
            <span style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Help & FAQ</span>
          </div>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-medium)", margin: 0, lineHeight: 1.55 }}>
            Find answers about your membership, features, and how to get the most out of your plan.
          </p>
          <Link
            href="/faq"
            className="btn"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "100%", marginTop: "auto",
              border: "1.5px solid var(--border-color)", color: "var(--text-secondary)",
              background: "#fff", textDecoration: "none",
            }}
          >
            <HelpCircle size={14} style={{ marginRight: "6px" }} />
            View FAQ
          </Link>
        </div>

        {/* Billing receipt */}
        {user?.membershipPricePaid && (
          <div style={{
            background: "#fff", border: "1px solid var(--border-light)", borderRadius: "var(--radius-xl)",
            padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.625rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-dark)" }}>
              <Receipt size={18} />
              <span style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Billing Details</span>
            </div>
            <div style={{ fontSize: "0.8125rem", color: "var(--text-medium)", lineHeight: 1.65 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span>Plan</span><span style={{ fontWeight: 700 }}>{plan}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span>Duration</span><span style={{ fontWeight: 700 }}>{user.membershipPlanPeriod ?? "-"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-light)", paddingTop: "6px", marginTop: "4px" }}>
                <span style={{ fontWeight: 700 }}>Total Paid</span>
                <span style={{ fontWeight: 800, color: "var(--text-dark)" }}>₹{user.membershipPricePaid.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancel plan — danger zone */}
      <div style={{
        background: "#fff", border: "1px solid #FFCDD2", borderRadius: "var(--radius-xl)",
        padding: "1.5rem",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
          <AlertTriangle size={20} style={{ color: "#C62828", flexShrink: 0, marginTop: "2px" }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#C62828", marginBottom: "0.375rem" }}>
              Cancel Membership
            </p>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-medium)", lineHeight: 1.6, marginBottom: "1rem" }}>
              Cancelling your plan will <strong>immediately revoke all premium benefits</strong> and revert your account
              to the Free plan. <strong style={{ color: "#C62828" }}>Paid amounts are strictly non-refundable</strong> as per our Terms of Service.
              This action cannot be undone.
            </p>
            {cancelError && (
              <div style={{
                display: "flex", gap: "6px", alignItems: "flex-start",
                background: "#FFF5F5", border: "1px solid #FFCDD2",
                borderRadius: "var(--radius-md)", padding: "0.5rem 0.75rem",
                marginBottom: "0.875rem", color: "#C62828", fontSize: "0.8125rem",
              }}>
                <X size={13} style={{ flexShrink: 0, marginTop: "1px" }} />{cancelError}
              </div>
            )}
            {!showCancelConfirm ? (
              <button
                onClick={() => setShowCancelConfirm(true)}
                style={{
                  background: "none", border: "1.5px solid #C62828", color: "#C62828",
                  borderRadius: "var(--radius-md)", padding: "0.6rem 1.25rem",
                  fontSize: "0.875rem", fontWeight: 700, cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Cancel My Plan
              </button>
            ) : (
              <div style={{
                background: "#FFF5F5", border: "1.5px solid #C62828", borderRadius: "var(--radius-lg)",
                padding: "1rem 1.25rem",
              }}>
                <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#C62828", marginBottom: "0.5rem" }}>
                  Are you absolutely sure?
                </p>
                <p style={{ fontSize: "0.8125rem", color: "#C62828", marginBottom: "1rem", lineHeight: 1.55 }}>
                  Your {plan} plan will be <strong>cancelled immediately</strong>. You will lose all premium features
                  right now and <strong>no refund will be issued</strong>.
                </p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <button
                    onClick={handleCancelPlan}
                    disabled={cancelling}
                    style={{
                      background: "#C62828", color: "#fff", border: "none",
                      borderRadius: "var(--radius-md)", padding: "0.6rem 1.25rem",
                      fontSize: "0.875rem", fontWeight: 700, cursor: cancelling ? "not-allowed" : "pointer",
                      opacity: cancelling ? 0.7 : 1, fontFamily: "var(--font-sans)",
                    }}
                  >
                    {cancelling ? "Cancelling…" : "Yes, Cancel My Plan (No Refund)"}
                  </button>
                  <button
                    onClick={() => { setShowCancelConfirm(false); setCancelError(null); }}
                    disabled={cancelling}
                    style={{
                      background: "#fff", color: "var(--text-secondary)",
                      border: "1.5px solid var(--border-color)", borderRadius: "var(--radius-md)",
                      padding: "0.6rem 1.25rem", fontSize: "0.875rem", fontWeight: 700,
                      cursor: "pointer", fontFamily: "var(--font-sans)",
                    }}
                  >
                    Keep My Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Pricing grid (for non-premium users) ────────────────────────────────────
function PricingGrid() {
  const router = useRouter();
  return (
    <>
      <section style={{ background: "var(--bg-page)", marginTop: "-2.5rem", padding: "0 0 4rem" }}>
        <div className="container">
          <div className="plans-grid">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                style={{
                  background: "#fff",
                  borderRadius: "var(--radius-xl)",
                  boxShadow: plan.highlight ? "0 8px 32px rgba(233,30,99,0.22)" : "var(--shadow-md)",
                  border: `2px solid ${plan.highlight ? "var(--primary)" : "var(--border-light)"}`,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  position: "relative",
                  transform: plan.highlight ? "translateY(-8px)" : "none",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                {/* Best Seller badge */}
                {(plan as any).isBestSeller && (
                  <div style={{
                    position: "absolute", top: 0, right: 0,
                    background: "var(--primary)", color: "#fff",
                    fontSize: "0.6875rem", fontWeight: 800,
                    padding: "0.3rem 0.875rem",
                    borderRadius: "0 var(--radius-xl) 0 var(--radius-xl)",
                  }}>
                    Best Seller
                  </div>
                )}
                {/* Most Popular badge */}
                {plan.highlight && !
                  (plan as any).isBestSeller && (
                  <div style={{
                    background: "var(--gradient-hero)", color: "#fff",
                    fontSize: "0.6875rem", fontWeight: 800,
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    textAlign: "center", padding: "0.4rem 0",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
                  }}>
                    <Star size={11} fill="#FFD54F" stroke="#FFD54F" /> Most Popular
                  </div>
                )}

                {/* Card header */}
                <div style={{ padding: "1.5rem 1.5rem 1rem" }}>
                  <div style={{
                    fontWeight: 700, fontSize: "1rem",
                    color: "var(--text-dark)", marginBottom: "0.875rem", textAlign: "center",
                  }}>
                    {(plan as any).label || plan.name}
                  </div>

                  {/* Discount badge + original price */}
                  {(plan as any).originalPrice && (
                    <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                      <span style={{
                        fontSize: "0.75rem", fontWeight: 700, color: "#2BA745",
                      }}>
                        {(plan as any).discountPct} Valid for today
                      </span>
                      <div style={{ fontSize: "0.8125rem", color: "#888", marginTop: "2px" }}>
                        <span style={{ textDecoration: "line-through" }}>{(plan as any).originalPrice}</span>
                      </div>
                    </div>
                  )}

                  {/* Main price */}
                  <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                    <span style={{
                      fontSize: "2rem", fontWeight: 800,
                      fontFamily: "var(--font-serif)",
                      color: "var(--text-dark)", lineHeight: 1,
                    }}>
                      {plan.price}
                    </span>
                  </div>

                  {/* Per month */}
                  {(plan as any).perMonth && (
                    <div style={{ textAlign: "center", marginBottom: "0.75rem" }}>
                      <span style={{
                        display: "inline-block",
                        fontSize: "0.75rem", color: "#555",
                        border: "1px solid #ddd",
                        borderRadius: "var(--radius-full)",
                        padding: "2px 10px",
                      }}>
                        {(plan as any).perMonth}
                      </span>
                    </div>
                  )}
                </div>

                {/* Features list */}
                <div style={{ padding: "0 1.5rem", flex: 1 }}>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    {plan.features.map((feat) => (
                      <li key={feat.text} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
                        <div style={{
                          width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0, marginTop: "1px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: feat.included ? "hsl(142,71%,93%)" : "var(--bg-page)",
                        }}>
                          {feat.included
                            ? <Check size={11} style={{ color: "#2BA745", strokeWidth: 3 }} />
                            : <X size={9} style={{ color: "var(--text-muted)", strokeWidth: 3 }} />
                          }
                        </div>
                        <span style={{
                          fontSize: "0.8125rem", lineHeight: 1.45,
                          color: feat.included ? "var(--text-secondary)" : "var(--text-muted)",
                          textDecoration: feat.included ? "none" : "line-through",
                        }}>
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA button */}
                <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
                  <button
                    onClick={() => router.push(plan.href)}
                    className="btn"
                    style={{
                      display: "flex", width: "100%", justifyContent: "center", gap: "0.375rem",
                      fontSize: "0.9375rem", fontWeight: 700,
                      background: plan.highlight
                        ? "var(--gradient-hero)"
                        : "linear-gradient(135deg, #E8401A 0%, #FF6B35 100%)",
                      color: "#fff",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(232,64,26,0.35)",
                      borderRadius: "var(--radius-full)",
                      cursor: "pointer", fontFamily: "var(--font-sans)",
                      padding: "0.75rem",
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section style={{ background: "#fff", padding: "4rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{
              fontFamily: "var(--font-serif)", fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
              fontWeight: 800, color: "var(--text-dark)", marginBottom: "0.5rem",
            }}>
              Plan Comparison
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
              See exactly what each plan includes.
            </p>
          </div>
          <div style={{ overflowX: "auto", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-light)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "460px" }}>
              <thead>
                <tr style={{ background: "var(--bg-page)", borderBottom: "2px solid var(--border-color)" }}>
                  <th style={{ textAlign: "left", padding: "1rem 1.25rem", fontWeight: 700, color: "var(--text-dark)", fontSize: "0.875rem" }}>Feature</th>
                  {["Gold", "Prime Gold", "Prime – Till U Marry"].map((p) => (
                    <th key={p} style={{
                      padding: "1rem 0.75rem", textAlign: "center", fontWeight: 700,
                      fontSize: "0.875rem",
                      color: p === "Prime Gold" ? "var(--primary)" : "var(--text-dark)",
                    }}>
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={row.feature} style={{
                    borderBottom: i < COMPARISON_ROWS.length - 1 ? "1px solid var(--border-light)" : "none",
                    background: i % 2 === 0 ? "#fff" : "var(--bg-page)",
                  }}>
                    <td style={{ padding: "0.875rem 1.25rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem" }}>{row.feature}</td>
                    <td style={{ padding: "0.875rem 0.75rem", textAlign: "center", fontSize: "0.875rem", color: "var(--text-secondary)" }}><CellValue val={(row as any).gold} /></td>
                    <td style={{ padding: "0.875rem 0.75rem", textAlign: "center", fontSize: "0.875rem", fontWeight: 600, color: "var(--primary)" }}><CellValue val={(row as any).primeGold} /></td>
                    <td style={{ padding: "0.875rem 0.75rem", textAlign: "center", fontSize: "0.875rem", color: "var(--text-secondary)" }}><CellValue val={(row as any).primeTillUMarry} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "var(--bg-page)", padding: "4rem 0" }}>
        <div className="container" style={{ maxWidth: "720px" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{
              fontFamily: "var(--font-serif)", fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
              fontWeight: 800, color: "var(--text-dark)",
            }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes. You can cancel your Gold, Diamond, or Platinum plan at any time from your membership page. Your account will immediately revert to the Free plan. Please note: paid membership fees are strictly non-refundable.",
              },
              {
                q: "Are my contact details shown to everyone?",
                a: "No. Your phone number is hidden by default. Only Gold and above members who you've matched with can request to see it.",
              },
              {
                q: "How does the AI compatibility score work?",
                a: "Our psychology-based algorithm scores matches across 5 dimensions: education, religion/culture, career/lifestyle, location, and values.",
              },
              {
                q: "Is there a refund policy?",
                a: "We offer a 7-day refund for your first purchase if you're not satisfied. Contact our support team at support@elitetamilmatrimony.com.",
              },
              {
                q: "What is the Platinum Concierge service?",
                a: "A dedicated human matchmaker personally reviews your profile, hand-picks suitable matches, and helps coordinate introductions.",
              },
            ].map((faq) => (
              <div key={faq.q} style={{
                background: "#fff", borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-light)", padding: "1.25rem 1.5rem",
                boxShadow: "var(--shadow-sm)",
              }}>
                <div style={{ fontWeight: 700, color: "var(--text-dark)", marginBottom: "0.5rem", fontSize: "0.9375rem" }}>{faq.q}</div>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ background: "var(--gradient-hero)", padding: "4rem 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <Zap size={36} style={{ color: "#FFD54F", marginBottom: "1rem" }} />
          <h2 style={{
            fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 800, color: "#fff", marginBottom: "0.75rem",
          }}>
            Ready to find your match?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: "1.75rem", maxWidth: "420px", margin: "0 auto 1.75rem", fontSize: "0.9375rem" }}>
            Join Tamil singles on India&apos;s most trusted Tamil matrimony platform.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" className="btn btn-xl" style={{ background: "#fff", color: "var(--primary)", fontWeight: 800 }}>
              Start Free Today
            </Link>
            <Link
              href="/contact" className="btn btn-xl"
              style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.4)", color: "#fff" }}
            >
              <Phone size={16} />
              Talk to a Matchmaker
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function MembershipPage() {
  const { user, loading } = useAuth();
  const hasActivePlan = !!(user?.membershipPlan && user?.membershipExpiry && new Date(user.membershipExpiry) > new Date());

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-page)" }}>
        {/* Hero */}
        <section style={{
          background: "var(--gradient-hero)", padding: "4rem 0 5rem",
          position: "relative", overflow: "hidden",
        }}>
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.12) 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }} />
          <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <Sparkles size={18} style={{ color: "#FFD54F" }} />
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)" }}>
                {hasActivePlan ? `${user?.membershipPlan} Member` : "Membership Plans"}
              </span>
            </div>
            <h1 style={{
              fontFamily: "var(--font-serif)", fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              fontWeight: 800, color: "#fff", marginBottom: "1rem", lineHeight: 1.2,
            }}>
              {hasActivePlan ? "Your Membership" : "Invest in your forever"}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", maxWidth: "520px", margin: "0 auto", fontSize: "1rem", lineHeight: 1.6 }}>
              {hasActivePlan
                ? "Manage your active plan, view billing details, and access support."
                : "Choose the plan that fits your journey. Upgrade anytime. Cancel anytime. All plans include 100% Tamil profiles and privacy-first features."}
            </p>
          </div>
        </section>

        {/* Body — active plan dashboard OR pricing grid */}
        {loading ? (
          <div style={{ minHeight: "40vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "var(--text-muted)" }}>Loading…</p>
          </div>
        ) : hasActivePlan ? (
          <section style={{ background: "var(--bg-page)", marginTop: "-2.5rem", padding: "0" }}>
            <div className="container" style={{ paddingTop: "2.5rem" }}>
              <ActivePlanDashboard />
            </div>
          </section>
        ) : (
          <PricingGrid />
        )}
      </main>
      <Footer />

      <style>{`
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          padding-top: 2.5rem;
        }
        @media (max-width: 900px) {
          .plans-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .active-plan-card-header { padding: 1.25rem 1rem 1rem !important; }
          .active-plan-title { font-size: 1.125rem !important; }
          .active-plan-badge { padding: 0.25rem 0.625rem !important; font-size: 0.75rem !important; }
          .active-plan-grid { grid-template-columns: 1fr 1fr !important; padding: 0.875rem !important; gap: 0.75rem !important; }
        }
      `}</style>
    </>
  );
}
