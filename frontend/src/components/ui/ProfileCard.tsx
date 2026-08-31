"use client";

import Link from "next/link";
import { CheckCircle, MapPin, Briefcase, GraduationCap, Heart, BookmarkPlus, MessageCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

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

// Fallback photos
const FEMALE_PHOTOS = [
  "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
];
const MALE_PHOTOS = [
  "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
];

function getPhoto(profile: ProfileData): string {
  if (profile.photoUrl) return profile.photoUrl;
  const idx = parseInt(profile.id.replace(/\D/g, ""), 10) % 3;
  return profile.gender === "male" ? MALE_PHOTOS[idx] : FEMALE_PHOTOS[idx];
}

export default function ProfileCard({ profile, variant = "full" }: ProfileCardProps) {
  const [interested, setInterested] = useState(false);
  const [shortlisted, setShortlisted] = useState(false);

  const photo = getPhoto(profile);

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
        }}
      >
        <Link href={`/profile/${profile.id}`} style={{ flexShrink: 0, textDecoration: "none" }}>
          <img
            src={photo}
            alt={profile.name}
            style={{
              width: "64px",
              height: "72px",
              objectFit: "contain",
              background: "#F8F0F0",
              borderRadius: "var(--radius-md)",
              display: "block",
            }}
          />
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <Link
              href={`/profile/${profile.id}`}
              style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)", textDecoration: "none" }}
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
            onClick={() => { setInterested((v) => !v); toast.success(interested ? "Interest withdrawn" : "Interest sent!"); }}
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
      }}
    >
      {/* Photo area */}
      <div style={{ position: "relative", height: "240px", overflow: "hidden", background: "#F8F0F0" }}>
        <Link href={`/profile/${profile.id}`}>
          <img
            src={photo}
            alt={profile.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </Link>

        {/* Online badge */}
        {profile.isOnline && (
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              background: "#22C55E",
              color: "#fff",
              fontSize: "0.6875rem",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "var(--radius-full)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
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
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "var(--primary)",
              color: "#fff",
              fontSize: "0.6875rem",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "var(--radius-full)",
            }}
          >
            Premium
          </div>
        )}

        {/* Match score */}
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            background: "rgba(255,255,255,0.95)",
            border: "1.5px solid var(--success)",
            borderRadius: "var(--radius-md)",
            padding: "2px 7px",
            fontSize: "0.6875rem",
            fontWeight: 700,
            color: "var(--success)",
          }}
        >
          {profile.compatibilityScore}% Match
        </div>
      </div>

      {/* Info section */}
      <div style={{ padding: "1rem" }}>
        {/* Name + Verified */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "2px" }}>
          <Link
            href={`/profile/${profile.id}`}
            style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-dark)", textDecoration: "none" }}
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
              fontSize: "0.6875rem",
              fontWeight: 600,
              color: "var(--success)",
              background: "var(--success-light)",
              padding: "2px 8px",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {profile.religion} • {profile.community}
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "0.5rem", borderTop: "1px solid var(--border-light)", paddingTop: "0.625rem" }}>
          <button
            onClick={() => { setInterested((v) => !v); toast.success(interested ? "Interest withdrawn" : `Interest sent to ${profile.name}`); }}
            aria-label={interested ? "Withdraw interest" : `Send interest to ${profile.name}`}
            aria-pressed={interested}
            style={{
              flex: 1,
              padding: "0.5rem",
              background: interested ? "var(--primary)" : "#fff",
              border: "1.5px solid var(--primary)",
              color: interested ? "#fff" : "var(--primary)",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontSize: "0.8125rem",
              fontWeight: 700,
              fontFamily: "var(--font-sans)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              transition: "background 0.15s, color 0.15s",
              minHeight: "44px",
            }}
          >
            <Heart size={15} style={{ fill: interested ? "white" : "none" }} />
            {interested ? "Interested" : "Interest"}
          </button>

          <button
            onClick={() => { setShortlisted((v) => !v); toast.success(shortlisted ? "Removed from shortlist" : "Added to shortlist"); }}
            aria-label={shortlisted ? "Remove from shortlist" : "Add to shortlist"}
            aria-pressed={shortlisted}
            style={{
              flex: 1,
              padding: "0.5rem",
              background: shortlisted ? "var(--success)" : "#fff",
              border: "1.5px solid var(--success)",
              color: shortlisted ? "#fff" : "var(--success)",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontSize: "0.8125rem",
              fontWeight: 700,
              fontFamily: "var(--font-sans)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              transition: "background 0.15s, color 0.15s",
              minHeight: "44px",
            }}
          >
            <BookmarkPlus size={15} />
            {shortlisted ? "Saved" : "Shortlist"}
          </button>

          <Link
            href={`/profile/${profile.id}`}
            style={{
              flex: 1,
              padding: "0.5rem",
              background: "#fff",
              border: "1.5px solid var(--border-color)",
              color: "var(--text-medium)",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontSize: "0.8125rem",
              fontWeight: 700,
              fontFamily: "var(--font-sans)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              textDecoration: "none",
              minHeight: "44px",
            }}
          >
            <MessageCircle size={15} />
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
