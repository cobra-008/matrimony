"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PlanTabs from "@/components/ui/PlanTabs";
import { useAuth } from "@/context/AuthContext";
import { getDailyRecommendations, sendInterest, shortlistProfile, type RegisteredUser } from "@/lib/auth-store";
import Link from "next/link";
import toast from "react-hot-toast";

// ── Countdown timer until midnight ────────────────────────────────────
function useCountdown() {
  const [timeLeft, setTimeLeft] = useState("");
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
  return timeLeft;
}

// ── Placeholder photos ────────────────────────────────────────────────
const MALE_PHOTOS = [
  "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400",
];
const FEMALE_PHOTOS = [
  "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1138903/pexels-photo-1138903.jpeg?auto=compress&cs=tinysrgb&w=400",
];

function getPhoto(p: RegisteredUser, idx: number): string {
  if (p.photoUrl) return p.photoUrl;
  return p.gender === "female" ? FEMALE_PHOTOS[idx % 5] : MALE_PHOTOS[idx % 5];
}

// ── Skeleton card ─────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ background: "#fff", borderRadius: "8px", overflow: "hidden", border: "1px solid #e8e8e8" }}>
      <div style={{ width: "100%", paddingBottom: "120%", background: "#f0f0f0", animation: "pulse 1.5s ease-in-out infinite" }} />
      <div style={{ padding: "0.75rem" }}>
        <div style={{ width: "70%", height: "14px", background: "#f0f0f0", borderRadius: "4px", marginBottom: "6px", animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ width: "50%", height: "12px", background: "#f0f0f0", borderRadius: "4px", animation: "pulse 1.5s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

// ── Profile Card ──────────────────────────────────────────────────────
function RecommendationCard({
  profile,
  idx,
  onSendInterest,
  onShortlist,
}: {
  profile: RegisteredUser;
  idx: number;
  onSendInterest: () => void;
  onShortlist: () => void;
}) {
  const photo = getPhoto(profile, idx);
  const age = profile.dob
    ? Math.floor((Date.now() - new Date(profile.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : 0;

  const info = [
    age > 0 ? `${age} Yrs` : null,
    profile.height,
  ].filter(Boolean).join(", ");

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #e8e8e8",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)")}
    >
      {/* Photo */}
      <Link href={`/profile/${profile.id}`} style={{ display: "block", position: "relative" }}>
        <img
          src={photo}
          alt={profile.name}
          style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", objectPosition: "top", display: "block" }}
        />
        {/* Shortlist */}
        <button
          onClick={(e) => { e.preventDefault(); onShortlist(); }}
          style={{
            position: "absolute", top: "8px", right: "8px",
            width: "30px", height: "30px",
            background: "rgba(255,255,255,0.9)",
            border: "none", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", backdropFilter: "blur(4px)",
          }}
          title="Shortlist"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B1A2A" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
          </svg>
        </button>
      </Link>

      {/* Info */}
      <div style={{ padding: "0.75rem" }}>
        <Link
          href={`/profile/${profile.id}`}
          style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#111", textDecoration: "none", display: "block", marginBottom: "2px" }}
        >
          {profile.name}
        </Link>
        <p style={{ fontSize: "0.8125rem", color: "#777", margin: "0 0 0.625rem" }}>{info || "Details not set"}</p>

        {/* Send Interest */}
        <button
          onClick={onSendInterest}
          style={{
            width: "100%",
            padding: "0.375rem",
            background: "#6B1A2A",
            color: "#fff",
            border: "none",
            borderRadius: "20px",
            fontSize: "0.8125rem",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          Send Interest
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function DailyRecsPage() {
  const { user } = useAuth();
  const timeLeft = useCountdown();
  const [profiles, setProfiles] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const recs = await getDailyRecommendations(user.id, user.gender);
    setProfiles(recs);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) load();
  }, [user?.id]);

  const handleSendInterest = async (p: RegisteredUser) => {
    if (!user) { toast.error("Please login"); return; }
    const { error } = await sendInterest(user.id, p.id);
    if (error) { toast.error("Already sent or error occurred"); return; }
    toast.success(`Interest sent to ${p.name}!`);
  };

  const handleShortlist = async (p: RegisteredUser) => {
    if (!user) { toast.error("Please login"); return; }
    await shortlistProfile(user.id, p.id);
    toast.success(`${p.name} shortlisted!`);
  };

  return (
    <>
      <Navbar />
      <PlanTabs activeTab="regular" />

      <main style={{ background: "#f2f2f2", minHeight: "100vh", padding: "1.25rem 0 3rem" }}>
        <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "0 1rem" }}>

          {/* Heading row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#111", margin: "0 0 4px" }}>
                Daily Recommendations
              </h1>
              <p style={{ fontSize: "0.875rem", color: "#888", margin: 0 }}>
                Recommended matches for today
              </p>
            </div>

            {/* Countdown badge */}
            <div
              style={{
                background: "#2e7d32",
                color: "#fff",
                padding: "0.375rem 0.875rem",
                borderRadius: "6px",
                fontSize: "0.8125rem",
                fontWeight: 700,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <span style={{ fontSize: "0.625rem", fontWeight: 500, letterSpacing: "0.03em", marginBottom: "1px" }}>
                Time left to view
              </span>
              {timeLeft}
            </div>
          </div>

          {/* Info banner */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "0.875rem 1.125rem",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B1A2A" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p style={{ fontSize: "0.8125rem", color: "#555", margin: 0 }}>
              These recommendations are refreshed every day at midnight and are based on your profile preferences.
            </p>
          </div>

          {/* Grid of recommendations */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))",
              gap: "1rem",
            }}
          >
            {loading
              ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
              : profiles.length === 0
              ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    background: "#fff",
                    borderRadius: "8px",
                    padding: "4rem 2rem",
                    textAlign: "center",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <p style={{ fontWeight: 700, color: "#555", marginBottom: "0.5rem" }}>No recommendations yet</p>
                  <p style={{ color: "#aaa", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
                    Complete your profile to get personalized daily recommendations.
                  </p>
                  <Link
                    href="/profile/edit"
                    style={{
                      display: "inline-block",
                      padding: "0.5rem 1.5rem",
                      background: "#6B1A2A", color: "#fff",
                      borderRadius: "20px", textDecoration: "none",
                      fontWeight: 700, fontSize: "0.875rem",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    Complete Profile
                  </Link>
                </div>
              )
              : profiles.map((p, idx) => (
                <RecommendationCard
                  key={p.id}
                  profile={p}
                  idx={idx}
                  onSendInterest={() => handleSendInterest(p)}
                  onShortlist={() => handleShortlist(p)}
                />
              ))
            }
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
