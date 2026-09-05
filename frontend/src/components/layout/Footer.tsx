"use client";

import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS = {
  "Help & Support": [
    { label: "24x7 Live help", href: "/contact" },
    { label: "Contact us", href: "/contact" },
    { label: "Feedback", href: "/contact" },
    { label: "FAQs", href: "/faq" },
  ],
  "Our Other Services": [
    { label: "EliteMatrimony.com", href: "/" },
  ],
  "Social Initiatives": [
    { label: "AbilityMatrimony.com", href: "#" },
    { label: "Happymarriages.com", href: "#" },
  ],
  "Our Wedding Services": [
    { label: "MatrimonyMandaps.com", href: "#" },
    { label: "weddingBazaar.com", href: "#" },
  ],
  "Information": [
    { label: "About Us", href: "/about" },
    { label: "Awards", href: "#" },
    { label: "Milestones", href: "#" },
    { label: "Success stories", href: "/success-stories" },
    { label: "Careers", href: "#" },
    { label: "Media Room", href: "#" },
    { label: "Affiliates", href: "#" },
    { label: "TV Commercials", href: "#" },
    { label: "Advertise with us", href: "#" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
  "Related Matrimony Services": [
    { label: "HappyMarriages.com", href: "#" },
    { label: "Safe Matrimony", href: "#" },
    { label: "Matrimonial Tools", href: "#" },
    { label: "Matrimonial Sites", href: "#" },
    { label: "Tamil Matrimonials", href: "#" },
    { label: "Matrimonial Websites", href: "#" },
    { label: "Tamil Matrimony Branches", href: "#" },
    { label: "Kalyana Mandapams", href: "#" },
    { label: "Banquet Halls", href: "#" },
    { label: "Muhurtham Dates", href: "#" },
  ],
};

const TRUST_BADGES = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="1.8">
        <circle cx="16" cy="11" r="6" />
        <path d="M5 29c0-6 5-11 11-11s11 5 11 11" />
        <polyline points="13,25 15.5,27.5 20,22" strokeWidth="2" />
      </svg>
    ),
    label: "Mobile-Verified Profiles",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="1.8">
        <rect x="6" y="13" width="20" height="15" rx="2" />
        <path d="M10 13V9a6 6 0 0 1 12 0v4" />
        <circle cx="16" cy="21" r="2" fill="white" stroke="none" />
      </svg>
    ),
    label: "SSL Secured",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="1.8">
        <path d="M16 3 L28 9 V17 C28 23 22 28 16 30 C10 28 4 23 4 17 V9 Z" />
        <polyline points="11,16 14,19 21,13" strokeWidth="2" />
      </svg>
    ),
    label: "Privacy Protected",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="1.8">
        <rect x="4" y="6" width="24" height="20" rx="2" />
        <polyline points="4,12 16,20 28,12" />
      </svg>
    ),
    label: "Dedicated Support",
  },
];

