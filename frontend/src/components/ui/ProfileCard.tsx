"use client";

import Link from "next/link";
import { CheckCircle, MapPin, Briefcase, GraduationCap, Heart, BookmarkPlus, MessageCircle, Lock } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { sendInterest } from "@/lib/auth-store";
import { useRouter } from "next/navigation";

export interface ProfileData {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation: string;
  education: string;
  religion: string;
  community: string;
  compatibilityScore: number;
  isVerified: boolean;
  isOnline: boolean;
  isPremium: boolean;
  photoUrl?: string;
  matchReasons: string[];
  gender?: "male" | "female";
  // Extended fields (optional, used in full profile views)
  height?: string;
  income?: string;
  subCaste?: string;
  maritalStatus?: string;
  motherTongue?: string;
  mobile?: string;
  photos?: any[];
}

interface ProfileCardProps {
  profile: ProfileData;
  variant?: "full" | "compact";
}

// SVG Avatar — no stock photos
function GenderAvatar({ gender, width = 64, height = 72, blur = false }: { gender?: string; width?: number; height?: number; blur?: boolean }) {
  const isFemale = gender === "female";
  return (
    <div style={{
      width: `${width}px`, height: `${height}px`,
      background: isFemale ? "#F5E6E9" : "#EAF0FA",
      borderRadius: "var(--radius-md)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      filter: blur ? "blur(6px)" : "none",
    }}>
      {isFemale ? (
        <svg width={Math.round(width * 0.65)} height={Math.round(height * 0.65)} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="7" r="4.5" fill="#C8973A" opacity="0.7"/>
          <path d="M4 21c0-4.5 3.6-8 8-8s8 3.5 8 8" fill="#6B1A2A" opacity="0.3"/>
          <circle cx="12" cy="7" r="4.5" stroke="#6B1A2A" strokeWidth="1.2" fill="none"/>
          <path d="M4 21c0-4.5 3.6-8 8-8s8 3.5 8 8" stroke="#6B1A2A" strokeWidth="1.2" fill="none"/>
        </svg>
      ) : (
        <svg width={Math.round(width * 0.65)} height={Math.round(height * 0.65)} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="7" r="4.5" fill="#C8973A" opacity="0.7"/>
          <path d="M4 21c0-4.5 3.6-8 8-8s8 3.5 8 8" fill="#1A3A6B" opacity="0.2"/>
          <circle cx="12" cy="7" r="4.5" stroke="#1A3A6B" strokeWidth="1.2" fill="none"/>
          <path d="M4 21c0-4.5 3.6-8 8-8s8 3.5 8 8" stroke="#1A3A6B" strokeWidth="1.2" fill="none"/>
        </svg>
      )}
    </div>
  );
}

