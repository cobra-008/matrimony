"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Check, Star, Sparkles, Phone, Award, Shield, Zap, Crown, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Get started and explore",
    colorAccent: "var(--text-secondary)",
    isGradient: false,
    highlight: false,
    cta: "Start Free",
    href: "/register",
    icon: <Shield size={24} />,
    features: [
      { text: "Browse 25 Lakh+ profiles", included: true },
      { text: "10 interests per month", included: true },
      { text: "Basic search filters", included: true },
      { text: "Send/receive messages after match", included: true },
      { text: "Contact number reveal", included: false },
      { text: "AI compatibility scores", included: false },
      { text: "Priority listing", included: false },
      { text: "Advanced search filters", included: false },
      { text: "Human matchmaker", included: false },
    ],
  },
  {
    name: "Gold",
    price: "₹999",
    period: "per month",
    description: "Most popular — serious seekers",
    colorAccent: "var(--primary)",
    isGradient: true,
    gradientBg: "var(--gradient-hero)",
    highlight: true,
    cta: "Get Gold",
    href: "/payment?plan=Gold",
    icon: <Star size={24} />,
    features: [
      { text: "Browse 25 Lakh+ profiles", included: true },
      { text: "Unlimited interests", included: true },
      { text: "30 contact reveals per month", included: true },
      { text: "AI compatibility score for every match", included: true },
      { text: "Priority profile listing", included: true },
      { text: "Advanced search (25+ filters)", included: true },
      { text: "See who viewed your profile", included: true },
      { text: "Chat with all matched profiles", included: true },
      { text: "Human matchmaker", included: false },
    ],
  },
  {
    name: "Diamond",
    price: "₹1,999",
    period: "per month",
    description: "For premium seekers",
    colorAccent: "hsl(253, 70%, 55%)",
    isGradient: true,
    gradientBg: "linear-gradient(135deg, hsl(253,70%,45%) 0%, hsl(217,91%,55%) 100%)",
    highlight: false,
    cta: "Go Diamond",
    href: "/payment?plan=Diamond",
    icon: <Award size={24} />,
    features: [
      { text: "Everything in Gold", included: true },
      { text: "Unlimited contact reveals", included: true },
      { text: "Unlimited interests", included: true },
      { text: "First-page priority placement", included: true },
      { text: "Verified badge prominence", included: true },
      { text: "Video call request feature", included: true },
      { text: "Exclusive Diamond-only matches", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Human matchmaker", included: false },
    ],
  },
  {
    name: "Platinum",
    nameSecondLine: "Concierge",
    price: "₹9,999",
    period: "3 months",
    description: "White-glove service",
    colorAccent: "var(--gold-dark)",
    isGradient: true,
    gradientBg: "linear-gradient(135deg, #E69C00 0%, #FFB703 100%)",
    highlight: false,
    cta: "Go Platinum",
    href: "/payment?plan=Platinum",
    icon: <Crown size={24} />,
    features: [
      { text: "Everything in Diamond", included: true },
      { text: "Dedicated human matchmaker", included: true },
      { text: "Hand-curated match recommendations", included: true },
      { text: "Background verification assistance", included: true },
      { text: "Profile video introduction (2 mins)", included: true },
      { text: "Priority 24/7 support", included: true },
      { text: "Astrology compatibility check", included: true },
      { text: "Offline meetup coordination", included: true },
      { text: "Guaranteed 100 curated introductions", included: true },
    ],
  },
];

const COMPARISON_ROWS = [
  { feature: "Profile browsing", free: "Unlimited", gold: "Unlimited", diamond: "Unlimited", platinum: "Unlimited" },
  { feature: "Interests per month", free: "10", gold: "Unlimited", diamond: "Unlimited", platinum: "Unlimited" },
  { feature: "Contact reveals/month", free: "0", gold: "30", diamond: "Unlimited", platinum: "Unlimited" },
  { feature: "AI match scores", free: false, gold: true, diamond: true, platinum: true },
  { feature: "Advanced filters", free: false, gold: true, diamond: true, platinum: true },
  { feature: "Priority listing", free: false, gold: true, diamond: "First page", platinum: "First page" },
  { feature: "Video call request", free: false, gold: false, diamond: true, platinum: true },
  { feature: "Human matchmaker", free: false, gold: false, diamond: false, platinum: "Dedicated" },
];

function CellValue({ val }: { val: boolean | string }) {
  if (typeof val === "boolean") {
    return val
      ? <Check size={16} style={{ color: "var(--success)", strokeWidth: 2.5 }} />
      : <X size={14} style={{ color: "var(--text-muted)", strokeWidth: 2 }} />;
  }
  return <span>{val}</span>;
}

