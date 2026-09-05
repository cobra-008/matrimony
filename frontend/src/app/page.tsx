"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ChevronDown, ArrowRight, CheckCircle, Shield, Users, Star,
  Crown, Camera, Briefcase, FileText, MapPin, Heart,
  Users2, Sparkles, Eye, Search, User, Settings2, Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import ProfileCard from "@/components/ui/ProfileCard";
import { PROFILE_FOR_OPTIONS } from "@/data/matrimony-data";
import { fetchMatchProfiles, fetchLatestProfiles, type RegisteredUser } from "@/lib/auth-store";
import { supabase } from "@/lib/supabase";

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


// Stats — honest, credible
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
        <rect x="8" y="14" width="32" height="24" rx="3" />
        <path d="M16 14V10a8 8 0 0116 0v4" />
        <circle cx="24" cy="26" r="3" />
      </svg>
    ),
    value: "Free",
    label: "Register & browse profiles",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="#3D7A28" strokeWidth="1.8">
        <path d="M24 6 L28 18 L42 18 L30 26 L35 40 L24 32 L13 40 L18 26 L6 18 L20 18 Z" />
      </svg>
    ),
    value: "Tamil",
    label: "Community focused matrimony",
  },
];

// Profile matches preview — loaded dynamically from DB
const PREVIEW_PROFILES: RegisteredUser[] = [];

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
    <div style={{ background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", overflow: "hidden", boxShadow: "var(--shadow-lg)", width: "100%", maxWidth: "380px" }}>
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
  const [matchCounts, setMatchCounts] = useState({
    allMatches: 0,
    newMatches: 0,
    whoViewedYou: 0,
    whoShortlistedYou: 0,
    profilesYouViewed: 0,
    shortlistedByYou: 0,
  });

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
    const {
      getDailyRecommendations, fetchMatchProfiles, getViewedMe, getShortlistedMe,
      getViewedByMe, getShortlistedProfiles, getNewlyJoined,
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    } = require("@/lib/auth-store");
    const opp = user.gender === "male" ? "female" : user.gender === "female" ? "male" : null;

    getDailyRecommendations(user.id, user.gender)
      .then((data: RegisteredUser[]) => setDailyRecs(data.slice(0, 10)))
      .catch(() => setDailyRecs([]))
      .finally(() => setLoadingRecs(false));

    // Load counts
    Promise.all([
      fetchMatchProfiles(user, user.gender),
      getNewlyJoined(user.id, opp),
      getViewedMe(user.id, opp),
      getShortlistedMe(user.id, opp),
      getViewedByMe(user.id, opp),
      getShortlistedProfiles(user.id),
    ]).then(([all, newM, viewedMe, shortlistedMe, viewedByMe, shortlisted]: RegisteredUser[][]) => {
      setMatchCounts({
        allMatches: all.length,
        newMatches: newM.length,
        whoViewedYou: viewedMe.length,
        whoShortlistedYou: shortlistedMe.length,
        profilesYouViewed: viewedByMe.length,
        shortlistedByYou: shortlisted.length,
      });
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const missing: { label: string; href: string; icon: React.ReactNode }[] = [];
  if (!user.photoUrl) missing.push({ label: "Add Photo", href: "/profile/edit?section=photo", icon: <Camera size={16} color="#6B1A2A" /> });
  if (!user.email || user.email.endsWith("@etm.app")) missing.push({ label: "Add Email", href: "/profile/edit?section=contact", icon: <Mail size={16} color="#6B1A2A" /> });
  if (!user.education && !user.occupation) missing.push({ label: "Professional Details", href: "/profile/edit?section=professional", icon: <Briefcase size={16} color="#6B1A2A" /> });
  if (!user.star && !user.rasi) missing.push({ label: "Horoscope Details", href: "/profile/edit?section=religion", icon: <Star size={16} color="#C8973A" /> });
  if (!user.about) missing.push({ label: "About Me", href: "/profile/edit?section=about", icon: <FileText size={16} color="#6B1A2A" /> });
  if (!user.city) missing.push({ label: "Location", href: "/profile/edit?section=location", icon: <MapPin size={16} color="#6B1A2A" /> });
  if (!user.partnerAgeMin || user.partnerAgeMin === 22) missing.push({ label: "Set Partner Preferences", href: "/settings?section=preferences", icon: <Heart size={16} color="#C8973A" /> });

  const totalFields = 10;
  const pct = Math.round(((totalFields - missing.length) / totalFields) * 100);

  const profileCode = `ETM${user.id.replace(/-/g, "").slice(0, 7).toUpperCase()}`;
  const userPhoto = user.photoUrl || null;

  // Match stat tiles
  const STAT_TILES: { label: string; count: number; href: string; icon: React.ReactNode }[] = [
    { label: "All Matches", count: matchCounts.allMatches, href: "/matches", icon: <Users2 size={20} color="#6B1A2A" /> },
    { label: "New Matches", count: matchCounts.newMatches, href: "/matches?tab=newly_joined", icon: <Sparkles size={20} color="#C8973A" /> },
    { label: "Who Viewed You", count: matchCounts.whoViewedYou, href: "/matches?tab=viewed_you", icon: <Eye size={20} color="#6B1A2A" /> },
    { label: "Who Shortlisted You", count: matchCounts.whoShortlistedYou, href: "/matches?tab=shortlisted_you", icon: <Star size={20} color="#C8973A" fill="#C8973A" /> },
    { label: "Profiles You Viewed", count: matchCounts.profilesYouViewed, href: "/matches?tab=viewed_by_you", icon: <Search size={20} color="#6B1A2A" /> },
    { label: "Shortlisted By You", count: matchCounts.shortlistedByYou, href: "/shortlisted", icon: <Heart size={20} color="#6B1A2A" /> },
  ];

  // Profile completion banner (shown once after registration if profile < 80%)
  const showCompletionBanner = pct < 80;

  return (
    <div style={{ background: "#FFF8F0", minHeight: "100vh" }}>
      <Navbar />

      {/* Profile Completion Banner */}
      {showCompletionBanner && (
        <div style={{
          background: "linear-gradient(90deg, #6B1A2A 0%, #9B2D42 100%)",
          color: "#fff",
          padding: "0.75rem 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          flexWrap: "wrap",
          textAlign: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 700 }}>
              ✨ Your profile is {pct}% complete.
            </span>
            <span style={{ fontSize: "0.8125rem", opacity: 0.9 }}>
              Complete your profile to get better matches!
            </span>
          </div>
          <a
            href="/profile/edit"
            style={{
              background: "#fff",
              color: "#6B1A2A",
              padding: "0.375rem 1rem",
              borderRadius: "20px",
              fontWeight: 700,
              fontSize: "0.8125rem",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Complete Profile →
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 899px) {
          .dashboard-sidebar { display: none !important; }
          .dashboard-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dash-main-wrap { padding: 0.875rem 0.75rem !important; }
        }
        @media (min-width: 900px) {
          .dashboard-sidebar { display: block !important; }
          .dashboard-stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>

      <div
        className="dash-main-wrap"
        style={{
          maxWidth: "1060px",
          margin: "0 auto",
          padding: "1.25rem 1rem",
          display: "flex",
          gap: "1.125rem",
          alignItems: "flex-start",
        }}
      >
        {/* ── LEFT SIDEBAR — hidden on mobile, bottom nav handles navigation ── */}
        <aside
          className="dashboard-sidebar"
          style={{
            width: "230px",
            flexShrink: 0,
            background: "#fff",
            border: "1px solid #E8D5B7",
            borderRadius: "6px",
            overflow: "hidden",
            position: "sticky",
            top: "80px",
            maxHeight: "calc(100vh - 90px)",
            overflowY: "auto",
          }}
        >
          {/* Avatar + name */}
          <div style={{ padding: "1.25rem 1rem 1rem", textAlign: "center", borderBottom: "1px solid #F2E8D6" }}>
              <div style={{ position: "relative", display: "inline-block", marginBottom: "0.75rem" }}>
                <div
                  style={{
                    width: "72px", height: "72px", borderRadius: "50%",
                    border: "2px solid #E8D5B7",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden", background: userPhoto ? "transparent" : "var(--primary-light)",
                  }}
                >
                  {userPhoto
                    ? <img src={userPhoto} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                    : <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" opacity="0.6"><circle cx="12" cy="7" r="5"/><path d="M4 21c0-4.5 3.6-8 8-8s8 3.5 8 8"/></svg>
                  }
                </div>
              <Link
                href="/profile/edit?section=photo"
                style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: "22px", height: "22px",
                  background: "#fff", border: "1px solid #E8D5B7",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
                title="Change photo"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6B1A2A" strokeWidth="2">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </Link>
            </div>

            <div style={{ fontWeight: 700, fontSize: "1rem", color: "#111", marginBottom: "2px" }}>{user.name}</div>
            <div style={{ fontSize: "0.75rem", color: "#5C3040", marginBottom: "4px" }}>Elite Tamil Matrimony</div>
            <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#2D1018", marginBottom: "4px" }}>{profileCode}</div>
            {/* Premium badge — only for paid members */}
            {user.isPremium ? (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "linear-gradient(135deg, #C8973A, #E8C060)",
                color: "#fff", borderRadius: "20px",
                padding: "2px 10px", fontSize: "0.6875rem", fontWeight: 700,
              }}>
                <Crown size={11} fill="#fff" strokeWidth={0} /> Premium Member
              </div>
            ) : (
              <div style={{ fontSize: "0.75rem", color: "#5C3040", fontWeight: 400 }}>Free member</div>
            )}
          </div>

          {/* Upgrade CTA — only for free members */}
          {!user.isPremium && (
            <div
              style={{
                margin: "0.875rem 0.875rem 0",
                background: "linear-gradient(135deg, #FBF6EC, #F5EDDC)",
                border: "1px solid #E0C070",
                borderRadius: "6px",
                padding: "0.75rem",
              }}
            >
              <p style={{ fontSize: "0.75rem", color: "#6B1A2A", margin: "0 0 0.5rem", lineHeight: 1.4, fontWeight: 600 }}>
                Upgrade to call or message matches
              </p>
              <Link
                href="/membership"
                style={{
                  display: "block", textAlign: "center",
                  padding: "0.375rem",
                  background: "#6B1A2A", color: "#fff",
                  borderRadius: "20px", textDecoration: "none",
                  fontSize: "0.8125rem", fontWeight: 700,
                  fontFamily: "var(--font-sans)",
                }}
              >
                Upgrade now
              </Link>
            </div>
          )}

          {/* Switch account */}
          <div style={{ margin: "0.875rem 0 0", padding: "0.625rem 0.875rem", borderTop: "1px solid #F2E8D6" }}>
            <Link
              href="/login"
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                textDecoration: "none",
                fontFamily: "var(--font-sans)", fontSize: "0.875rem",
                color: "#2D1018", fontWeight: 400,
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
            {([
              { href: "/profile/edit", icon: <User size={15} color="#6B1A2A" />, label: "Edit profile" },
              { href: "/settings", icon: <Settings2 size={15} color="#6B1A2A" />, label: "Edit preferences" },
              { href: "/shortlisted", icon: <Heart size={15} color="#6B1A2A" />, label: "Shortlisted" },
              { href: "/interests", icon: <Mail size={15} color="#6B1A2A" />, label: "Interests" },
            ] as { href: string; icon: React.ReactNode; label: string }[]).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "0.5rem 0.875rem",
                  color: "#2D1018", textDecoration: "none",
                  fontSize: "0.875rem", fontWeight: 400,
                  borderTop: "1px solid #F2E8D6",
                }}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </div>
        </aside>

        {/* ── RIGHT MAIN ──────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* ── Match Stat Tiles ── */}
          <div
            className="dashboard-stats-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            {STAT_TILES.map((tile) => (
              <Link
                key={tile.href}
                href={tile.href}
                style={{
                  background: "#fff",
                  border: "1px solid #E8D5B7",
                  borderRadius: "6px",
                  padding: "0.75rem 0.875rem",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  transition: "box-shadow 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#6B1A2A";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(107,26,42,0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#E8D5B7";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {tile.icon}
                <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#6B1A2A", lineHeight: 1 }}>
                  {tile.count}
                </span>
                <span style={{ fontSize: "0.6875rem", color: "#4A2030", lineHeight: 1.3 }}>{tile.label}</span>
              </Link>
            ))}
          </div>

          {/* Complete Your Profile OR 100% Complete banner */}
          {missing.length > 0 ? (
            <div
              style={{
                background: "#fff",
                border: "1px solid #E8D5B7",
                borderRadius: "6px",
                padding: "1rem 1.125rem",
                marginBottom: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.625rem" }}>
                <div>
                  <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#111", margin: "0 0 3px" }}>Complete Your Profile</h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.75rem", color: "#5C3040" }}>Profile completeness score {pct}%</span>
                    <div style={{ width: "80px", height: "6px", background: "#E8D5B7", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "#C8973A", borderRadius: "3px" }} />
                    </div>
                  </div>
                </div>
                <Link href="/profile/edit" style={{ fontSize: "0.75rem", color: "#6B1A2A", fontWeight: 600, textDecoration: "none" }}>
                  Edit all &rarr;
                </Link>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {missing.map((m) => (
                  <Link
                    key={m.href}
                    href={m.href}
                    style={{
                      display: "flex", alignItems: "center", gap: "5px",
                      padding: "0.5rem 0.875rem",
                      background: m.label === "Set Partner Preferences" ? "#FBF6EC" : "#fff",
                      border: m.label === "Set Partner Preferences" ? "1px solid #E0C070" : "1px solid #E8D5B7",
                      borderRadius: "8px",
                      color: m.label === "Set Partner Preferences" ? "#6B1A2A" : "#333",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      fontWeight: m.label === "Set Partner Preferences" ? 700 : 500,
                    }}
                  >
                    {m.icon}
                    {m.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div
              style={{
                background: "linear-gradient(135deg, #E8F5E9, #F1F8E9)",
                border: "1.5px solid #A5D6A7",
                borderRadius: "6px",
                padding: "1rem 1.25rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%",
                background: "#2E7D32", display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0,
              }}>
                <CheckCircle size={24} color="#fff" fill="#2E7D32" stroke="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#1B5E20", fontSize: "1rem" }}>
                  🎉 Profile 100% Complete!
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#388E3C", marginTop: "2px" }}>
                  Your profile is fully set up. You&apos;re getting maximum visibility to matches!
                </div>
              </div>
              <Link href={`/profile/${user.id}`} style={{
                padding: "0.4375rem 1rem", background: "#2E7D32",
                color: "#fff", borderRadius: "20px", fontWeight: 700,
                fontSize: "0.8125rem", textDecoration: "none", flexShrink: 0,
              }}>
                View Profile
              </Link>
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
    // Load recent registered profiles from DB
    fetchLatestProfiles(12)
      .then((data) => setProfiles(data || []))
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
          <>
            <div
              className="guest-profiles-scroll"
              style={{
                display: "flex",
                gap: "1rem",
                overflowX: "auto",
                paddingBottom: "0.75rem",
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {profiles.map((profile) => {
                const age = profile.dob ? Math.floor((Date.now() - new Date(profile.dob).getTime()) / (365.25*24*60*60*1000)) : 0;
                return (
                  <Link
                    key={profile.id}
                    href="/register"
                    style={{
                      textDecoration: "none",
                      minWidth: "170px",
                      maxWidth: "200px",
                      flex: "0 0 auto",
                      scrollSnapAlign: "start",
                    }}
                  >
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
                            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", background: "#F8F0F0", filter: "blur(18px)", transform: "scale(1.2)" }}
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
            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <Link href="/register" className="btn btn-primary" style={{ display: "inline-flex" }}>
                View All {profiles.length}+ Profiles <ArrowRight size={14} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// ── Guest Success Stories (DB-backed, shown only if stories exist) ─────────────
function GuestSuccessStories() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStories() {
      try {
        const { data, error } = await supabase
          .from("success_stories")
          .select("*")
          .eq("is_visible", true)
          .order("created_at", { ascending: false });
        if (!error && data) {
          setStories(data);
        } else {
          setStories([]);
        }
      } catch {
        setStories([]);
      } finally {
        setLoading(false);
      }
    }
    loadStories();
  }, []);

  if (loading || stories.length === 0) return null;

  return (
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

        <div
          className="success-stories-scroll"
          style={{
            display: "flex",
            gap: "1.25rem",
            overflowX: "auto",
            paddingBottom: "0.5rem",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {stories.map((story) => (
            <div
              key={story.id}
              style={{
                background: "#fff",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                minWidth: "280px",
                maxWidth: "340px",
                flex: "0 0 auto",
                scrollSnapAlign: "start",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {story.photo_url ? (
                <div style={{ height: "160px", width: "100%", overflow: "hidden", background: "#f0f0f0" }}>
                  <img src={story.photo_url} alt={story.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <div style={{ height: "100px", background: "var(--gradient-hero)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Heart size={32} className="fill-white text-white opacity-80" />
                </div>
              )}
              <div style={{ padding: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)" }}>
                    {story.name}
                  </div>
                  {story.married && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{story.married}</div>}
                </div>
                {story.city && (
                  <div style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 600, marginBottom: "0.5rem" }}>
                    {story.city}
                  </div>
                )}
                <p style={{ fontSize: "0.8125rem", color: "var(--text-medium)", lineHeight: 1.55 }}>
                  &ldquo;{story.story}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
        <style>{`.success-stories-scroll::-webkit-scrollbar{display:none}`}</style>
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
      <main style={{ background: "var(--bg-page)", paddingTop: "72px" }}>

        {/* =================== HERO =================== */}
        <section style={{ background: "var(--bg-page)", padding: "2rem 0 1.5rem" }}>
          <div className="container">
            <div className="hero-inner">
              {/* Left Column: Text + Image (Desktop only for image) */}
              <div className="hero-left">
                <h1 className="hero-text" style={{
                  fontSize: "clamp(1.25rem, 4vw, 2rem)",
                  fontWeight: 900,
                  color: "var(--text-dark)",
                  lineHeight: 1.25,
                  marginBottom: "1.5rem",
                }}>
                  A new{" "}
                  <span style={{ color: "var(--primary)" }}>dedicated platform</span>
                  {" "}for Tamil matrimony
                </h1>
                
                {/* Illustration — hidden on mobile */}
                <div className="hide-mobile" style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                  <img
                    src="/wedding-couple.png"
                    alt="Tamil wedding couple illustration"
                    className="animate-fade-in hero-image"
                    style={{
                      maxWidth: "320px",
                      width: "100%",
                      borderRadius: "16px",
                      filter: "drop-shadow(0 8px 32px rgba(107,26,42,0.15))",
                    }}
                  />
                </div>
              </div>

              {/* Right Column: Register form */}
              <div className="hero-right">
                <div className="hero-form-wrap" style={{ display: "flex", justifyContent: "center" }}>
                  <RegisterForm />
                </div>
              </div>
            </div>

            <style>{`
              .hero-inner {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
              }
              .hero-text {
                text-align: center;
              }
              @media (min-width: 992px) {
                .hero-inner {
                  flex-direction: row;
                  align-items: center;
                  justify-content: space-between;
                }
                .hero-left {
                  flex: 1;
                  padding-right: 2rem;
                }
                .hero-right {
                  flex: 1;
                }
                .hero-text {
                  text-align: left;
                }
                .hero-form-wrap {
                  justify-content: flex-end;
                }
                .hero-image {
                  margin-left: 0;
                  margin-right: auto;
                }
              }
            `}</style>
          </div>
        </section>

        {/* =================== STATS BAR =================== */}
        <section style={{ background: "#fff", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)", padding: "1.25rem 0" }}>
          <div className="container">
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "1rem",
              alignItems: "center",
            }}>
              {STATS.map((stat) => (
                <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div className="stat-icon-wrap" style={{ flexShrink: 0 }}>{stat.icon}</div>
                  <div>
                    <div style={{ fontSize: "1.125rem", fontWeight: 900, color: "var(--text-dark)", lineHeight: 1.1 }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-light)", marginTop: "2px" }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
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
                  desc: "Browse verified Tamil profiles. Use smart filters to find your ideal match.",
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

        {/* =================== SUCCESS STORIES (DB-backed) =================== */}
        <GuestSuccessStories />

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
                  Register free today and start your journey.
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
