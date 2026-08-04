"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown, HelpCircle, Menu, X,
  Home, Heart, Send, MessageSquare, Search, Bell,
  LogOut, Sparkles, RefreshCw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// ── SVG Icon Components (no emojis) ─────────────────────────────────────────

const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="7" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

// ── Logged-in icon nav items ─────────────────────────────────────────────────
const LOGGED_IN_NAV = [
  { label: "Home", href: "/", icon: <Home size={18} /> },
  { label: "Matches", href: "/matches", icon: <Heart size={18} /> },
  { label: "Interests", href: "/interests", icon: <Send size={18} /> },
  { label: "Messages", href: "/messages", icon: <MessageSquare size={18} /> },
  { label: "Search", href: "/search", icon: <Search size={18} /> },
  { label: "Notification", href: "/notifications", icon: <Bell size={18} /> },
];

// Stored profile shape for switch-account
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

  // Load stored profiles for switch-account
  useEffect(() => {
    setStoredProfiles(getStoredProfiles());
  }, [user]);

  // When a user logs in, persist their profile in localStorage list
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

  const handleLogout = () => {
    logout();
    router.push("/");
    setProfileMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const otherProfiles = storedProfiles.filter((p) => p.id !== user?.id);

  // ── LOGGED-IN NAVBAR ─────────────────────────────────────────────────────
  if (user) {
    return (
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #e0e0e0",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
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
            gap: "1rem",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", flexShrink: 0 }}>
            <img
              src="/logo.svg"
              alt="Elite Tamil Matrimony"
              style={{ height: "44px", width: "auto", display: "block" }}
            />
          </Link>

          {/* Icon nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: "0" }}>
            {LOGGED_IN_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2px",
                    padding: "0 0.75rem",
                    height: "56px",
                    justifyContent: "center",
                    color: active ? "var(--primary)" : "#555",
                    textDecoration: "none",
                    fontSize: "0.6875rem",
                    fontWeight: active ? 700 : 500,
                    borderBottom: active ? "2px solid var(--primary)" : "2px solid transparent",
                    position: "relative",
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Upgrade + Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0 }}>
            {/* Gold Upgrade CTA */}
            {!user.isPremium && (
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
                  letterSpacing: "0.02em",
                }}
              >
                <Sparkles size={12} />
                Upgrade
              </button>
            )}

            {/* Avatar dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setProfileMenuOpen((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  fontFamily: "var(--font-sans)",
                }}
                aria-label="Profile menu"
                aria-expanded={profileMenuOpen}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
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
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                    minWidth: "220px",
                    zIndex: 300,
                  }}
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
                    <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#222" }}>{user.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#888", marginTop: "2px" }}>
                      {user.mobile ? `+91 ${user.mobile}` : user.id.slice(0, 8).toUpperCase()}
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
                      onClick={() => setProfileMenuOpen(false)}
                      style={{
                        display: "block",
                        padding: "0.5rem 1rem",
                        fontSize: "0.875rem",
                        color: "#333",
                        textDecoration: "none",
                        borderBottom: "1px solid #f5f5f5",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {item.label}
                    </Link>
                  ))}

                  {/* Switch Account — only shown if other stored profiles exist */}
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
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <div
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              background: "#eee",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              flexShrink: 0,
                              border: "1px solid #ddd",
                            }}
                          >
                            {p.photoUrl ? (
                              <img src={p.photoUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.8">
                                <circle cx="12" cy="7" r="4" />
                                <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#222" }}>{p.name}</div>
                            {p.mobile && <div style={{ fontSize: "0.6875rem", color: "#888" }}>+91 {p.mobile}</div>}
                          </div>
                          <RefreshCw size={12} style={{ marginLeft: "auto", color: "#bbb" }} />
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
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
    );
  }

  // ── GUEST NAVBAR ─────────────────────────────────────────────────────────
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff", borderBottom: "1px solid #e0e0e0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
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
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "1px" }}>
            <span style={{ fontSize: "0.5rem", color: "#aaa", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600 }}>
              Trusted Tamil Matrimony
            </span>
            <img
              src="/logo.svg"
              alt="Elite Tamil Matrimony"
              style={{ height: "40px", width: "auto", display: "block" }}
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
              padding: "4px",
              color: "#333",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: "#fff", borderTop: "1px solid #e0e0e0", padding: "0.75rem 1rem 1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              style={{
                padding: "0.625rem 1rem",
                border: "1.5px solid var(--primary)",
                color: "var(--primary)",
                borderRadius: "4px",
                fontSize: "0.875rem",
                fontWeight: 700,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              style={{
                padding: "0.625rem 1rem",
                background: "var(--primary)",
                color: "#fff",
                borderRadius: "4px",
                fontSize: "0.875rem",
                fontWeight: 700,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Register Free
            </Link>
            <Link
              href="/faq"
              onClick={() => setMobileOpen(false)}
              style={{
                padding: "0.5rem 0",
                color: "#777",
                fontSize: "0.875rem",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <HelpCircle size={15} />
              Help & FAQ
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