export default function MembershipPage() {
  const router = useRouter();
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-page)" }}>

        {/* ── Hero ── */}
        <section
          style={{
            background: "var(--gradient-hero)",
            padding: "4rem 0 5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* dot pattern */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.12) 1px, transparent 0)",
              backgroundSize: "30px 30px",
            }}
          />
          <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <Sparkles size={18} style={{ color: "#FFD54F" }} />
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)" }}>
                Membership Plans
              </span>
            </div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                fontWeight: 800,
                color: "#fff",
                marginBottom: "1rem",
                lineHeight: 1.2,
              }}
            >
              Invest in your forever
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", maxWidth: "520px", margin: "0 auto", fontSize: "1rem", lineHeight: 1.6 }}>
              Choose the plan that fits your journey. Upgrade anytime. Cancel anytime.
              All plans include 100% Tamil profiles and privacy-first features.
            </p>
          </div>
        </section>

        {/* ── Plans Grid ── */}
        <section style={{ background: "var(--bg-page)", marginTop: "-2.5rem", padding: "0 0 4rem" }}>
          <div className="container">
            {/* 4-column grid, collapses to 2 on tablet, 1 on mobile */}
            <div className="plans-grid">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  style={{
                    background: "#fff",
                    borderRadius: "var(--radius-xl)",
                    boxShadow: plan.highlight
                      ? "0 8px 32px rgba(233,30,99,0.22)"
                      : "var(--shadow-md)",
                    border: `2px solid ${plan.highlight ? "var(--primary)" : "var(--border-light)"}`,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    position: "relative",
                    transform: plan.highlight ? "translateY(-8px)" : "none",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                >
                  {/* Most Popular badge */}
                  {plan.highlight && (
                    <div
                      style={{
                        background: "var(--gradient-hero)",
                        color: "#fff",
                        fontSize: "0.6875rem",
                        fontWeight: 800,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        textAlign: "center",
                        padding: "0.4rem 0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                      }}
                    >
                      <Star size={11} fill="#FFD54F" stroke="#FFD54F" /> Most Popular
                    </div>
                  )}

                  {/* Plan Header */}
                  <div
                    style={{
                      background: plan.isGradient ? plan.gradientBg : "var(--bg-page)",
                      padding: "1.5rem 1.5rem 1.25rem",
                    }}
                  >
                    {/* Icon */}
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "var(--radius-lg)",
                        background: plan.isGradient ? "rgba(255,255,255,0.2)" : "var(--primary-light)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: plan.isGradient ? "#fff" : plan.colorAccent,
                        marginBottom: "1rem",
                      }}
                    >
                      {plan.icon}
                    </div>

                    {/* Plan name */}
                    <div
                      style={{
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        color: plan.isGradient ? "rgba(255,255,255,0.8)" : "var(--text-secondary)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {plan.name}{plan.nameSecondLine ? ` ${plan.nameSecondLine}` : ""}
                    </div>

                    {/* Price */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.375rem", marginBottom: "0.25rem" }}>
                      <span
                        style={{
                          fontSize: "2rem",
                          fontWeight: 800,
                          fontFamily: "var(--font-serif)",
                          color: plan.isGradient ? "#fff" : "var(--text-dark)",
                          lineHeight: 1,
                        }}
                      >
                        {plan.price}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: plan.isGradient ? "rgba(255,255,255,0.65)" : "var(--text-muted)" }}>
                        / {plan.period}
                      </span>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: "0.8125rem", color: plan.isGradient ? "rgba(255,255,255,0.7)" : "var(--text-secondary)", margin: 0 }}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div style={{ padding: "1.25rem 1.5rem", flex: 1 }}>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {plan.features.map((feat) => (
                        <li
                          key={feat.text}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.625rem",
                          }}
                        >
                          <div
                            style={{
                              width: "18px",
                              height: "18px",
                              borderRadius: "50%",
                              flexShrink: 0,
                              marginTop: "1px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: feat.included ? "hsl(142,71%,93%)" : "var(--bg-page)",
                            }}
                          >
                            {feat.included
                              ? <Check size={11} style={{ color: "#2BA745", strokeWidth: 3 }} />
                              : <X size={9} style={{ color: "var(--text-muted)", strokeWidth: 3 }} />
                            }
                          </div>
                          <span
                            style={{
                              fontSize: "0.8125rem",
                              lineHeight: 1.45,
                              color: feat.included ? "var(--text-secondary)" : "var(--text-muted)",
                              textDecoration: feat.included ? "none" : "line-through",
                            }}
                          >
                            {feat.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div style={{ padding: "0 1.5rem 1.5rem" }}>
                    <button
                      onClick={() => plan.href.startsWith('/payment') ? router.push(plan.href) : router.push(plan.href)}
                      className="btn"
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        gap: "0.375rem",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        background: plan.highlight
                          ? "var(--gradient-hero)"
                          : plan.isGradient
                          ? plan.gradientBg
                          : "#fff",
                        color: plan.highlight || plan.isGradient ? "#fff" : "var(--text-secondary)",
                        border: !plan.isGradient ? "1.5px solid var(--border-color)" : "none",
                        boxShadow: plan.highlight ? "var(--shadow-pink)" : "none",
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {plan.cta}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison Table ── */}
        <section style={{ background: "#fff", padding: "4rem 0" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                  fontWeight: 800,
                  color: "var(--text-dark)",
                  marginBottom: "0.5rem",
                }}
              >
                Plan Comparison
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
                See exactly what each plan includes.
              </p>
            </div>

            <div style={{ overflowX: "auto", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-light)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
                <thead>
                  <tr style={{ background: "var(--bg-page)", borderBottom: "2px solid var(--border-color)" }}>
                    <th style={{ textAlign: "left", padding: "1rem 1.25rem", fontWeight: 700, color: "var(--text-dark)", fontSize: "0.875rem" }}>Feature</th>
                    {["Free", "Gold", "Diamond", "Platinum"].map((p) => (
                      <th
                        key={p}
                        style={{
                          padding: "1rem 0.75rem",
                          textAlign: "center",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          color: p === "Gold" ? "var(--primary)" : "var(--text-dark)",
                        }}
                      >
                        {p}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr
                      key={row.feature}
                      style={{
                        borderBottom: i < COMPARISON_ROWS.length - 1 ? "1px solid var(--border-light)" : "none",
                        background: i % 2 === 0 ? "#fff" : "var(--bg-page)",
                      }}
                    >
                      <td style={{ padding: "0.875rem 1.25rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem" }}>{row.feature}</td>
                      <td style={{ padding: "0.875rem 0.75rem", textAlign: "center", fontSize: "0.875rem", color: "var(--text-secondary)" }}><CellValue val={row.free} /></td>
                      <td style={{ padding: "0.875rem 0.75rem", textAlign: "center", fontSize: "0.875rem", fontWeight: 600, color: "var(--primary)" }}><CellValue val={row.gold} /></td>
                      <td style={{ padding: "0.875rem 0.75rem", textAlign: "center", fontSize: "0.875rem", color: "var(--text-secondary)" }}><CellValue val={row.diamond} /></td>
                      <td style={{ padding: "0.875rem 0.75rem", textAlign: "center", fontSize: "0.875rem", color: "var(--text-secondary)" }}><CellValue val={row.platinum} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ background: "var(--bg-page)", padding: "4rem 0" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                  fontWeight: 800,
                  color: "var(--text-dark)",
                }}
              >
                Frequently Asked Questions
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                {
                  q: "Can I cancel my subscription anytime?",
                  a: "Yes. You can cancel your Gold or Diamond subscription at any time. You'll retain access until the end of your billing period.",
                },
                {
                  q: "Are my contact details shown to everyone?",
                  a: "No. Your phone number is hidden by default. Only Gold and above members who you've matched with can request to see it.",
                },
                {
                  q: "How does the AI compatibility score work?",
                  a: "Our psychology-based algorithm scores matches across 5 dimensions: education, religion/culture, career/lifestyle, location, and values. See the 'Why you match' breakdown on any profile.",
                },
                {
                  q: "Is there a refund policy?",
                  a: "We offer a 7-day refund for your first purchase if you're not satisfied. Contact our support team at support@elitetamilmatrimony.com.",
                },
                {
                  q: "What is the Platinum Concierge service?",
                  a: "A dedicated human matchmaker personally reviews your profile, hand-picks suitable matches, and helps coordinate introductions. It's like having a trusted relative searching for you.",
                },
              ].map((faq) => (
                <div
                  key={faq.q}
                  style={{
                    background: "#fff",
                    borderRadius: "var(--radius-xl)",
                    border: "1px solid var(--border-light)",
                    padding: "1.25rem 1.5rem",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "var(--text-dark)", marginBottom: "0.5rem", fontSize: "0.9375rem" }}>
                    {faq.q}
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section style={{ background: "var(--gradient-hero)", padding: "4rem 0" }}>
          <div className="container" style={{ textAlign: "center" }}>
            <Zap size={36} style={{ color: "#FFD54F", marginBottom: "1rem" }} />
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 800,
                color: "#fff",
                marginBottom: "0.75rem",
              }}
            >
              Ready to find your match?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: "1.75rem", maxWidth: "420px", margin: "0 auto 1.75rem", fontSize: "0.9375rem" }}>
              Join over 25 Lakh Tamil singles on India&apos;s most trusted Tamil matrimony platform.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/register"
                className="btn btn-xl"
                style={{ background: "#fff", color: "var(--primary)", fontWeight: 800 }}
              >
                Start Free Today
              </Link>
              <Link
                href="/contact"
                className="btn btn-xl"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "2px solid rgba(255,255,255,0.4)",
                  color: "#fff",
                }}
              >
                <Phone size={16} />
                Talk to a Matchmaker
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