export default function ProfileCard({ profile, variant = "full" }: ProfileCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [interested, setInterested] = useState(false);
  const [shortlisted, setShortlisted] = useState(false);
  const [sendingInterest, setSendingInterest] = useState(false);

  const isLoggedIn = !!user;
  const photo = profile.photoUrl || null;

  const handleSendInterest = async () => {
    if (!user) {
      toast.error("Please login to send interest");
      router.push("/login");
      return;
    }
    if (interested) {
      setInterested(false);
      toast("Interest withdrawn");
      return;
    }
    setSendingInterest(true);
    const { error } = await sendInterest(user.id, profile.id);
    setSendingInterest(false);
    if (error) {
      toast.error("Failed to send interest");
    } else {
      setInterested(true);
      toast.success(`Interest sent to ${profile.name}!`);
    }
  };

  const handleMessage = () => {
    if (!user) {
      toast.error("Please login to send messages");
      router.push("/login");
      return;
    }
    router.push(`/messages?partnerId=${profile.id}`);
  };

  if (variant === "compact") {
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          gap: "0.875rem",
          padding: "0.75rem",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Link href={isLoggedIn ? `/profile/${profile.id}` : "/login"} style={{ flexShrink: 0, textDecoration: "none" }}>
          <div style={{ position: "relative" }}>
            {photo
              ? <img src={photo} alt={profile.name} style={{ width: "64px", height: "72px", objectFit: "contain", background: "#F8F0F0", borderRadius: "var(--radius-md)", display: "block", filter: isLoggedIn ? "none" : "blur(6px)" }} />
              : <GenderAvatar gender={profile.gender} width={64} height={72} blur={!isLoggedIn} />}
          </div>
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <Link
              href={isLoggedIn ? `/profile/${profile.id}` : "/login"}
              style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)", textDecoration: "none",
                filter: isLoggedIn ? "none" : "blur(4px)", userSelect: isLoggedIn ? "auto" : "none" }}
            >
              {profile.name}
            </Link>
            {profile.isVerified && (
              <CheckCircle size={13} style={{ color: "var(--success)", flexShrink: 0 }} />
            )}
          </div>
          <div style={{ fontSize: "0.8125rem", color: "var(--text-medium)", marginTop: "2px" }}>
            {profile.age} yrs • {profile.community}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
            <MapPin size={11} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>{profile.location}</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-light)", marginTop: "2px" }}>
            {profile.occupation}
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
          <button
            onClick={handleSendInterest}
            style={{
              background: interested ? "var(--primary)" : "#fff",
              border: "1.5px solid var(--primary)",
              color: interested ? "#fff" : "var(--primary)",
              borderRadius: "var(--radius-md)",
              padding: "0.375rem 0.75rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Heart size={12} style={{ fill: interested ? "white" : "none" }} />
            {interested ? "Interested" : "Interest"}
          </button>
        </div>
        {/* Blur overlay for guests */}
        {!isLoggedIn && (
          <div
            onClick={() => router.push("/login")}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(3px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", zIndex: 2,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px",
              background: "#6B1A2A", color: "#fff", padding: "6px 14px",
              borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700 }}>
              <Lock size={12} /> Login to View
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full card — BharatMatrimony style
  return (
    <div
      className="profile-card-hover"
      style={{
        background: "#fff",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Photo area */}
      <div style={{ position: "relative", height: "240px", overflow: "hidden", background: "#F8F0F0" }}>
        <Link href={isLoggedIn ? `/profile/${profile.id}` : "/login"}>
          {photo
            ? <img
                src={photo}
                alt={profile.name}
                style={{
                  width: "100%", height: "100%",
                  objectFit: "contain", display: "block",
                  filter: isLoggedIn ? "none" : "blur(12px)",
                  transform: isLoggedIn ? "none" : "scale(1.05)",
                }}
              />
            : <GenderAvatar gender={profile.gender} width={240} height={240} blur={!isLoggedIn} />}
        </Link>

        {/* Online badge */}
        {profile.isOnline && (
          <div
            style={{
              position: "absolute", top: "8px", left: "8px",
              background: "#22C55E", color: "#fff",
              fontSize: "0.6875rem", fontWeight: 700,
              padding: "2px 8px", borderRadius: "var(--radius-full)",
              display: "flex", alignItems: "center", gap: "4px",
            }}
          >
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#fff" }} />
            Online
          </div>
        )}

        {/* Premium badge */}
        {profile.isPremium && (
          <div
            style={{
              position: "absolute", top: "8px", right: "8px",
              background: "var(--primary)", color: "#fff",
              fontSize: "0.6875rem", fontWeight: 700,
              padding: "2px 8px", borderRadius: "var(--radius-full)",
            }}
          >
            Premium
          </div>
        )}

        {/* Match score */}
        <div
          style={{
            position: "absolute", bottom: "8px", right: "8px",
            background: "rgba(255,255,255,0.95)",
            border: "1.5px solid var(--success)",
            borderRadius: "var(--radius-md)",
            padding: "2px 7px",
            fontSize: "0.6875rem", fontWeight: 700,
            color: "var(--success)",
          }}
        >
          {profile.compatibilityScore}% Match
        </div>

        {/* Login overlay on photo */}
        {!isLoggedIn && (
          <div
            onClick={() => router.push("/login")}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
              background: "rgba(0,0,0,0.6)", color: "#fff",
              padding: "12px 20px", borderRadius: "12px",
              textAlign: "center",
            }}>
              <Lock size={20} />
              <span style={{ fontSize: "0.8125rem", fontWeight: 700 }}>Login to View Profile</span>
            </div>
          </div>
        )}
      </div>

      {/* Info section */}
      <div style={{ padding: "1rem" }}>
        {/* Name + Verified */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "2px" }}>
          <Link
            href={isLoggedIn ? `/profile/${profile.id}` : "/login"}
            style={{
              fontWeight: 700, fontSize: "1rem", color: "var(--text-dark)", textDecoration: "none",
              filter: isLoggedIn ? "none" : "blur(5px)",
              userSelect: isLoggedIn ? "auto" : "none",
            }}
          >
            {profile.name}
          </Link>
          {profile.isVerified && (
            <CheckCircle size={14} style={{ color: "var(--success)", flexShrink: 0 }} />
          )}
        </div>

        {/* Age + Community */}
        <div style={{ fontSize: "0.8125rem", color: "var(--text-medium)", marginBottom: "4px" }}>
          {profile.age} yrs • {profile.community}
        </div>

        {/* Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginBottom: "0.625rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <MapPin size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <span style={{ fontSize: "0.8125rem", color: "var(--text-light)" }}>{profile.location}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Briefcase size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <span style={{ fontSize: "0.8125rem", color: "var(--text-light)" }}>{profile.occupation}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <GraduationCap size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <span style={{ fontSize: "0.8125rem", color: "var(--text-light)" }}>{profile.education}</span>
          </div>
        </div>

        {/* Religion tag */}
        <div style={{ marginBottom: "0.625rem" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.6875rem", fontWeight: 600,
              color: "var(--success)", background: "var(--success-light)",
              padding: "2px 8px", borderRadius: "var(--radius-sm)",
            }}
          >
            {profile.religion} • {profile.community}
          </span>
        </div>

        {/* Action buttons */}
        {isLoggedIn ? (
          <div style={{ display: "flex", gap: "0.5rem", borderTop: "1px solid var(--border-light)", paddingTop: "0.625rem" }}>
            <button
              onClick={handleSendInterest}
              disabled={sendingInterest}
              aria-label={interested ? "Withdraw interest" : `Send interest to ${profile.name}`}
              aria-pressed={interested}
              style={{
                flex: 1, padding: "0.5rem",
                background: interested ? "var(--primary)" : "#fff",
                border: "1.5px solid var(--primary)",
                color: interested ? "#fff" : "var(--primary)",
                borderRadius: "var(--radius-md)",
                cursor: sendingInterest ? "wait" : "pointer",
                fontSize: "0.8125rem", fontWeight: 700,
                fontFamily: "var(--font-sans)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
                transition: "background 0.15s, color 0.15s",
                minHeight: "44px",
              }}
            >
              <Heart size={15} style={{ fill: interested ? "white" : "none" }} />
              {interested ? "Interest Sent ✓" : "Send Interest"}
            </button>

            <button
              onClick={() => { setShortlisted((v) => !v); toast.success(shortlisted ? "Removed from shortlist" : "Added to shortlist"); }}
              aria-label={shortlisted ? "Remove from shortlist" : "Add to shortlist"}
              aria-pressed={shortlisted}
              style={{
                flex: 1, padding: "0.5rem",
                background: shortlisted ? "var(--success)" : "#fff",
                border: "1.5px solid var(--success)",
                color: shortlisted ? "#fff" : "var(--success)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontSize: "0.8125rem", fontWeight: 700,
                fontFamily: "var(--font-sans)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
                transition: "background 0.15s, color 0.15s",
                minHeight: "44px",
              }}
            >
              <BookmarkPlus size={15} />
              {shortlisted ? "Saved" : "Shortlist"}
            </button>

            <button
              onClick={handleMessage}
              style={{
                flex: 1, padding: "0.5rem",
                background: "#fff",
                border: "1.5px solid var(--border-color)",
                color: "var(--text-medium)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontSize: "0.8125rem", fontWeight: 700,
                fontFamily: "var(--font-sans)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
                textDecoration: "none",
                minHeight: "44px",
              }}
            >
              <MessageCircle size={15} />
              Message
            </button>
          </div>
        ) : (
          <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "0.75rem" }}>
            <button
              onClick={() => router.push("/login")}
              style={{
                width: "100%", padding: "0.625rem",
                background: "#6B1A2A", color: "#fff",
                border: "none", borderRadius: "var(--radius-md)",
                fontWeight: 700, fontSize: "0.875rem",
                fontFamily: "var(--font-sans)",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                minHeight: "44px",
              }}
            >
              <Lock size={14} />
              Login to Send Interest
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
