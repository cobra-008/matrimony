import Link from "next/link";
import Image from "next/image";

// Only Discover and Information sections — all links verified to existing routes
const FOOTER_LINKS = {
  "Discover": [
    { label: "Search Profiles", href: "/search" },
    { label: "Recommended Matches", href: "/matches" },
    { label: "Daily Recommendations", href: "/daily-recs" },
    { label: "Success Stories", href: "/success-stories" },
  ],
  "Information": [
    { label: "About Us", href: "/about" },
    { label: "Membership Plans", href: "/membership" },
    { label: "FAQs", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
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
        {/* Trust strip */}
        <div style={{ background: "var(--primary)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "0.875rem 0" }}>
          <div className="container">
            <div
              className="footer-trust-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "0.75rem 1rem",
              }}
            >
              {TRUST_BADGES.map((badge) => (
                <div key={badge.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {badge.icon}
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#fff" }}>{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          <style>{`
            @media (min-width: 640px) {
              .footer-trust-grid { grid-template-columns: repeat(4, 1fr) !important; }
            }
          `}</style>
        </div>

        {/* Main footer body */}
        <div className="container" style={{ padding: "2rem 1rem" }}>
          {/* Brand row — uses /logo.svg same as Navbar */}
          <div
            className="footer-brand-row"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
              <Image
                src="/logo.svg"
                alt="Elite Tamil Matrimony"
                width={140}
                height={40}
                style={{ height: "40px", width: "auto" }}
                priority
              />
            </Link>

            <div>
              <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.55)", maxWidth: "360px", lineHeight: 1.6, margin: "0 0 0.625rem" }}>
                Elite Tamil Matrimony is a newly launched dedicated platform helping Tamil individuals and families discover meaningful marriage relationships.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>
                  support@elitetamilmatrimony.com
                </span>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>
                  Chennai, Tamil Nadu, India
                </span>
              </div>

              {/* Social media */}
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.875rem", flexWrap: "wrap" }}>
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    title={`${s.label} — Coming Soon`}
                    style={{
                      width: "36px",
                      height: "36px",
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
              <p style={{ fontSize: "0.625rem", color: "rgba(255,255,255,0.3)", marginTop: "0.375rem" }}>
                Social media accounts coming soon
              </p>
            </div>
          </div>

          {/* Links grid — only Discover + Information */}
          <div
            className="footer-links-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1.25rem 1rem",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <style>{`
              @media (min-width: 480px) { .footer-links-grid { grid-template-columns: repeat(2, 1fr) !important; max-width: 480px; } }
              @media (min-width: 640px) { .footer-brand-row { flex-direction: row !important; align-items: flex-start !important; } }
            `}</style>

            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category}>
                <h4
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: "0.625rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {category}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  {links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        style={{
                          fontSize: "0.8125rem",
                          color: "rgba(255,255,255,0.5)",
                          textDecoration: "none",
                          lineHeight: 1.6,
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
