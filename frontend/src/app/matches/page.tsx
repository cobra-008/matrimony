"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Crown, Lock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useMembership } from "@/hooks/useMembership";
import toast from "react-hot-toast";
import Link from "next/link";
import { HEIGHTS } from "@/data/matrimony-data";
import {
  fetchMatchProfiles,
  shortlistProfileWithNotification,
  sendInterestWithNotification,
  getShortlistedProfiles,
  getShortlistedMe,
  getViewedByMe,
  getViewedMe,
  getNewlyJoined,
  getNearbyMatches,
  getWithPhotos,
  getWithHoroscope,
  getSimilarHobbies,
  getMutualMatches,
  getLookingForMe,
  getByEducationPref,
  getByProfessionPref,
  getByLocationPref,
  getNRIMatches,
  getStarMatches,
  getHoroscopeMatches,
  type RegisteredUser,
} from "@/lib/auth-store";

// ── Sidebar section definitions (matching screenshot exactly) ─────────────────
const SIDEBAR = [
  {
    group: null,
    items: [
      {
        id: "your_matches",
        label: "Your Matches",
        sub: "View all the profiles that match\nyour preferences",
      },
    ],
  },
  {
    group: "BASED ON ACTIVITY",
    items: [
      { id: "shortlisted_by_you", label: "Shortlisted by you", sub: "Matches you have shortlisted" },
      { id: "viewed_you", label: "Viewed you", sub: "Matches who have viewed your\nprofile" },
      { id: "shortlisted_you", label: "Shortlisted you", sub: "Matches who have shortlisted your\nprofile" },
      { id: "viewed_by_you", label: "Viewed by you", sub: "Matches you have viewed" },
    ],
  },
  {
    group: "RECENTLY JOINED & NEARBY\nMATCHES",
    items: [
      { id: "newly_joined", label: "Newly Joined", sub: "Matches who joined within the last\n30 days" },
      { id: "nearby_matches", label: "Nearby matches", sub: "Matches near your location" },
    ],
  },
  {
    group: "BASED ON PROFILE DETAILS",
    items: [
      { id: "with_photos", label: "Matches with photos", sub: "Profiles with a photo" },
      { id: "with_horoscope", label: "Matches with horoscope", sub: "Profiles with horoscope details" },
      { id: "similar_hobbies", label: "Similar hobbies", sub: "Profiles who share your hobbies" },
    ],
  },
  {
    group: "BASED ON ASTROLOGICAL\nCOMPATIBILITY",
    items: [
      { id: "star_matches", label: "Star matches", sub: "Profiles with compatible star sign" },
      { id: "horoscope_matches", label: "Horoscope matches", sub: "Profiles with matching horoscope" },
    ],
  },
  {
    group: "MEMBERS LOOKING FOR\nSOMEONE LIKE YOU",
    items: [
      { id: "mutual_matches", label: "Mutual matches", sub: "Profiles matching your preferences,\nand vice versa" },
      { id: "looking_for_you", label: "Looking for you", sub: "Profiles whose preferences match you" },
    ],
  },
  {
    group: "MATCHES BASED ON\nPREFERENCES",
    items: [
      { id: "education_pref", label: "Education preference", sub: "Profiles matching your preferred\neducation" },
      { id: "professional_pref", label: "Professional preference", sub: "Profiles matching your preferred\nprofession" },
      { id: "location_pref", label: "City/location preference", sub: "Profiles in your preferred city or\nstate" },
      { id: "nri_matches", label: "NRI matches", sub: "Profiles from outside India" },
    ],
  },
];

// ── WhatsApp + Phone SVG icons ────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#E8401A" opacity="0.12" />
    <path d="M16.5 13.9c-.3-.15-1.75-.87-2.02-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.48-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" fill="#E8401A" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#25D366" opacity="0.12" />
    <path d="M17.47 6.53A7.26 7.26 0 0 0 12 4.27a7.3 7.3 0 0 0-6.3 10.95L4.27 19.73l4.6-1.21A7.3 7.3 0 0 0 19.73 12a7.24 7.24 0 0 0-2.26-5.47zm-5.47 11.2a6.06 6.06 0 0 1-3.09-.85l-.22-.13-2.28.6.61-2.23-.14-.23a6.08 6.08 0 1 1 5.12 2.84zm3.34-4.55c-.18-.09-1.08-.53-1.24-.59-.17-.06-.29-.09-.41.09-.12.18-.47.59-.58.71-.1.12-.21.14-.4.05-.18-.09-.77-.28-1.47-.91-.54-.48-.91-1.08-1.01-1.26-.11-.18-.01-.28.08-.37.08-.08.18-.21.27-.32.09-.1.12-.18.18-.3.06-.12.03-.23-.01-.32-.05-.09-.41-.99-.56-1.35-.15-.36-.3-.31-.41-.31h-.35c-.12 0-.32.05-.49.23-.17.18-.64.63-.64 1.52 0 .9.66 1.77.75 1.89.09.12 1.29 1.97 3.13 2.76.44.19.78.3 1.04.38.44.14.84.12 1.15.07.35-.05 1.08-.44 1.23-.87.15-.43.15-.79.1-.87-.05-.08-.17-.12-.35-.21z" fill="#25D366" />
  </svg>
);

const BookmarkIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? "#C8973A" : "none"} stroke={filled ? "#C8973A" : "white"} strokeWidth="2">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);

const VerifiedIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#6B1A2A" />
    <polyline points="7 12 10 15 17 9" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Single Profile Card (matching screenshot layout exactly) ──────────────────
function ProfileCard({
  profile,
  index,
  onShortlist,
  onHide,
  onSendInterest,
  shortlisted,
  canMessage = false,
  canViewContact = false,
}: {
  profile: RegisteredUser;
  index: number;
  onShortlist: () => void;
  onHide: () => void;
  onSendInterest: () => void;
  shortlisted?: boolean;
  canMessage?: boolean;
  canViewContact?: boolean;
}) {
  const age = profile.dob
    ? Math.floor((Date.now() - new Date(profile.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : 0;

  // Placeholder photos by gender (used when no photo uploaded)
  // Use more photos and a stable ID-based hash to avoid same photo on consecutive profiles
  const MALE_PHOTOS = [
    "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=400",
  ];
  const FEMALE_PHOTOS = [
    "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/1138903/pexels-photo-1138903.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
  ];
  // Stable hash from profile ID (UUID chars) so same profile always gets same photo
  const idHash = profile.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const photo = profile.photoUrl
    ? profile.photoUrl
    : profile.gender === "male"
    ? MALE_PHOTOS[idHash % MALE_PHOTOS.length]
    : FEMALE_PHOTOS[idHash % FEMALE_PHOTOS.length];

  const profileCode = `ETM${String(index + 1).padStart(3, "0")}`;
  const location = [profile.city, profile.state].filter(Boolean).join(", ") || profile.country || "India";

  // Build attribute string
  const attrs: string[] = [
    age > 0 ? `${age} yrs` : "",
    profile.height || "",
    profile.caste || "",
    profile.education || "",
    profile.occupation || "",
    profile.income ? `₹ ${profile.income}` : "",
    location,
  ].filter(Boolean);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8e8e8",
        borderRadius: "8px",
        overflow: "visible",
        display: "flex",
        flexDirection: "column",
        marginBottom: "14px",
        position: "relative",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
      className="match-card-horizontal"
    >
      {/* LEFT — Photo column */}
      <div style={{ width: "100%", flexShrink: 0, position: "relative" }} className="match-card-photo-wrap">
        <Link href={`/profile/${profile.id}`} style={{ display: "block", lineHeight: 0 }}>
          <img
            src={photo}
            alt={profile.name}
            className="match-card-photo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
              display: "block",
              maxHeight: "340px",
            }}
          />
        </Link>

        {/* Shortlist badge — top left */}
        {shortlisted ? (
          /* Static gold badge when already shortlisted */
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "rgba(200,151,58,0.90)",
              border: "none",
              borderRadius: "3px",
              padding: "3px 7px",
              color: "#fff",
              fontSize: "0.6875rem",
              fontWeight: 700,
            }}
          >
            <BookmarkIcon filled />
            Shortlisted
          </div>
        ) : (
          /* Click to shortlist when not yet saved */
          <button
            onClick={onShortlist}
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "rgba(0,0,0,0.62)",
              border: "none",
              borderRadius: "3px",
              padding: "3px 7px",
              color: "#fff",
              fontSize: "0.6875rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
            }}
          >
            <BookmarkIcon filled={false} />
            Shortlist
          </button>
        )}

        {/* Photo count badge — bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: "6px",
            right: "6px",
            background: "rgba(0,0,0,0.55)",
            color: "#fff",
            fontSize: "0.625rem",
            fontWeight: 700,
            borderRadius: "3px",
            padding: "1px 5px",
          }}
        >
          1/3
        </div>
      </div>

      {/* RIGHT — Info column */}
      <div
        style={{
          flex: 1,
          padding: "1rem 1.125rem 1rem 1.125rem",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Top row: Verified + name / phone+whatsapp */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "2px",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Verified badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginBottom: "2px",
              }}
            >
              <VerifiedIcon />
              <span style={{ fontSize: "0.75rem", color: "#1565C0", fontWeight: 600 }}>
                Verified
              </span>
              {/* Match score badge */}
              {profile.compatibilityScore !== undefined && (
                <span
                  style={{
                    marginLeft: "6px",
                    padding: "1px 7px",
                    borderRadius: "10px",
                    fontSize: "0.6875rem",
                    fontWeight: 800,
                    background:
                      profile.compatibilityScore >= 70 ? "#E8F5E9" :
                      profile.compatibilityScore >= 50 ? "#FBF6EC" : "#F5F5F5",
                    color:
                      profile.compatibilityScore >= 70 ? "#2E7D32" :
                      profile.compatibilityScore >= 50 ? "#C8973A" : "#888",
                    border:
                      profile.compatibilityScore >= 70 ? "1px solid #A5D6A7" :
                      profile.compatibilityScore >= 50 ? "1px solid #E0C070" : "1px solid #ddd",
                  }}
                >
                  {profile.compatibilityScore}% Match
                </span>
              )}
            </div>

            {/* Name */}
            <Link
              href={`/profile/${profile.id}`}
              style={{
                fontSize: "1.125rem",
                fontWeight: 700,
                color: "#111",
                textDecoration: "none",
                display: "block",
                lineHeight: 1.2,
              }}
            >
              {profile.name}
            </Link>

            {/* Profile code + last seen */}
            <div
              style={{
                fontSize: "0.75rem",
                color: "#E8401A",
                marginTop: "2px",
                fontWeight: 500,
              }}
            >
              {profileCode} | Last seen few hour ago
            </div>
          </div>

          {/* Phone + WhatsApp */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexShrink: 0,
              paddingTop: "2px",
            }}
          >
            <button
              onClick={() => toast("Upgrade to call this member")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "3px",
              }}
              title="Call"
            >
              <PhoneIcon />
            </button>
            <button
              onClick={() => toast("Upgrade to WhatsApp this member")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "3px",
              }}
              title="WhatsApp"
            >
              <WhatsAppIcon />
            </button>
          </div>
        </div>

        {/* Attributes line */}
        <p
          style={{
            fontSize: "0.8125rem",
            color: "#444",
            margin: "0.5rem 0 0.75rem",
            lineHeight: 1.55,
          }}
        >
          {attrs.map((a, i) => (
            <span key={i}>
              {a}
              {i < attrs.length - 1 && (
                <span style={{ color: "#bbb", margin: "0 4px" }}>·</span>
              )}
            </span>
          ))}
        </p>

        {/* Action buttons row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            marginTop: "auto",
            flexWrap: "wrap",
            paddingTop: "0.5rem",
          }}
          className="match-card-actions"
        >
          {/* Don't Show */}
          <button
            onClick={onHide}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "0.4375rem 0.875rem",
              border: "1.5px solid #ccc",
              borderRadius: "20px",
              background: "#fff",
              color: "#444",
              fontSize: "0.8125rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Don&apos;t Show
          </button>

          {/* Shortlist button (bottom row) */}
          {shortlisted ? (
            /* Already shortlisted — show saved state + remove option */
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "0.4375rem 0.875rem",
                  border: "1.5px solid #C8973A",
                  borderRadius: "20px",
                  background: "#FBF6EC",
                  color: "#C8973A",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#C8973A" stroke="#C8973A" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
                Saved
              </div>
              <button
                onClick={onShortlist}
                title="Remove from shortlist"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#aaa",
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-sans)",
                  padding: "2px 4px",
                  textDecoration: "underline",
                }}
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              onClick={onShortlist}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "0.4375rem 0.875rem",
                border: "1.5px solid #ccc",
                borderRadius: "20px",
                background: "#fff",
                color: "#444",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                transition: "all 0.2s",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
              Shortlist
            </button>
          )}

          {/* Send Interest — dark maroon */}
          <button
            onClick={onSendInterest}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "0.4375rem 1.125rem",
              border: "none",
              borderRadius: "20px",
              background: "#6B1A2A",
              color: "#fff",
              fontSize: "0.8125rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            Send Interest
          </button>

          {/* View Contact — Gold+ */}
          {canViewContact ? (
            <Link
              href={`/profile/${profile.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "0.4375rem 1rem",
                border: "1.5px solid #E8401A",
                borderRadius: "20px",
                background: "#fff",
                color: "#E8401A",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                textDecoration: "none",
              }}
            >
              <PhoneIcon />
              View Contact
            </Link>
          ) : (
            <Link
              href="/membership"
              title="Upgrade to Gold to view contacts"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "0.4375rem 1rem",
                border: "1.5px solid #E8D5B7",
                borderRadius: "20px",
                background: "#FFF8E8",
                color: "#C8973A",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                textDecoration: "none",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C8973A" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Gold+
            </Link>
          )}

          {/* Message — Gold+ */}
          {canMessage && (
            <Link
              href={`/messages?partnerId=${profile.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "0.4375rem 1rem",
                border: "1.5px solid #6B1A2A",
                borderRadius: "20px",
                background: "#fff",
                color: "#6B1A2A",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                textDecoration: "none",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              Message
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Filter chips (top row, matching screenshot) ───────────────────────────────
const QUICK_CHIPS = ["Newly joined", "Not seen", "Profiles with photo", "Matches with horoscope"];

// ── Skeleton loader card ──────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8e8e8",
        borderRadius: "6px",
        display: "flex",
        marginBottom: "10px",
        overflow: "hidden",
      }}
    >
      <div style={{ width: "160px", height: "192px", background: "#f0f0f0", flexShrink: 0, animation: "pulse 1.5s ease-in-out infinite" }} />
      <div style={{ flex: 1, padding: "1rem" }}>
        <div style={{ width: "120px", height: "14px", background: "#f0f0f0", borderRadius: "4px", marginBottom: "8px", animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ width: "200px", height: "20px", background: "#f0f0f0", borderRadius: "4px", marginBottom: "6px", animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ width: "80%", height: "13px", background: "#f0f0f0", borderRadius: "4px", marginBottom: "12px", animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ width: "60%", height: "13px", background: "#f0f0f0", borderRadius: "4px", animation: "pulse 1.5s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function MatchesContent() {
  const { user, loading: authLoading } = useAuth();
  const { can } = useMembership();
  const canMessage     = can("messages");
  const canViewContact = can("contacts");
  const searchParams = useSearchParams();
  const tab = searchParams?.get("tab");
  const [activeSection, setActiveSection] = useState(tab || "your_matches");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (tab && tab !== activeSection) {
      setActiveSection(tab);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);
  const [profiles, setProfiles] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChips, setActiveChips] = useState<string[]>([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState("Best Match");
  const [filterOpen, setFilterOpen] = useState(false);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());
  const chipRowRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  // Track last user ID to detect account switches
  const lastUserIdRef = useRef<string | null>(null);

  const oppositeGender = user?.gender === "male" ? "female" : user?.gender === "female" ? "male" : null;

  const loadSection = useCallback(async (sectionId: string, currentUser: typeof user) => {
    if (!currentUser) return;
    setLoading(true);
    setProfiles([]);
    let result: RegisteredUser[] = [];
    try {
      switch (sectionId) {
        case "your_matches":         result = await fetchMatchProfiles(currentUser, currentUser.gender as "male" | "female" | undefined); break;
        case "shortlisted_by_you":   result = await getShortlistedProfiles(currentUser.id); break;
        case "viewed_you":           result = await getViewedMe(currentUser.id, currentUser.gender === "male" ? "female" : currentUser.gender === "female" ? "male" : null); break;
        case "shortlisted_you":      result = await getShortlistedMe(currentUser.id, currentUser.gender === "male" ? "female" : currentUser.gender === "female" ? "male" : null); break;
        case "viewed_by_you":        result = await getViewedByMe(currentUser.id, currentUser.gender === "male" ? "female" : currentUser.gender === "female" ? "male" : null); break;
        case "newly_joined":         result = await getNewlyJoined(currentUser.id, currentUser.gender === "male" ? "female" : currentUser.gender === "female" ? "male" : null); break;
        case "nearby_matches":       result = await getNearbyMatches(currentUser.id, currentUser.state, currentUser.gender === "male" ? "female" : currentUser.gender === "female" ? "male" : null); break;
        case "with_photos":          result = await getWithPhotos(currentUser.id, currentUser.gender === "male" ? "female" : currentUser.gender === "female" ? "male" : null); break;
        case "with_horoscope":       result = await getWithHoroscope(currentUser.id, currentUser.gender === "male" ? "female" : currentUser.gender === "female" ? "male" : null); break;
        case "similar_hobbies":      result = await getSimilarHobbies(currentUser.id, currentUser.hobbies || [], currentUser.gender === "male" ? "female" : currentUser.gender === "female" ? "male" : null); break;
        case "star_matches":         result = await getStarMatches(currentUser.id, currentUser.star, currentUser.gender === "male" ? "female" : currentUser.gender === "female" ? "male" : null); break;
        case "horoscope_matches":    result = await getHoroscopeMatches(currentUser.id, currentUser.rasi, currentUser.gender === "male" ? "female" : currentUser.gender === "female" ? "male" : null); break;
        case "mutual_matches":       result = await getMutualMatches(currentUser); break;
        case "looking_for_you":      result = await getLookingForMe(currentUser); break;
        case "education_pref":       result = await getByEducationPref(currentUser.id, currentUser.partnerEducation, currentUser.gender === "male" ? "female" : currentUser.gender === "female" ? "male" : null); break;
        case "professional_pref":    result = await getByProfessionPref(currentUser.id, currentUser.partnerOccupation, currentUser.gender === "male" ? "female" : currentUser.gender === "female" ? "male" : null); break;
        case "location_pref":        result = await getByLocationPref(currentUser.id, currentUser.city, currentUser.state, currentUser.gender === "male" ? "female" : currentUser.gender === "female" ? "male" : null); break;
        case "nri_matches":          result = await getNRIMatches(currentUser.id, currentUser.gender === "male" ? "female" : currentUser.gender === "female" ? "male" : null); break;
        default:                     result = await fetchMatchProfiles(currentUser.id, currentUser.gender as "male" | "female" | undefined);
      }
    } catch {
      result = [];
    }
    setProfiles(result.slice(0, 30));
    setLoading(false);
  }, []);

  // Reload data whenever the user changes (account switch) or active section changes
  useEffect(() => {
    if (!user) {
      // User logged out — reset state
      if (lastUserIdRef.current !== null) {
        setProfiles([]);
        setActiveSection("your_matches");
        lastUserIdRef.current = null;
      }
      return;
    }
    // User changed (account switch) or section changed
    lastUserIdRef.current = user.id;
    loadSection(activeSection, user);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, user?.id]);

  // Restore window scroll position when navigating back from a profile
  useEffect(() => {
    if (loading) return; // wait until profiles have loaded and rendered
    const saved = sessionStorage.getItem("matches_scroll");
    if (saved) {
      const scrollY = parseInt(saved, 10);
      sessionStorage.removeItem("matches_scroll");
      // Defer to next paint so cards are in DOM
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: scrollY, behavior: "instant" } as ScrollToOptions);
        });
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // Client-side chip filtering + hide
  const displayed = profiles.filter((p) => {
    if (hiddenIds.has(p.id)) return false;
    if (activeChips.includes("Profiles with photo") && !p.photoUrl) return false;
    if (activeChips.includes("Matches with horoscope") && !p.star && !p.rasi) return false;
    if (activeChips.includes("Newly joined")) {
      if (!p.createdAt || Date.now() - new Date(p.createdAt).getTime() > 30 * 24 * 60 * 60 * 1000) return false;
    }
    return true;
  });

  const toggleChip = (chip: string) =>
    setActiveChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );

  const handleShortlist = async (profileId: string, name: string) => {
    if (!user) { toast.error("Please login"); return; }
    const isAlreadyShortlisted = shortlistedIds.has(profileId);
    if (isAlreadyShortlisted) {
      setShortlistedIds((prev) => { const s = new Set(prev); s.delete(profileId); return s; });
      toast("Removed from shortlist");
    } else {
      setShortlistedIds((prev) => new Set([...prev, profileId]));
      await shortlistProfileWithNotification(user.id, profileId, user.name);
      toast.success(`${name} shortlisted!`);
    }
  };

  const handleHide = (profileId: string) => {
    setHiddenIds((prev) => new Set([...prev, profileId]));
    toast("Profile hidden");
  };

  const handleSendInterest = async (profileId: string, name: string) => {
    if (!user) { toast.error("Please login"); return; }
    await sendInterestWithNotification(user.id, profileId, user.name);
    toast.success(`Interest sent to ${name}!`);
  };

  // Section label for heading
  const sectionLabel = SIDEBAR.flatMap((s) => s.items).find((i) => i.id === activeSection)?.label || "Matches";

  // While auth is resolving (e.g. account switch in progress), show a spinner
  if (authLoading) {
    return (
      <>
        <Navbar />
        <main style={{ background: "#f2f2f2", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{
              width: "40px", height: "40px", margin: "0 auto 1rem",
              border: "3px solid #e0e0e0",
              borderTopColor: "#6B1A2A",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }} />
            <p style={{ color: "#888", fontSize: "0.875rem" }}>Loading your profile…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ background: "#f2f2f2", height: "calc(100vh - 64px)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            maxWidth: "1100px",
            width: "100%",
            margin: "0 auto",
            padding: "0.75rem",
            display: "flex",
            gap: "1rem",
            alignItems: "stretch",
            flex: 1,
            overflow: "hidden",
          }}
        >

          {/* ── MOBILE SIDEBAR OVERLAY ── */}
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
                zIndex: 150, animation: "fadeIn 0.2s ease",
              }}
            />
          )}

          {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
          <aside
            className="matches-sidebar-panel"
            style={{
              width: "268px",
              flexShrink: 0,
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              overflow: "hidden",
              alignSelf: "flex-start",
              position: "sticky",
              top: 0,
              height: "100%",
              maxHeight: "100%",
              overflowY: "auto",
            }}
          >
            {/* "All Matches" header */}
            <div
              style={{
                padding: "0.875rem 1rem",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <span style={{ fontWeight: 800, fontSize: "1rem", color: "#111" }}>
                All Matches
              </span>
            </div>

            {SIDEBAR.map((section) => (
              <div key={section.group ?? "root"}>
                {/* Group label */}
                {section.group && (
                  <div
                    style={{
                      padding: "0.625rem 1rem 0.25rem",
                      fontSize: "0.6875rem",
                      fontWeight: 800,
                      color: "#888",
                      letterSpacing: "0.03em",
                      lineHeight: 1.3,
                      borderTop: "1px solid #f4f4f4",
                      background: "#fafafa",
                    }}
                  >
                    {section.group.split("\n").map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                )}

                {section.items.map((item) => {
                  const active = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.625rem 1rem",
                        background: active ? "#FEF0F0" : "transparent",
                        border: "none",
                        borderLeft: active ? "3px solid #6B1A2A" : "3px solid transparent",
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "var(--font-sans)",
                        borderBottom: "1px solid #f8f8f8",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: active ? 700 : 600,
                            fontSize: "0.875rem",
                            color: active ? "#6B1A2A" : "#222",
                            marginBottom: "1px",
                          }}
                        >
                          {item.label}
                        </div>
                        <div
                          style={{
                            fontSize: "0.6875rem",
                            color: "#999",
                            lineHeight: 1.3,
                          }}
                        >
                          {item.sub.split("\n").map((l, i) => (
                            <span key={i}>
                              {l}
                              {i < item.sub.split("\n").length - 1 && <br />}
                            </span>
                          ))}
                        </div>
                      </div>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ccc"
                        strokeWidth="2.5"
                        style={{ flexShrink: 0, marginLeft: "4px" }}
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            ))}
          </aside>

          {/* ── MAIN ────────────────────────────────────────────────────── */}
          <div
            ref={rightPanelRef}
            style={{ flex: 1, minWidth: 0, overflowY: "auto", overflowX: "hidden", paddingRight: "2px" }}>
            {/* Mobile: Section select button */}
            <div className="matches-mobile-header" style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap" }}>
              <button
                onClick={() => setSidebarOpen(true)}
                className="matches-section-btn"
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "0.5rem 0.875rem", border: "1.5px solid #6B1A2A",
                  borderRadius: "20px", background: "#fff", color: "#6B1A2A",
                  fontWeight: 700, fontSize: "0.8125rem", cursor: "pointer",
                  fontFamily: "var(--font-sans)", minHeight: "40px",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
                </svg>
                {SIDEBAR.flatMap(s => s.items).find(i => i.id === activeSection)?.label || "Category"}
              </button>
              <h1
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  color: "#111",
                  margin: 0,
                  flex: 1,
                }}
              >
                {loading ? "Loading…" : `${displayed.length} matches`}
              </h1>
            </div>

            {/* Filter / Sort / Chips row */}
            <div
              ref={chipRowRef}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                flexWrap: "nowrap",
                marginBottom: "0.75rem",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                paddingBottom: "4px",
              }}
            >
                {/* Filter button with active-count badge */}
              <button
                onClick={() => setFilterOpen((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "0.3125rem 0.75rem",
                  border: filterOpen || activeChips.length > 0 ? "1.5px solid #6B1A2A" : "1.5px solid #ccc",
                  borderRadius: "20px",
                  background: filterOpen ? "#FEF0F0" : "#fff",
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  color: filterOpen || activeChips.length > 0 ? "#6B1A2A" : "#333",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
                </svg>
                Filter
                {activeChips.length > 0 && (
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "#E8401A",
                    color: "#fff",
                    fontSize: "0.625rem",
                    fontWeight: 800,
                    lineHeight: 1,
                    flexShrink: 0,
                  }}>{activeChips.length}</span>
                )}
              </button>

              {/* Sort by */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <button
                  onClick={() => setSortOpen((v) => !v)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "0.3125rem 0.75rem",
                    border: "1.5px solid #ccc",
                    borderRadius: "20px",
                    background: "#fff",
                    fontWeight: 600,
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    color: "#333",
                    whiteSpace: "nowrap",
                  }}
                >
                  Sort by
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {sortOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 4px)",
                      left: 0,
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      zIndex: 100,
                      minWidth: "170px",
                    }}
                  >
                    {["Best Match", "Newly Joined", "Profile with Photo", "Profile with Horoscope"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setSort(opt); setSortOpen(false); }}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "0.5rem 0.875rem",
                          background: sort === opt ? "#FEF0F0" : "transparent",
                          border: "none",
                          textAlign: "left",
                          fontSize: "0.8125rem",
                          fontWeight: sort === opt ? 700 : 400,
                          color: sort === opt ? "#6B1A2A" : "#333",
                          cursor: "pointer",
                          fontFamily: "var(--font-sans)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick filter chips */}
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => toggleChip(chip)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "0.3125rem 0.75rem",
                    border: activeChips.includes(chip)
                      ? "1.5px solid #6B1A2A"
                      : "1.5px solid #ccc",
                    borderRadius: "20px",
                    background: activeChips.includes(chip) ? "#FEF0F0" : "#fff",
                    fontWeight: activeChips.includes(chip) ? 700 : 500,
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    color: activeChips.includes(chip) ? "#6B1A2A" : "#333",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "all 0.15s",
                  }}
                >
                  {chip}
                  {activeChips.includes(chip) && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  )}
                </button>
              ))}

              {/* Scroll arrows — scroll chip row left/right */}
              <button
                onClick={() => chipRowRef.current?.scrollBy({ left: -200, behavior: "smooth" })}
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  border: "1.5px solid #ccc",
                  background: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
                title="Scroll left"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={() => chipRowRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  border: "1.5px solid #ccc",
                  background: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
                title="Scroll right"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Expandable filter panel */}
            {filterOpen && (
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "1rem",
                  marginBottom: "0.875rem",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                {[
                  { label: "Age From", opts: Array.from({ length: 35 }, (_, i) => `${18 + i} Yrs`) },
                  { label: "Age To", opts: Array.from({ length: 35 }, (_, i) => `${18 + i} Yrs`) },
                  { label: "Height From", opts: HEIGHTS.map((h) => h.label) },
                  { label: "Height To", opts: HEIGHTS.map((h) => h.label) },
                ].map(({ label, opts }) => (
                  <div key={label}>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#555", marginBottom: "4px" }}>
                      {label}
                    </label>
                    <select className="form-select" style={{ fontSize: "0.8125rem" }}>
                      {opts.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            )}

            {/* Profile cards */}
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
              : displayed.length === 0
              ? (
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "4rem 2rem",
                    textAlign: "center",
                  }}
                >
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.2" style={{ margin: "0 auto 1rem" }}>
                    <circle cx="12" cy="7" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                  <p style={{ fontWeight: 700, color: "#555", fontSize: "1rem", margin: "0 0 0.5rem" }}>
                    No profiles found
                  </p>
                  <p style={{ color: "#aaa", fontSize: "0.875rem", margin: "0 0 1.25rem" }}>
                    No matches in this category yet. Try another section.
                  </p>
                  <button
                    onClick={() => setActiveSection("your_matches")}
                    style={{
                      padding: "0.5rem 1.5rem",
                      background: "#6B1A2A",
                      color: "#fff",
                      border: "none",
                      borderRadius: "20px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.875rem",
                    }}
                  >
                    View All Matches
                  </button>
                </div>
              )
              : activeSection === "shortlisted_you" && !user?.isPremium ? (
                <div style={{ padding: "4rem 2rem", textAlign: "center", background: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px" }}>
                  <div style={{
                    width: "64px", height: "64px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #6B1A2A 0%, #C8973A 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 1rem",
                  }}>
                    <Lock size={28} color="#fff" />
                  </div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.5rem" }}>
                    See Who Shortlisted You
                  </h3>
                  <p style={{ color: "#666", fontSize: "0.9375rem", marginBottom: "1.5rem", maxWidth: "400px", margin: "0 auto 1.5rem" }}>
                    Upgrade to Gold to unlock this feature and see all the members who have expressed interest in your profile.
                  </p>
                  <Link href="/membership"
                    style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      background: "linear-gradient(135deg, #C8973A 0%, #E8C060 100%)",
                      color: "#fff", fontWeight: 700, fontSize: "0.9375rem",
                      borderRadius: "30px", padding: "0.75rem 2rem",
                      textDecoration: "none", boxShadow: "0 4px 16px rgba(200,151,58,0.35)",
                    }}
                  >
                    <Crown size={16} />
                    Upgrade to Gold — ₹999/mo
                  </Link>
                </div>
              )
              : displayed.map((profile, idx) => (
                <div
                  key={profile.id}
                  onClick={() => {
                    // Save window scroll position before navigating to profile detail
                    sessionStorage.setItem("matches_scroll", String(window.scrollY));
                  }}
                >
                  <ProfileCard
                    profile={profile}
                    index={idx}
                    onShortlist={() => handleShortlist(profile.id, profile.name)}
                    onHide={() => handleHide(profile.id)}
                    onSendInterest={() => handleSendInterest(profile.id, profile.name)}
                    shortlisted={shortlistedIds.has(profile.id)}
                    canMessage={canMessage}
                    canViewContact={canViewContact}
                  />
                </div>
              ))
            }

            {/* Load more */}
            {!loading && displayed.length > 0 && (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <button
                  onClick={() => loadSection(activeSection, user)}

                  style={{
                    padding: "0.625rem 2rem",
                    border: "1.5px solid #6B1A2A",
                    borderRadius: "20px",
                    background: "#fff",
                    color: "#6B1A2A",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Mobile-specific styles */}
      <style>{`
        /* Desktop: sidebar always visible */
        @media (min-width: 900px) {
          .matches-sidebar-panel {
            display: block !important;
            position: sticky !important;
          }
          .matches-section-btn { display: none !important; }
          .matches-mobile-header h1 { font-size: 1rem !important; }
        }
        /* Mobile: sidebar as drawer */
        @media (max-width: 899px) {
          .matches-sidebar-panel {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            width: 85vw !important;
            max-width: 320px !important;
            z-index: 160 !important;
            max-height: 100vh !important;
            border-radius: 0 12px 12px 0 !important;
            overflow-y: auto !important;
            box-shadow: 4px 0 20px rgba(0,0,0,0.15) !important;
            transform: ${sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'} !important;
            transition: transform 0.25s ease !important;
          }
        }
        /* Smallest screens: full-width stacked card */
        @media (max-width: 479px) {
          .match-card-horizontal { flex-direction: column !important; }
          .match-card-photo-wrap {
            width: 100% !important;
            aspect-ratio: 4/5 !important;
            max-height: 340px !important;
            overflow: hidden !important;
          }
          .match-card-photo {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            object-position: top center !important;
            max-height: 340px !important;
          }
        }
        /* Medium phones: side-by-side */
        @media (min-width: 480px) {
          .match-card-horizontal { flex-direction: row !important; }
          .match-card-photo-wrap {
            width: 165px !important;
            aspect-ratio: unset !important;
            min-height: 210px !important;
          }
          .match-card-photo {
            height: 100% !important;
            min-height: 210px !important;
            max-height: 300px !important;
          }
        }
        @media (min-width: 768px) {
          .match-card-photo-wrap { width: 190px !important; min-height: 230px !important; }
          .match-card-photo { min-height: 230px !important; max-height: 340px !important; }
        }
        .match-card-actions::-webkit-scrollbar { display: none; }
        /* Right scroll panel custom scrollbar */
        .matches-right-scroll::-webkit-scrollbar { width: 4px; }
        .matches-right-scroll::-webkit-scrollbar-track { background: transparent; }
        .matches-right-scroll::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
        .matches-right-scroll::-webkit-scrollbar-thumb:hover { background: #bbb; }
      `}</style>
    </>
  );
}

export default function MatchesPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "3rem" }}>Loading...</div>}>
      <MatchesContent />
    </Suspense>
  );
}
