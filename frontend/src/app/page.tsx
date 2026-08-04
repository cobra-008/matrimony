"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronDown, ArrowRight, CheckCircle, Shield, Users, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import ProfileCard from "@/components/ui/ProfileCard";
import { PROFILE_FOR_OPTIONS } from "@/data/matrimony-data";
import { fetchMatchProfiles, type RegisteredUser } from "@/lib/auth-store";
import PlanTabs from "@/components/ui/PlanTabs";

// Helper: compute age from dob
function calcAge(dob?: string): number {
  if (!dob) return 0;
  return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

// Helper: convert RegisteredUser → ProfileData shape for ProfileCard
function toProfileData(u: RegisteredUser) {
  return {
    id: u.id,
    name: u.name,
    age: calcAge(u.dob),
    location: [u.city, u.state].filter(Boolean).join(", ") || u.country || "India",
    occupation: u.occupation || "—",
    education: u.education || "—",
    religion: u.religion || "Hindu",
    community: u.caste || u.motherTongue || "Tamil",
    compatibilityScore: 80,
    isVerified: u.isVerified || false,
    isOnline: false,
    isPremium: u.isPremium || false,
    photoUrl: u.photoUrl,
    matchReasons: [],
    gender: u.gender,
    height: u.height,
    income: u.income,
    maritalStatus: u.maritalStatus,
    motherTongue: u.motherTongue,
  };
}


// Stats — BharatMatrimony-style
const STATS = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="#3D7A28" strokeWidth="1.8">
        <circle cx="24" cy="14" r="8" />
        <path d="M8 42c0-8.8 7.2-16 16-16s16 7.2 16 16" />
        <polyline points="20,34 23,37 29,31" strokeWidth="2" />
      </svg>
    ),
    value: "100%",
    label: "Mobile-verified profiles",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="#3D7A28" strokeWidth="1.8">
        <path d="M16 8 L8 20 L16 32 L40 32 L40 8 Z" />
        <circle cx="20" cy="20" r="4" />
        <path d="M28 16 L36 20 L28 24" />
      </svg>
    ),
    value: "4 Crore+",
    label: "Customers served",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="#3D7A28" strokeWidth="1.8">
        <path d="M24 6 L28 18 L42 18 L30 26 L35 40 L24 32 L13 40 L18 26 L6 18 L20 18 Z" />
        <circle cx="24" cy="24" r="14" />
      </svg>
    ),
    value: "26 Years",
    label: "of successful matchmaking",
  },
];