// Social media placeholder icons
const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <>
      {/* ── Pre-Footer CTA Band ─────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--bg-light)",
          borderTop: "1px solid var(--border-color)",
          borderBottom: "1px solid var(--border-color)",
          padding: "2.5rem 0",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "0.875rem",
            }}
          >
            {/* Kolam-inspired decorative line */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "0.25rem",
              }}
            >
              <div style={{ width: "40px", height: "1px", background: "var(--secondary)" }} />
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <polygon points="8,1 10,6 15,6 11,9.5 12.5,15 8,11.5 3.5,15 5,9.5 1,6 6,6" fill="var(--secondary)" />
              </svg>
              <div style={{ width: "40px", height: "1px", background: "var(--secondary)" }} />
            </div>

            <h2
              style={{
                fontSize: "clamp(1.0625rem, 2.5vw, 1.375rem)",
                fontWeight: 700,
                color: "var(--text-dark)",
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              Looking for a meaningful marriage relationship?
            </h2>

            <p
              style={{
                fontSize: "0.9375rem",
                color: "var(--text-medium)",
                maxWidth: "520px",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Create your profile, discover compatible matches, and take the first step toward finding your life partner.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                justifyContent: "center",
                marginTop: "0.25rem",
              }}
            >
              <Link
                href="/register"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "var(--primary)",
                  color: "#fff",
                  padding: "0.625rem 1.5rem",
                  borderRadius: "4px",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  transition: "background 0.15s",
                  minHeight: "44px",
                }}
              >
                Register Free
              </Link>
              <Link
                href="/search"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "transparent",
                  color: "var(--primary)",
                  border: "1.5px solid var(--primary)",
                  padding: "0.625rem 1.5rem",
                  borderRadius: "4px",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  transition: "background 0.15s, color 0.15s",
                  minHeight: "44px",
                }}
              >
                Search Profiles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Footer ─────────────────────────────────────────────────── */}
      <footer style={{ background: "var(--primary-dark)", color: "rgba(255,255,255,0.8)", marginTop: "auto" }}>
        {/* Main footer body */}
        <div className="container" style={{ padding: "2rem 1rem" }}>
          {/* About Us section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              marginBottom: "1.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
                <Image
                  src="/logo-transparent.png"
                  alt="Elite Tamil Matrimony"
                  width={120}
                  height={60}
                  style={{ height: "44px", width: "auto", filter: "brightness(0) invert(1) drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
                  priority
                />
              </Link>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.55)", maxWidth: "340px", lineHeight: 1.65, margin: 0 }}>
              Elite Tamil Matrimony is a part of BharatMatrimony — the pioneers of online matrimony service. Today, we are the most trusted Matrimony website by Brand Trust Report. Millions of happy marriages happened and continue to happen through BharatMatrimony. We have been featured in the Limca Book of Records for the highest number of documented marriages online.
            </p>
            <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.55)", maxWidth: "340px", lineHeight: 1.65, margin: 0 }}>
              BharatMatrimony is the 1st group to offer 100% mobile verified profiles, reinforcing the trust that members have on us. We have also pioneered the highly personalized matchmaking services — Assisted Service and EliteMatrimony. Our{" "}
              <a href="/about" style={{ color: "rgba(255,200,100,0.85)", textDecoration: "underline" }}>purpose</a>{" "}
              is to build a better Bharat through happy marriages.
            </p>
            {/* Contact */}
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <a href="mailto:support@elitetamilmatrimony.com" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>support@elitetamilmatrimony.com</a>
              <a href="tel:+919360653547" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>+91 93606 53547</a>
            </div>
            {/* Social media */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  title={`${s.label} — Coming Soon`}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.2)";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links grid — Help, Services, Information, Related */}
          <div
            className="footer-links-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1.5rem 1.5rem",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <style>{`
              @media (min-width: 640px) { .footer-links-grid { grid-template-columns: repeat(2, 1fr) !important; } }
              @media (min-width: 900px) { .footer-links-grid { grid-template-columns: repeat(3, 1fr) !important; } }
              @media (min-width: 1100px) { .footer-links-grid { grid-template-columns: 1.4fr 1fr 1.2fr 1.3fr !important; } }
            `}</style>

            {/* Help & Support + sub-sections */}
            <div>
              <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#fff", marginBottom: "0.75rem", margin: "0 0 0.75rem" }}>Help &amp; Support</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.25rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {FOOTER_LINKS["Help & Support"].map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.55)", textDecoration: "none", lineHeight: 1.6 }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#fff", margin: "0 0 0.5rem" }}>Our Other Services</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.25rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {FOOTER_LINKS["Our Other Services"].map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.55)", textDecoration: "none", lineHeight: 1.6 }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#fff", margin: "0 0 0.5rem" }}>Social Initiatives</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.25rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {FOOTER_LINKS["Social Initiatives"].map((link) => (
                  <li key={link.href + link.label}>
                    <a href={link.href} style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.55)", textDecoration: "none", lineHeight: 1.6 }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)")}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#fff", margin: "0 0 0.5rem" }}>Our Wedding Services</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {FOOTER_LINKS["Our Wedding Services"].map((link) => (
                  <li key={link.href + link.label}>
                    <a href={link.href} style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.55)", textDecoration: "none", lineHeight: 1.6 }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)")}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information */}
            <div>
              <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#fff", margin: "0 0 0.75rem" }}>Information</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {FOOTER_LINKS["Information"].map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.55)", textDecoration: "none", lineHeight: 1.6 }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Matrimony Services */}
            <div>
              <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#fff", margin: "0 0 0.75rem" }}>Related Matrimony Services</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {FOOTER_LINKS["Related Matrimony Services"].map((link) => (
                  <li key={link.href + link.label}>
                    <a href={link.href} style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.55)", textDecoration: "none", lineHeight: 1.6 }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)")}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar — no dead links */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: "1rem",
            }}
          >
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", margin: 0 }}>
              &copy; {new Date().getFullYear()} Elite Tamil Matrimony. All rights reserved.
            </p>
            <p style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.25)", margin: 0 }}>
              A newly launched platform for Tamil families and individuals seeking meaningful marriage relationships.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
