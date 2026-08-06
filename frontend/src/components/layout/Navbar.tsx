"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown, HelpCircle, Menu, X,
  Home, Heart, Send, MessageSquare, Search, Bell,
  LogOut, Sparkles, Crown, Lock, RefreshCw, User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMembership } from "@/hooks/useMembership";
import BottomNav from "./BottomNav";

// ── SVG Icon Components ───────────────────────────────────────────────────────

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="7" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

// ── Logged-in icon nav items ──────────────────────────────────────────────────

const LOGGED_IN_NAV = [
  {
    label: "Home",
    href: "/",
    icon: <Home size={18} />,
    preview: {
      title: "Dashboard",
      desc: "Your daily match recommendations and profile completeness.",
      stats: [{ label: "New Matches", val: "6" }, { label: "Profile Views", val: "175" }],
      locked: false,
    },
  },
  {
    label: "Matches",
    href: "/matches",
    icon: <Heart size={18} />,
    preview: {
      title: "All Matches",
      desc: "Browse profiles matching your partner preferences.",
      stats: [{ label: "Matches", val: "72" }, { label: "Shortlisted", val: "12" }],
      locked: false,
    },
  },
  {
    label: "Interests",
    href: "/interests",
    icon: <Send size={18} />,
    preview: {
      title: "Interests Sent & Received",
      desc: "Track all interests you have sent and received.",
      stats: [{ label: "Sent", val: "8" }, { label: "Received", val: "14" }],
      locked: false,
    },
  },
  {
    label: "Messages",
    href: "/messages",
    icon: <MessageSquare size={18} />,
    preview: {
      title: "Messages",
      desc: "Chat with matched profiles. Available for Gold and above.",
      stats: [{ label: "Conversations", val: "5" }, { label: "Unread", val: "2" }],
      locked: true,
    },
  },
  {
    label: "Search",
    href: "/search",
    icon: <Search size={18} />,
    preview: {
      title: "Advanced Search",
      desc: "Filter by caste, city, education, income and 25+ filters.",
      stats: [{ label: "Profiles", val: "25L+" }, { label: "Filters", val: "25+" }],
      locked: false,
    },
  },
  {
    label: "Alerts",
    href: "/notifications",
    icon: <Bell size={18} />,
    preview: {
      title: "Notifications",
      desc: "Stay updated on views, interests, and messages.",
      stats: [{ label: "New", val: "3" }, { label: "Today", val: "7" }],
      locked: false,
    },
  },
];

interface StoredProfile {
  id: string;
  name: string;
  photoUrl?: string;
  mobile?: string;
}