// Success stories
const SUCCESS_STORIES = [
  {
    id: "s1",
    bride: "Priya",
    groom: "Karthik",
    city: "Chennai",
    married: "March 2024",
    community: "Vellalar",
    text: "We connected through Elite Tamil Matrimony and knew immediately we were meant for each other. The matching was spot on — same values, similar family backgrounds.",
    brideImg: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=400",
    groomImg: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "s2",
    bride: "Deepa",
    groom: "Arun",
    city: "Singapore",
    married: "January 2024",
    community: "Mudaliar",
    text: "As an NRI settled in Singapore, finding a Tamil match was challenging. Verified profiles made it easy. We got married within 6 months.",
    brideImg: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    groomImg: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "s3",
    bride: "Kavitha",
    groom: "Suresh",
    city: "Madurai",
    married: "June 2024",
    community: "Thevar",
    text: "My parents created my profile. Within two weeks we found the perfect match in every way. The horoscope feature helped my parents feel confident.",
    brideImg: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    groomImg: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

// Profile matches preview — loaded from DB, not mocks
const PREVIEW_PROFILES: RegisteredUser[] = []; // placeholder; filled by GuestLatestProfiles component

function RegisterForm() {
  const [profileFor, setProfileFor] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileFor) { toast.error("Please select who this profile is for"); return; }
    if (!name.trim()) { toast.error("Please enter the name"); return; }
    if (!mobile || mobile.length < 10) { toast.error("Please enter a valid 10-digit mobile number"); return; }
    // Pass data via URL so register page skips asking again
    const params = new URLSearchParams({
      profileFor,
      name: name.trim(),
      mobile,
    });
    window.location.href = `/register?${params.toString()}`;
  };

  return (
    <div style={{ background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", overflow: "hidden", boxShadow: "var(--shadow-lg)", width: "100%", maxWidth: "340px" }}>
      {/* Green header */}
      <div style={{ background: "var(--gradient-hero)", padding: "0.875rem 1.25rem", textAlign: "center" }}>
        <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", margin: 0 }}>
          Create a Matrimony Profile
        </h2>
      </div>

      <div style={{ padding: "1.25rem" }}>
        <p style={{ textAlign: "center", fontSize: "0.875rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "1rem" }}>
          Find your perfect match
        </p>

        <form onSubmit={handleRegister}>
          {/* Profile created for */}
          <div style={{ marginBottom: "0.75rem", position: "relative" }}>
            <select
              className="form-select"
              value={profileFor}
              onChange={(e) => setProfileFor(e.target.value)}
            >
              <option value="" disabled>Profile created for</option>
              {PROFILE_FOR_OPTIONS.map((p) => <option key={p.value} value={p.label}>{p.label}</option>)}
            </select>
          </div>

          {/* Name */}
          <div style={{ marginBottom: "0.75rem" }}>
            <input
              type="text"
              className="form-input"
              placeholder="Enter the name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Mobile */}
          <div style={{ marginBottom: "0.5rem" }}>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  border: "1.5px solid var(--border-color)",
                  borderRight: "none",
                  borderRadius: "var(--radius-md) 0 0 var(--radius-md)",
                  padding: "0.625rem 0.625rem",
                  background: "#F7F7F7",
                  fontSize: "0.875rem",
                  color: "var(--text-dark)",
                  fontWeight: 600,
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
              >
                +91 <ChevronDown size={11} />
              </div>
              <input
                type="tel"
                className="form-input"
                placeholder="Enter Mobile Number"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                style={{ borderRadius: "0 var(--radius-md) var(--radius-md) 0" }}
              />
            </div>
            <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              OTP will be sent to this number
            </p>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", display: "flex", marginTop: "0.875rem", fontSize: "0.9375rem" }}
          >
            REGISTER FREE
            <ArrowRight size={16} />
          </button>
        </form>

        <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", textAlign: "center", marginTop: "0.75rem" }}>
          *By clicking register free, I agree to the{" "}
          <Link href="/terms" style={{ color: "var(--primary)", textDecoration: "none" }}>T&C</Link>
          {" "}and{" "}
          <Link href="/privacy" style={{ color: "var(--primary)", textDecoration: "none" }}>Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}

function AuthenticatedDashboard() {
  const { user } = useAuth();
  const [dailyRecs, setDailyRecs] = useState<RegisteredUser[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");

  // Countdown until midnight
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000).toString().padStart(2, "0");
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, "0");
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");
      setTimeLeft(`${h}h:${m}m:${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!user) return;
    const { getDailyRecommendations } = require("@/lib/auth-store");
    getDailyRecommendations(user.id, user.gender)
      .then((data: RegisteredUser[]) => setDailyRecs(data.slice(0, 10)))
      .catch(() => setDailyRecs([]))
      .finally(() => setLoadingRecs(false));
  }, [user?.id]);

  if (!user) return null;

  const MALE_PHOTOS = [
    "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200",
    "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200",
    "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
  ];
  const FEMALE_PHOTOS = [
    "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=200",
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
    "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
  ];

  // Profile completeness — which fields are missing
  const missing: { label: string; section: string; icon: string }[] = [];
  if (!user.photoUrl) missing.push({ label: "Add Photo", section: "photo", icon: "📷" });
  if (!user.education && !user.occupation) missing.push({ label: "Professional Details", section: "professional", icon: "💼" });
  if (!user.star && !user.rasi) missing.push({ label: "Horoscope", section: "religion", icon: "⭐" });
  if (!user.about) missing.push({ label: "About Me", section: "about", icon: "📝" });
  if (!user.city) missing.push({ label: "Location", section: "location", icon: "📍" });
  if (!user.partnerAgeMin) missing.push({ label: "Partner Preferences", section: "partner", icon: "❤️" });

  const totalFields = 10;
  const pct = Math.round(((totalFields - missing.length) / totalFields) * 100);

  const profileCode = `ETM${user.id.replace(/-/g, "").slice(0, 7).toUpperCase()}`;
  const userPhoto = user.photoUrl || (user.gender === "female" ? FEMALE_PHOTOS[0] : MALE_PHOTOS[0]);

  return (
    <div style={{ background: "#f2f2f2", minHeight: "100vh" }}>
      <Navbar />
      <PlanTabs activeTab="regular" />

      <div
        style={{
          maxWidth: "1060px",
          margin: "0 auto",
          padding: "1.25rem 1rem",
          display: "flex",
          gap: "1.125rem",
          alignItems: "flex-start",
        }}
      >
        {/* ── LEFT SIDEBAR ─────────────────────────────────────── */}
        <aside
          style={{
            width: "230px",
            flexShrink: 0,
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: "6px",
            overflow: "hidden",
            position: "sticky",
            top: "70px",
          }}
        >
          {/* Avatar + name */}
          <div style={{ padding: "1.25rem 1rem 1rem", textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ position: "relative", display: "inline-block", marginBottom: "0.75rem" }}>
              <img
                src={userPhoto}
                alt={user.name}
                style={{
                  width: "72px", height: "72px", borderRadius: "50%",
                  objectFit: "cover", objectPosition: "top",
                  border: "2px solid #e0e0e0",
                  display: "block",
                }}
              />
              <Link
                href="/profile/edit?section=photo"
                style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: "22px", height: "22px",
                  background: "#fff", border: "1px solid #ddd",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
                title="Change photo"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </Link>
            </div>

            <div style={{ fontWeight: 700, fontSize: "1rem", color: "#111", marginBottom: "2px" }}>{user.name}</div>
            <div style={{ fontSize: "0.75rem", color: "#888", marginBottom: "4px" }}>BharatMatrimony</div>
            <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#555", marginBottom: "4px" }}>{profileCode}</div>
            <div style={{ fontSize: "0.75rem", color: "#aaa" }}>Free member</div>
          </div>

          {/* Upgrade CTA */}
          <div
            style={{
              margin: "0.875rem 0.875rem 0",
              background: "linear-gradient(135deg, #fff8f0, #fff3e8)",
              border: "1px solid #ffcc80",
              borderRadius: "6px",
              padding: "0.75rem",
            }}
          >
            <p style={{ fontSize: "0.75rem", color: "#555", margin: "0 0 0.5rem", lineHeight: 1.4 }}>
              Upgrade membership to call or message with matches
            </p>
            <Link
              href="/membership"
              style={{
                display: "block", textAlign: "center",
                padding: "0.375rem",
                background: "#E8401A", color: "#fff",
                borderRadius: "20px", textDecoration: "none",
                fontSize: "0.8125rem", fontWeight: 700,
                fontFamily: "var(--font-sans)",
              }}
            >
              Upgrade now
            </Link>
          </div>

          {/* Switch account — links to login page which has multi-profile picker */}
          <div style={{ margin: "0.875rem 0 0", padding: "0.625rem 0.875rem", borderTop: "1px solid #f0f0f0" }}>
            <Link
              href="/login"
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                textDecoration: "none",
                fontFamily: "var(--font-sans)", fontSize: "0.875rem",
                color: "#333", fontWeight: 500,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
              Switch account
            </Link>
          </div>

          {/* Quick links */}
          <div style={{ padding: "0.25rem 0 0.875rem" }}>
            {[
              { href: "/profile/edit", icon: "👤", label: "Edit profile" },
              { href: "/settings", icon: "⚙️", label: "Edit preferences" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "0.5rem 0.875rem",
                  color: "#444", textDecoration: "none",
                  fontSize: "0.875rem", fontWeight: 500,
                  borderTop: "1px solid #f8f8f8",
                }}
              >
                <span>{item.icon}</span> {item.label}
              </Link>
            ))}
          </div>
        </aside>

        {/* ── RIGHT MAIN ──────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Complete Your Profile */}
          {missing.length > 0 && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                padding: "1rem 1.125rem",
                marginBottom: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.625rem" }}>
                <div>
                  <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#111", margin: "0 0 3px" }}>Complete Your Profile</h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.75rem", color: "#888" }}>Profile completeness score {pct}%</span>
                    <div style={{ width: "80px", height: "6px", background: "#e0e0e0", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "#4CAF50", borderRadius: "3px" }} />
                    </div>
                  </div>
                </div>
                <Link href="/profile/edit" style={{ fontSize: "0.75rem", color: "#E8401A", fontWeight: 600, textDecoration: "none" }}>
                  Edit all →
                </Link>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {missing.map((m) => (
                  <Link
                    key={m.section}
                    href={`/profile/edit?section=${m.section}`}
                    style={{
                      display: "flex", alignItems: "center", gap: "5px",
                      padding: "0.5rem 0.875rem",
                      background: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      color: "#333",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    <span style={{ fontSize: "1.125rem" }}>{m.icon}</span>
                    {m.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Daily Recommendations */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              padding: "1rem 1.125rem",
            }}
          >
            {/* Heading row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <div>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#111", margin: "0 0 2px" }}>Daily Recommendations</h2>
                <p style={{ fontSize: "0.8125rem", color: "#888", margin: 0 }}>Recommended matches for today</p>
              </div>

              {/* Countdown */}
              <div
                style={{
                  background: "#2e7d32",
                  color: "#fff",
                  padding: "0.25rem 0.625rem",
                  borderRadius: "4px",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                <div style={{ fontSize: "0.5625rem", fontWeight: 400, letterSpacing: "0.03em" }}>Time left to view</div>
                {timeLeft}
              </div>
            </div>

            {/* Horizontal scroll of profiles */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                overflowX: "auto",
                paddingBottom: "0.5rem",
              }}
            >
              {loadingRecs
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: "125px", flexShrink: 0,
                        background: "#f0f0f0", borderRadius: "6px",
                        height: "175px", animation: "pulse 1.5s ease-in-out infinite",
                      }}
                    />
                  ))
                : dailyRecs.slice(0, 10).map((p, idx) => {
                    const photo = p.photoUrl || (p.gender === "female" ? FEMALE_PHOTOS[idx % 3] : MALE_PHOTOS[idx % 3]);
                    const age = p.dob
                      ? Math.floor((Date.now() - new Date(p.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                      : 0;
                    return (
                      <Link
                        key={p.id}
                        href={`/profile/${p.id}`}
                        style={{
                          width: "125px", flexShrink: 0,
                          display: "block", textDecoration: "none",
                        }}
                      >
                        <img
                          src={photo}
                          alt={p.name}
                          style={{
                            width: "125px", height: "160px",
                            objectFit: "cover", objectPosition: "top",
                            borderRadius: "6px", display: "block",
                          }}
                        />
                        <div style={{ marginTop: "5px", fontSize: "0.8125rem", fontWeight: 600, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#888" }}>
                          {[age > 0 ? `${age} Yrs` : null, p.height].filter(Boolean).join(", ")}
                        </div>
                      </Link>
                    );
                  })
              }

              {/* "More" arrow button */}
              {!loadingRecs && dailyRecs.length > 0 && (
                <Link
                  href="/daily-recs"
                  style={{
                    width: "44px", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "#f5f5f5", border: "1px solid #e0e0e0",
                    borderRadius: "6px", height: "160px",
                    textDecoration: "none",
                  }}
                  title="View all daily recommendations"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </Link>
              )}
            </div>

            {/* View all button */}
            {!loadingRecs && dailyRecs.length > 0 && (
              <div style={{ marginTop: "0.875rem", textAlign: "center" }}>
                <Link
                  href="/daily-recs"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    padding: "0.4375rem 1.5rem",
                    border: "1.5px solid #E8401A",
                    borderRadius: "20px",
                    color: "#E8401A",
                    textDecoration: "none",
                    fontSize: "0.875rem", fontWeight: 700,
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  View all
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ── Guest Latest Profiles (DB-backed) ───────────────────────────────────────
function GuestLatestProfiles() {
  const [profiles, setProfiles] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load a mix of recent profiles for public preview
    fetchMatchProfiles(undefined, undefined)
      .then((data) => setProfiles(data.slice(0, 6)))
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{ background: "#fff", padding: "3rem 0", borderTop: "1px solid var(--border-light)" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-dark)", margin: 0 }}>
              Latest Profiles
            </h2>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-medium)", marginTop: "2px" }}>
              Recently joined Tamil members
            </p>
          </div>
          <Link
            href="/register"
            style={{ fontSize: "0.875rem", color: "var(--primary)", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
          >
            Register to View All <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "1rem" }}>
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} style={{ background: "#f5f5f5", borderRadius: "var(--radius-lg)", height: "240px", animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", background: "var(--primary-light)", borderRadius: "var(--radius-xl)", border: "1px dashed var(--primary)" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" style={{ margin: "0 auto 1rem", opacity: 0.5 }}>
              <circle cx="12" cy="7" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            <p style={{ color: "var(--text-medium)", fontWeight: 600, margin: "0 0 0.5rem" }}>Be the first to join!</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: "0 0 1rem" }}>
              Register now and start your Tamil matrimony journey.
            </p>
            <Link href="/register" className="btn btn-primary" style={{ display: "inline-flex" }}>
              Register Free <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="profile-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "1rem" }}>
            {profiles.map((profile) => {
              const age = profile.dob ? Math.floor((Date.now() - new Date(profile.dob).getTime()) / (365.25*24*60*60*1000)) : 0;
              return (
                <Link key={profile.id} href="/register" style={{ textDecoration: "none" }}>
                  <div
                    className="profile-card-hover"
                    style={{ background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}
                  >
                    {/* Photo — blurred for guest view */}
                    <div style={{ height: "180px", overflow: "hidden", background: "#f0f0f0", position: "relative" }}>
                      {profile.photoUrl ? (
                        <img
                          src={profile.photoUrl}
                          alt={profile.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", filter: "blur(6px)", transform: "scale(1.1)" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--primary-light)" }}>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.2" opacity="0.4">
                            <circle cx="12" cy="7" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
                          </svg>
                        </div>
                      )}
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.25)" }}>
                        <span style={{ color: "#fff", fontSize: "0.6875rem", fontWeight: 700, background: "rgba(0,0,0,0.4)", padding: "2px 8px", borderRadius: "20px" }}>
                          Register to View
                        </span>
                      </div>
                    </div>
                    {/* Info */}
                    <div style={{ padding: "0.625rem 0.75rem" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-dark)", marginBottom: "2px" }}>
                        {profile.name.split(" ")[0]} {profile.name.split(" ")[1]?.[0]}.
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-medium)" }}>
                        {age > 0 ? `${age} yrs` : ""}{age > 0 && profile.caste ? " • " : ""}{profile.caste || profile.motherTongue || "Tamil"}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-light)", marginTop: "1px" }}>
                        {[profile.city, profile.state].filter(Boolean).join(", ") || "India"}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { user, loading } = useAuth();

  // While auth is resolving, show a minimal spinner to avoid flash of guest UI
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f2f2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: "40px", height: "40px",
          border: "3px solid #e0e0e0",
          borderTopColor: "#6B1A2A",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (user) {
    return <AuthenticatedDashboard />;
  }

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-page)" }}>

        {/* =================== HERO =================== */}
        <section style={{ background: "var(--bg-page)", padding: "2.5rem 0" }}>
          <div className="container">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
              {/* Left — headline */}
              <div style={{ flex: 1, minWidth: "280px" }}>
                <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 900, color: "var(--text-dark)", lineHeight: 1.25, marginBottom: "0.5rem" }}>
                  The{" "}
                  <span style={{ color: "var(--primary)" }}>biggest and most trusted</span>
                  <br />
                  matrimony service for Tamils!
                </h1>

                {/* Premium Tamil couple illustration */}
                <div
                  className="animate-fade-in"
                  style={{ margin: "1.5rem 0" }}
                >
                  <svg
                    width="320"
                    height="260"
                    viewBox="0 0 320 260"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Tamil newly married couple illustration"
                    role="img"
                    style={{
                      maxWidth: "100%",
                      filter: "drop-shadow(0 8px 24px rgba(107,26,42,0.12))",
                    }}
                  >
                    {/* Background arch */}
                    <ellipse cx="160" cy="240" rx="130" ry="20" fill="#F5E6E9" opacity="0.6"/>

                    {/* === BRIDE (left) === */}
                    {/* Saree body — deep maroon */}
                    <path d="M85 145 Q78 180 75 230 L115 230 Q118 180 120 145 Z" fill="#8B1A2A"/>
                    {/* Saree gold border */}
                    <path d="M85 145 Q78 180 75 230 L80 230 Q83 180 90 145 Z" fill="#C8973A"/>
                    <path d="M115 145 Q118 180 115 230 L120 230 Q122 180 120 145 Z" fill="#C8973A"/>
                    {/* Saree pleats */}
                    <path d="M90 170 L110 170" stroke="#6B1A2A" strokeWidth="0.5" opacity="0.4"/>
                    <path d="M89 180 L111 180" stroke="#6B1A2A" strokeWidth="0.5" opacity="0.4"/>
                    <path d="M88 190 L112 190" stroke="#6B1A2A" strokeWidth="0.5" opacity="0.4"/>
                    <path d="M87 200 L113 200" stroke="#6B1A2A" strokeWidth="0.5" opacity="0.4"/>
                    {/* Blouse (upper body) */}
                    <path d="M90 115 Q85 125 85 145 L120 145 Q120 125 115 115 Z" fill="#8B1A2A"/>
                    {/* Blouse gold trim */}
                    <line x1="90" y1="115" x2="120" y2="115" stroke="#C8973A" strokeWidth="1.5"/>
                    {/* Saree pallu draped over shoulder */}
                    <path d="M88 120 Q70 130 65 155 Q70 160 75 155 Q80 135 95 125 Z" fill="#8B1A2A" opacity="0.85"/>
                    <path d="M88 120 Q70 130 65 155 Q67 157 70 155 Q75 136 90 126 Z" fill="#C8973A"/>
                    {/* Bride neck */}
                    <rect x="98" y="100" width="9" height="16" rx="4" fill="#D4956E"/>
                    {/* Necklace / thali */}
                    <ellipse cx="102.5" cy="118" rx="8" ry="3" stroke="#C8973A" strokeWidth="1.2" fill="none"/>
                    <circle cx="102.5" cy="121" r="3" fill="#C8973A"/>
                    {/* Bride head */}
                    <ellipse cx="102" cy="88" rx="15" ry="16" fill="#D4956E"/>
                    {/* Hair bun at top — elaborate */}
                    <path d="M90 78 Q102 65 114 78 Q112 70 102 68 Q92 70 90 78 Z" fill="#1A0A0E"/>
                    <path d="M96 72 Q102 66 108 72 Q106 68 102 67 Q98 68 96 72 Z" fill="#1A0A0E"/>
                    {/* Jasmine flowers in hair */}
                    <circle cx="90" cy="76" r="3" fill="white"/>
                    <circle cx="93" cy="73" r="2.5" fill="white"/>
                    <circle cx="96" cy="71" r="2" fill="white"/>
                    <circle cx="99" cy="70" r="2" fill="white"/>
                    <circle cx="102" cy="69.5" r="2" fill="white"/>
                    <circle cx="105" cy="70" r="2" fill="white"/>
                    <circle cx="108" cy="71" r="2.5" fill="white"/>
                    <circle cx="111" cy="73" r="2.5" fill="white"/>
                    <circle cx="113" cy="76" r="3" fill="white"/>
                    {/* Bindi */}
                    <circle cx="102" cy="82" r="2" fill="#6B1A2A"/>
                    {/* Bride eyes */}
                    <ellipse cx="97" cy="88" rx="3" ry="2.5" fill="#fff"/>
                    <circle cx="97" cy="88" r="1.5" fill="#3D1A1F"/>
                    <ellipse cx="107" cy="88" rx="3" ry="2.5" fill="#fff"/>
                    <circle cx="107" cy="88" r="1.5" fill="#3D1A1F"/>
                    {/* Bride smile */}
                    <path d="M98 95 Q102 99 106 95" stroke="#8B2535" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    {/* Earrings */}
                    <circle cx="87" cy="92" r="3" fill="#C8973A"/>
                    <line x1="87" y1="95" x2="87" y2="100" stroke="#C8973A" strokeWidth="1"/>
                    <circle cx="87" cy="100" r="2" fill="#C8973A"/>
                    <circle cx="117" cy="92" r="3" fill="#C8973A"/>
                    <line x1="117" y1="95" x2="117" y2="100" stroke="#C8973A" strokeWidth="1"/>
                    <circle cx="117" cy="100" r="2" fill="#C8973A"/>
                    {/* Bride arms */}
                    <path d="M85 130 Q70 140 68 160" stroke="#D4956E" strokeWidth="8" strokeLinecap="round" fill="none"/>
                    <path d="M120 130 Q132 140 134 160" stroke="#D4956E" strokeWidth="8" strokeLinecap="round" fill="none"/>
                    {/* Bangles on bride arms */}
                    <circle cx="72" cy="150" r="5" stroke="#C8973A" strokeWidth="2" fill="none"/>
                    <circle cx="71" cy="155" r="5" stroke="#8B1A2A" strokeWidth="2" fill="none"/>
                    <circle cx="130" cy="150" r="5" stroke="#C8973A" strokeWidth="2" fill="none"/>
                    <circle cx="131" cy="155" r="5" stroke="#8B1A2A" strokeWidth="2" fill="none"/>
                    {/* Hands with garland */}
                    <ellipse cx="73" cy="163" rx="6" ry="5" fill="#D4956E"/>
                    <ellipse cx="133" cy="163" rx="6" ry="5" fill="#D4956E"/>

                    {/* === GROOM (right) === */}
                    {/* Veshti — cream/off-white */}
                    <path d="M195 145 Q192 180 190 230 L230 230 Q232 180 230 145 Z" fill="#FFFDF0"/>
                    {/* Veshti gold border */}
                    <path d="M195 145 Q192 180 190 230 L195 230 Q196 180 200 145 Z" fill="#C8973A"/>
                    <path d="M230 145 Q232 180 230 230 L235 230 Q234 180 232 145 Z" fill="#C8973A"/>
                    {/* Veshti pleats */}
                    <path d="M200 170 L225 170" stroke="#E8D5A0" strokeWidth="0.7" opacity="0.7"/>
                    <path d="M200 180 L225 180" stroke="#E8D5A0" strokeWidth="0.7" opacity="0.7"/>
                    <path d="M200 190 L225 190" stroke="#E8D5A0" strokeWidth="0.7" opacity="0.7"/>
                    <path d="M200 200 L225 200" stroke="#E8D5A0" strokeWidth="0.7" opacity="0.7"/>
                    {/* Shirt — cream */}
                    <path d="M193 115 Q188 125 190 145 L230 145 Q232 125 227 115 Z" fill="#FFFDF0"/>
                    {/* Shirt collar */}
                    <path d="M205 115 L210 125 L215 115" stroke="#E8D5A0" strokeWidth="1.5" fill="none"/>
                    {/* Shirt gold buttons */}
                    <circle cx="210" cy="130" r="1.5" fill="#C8973A"/>
                    <circle cx="210" cy="137" r="1.5" fill="#C8973A"/>
                    {/* Groom neck */}
                    <rect x="207" y="100" width="9" height="16" rx="4" fill="#C47B4E"/>
                    {/* Groom head */}
                    <ellipse cx="211" cy="86" rx="16" ry="17" fill="#C47B4E"/>
                    {/* Groom hair — short neat */}
                    <path d="M196 83 Q211 70 226 83 Q224 74 211 72 Q198 74 196 83 Z" fill="#1A0A0E"/>
                    {/* Groom eyes */}
                    <ellipse cx="206" cy="87" rx="3" ry="2.5" fill="#fff"/>
                    <circle cx="206" cy="87" r="1.5" fill="#3D1A1F"/>
                    <ellipse cx="216" cy="87" rx="3" ry="2.5" fill="#fff"/>
                    <circle cx="216" cy="87" r="1.5" fill="#3D1A1F"/>
                    {/* Groom smile */}
                    <path d="M206 95 Q211 100 216 95" stroke="#8B2535" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    {/* Groom arms */}
                    <path d="M190 130 Q178 140 175 160" stroke="#C47B4E" strokeWidth="8" strokeLinecap="round" fill="none"/>
                    <path d="M230 130 Q242 140 245 160" stroke="#C47B4E" strokeWidth="8" strokeLinecap="round" fill="none"/>
                    {/* Groom hands */}
                    <ellipse cx="178" cy="164" rx="6" ry="5" fill="#C47B4E"/>
                    <ellipse cx="242" cy="164" rx="6" ry="5" fill="#C47B4E"/>

                    {/* === GARLANDS connecting them === */}
                    {/* Bride garland */}
                    <path d="M100 120 Q130 108 160 115 Q155 108 150 112 Q135 105 100 120 Z"
                      fill="none" stroke="#3D7A28" strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
                    {/* Groom garland */}
                    <path d="M212 118 Q185 108 160 115 Q165 108 170 112 Q188 105 212 118 Z"
                      fill="none" stroke="#3D7A28" strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
                    {/* Garland flowers */}
                    {[130, 140, 150, 160, 170, 180].map((x) => (
                      <circle key={x} cx={x} cy={Math.sin((x - 130) * 0.18) * 6 + 112} r="3.5" fill="#FFD54F" opacity="0.9"/>
                    ))}
                    {[132, 142, 152, 162, 172, 182].map((x) => (
                      <circle key={x + "g"} cx={x} cy={Math.sin((x - 130) * 0.18) * 6 + 112} r="1.5" fill="#3D7A28" opacity="0.7"/>
                    ))}

                    {/* Heart between them */}
                    <path
                      d="M157 100 C157 97 153 94 150 97 C147 94 143 97 143 100 C143 104 150 110 150 110 C150 110 157 104 157 100 Z"
                      transform="translate(10, -5)"
                      fill="#8B1A2A"
                      opacity="0.85"
                    />

                    {/* Subtle decorative kolam dots at bottom */}
                    {[130, 145, 160, 175, 190].map((x, i) => (
                      <circle key={i} cx={x} cy={248} r={i === 2 ? 3 : 2} fill="#C8973A" opacity="0.4"/>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Right — Register form */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <RegisterForm />
              </div>
            </div>
          </div>
        </section>

        {/* =================== STATS BAR =================== */}
        <section style={{ background: "#fff", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)", padding: "1.5rem 0" }}>
          <div className="container">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "3rem", flexWrap: "wrap" }}>
              {STATS.map((stat, i) => (
                <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div className="stat-icon-wrap">{stat.icon}</div>
                  <div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-dark)", lineHeight: 1.1 }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-light)", marginTop: "2px" }}>
                      {stat.label}
                    </div>
                  </div>
                  {i < STATS.length - 1 && (
                    <div style={{ width: "1px", height: "40px", background: "var(--border-color)", marginLeft: "1.5rem" }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================== TRUST STRIP =================== */}
        <section style={{ background: "var(--bm-green-muted)", borderBottom: "1px solid #C5E0B8", padding: "1.25rem 0" }}>
          <div className="container">
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
              {/* Limca Book badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  background: "#fff",
                  border: "1px solid #C5E0B8",
                  borderRadius: "var(--radius-lg)",
                  padding: "0.875rem 1.25rem",
                  flex: 1,
                  minWidth: "260px",
                }}
              >
                {/* Book icon */}
                <div style={{ flexShrink: 0 }}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="8" y="6" width="28" height="36" rx="3" stroke="#E8401A" strokeWidth="1.8" fill="none" />
                    <rect x="4" y="8" width="6" height="32" rx="2" fill="#E8401A" />
                    <line x1="14" y1="16" x2="30" y2="16" stroke="#3D7A28" strokeWidth="1.5" />
                    <line x1="14" y1="22" x2="30" y2="22" stroke="#3D7A28" strokeWidth="1.5" />
                    <line x1="14" y1="28" x2="24" y2="28" stroke="#3D7A28" strokeWidth="1.5" />
                  </svg>
                </div>
                <div>
                  <div style={{ color: "var(--bm-orange)", fontWeight: 700, fontSize: "0.9375rem" }}>
                    Lakhs of Happy Marriages!
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-medium)", marginTop: "2px" }}>
                    Featured for highest number of documented marriages online
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              {[
                { icon: <CheckCircle size={18} stroke="#3D7A28" />, text: "ISO 27001 Certified" },
                { icon: <Shield size={18} stroke="#3D7A28" />, text: "100% Privacy" },
                { icon: <Users size={18} stroke="#3D7A28" />, text: "Verified Profiles" },
                { icon: <Star size={18} stroke="#3D7A28" fill="none" />, text: "4.8 App Rating" },
              ].map((b) => (
                <div key={b.text} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {b.icon}
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-dark)" }}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================== ASSISTED SERVICE =================== */}
        <section style={{ background: "var(--bg-page)", padding: "3rem 0" }}>
          <div className="container">
            <div style={{ display: "flex", alignItems: "center", gap: "3rem", flexWrap: "wrap" }}>
              {/* Left text */}
              <div style={{ flex: 1, minWidth: "280px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "var(--bm-green)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M6 21v-1a6 6 0 0 1 12 0v1" />
                      <path d="M19 11l2 2-4 4" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-dark)" }}>Assisted Service</div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-medium)" }}>Personalised matchmaking service</div>
                  </div>
                </div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-dark)", marginBottom: "0.625rem" }}>
                  Find your match <span style={{ color: "var(--bm-orange)" }}>10x faster</span>
                </h2>
                <p style={{ fontSize: "0.9375rem", color: "var(--text-medium)", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                  Personalized matchmaking service through expert Relationship Managers who shortlist profiles on your behalf.
                </p>
                <Link
                  href="/membership"
                  className="btn btn-primary"
                  style={{ display: "inline-flex" }}
                >
                  Know More
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* Right — model image */}
              <div style={{ flexShrink: 0 }}>
                <img
                  src="https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1"
                  alt="Relationship Manager"
                  style={{
                    width: "260px",
                    height: "320px",
                    objectFit: "cover",
                    objectPosition: "top",
                    borderRadius: "var(--radius-xl)",
                    display: "block",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =================== LATEST PROFILES =================== */}
        <GuestLatestProfiles />

        {/* =================== HOW IT WORKS =================== */}
        <section style={{ background: "var(--bg-page)", padding: "3rem 0" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 900, color: "var(--text-dark)", marginBottom: "0.375rem" }}>
                How It Works
              </h2>
              <p style={{ fontSize: "0.9375rem", color: "var(--text-medium)" }}>
                Find your Tamil match in 3 simple steps
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
              {[
                {
                  step: "1",
                  title: "Register Free",
                  desc: "Create your profile in under 5 minutes. Basic details, preferences, and a photo.",
                  icon: (
                    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="var(--bm-green)" strokeWidth="1.8">
                      <rect x="8" y="6" width="32" height="38" rx="4" />
                      <line x1="16" y1="18" x2="32" y2="18" />
                      <line x1="16" y1="25" x2="32" y2="25" />
                      <line x1="16" y1="32" x2="24" y2="32" />
                      <circle cx="34" cy="36" r="6" fill="var(--bm-green)" stroke="none" />
                      <path d="M31 36l2 2 4-3" stroke="white" strokeWidth="1.5" />
                    </svg>
                  ),
                },
                {
                  step: "2",
                  title: "Search & Match",
                  desc: "Browse 25 Lakh+ verified Tamil profiles. Use smart filters to find your ideal match.",
                  icon: (
                    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="var(--bm-green)" strokeWidth="1.8">
                      <circle cx="20" cy="20" r="12" />
                      <line x1="29" y1="29" x2="40" y2="40" />
                      <line x1="14" y1="20" x2="26" y2="20" />
                      <line x1="20" y1="14" x2="20" y2="26" />
                    </svg>
                  ),
                },
                {
                  step: "3",
                  title: "Connect & Meet",
                  desc: "Send interest, chat after matching, and take the next step toward a lifelong bond.",
                  icon: (
                    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="var(--bm-green)" strokeWidth="1.8">
                      <path d="M12 20c0-8 4-14 12-14s12 6 12 14c0 6-4 12-12 16C16 32 12 26 12 20z" />
                      <circle cx="24" cy="20" r="4" fill="var(--bm-green)" stroke="none" />
                    </svg>
                  ),
                },
              ].map((step) => (
                <div
                  key={step.step}
                  style={{
                    background: "#fff",
                    border: "1px solid var(--border-light)",
                    borderRadius: "var(--radius-xl)",
                    padding: "1.5rem",
                    textAlign: "center",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.875rem" }}>
                    {step.icon}
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "var(--primary)",
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      lineHeight: "24px",
                      textAlign: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {step.step}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)", marginBottom: "0.375rem" }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-medium)", lineHeight: 1.55 }}>
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================== SUCCESS STORIES =================== */}
        <section style={{ background: "#fff", borderTop: "1px solid var(--border-light)", padding: "3rem 0" }}>
          <div className="container">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-dark)", margin: 0 }}>
                  Success Stories
                </h2>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-medium)", marginTop: "2px" }}>
                  Real Tamil couples who found their match
                </p>
              </div>
              <Link
                href="/success-stories"
                style={{ fontSize: "0.875rem", color: "var(--primary)", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {SUCCESS_STORIES.map((story) => (
                <div
                  key={story.id}
                  style={{
                    background: "#fff",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-xl)",
                    overflow: "hidden",
                  }}
                >
                  {/* Photos */}
                  <div style={{ display: "flex", height: "140px" }}>
                    <img
                      src={story.brideImg}
                      alt={story.bride}
                      style={{ width: "50%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                    />
                    <img
                      src={story.groomImg}
                      alt={story.groom}
                      style={{ width: "50%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                    />
                  </div>
                  {/* Content */}
                  <div style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)" }}>
                        {story.bride} &amp; {story.groom}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{story.married}</div>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 600, marginBottom: "0.5rem" }}>
                      {story.community} • {story.city}
                    </div>
                    <p style={{ fontSize: "0.8125rem", color: "var(--text-medium)", lineHeight: 1.55 }}>
                      &ldquo;{story.text}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================== MEMBERSHIP CTA =================== */}
        <section
          style={{
            background: "var(--gradient-hero)",
            padding: "2.5rem 0",
          }}
        >
          <div className="container">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
              <div style={{ color: "#fff" }}>
                <div style={{ fontSize: "1.25rem", fontWeight: 900, marginBottom: "0.25rem" }}>
                  Ready to find your perfect Tamil match?
                </div>
                <div style={{ fontSize: "0.9375rem", opacity: 0.85 }}>
                  Join 25 Lakh+ Tamil singles. Register free today.
                </div>
              </div>
              <Link
                href="/register"
                className="btn"
                style={{
                  background: "#fff",
                  color: "var(--primary)",
                  padding: "0.75rem 2rem",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Register Free
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
