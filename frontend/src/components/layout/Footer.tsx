import Link from "next/link";

const FOOTER_LINKS = {
  "Matrimonials by Community": [
    { label: "Brahmin Tamil Matrimony", href: "/community/brahmin" },
    { label: "Mudaliar Matrimony", href: "/community/mudaliar" },
    { label: "Vellalar Matrimony", href: "/community/vellalar" },
    { label: "Gounder Matrimony", href: "/community/gounder" },
    { label: "Nadar Matrimony", href: "/community/nadar" },
    { label: "Chettiar Matrimony", href: "/community/chettiar" },
    { label: "Pillai Matrimony", href: "/community/pillai" },
    { label: "Thevar Matrimony", href: "/community/thevar" },
    { label: "View All Communities", href: "/community" },
  ],
  "Matrimonials by City": [
    { label: "Chennai Matrimony", href: "/city/chennai" },
    { label: "Coimbatore Matrimony", href: "/city/coimbatore" },
    { label: "Madurai Matrimony", href: "/city/madurai" },
    { label: "Trichy Matrimony", href: "/city/trichy" },
    { label: "Salem Matrimony", href: "/city/salem" },
    { label: "Tirunelveli Matrimony", href: "/city/tirunelveli" },
    { label: "Erode Matrimony", href: "/city/erode" },
    { label: "NRI Tamil Matrimony", href: "/nri" },
  ],
  "Matrimonials by Religion": [
    { label: "Tamil Hindu Matrimony", href: "/religion/hindu" },
    { label: "Tamil Christian Matrimony", href: "/religion/christian" },
    { label: "Tamil Muslim Matrimony", href: "/religion/muslim" },
    { label: "Tamil Jain Matrimony", href: "/religion/jain" },
  ],
  "Company": [
    { label: "About Us", href: "/about" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "Membership Plans", href: "/membership" },
    { label: "Careers", href: "/careers" },
    { label: "Contact Us", href: "/contact" },
  ],
  "Help & Support": [
    { label: "Help Center", href: "/help" },
    { label: "FAQ", href: "/faq" },
    { label: "Safety Center", href: "/safety" },
    { label: "Report Abuse", href: "/report-abuse" },
    { label: "Grievance Officer", href: "/grievance" },
  ],
  "Legal": [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Refund Policy", href: "/refund" },
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
    label: "Verified Profiles",
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
    label: "100% Privacy",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="1.8">
        <rect x="4" y="6" width="24" height="20" rx="2" />
        <polyline points="4,12 16,20 28,12" />
      </svg>
    ),
    label: "ISO 27001 Certified",
  },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--primary-dark)", color: "rgba(255,255,255,0.8)", marginTop: "auto" }}>
      {/* Trust strip */}
      <div style={{ background: "var(--primary)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "0.875rem 0" }}>
        <div className="container">
          <div
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

        {/* Larger screens: single row */}
        <style>{`
          @media (min-width: 640px) {
            .footer-trust-grid { grid-template-columns: repeat(4, 1fr) !important; }
          }
        `}</style>
      </div>

      {/* Main footer */}
      <div className="container" style={{ padding: "2rem 1rem" }}>
        {/* Brand row */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <div
              style={{
                background: "var(--secondary)",
                borderRadius: "4px 0 0 4px",
                padding: "4px 8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="7" r="4" fill="white" />
                <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" fill="white" />
              </svg>
            </div>
            <div
              style={{
                background: "var(--primary)",
                borderRadius: "0 4px 4px 0",
                padding: "4px 10px",
              }}
            >
              <span style={{ color: "white", fontWeight: 900, fontSize: "0.875rem" }}>Elite Tamil</span>
              <br />
              <span style={{ color: "white", fontWeight: 700, fontSize: "0.625rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Matrimony
              </span>
            </div>
          </div>
          <div>
            <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.55)", maxWidth: "360px", lineHeight: 1.6 }}>
              India&rsquo;s most trusted Tamil matrimony platform. AI-powered matching, verified profiles,
              and a community built on trust and culture.
            </p>
            <div style={{ marginTop: "0.625rem", display: "flex", flexDirection: "column", gap: "3px" }}>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>
                support@elitetamilmatrimony.com
              </span>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>
                +91 44 1234 5678 &nbsp;|&nbsp; Chennai, Tamil Nadu
              </span>
            </div>
          </div>
        </div>

        {/* Links grid — responsive */}
        <div
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
            @media (min-width: 640px) { .footer-links-grid { grid-template-columns: repeat(3, 1fr) !important; } }
            @media (min-width: 900px) { .footer-links-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important; } }
            @media (min-width: 640px) { .footer-brand-row { flex-direction: row !important; align-items: flex-start !important; } }
          `}</style>
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "0.5rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {category}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: "0.8125rem",
                        color: "rgba(255,255,255,0.5)",
                        textDecoration: "none",
                        lineHeight: 1.6,
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App download strip */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.875rem",
            padding: "1rem",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid rgba(255,255,255,0.1)",
            marginBottom: "1.25rem",
          }}
        >
          <div>
            <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#fff", margin: 0 }}>
              Download the Elite Tamil Matrimony App
            </p>
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", marginTop: "2px" }}>
              Find your match on the go &mdash; 4.8 rated on App Store &amp; Google Play
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
            <a
              href="#"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-md)",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                fontSize: "0.8125rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              App Store
            </a>
            <a
              href="#"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-md)",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                fontSize: "0.8125rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M3 20.5v-17c0-.83 1-.83 1.5-.5l14 8.5-14 8.5c-.5.33-1.5.33-1.5-.5z"/>
              </svg>
              Google Play
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "1rem",
          }}
        >
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", margin: 0 }}>
            &copy; {new Date().getFullYear()} Elite Tamil Matrimony. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Cookies", href: "/cookies" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