function getStoredProfiles(): StoredProfile[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("etm_profiles") || "[]");
  } catch {
    return [];
  }
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [storedProfiles, setStoredProfiles] = useState<StoredProfile[]>([]);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Load stored profiles for switch-account
  useEffect(() => {
    setStoredProfiles(getStoredProfiles());
  }, [user]);

  // Persist profile to switch-account list
  useEffect(() => {
    if (!user) return;
    const existing = getStoredProfiles();
    const alreadyStored = existing.some((p) => p.id === user.id);
    if (!alreadyStored) {
      const updated = [
        ...existing,
        { id: user.id, name: user.name, photoUrl: user.photoUrl, mobile: user.mobile },
      ];
      localStorage.setItem("etm_profiles", JSON.stringify(updated));
      setStoredProfiles(updated);
    }
  }, [user]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileMenuOpen(false);
  }, [pathname]);

  // Close profile menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuOpen]);

  // Lock scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    router.push("/");
    setProfileMenuOpen(false);
    setMobileOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const otherProfiles = storedProfiles.filter((p) => p.id !== user?.id && p.mobile === user?.mobile);
  const { can } = useMembership();

  // ── LOGGED-IN NAVBAR ──────────────────────────────────────────────────────
  if (user) {
    return (
      <>
        <header
          style={{
            background: "#fff",
            borderBottom: "1px solid #e0e0e0",
            position: "sticky",
            top: 0,
            zIndex: 100,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            paddingLeft: "env(safe-area-inset-left, 0px)",
            paddingRight: "env(safe-area-inset-right, 0px)",
          }}
        >
          <div
            style={{
              maxWidth: "1140px",
              margin: "0 auto",
              padding: "0 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "56px",
              gap: "0.5rem",
            }}
          >
            {/* Logo */}
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", flexShrink: 0 }}>
              <img
                src="/logo.svg"
                alt="Elite Tamil Matrimony"
                style={{ height: "40px", width: "auto", display: "block" }}
              />
            </Link>

            {/* Desktop icon nav — hidden on mobile (bottom nav handles it) */}
            <nav className="nav-icon-row" style={{ display: "flex", alignItems: "center", gap: "0", flex: 1, justifyContent: "center" }}>
              {LOGGED_IN_NAV.map((item) => {
                const active = isActive(item.href);
                const isLocked = item.preview.locked && !can("messages");
                return (
                  <div
                    key={item.label}
                    className="nav-preview-wrap"
                    style={{ position: "relative" }}
                  >
                    <Link
                      href={item.href}
                      className="nav-link-item"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "2px",
                        padding: "0 0.625rem",
                        height: "56px",
                        justifyContent: "center",
                        color: active ? "var(--primary)" : isLocked ? "#aaa" : "#555",
                        textDecoration: "none",
                        fontSize: "0.625rem",
                        fontWeight: active ? 700 : 500,
                        borderBottom: active ? "2px solid var(--primary)" : "2px solid transparent",
                        position: "relative",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.icon}
                      {item.label}
                      {isLocked && (
                        <Lock size={8} style={{ position: "absolute", top: "8px", right: "6px", color: "#C8973A" }} />
                      )}
                    </Link>
                    {/* Hover Preview Card — desktop only */}
                    <div className="nav-preview-card" style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      left: "50%",
                      transform: "translateX(-50%) translateY(-4px)",
                      width: "220px",
                      background: "#fff",
                      border: "1px solid #E8D5B7",
                      borderRadius: "10px",
                      boxShadow: "0 8px 32px rgba(107,26,42,0.18)",
                      overflow: "hidden",
                      opacity: 0,
                      pointerEvents: "none",
                      transition: "opacity 0.18s ease, transform 0.18s ease",
                      zIndex: 500,
                      fontFamily: "var(--font-sans)",
                    }}>
                      <div style={{
                        background: "linear-gradient(135deg, #6B1A2A 0%, #C8973A 100%)",
                        padding: "0.625rem 0.875rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}>
                        <span style={{ color: "#fff", opacity: 0.9 }}>{item.icon}</span>
                        <span style={{ fontWeight: 700, fontSize: "0.8125rem", color: "#fff" }}>{item.preview.title}</span>
                        {isLocked && (
                          <span style={{
                            marginLeft: "auto",
                            background: "rgba(255,255,255,0.2)",
                            borderRadius: "4px",
                            padding: "1px 6px",
                            fontSize: "0.625rem",
                            color: "#FFD54F",
                            fontWeight: 700,
                          }}>GOLD+</span>
                        )}
                      </div>
                      <div style={{ padding: "0.625rem 0.875rem" }}>
                        <p style={{ fontSize: "0.75rem", color: "#555", lineHeight: 1.5, margin: "0 0 0.5rem" }}>
                          {item.preview.desc}
                        </p>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          {item.preview.stats.map((s) => (
                            <div key={s.label} style={{
                              flex: 1,
                              background: "#FBF0F5",
                              borderRadius: "6px",
                              padding: "0.375rem 0.5rem",
                              textAlign: "center",
                            }}>
                              <div style={{ fontSize: "0.9375rem", fontWeight: 800, color: "#6B1A2A" }}>{s.val}</div>
                              <div style={{ fontSize: "0.625rem", color: "#888", fontWeight: 500 }}>{s.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{
                        padding: "0.375rem 0.875rem",
                        borderTop: "1px solid #F0E8E8",
                        fontSize: "0.6875rem",
                        color: "#6B1A2A",
                        fontWeight: 600,
                      }}>Click to open {item.label} →</div>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Right: Premium badge + Avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
              {/* Upgrade / Plan badge — hidden on very small screens to save space */}
              <div className="hide-mobile" style={{ display: "flex" }}>
                {user.isPremium ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      background: {
                        Gold: "linear-gradient(135deg, #C8973A 0%, #E8C060 50%, #C8973A 100%)",
                        Diamond: "linear-gradient(135deg, hsl(253,70%,45%) 0%, hsl(217,91%,55%) 100%)",
                        Platinum: "linear-gradient(135deg, #E69C00 0%, #FFB703 100%)",
                      }[user.membershipPlan ?? "Gold"] ?? "linear-gradient(135deg, #C8973A 0%, #E8C060 50%, #C8973A 100%)",
                      border: "none",
                      borderRadius: "20px",
                      padding: "0.3rem 0.875rem",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#fff",
                      letterSpacing: "0.02em",
                      boxShadow: "0 2px 8px rgba(200,151,58,0.35)",
                    }}
                  >
                    <Crown size={12} fill="#fff" strokeWidth={0} />
                    {user.membershipPlan ?? "Premium"}
                  </div>
                ) : (
                  <button
                    onClick={() => router.push("/membership")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      background: "linear-gradient(135deg, #C8973A 0%, #E8C060 50%, #C8973A 100%)",
                      border: "none",
                      borderRadius: "20px",
                      padding: "0.3rem 0.875rem",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#fff",
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                      whiteSpace: "nowrap",
                      boxShadow: "0 2px 8px rgba(200,151,58,0.35)",
                    }}
                  >
                    <Sparkles size={12} />
                    Upgrade
                  </button>
                )}
              </div>

              {/* Avatar dropdown */}
              <div style={{ position: "relative" }} ref={profileMenuRef}>
                <button
                  onClick={() => setProfileMenuOpen((v) => !v)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    fontFamily: "var(--font-sans)",
                    minHeight: "44px",
                    minWidth: "44px",
                    justifyContent: "center",
                  }}
                  aria-label="Profile menu"
                  aria-expanded={profileMenuOpen}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      background: "#ddd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#555",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      overflow: "hidden",
                      border: "1px solid #ccc",
                    }}
                  >
                    {user.photoUrl ? (
                      <img
                        src={user.photoUrl}
                        alt={user.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <UserIcon />
                    )}
                  </div>
                  <ChevronDown size={12} style={{ color: "#777" }} />
                </button>

                {profileMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      background: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                      minWidth: "220px",
                      zIndex: 300,
                      animation: "slideDown 0.15s ease",
                    }}
                    role="menu"
                  >
                    {/* User info header */}
                    <div
                      style={{
                        padding: "0.875rem 1rem",
                        borderBottom: "1px solid #f0f0f0",
                        background: "#fafafa",
                        borderRadius: "8px 8px 0 0",
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#222", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "#888", marginTop: "2px" }}>
                        {user.mobile ? `+91 ${user.mobile}` : user.id.slice(0, 8).toUpperCase()}
                      </div>
                      {/* Show plan badge in dropdown on mobile */}
                      <div className="show-mobile" style={{ marginTop: "6px" }}>
                        {user.isPremium ? (
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: "4px",
                            background: "linear-gradient(135deg, #C8973A 0%, #E8C060 50%, #C8973A 100%)",
                            color: "#fff", fontSize: "0.6875rem", fontWeight: 700,
                            padding: "2px 8px", borderRadius: "10px",
                          }}>
                            <Crown size={10} fill="#fff" strokeWidth={0} />
                            {user.membershipPlan ?? "Premium"}
                          </span>
                        ) : (
                          <button
                            onClick={() => { router.push("/membership"); setProfileMenuOpen(false); }}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: "4px",
                              background: "linear-gradient(135deg, #C8973A 0%, #E8C060 50%, #C8973A 100%)",
                              color: "#fff", fontSize: "0.6875rem", fontWeight: 700,
                              padding: "3px 10px", borderRadius: "10px", border: "none", cursor: "pointer",
                              fontFamily: "var(--font-sans)",
                            }}
                          >
                            <Sparkles size={10} /> Upgrade to Gold
                          </button>
                        )}
                      </div>
                    </div>

                    {[
                      { label: "My Profile", href: `/profile/${user.id}` },
                      { label: "Edit Profile", href: "/profile/edit" },
                      { label: "My Matches", href: "/matches" },
                      { label: "Interests", href: "/interests" },
                      { label: "Settings", href: "/settings" },
                    ].map((item) => (
                      <Link
                        key={item.href + item.label}
                        href={item.href}
                        role="menuitem"
                        onClick={() => setProfileMenuOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "0.625rem 1rem",
                          fontSize: "0.875rem",
                          color: "#333",
                          textDecoration: "none",
                          borderBottom: "1px solid #f5f5f5",
                          minHeight: "44px",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        {item.label}
                      </Link>
                    ))}

                    {/* Switch Account */}
                    {otherProfiles.length > 0 && (
                      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "0.25rem" }}>
                        <div style={{ padding: "0.375rem 1rem 0.25rem", fontSize: "0.6875rem", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Switch Account
                        </div>
                        {otherProfiles.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setProfileMenuOpen(false);
                              router.push(`/login?switchTo=${p.mobile || ""}&name=${encodeURIComponent(p.name)}`);
                            }}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.625rem",
                              padding: "0.5rem 1rem",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              textAlign: "left",
                              fontFamily: "var(--font-sans)",
                              borderBottom: "1px solid #f5f5f5",
                              minHeight: "44px",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <div style={{
                              width: "28px", height: "28px", borderRadius: "50%",
                              background: "#eee", display: "flex", alignItems: "center",
                              justifyContent: "center", overflow: "hidden", flexShrink: 0, border: "1px solid #ddd",
                            }}>
                              {p.photoUrl ? (
                                <img src={p.photoUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.8">
                                  <circle cx="12" cy="7" r="4" />
                                  <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
                                </svg>
                              )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#222", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                              {p.mobile && <div style={{ fontSize: "0.6875rem", color: "#888" }}>+91 {p.mobile}</div>}
                            </div>
                            <RefreshCw size={12} style={{ color: "#bbb", flexShrink: 0 }} />
                          </button>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={handleLogout}
                      role="menuitem"
                      style={{
                        width: "100%",
                        padding: "0.625rem 1rem",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        color: "var(--primary)",
                        fontFamily: "var(--font-sans)",
                        fontWeight: 700,
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        borderRadius: "0 0 8px 8px",
                        borderTop: "1px solid #f0f0f0",
                        minHeight: "44px",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fff5f5")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Bottom nav for mobile — only for logged-in users */}
        <BottomNav />

        {/* Inline styles for nav hover effects on desktop only */}
        <style>{`
          @media (min-width: 901px) {
            .nav-preview-wrap:hover .nav-preview-card {
              opacity: 1 !important;
              pointer-events: auto !important;
              transform: translateX(-50%) translateY(0) !important;
            }
            .nav-preview-card {
              opacity: 0;
              pointer-events: none;
              transform: translateX(-50%) translateY(-4px);
              transition: opacity 0.18s ease, transform 0.18s ease;
            }
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </>
    );
  }

  // ── GUEST NAVBAR ──────────────────────────────────────────────────────────
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#fff",
        borderBottom: "1px solid #e0e0e0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        paddingLeft: "env(safe-area-inset-left, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
    >
      <div style={{ background: "#fff", padding: "0.5rem 0" }}>
        <div
          style={{
            maxWidth: "1140px",
            margin: "0 auto",
            padding: "0 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            minHeight: "52px",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "1px", flexShrink: 0 }}>
            <span style={{ fontSize: "0.5rem", color: "#aaa", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600 }}>
              Trusted Tamil Matrimony
            </span>
            <img
              src="/logo.svg"
              alt="Elite Tamil Matrimony"
              style={{ height: "36px", width: "auto", display: "block" }}
            />
          </Link>

          {/* Desktop right actions */}
          <div className="desktop-nav" style={{ alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.8125rem", color: "#777" }}>Already a member?</span>
            <Link
              href="/login"
              style={{
                border: "1.5px solid var(--primary)",
                color: "var(--primary)",
                padding: "0.375rem 1.125rem",
                borderRadius: "4px",
                fontWeight: 700,
                fontSize: "0.875rem",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                transition: "background 0.15s, color 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--primary)"; }}
            >
              Login
            </Link>
            <Link
              href="/register"
              style={{
                background: "var(--primary)",
                color: "#fff",
                padding: "0.375rem 1.25rem",
                borderRadius: "4px",
                fontWeight: 700,
                fontSize: "0.875rem",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                transition: "background 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-dark)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
            >
              Register Free
            </Link>
            <a
              href="/faq"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: "#777",
                textDecoration: "none",
                fontSize: "0.8125rem",
                whiteSpace: "nowrap",
              }}
            >
              <HelpCircle size={15} />
              Help
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-btn"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              color: "#333",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "44px",
              minHeight: "44px",
            }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 90,
              animation: "fadeIn 0.2s ease",
            }}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "280px",
              height: "100vh",
              background: "#fff",
              zIndex: 95,
              boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
              padding: "1rem",
              animation: "slideInRight 0.25s ease",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <img src="/logo.svg" alt="Elite Tamil Matrimony" style={{ height: "32px" }} />
              <button
                onClick={() => setMobileOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", color: "#333" }}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: "0.75rem 1rem",
                  border: "1.5px solid var(--primary)",
                  color: "var(--primary)",
                  borderRadius: "4px",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  textAlign: "center",
                  display: "block",
                }}
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: "0.75rem 1rem",
                  background: "var(--primary)",
                  color: "#fff",
                  borderRadius: "4px",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  textAlign: "center",
                  display: "block",
                }}
              >
                Register Free
              </Link>
              <Link
                href="/faq"
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: "0.75rem 0",
                  color: "#777",
                  fontSize: "0.9375rem",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <HelpCircle size={18} />
                Help & FAQ
              </Link>
              <Link
                href="/success-stories"
                onClick={() => setMobileOpen(false)}
                style={{ padding: "0.75rem 0", color: "#777", fontSize: "0.9375rem", textDecoration: "none", display: "block" }}
              >
                Success Stories
              </Link>
              <Link
                href="/membership"
                onClick={() => setMobileOpen(false)}
                style={{ padding: "0.75rem 0", color: "#777", fontSize: "0.9375rem", textDecoration: "none", display: "block" }}
              >
                Membership Plans
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                style={{ padding: "0.75rem 0", color: "#777", fontSize: "0.9375rem", textDecoration: "none", display: "block" }}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </header>
  );
}
