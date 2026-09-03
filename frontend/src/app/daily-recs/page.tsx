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

// SVG Avatar — no stock photos
function GenderAvatar({ gender }: { gender?: string }) {
  const isFemale = gender === "female";
  return (
    <div style={{
      width: "100%", height: "100%",
      background: isFemale ? "#F5E6E9" : "#EAF0FA",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {isFemale ? (
        <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="7" r="4.5" fill="#C8973A" opacity="0.7"/>
          <path d="M4 21c0-4.5 3.6-8 8-8s8 3.5 8 8" fill="#6B1A2A" opacity="0.3"/>
          <circle cx="12" cy="7" r="4.5" stroke="#6B1A2A" strokeWidth="1.2" fill="none"/>
          <path d="M4 21c0-4.5 3.6-8 8-8s8 3.5 8 8" stroke="#6B1A2A" strokeWidth="1.2" fill="none"/>
        </svg>
      ) : (
        <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="7" r="4.5" fill="#C8973A" opacity="0.7"/>
          <path d="M4 21c0-4.5 3.6-8 8-8s8 3.5 8 8" fill="#1A3A6B" opacity="0.2"/>
          <circle cx="12" cy="7" r="4.5" stroke="#1A3A6B" strokeWidth="1.2" fill="none"/>
          <path d="M4 21c0-4.5 3.6-8 8-8s8 3.5 8 8" stroke="#1A3A6B" strokeWidth="1.2" fill="none"/>
        </svg>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function DailyRecsPage() {
  const { user } = useAuth();
  const timeLeft = useCountdown();
  const [profiles, setProfiles] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const recs = await getDailyRecommendations(user.id, user.gender);
    setProfiles(recs);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) load();
  }, [user?.id, load]);

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

  const handleSkip = () => {
    if (selectedIndex < profiles.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.success("You've viewed all daily recommendations!");
    }
  };

  const handleDontShow = () => {
    handleSkip();
  };

  const activeProfile = profiles[selectedIndex];

  // Helper to calculate age
  const getAge = (dob?: string) => {
    if (!dob) return 0;
    return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg-page)" }}>
      <Navbar />
      <PlanTabs />
      <style>{`
        @media (max-width: 599px) {
          .daily-rec-card { flex-direction: column !important; min-height: unset !important; }
          .daily-rec-photo-col { width: 100% !important; height: 260px !important; }
          .daily-rec-detail-col { padding: 1.25rem !important; }
          .daily-rec-action-row { flex-wrap: wrap !important; gap: 0.5rem !important; }
          .daily-rec-info-grid { grid-template-columns: 120px 1fr !important; }
        }
        @media (min-width: 600px) {
          .daily-rec-photo-col { height: 100% !important; }
        }
      `}</style>

      <main style={{ flex: 1, padding: "1.25rem 0" }}>
        <div className="container" style={{ maxWidth: "1060px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
            <Link href="/" style={{ marginRight: "1rem", color: "var(--text-primary)", display: "flex", alignItems: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              Daily Recommendations ({profiles.length > 0 ? `${selectedIndex + 1}/${profiles.length}` : "0/0"})
            </h1>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>Loading...</div>
          ) : profiles.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0", background: "#fff", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <p style={{ fontWeight: 600, color: "var(--text-medium)" }}>No recommendations found today.</p>
              <Link href="/search" className="btn btn-primary" style={{ marginTop: "1rem" }}>Go to Search</Link>
            </div>
          ) : (
            <>
              {/* Horizontal Avatar Carousel */}
              <div 
                style={{
                  display: "flex",
                  gap: "1rem",
                  overflowX: "auto",
                  paddingBottom: "1rem",
                  marginBottom: "1rem",
                  scrollbarWidth: "thin"
                }}
              >
                {profiles.map((p, idx) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedIndex(idx)}
                    style={{
                      flexShrink: 0,
                      width: "100px",
                      height: "100px",
                      borderRadius: "16px",
                      overflow: "hidden",
                      cursor: "pointer",
                      border: selectedIndex === idx ? "3px solid var(--primary)" : "3px solid transparent",
                      transition: "border 0.2s ease, transform 0.2s ease",
                      transform: selectedIndex === idx ? "scale(1.05)" : "scale(1)",
                      position: "relative"
                    }}
                  >
                    {p.photoUrl
                      ? <img src={p.photoUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <GenderAvatar gender={p.gender} />}
                    {selectedIndex !== idx && (
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)" }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Main Profile Card */}
              {activeProfile && (
                <div
                  className="daily-rec-card"
                  style={{
                    display: "flex",
                    background: "#fff",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid var(--border-color)",
                    marginBottom: "1.5rem",
                    flexDirection: "row",
                    minHeight: "450px",
                  }}
                >
                  {/* Left Side: Large Photo */}
                  <div className="daily-rec-photo-col" style={{ width: "380px", flexShrink: 0, position: "relative" }}>
                    {activeProfile.photoUrl
                      ? <img src={activeProfile.photoUrl} alt={activeProfile.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <GenderAvatar gender={activeProfile.gender} />}
                    <div style={{ 
                      position: "absolute", 
                      bottom: "1.5rem", 
                      left: "0",
                      right: "0",
                      display: "flex",
                      justifyContent: "center"
                    }}>
                      <div style={{ 
                        background: "rgba(0,0,0,0.6)", 
                        color: "white", 
                        padding: "4px 16px", 
                        borderRadius: "20px", 
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        backdropFilter: "blur(4px)"
                      }}>
                        {selectedIndex + 1}/{profiles.length}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Details & Actions */}
                  <div className="daily-rec-detail-col" style={{ flex: 1, padding: "2rem", display: "flex", flexDirection: "column" }}>
                    {/* Header: Verification & Actions */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                      {activeProfile.isVerified ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--info)", fontWeight: 600, fontSize: "0.875rem" }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          Verified
                        </div>
                      ) : (
                        <div style={{ color: "var(--text-light)", fontSize: "0.875rem" }}>Unverified</div>
                      )}

                      <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button 
                          onClick={() => handleShortlist(activeProfile)}
                          style={{ 
                            display: "flex", alignItems: "center", gap: "0.5rem", 
                            background: "var(--bg-page)", border: "none", padding: "0.5rem 1rem", 
                            borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "0.8125rem",
                            color: "var(--text-medium)"
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                          </svg>
                          Shortlist
                        </button>
                        <button style={{ 
                            background: "var(--bg-page)", border: "none", width: "34px", height: "34px",
                            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                            color: "var(--text-medium)"
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Name & ID */}
                    <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 0.5rem" }}>
                      {activeProfile.name}
                    </h2>
                    <p style={{ color: "var(--text-light)", fontSize: "0.875rem", margin: "0 0 1.5rem" }}>
                      H{activeProfile.id.substring(0,8).toUpperCase()} <span style={{margin:"0 8px"}}>|</span> Last seen few weeks ago
                    </p>

                    {/* Quick Info Rows */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "auto" }}>
                      <p style={{ margin: 0, color: "var(--text-medium)", fontSize: "0.9375rem", fontWeight: 600 }}>
                        {[
                          activeProfile.maritalStatus || "Not Specified",
                          `Profile created by ${activeProfile.profileFor || "self"}`,
                          `${getAge(activeProfile.dob)} yrs`,
                          activeProfile.height,
                          activeProfile.caste ? `${activeProfile.caste}(Caste No Bar)` : "Caste Not Specified"
                        ].filter(Boolean).join(" • ")}
                      </p>
                      <p style={{ margin: 0, color: "var(--text-medium)", fontSize: "0.9375rem", fontWeight: 600 }}>
                        {[
                          activeProfile.education,
                          activeProfile.occupation,
                          activeProfile.income,
                          [activeProfile.city, activeProfile.state].filter(Boolean).join(", ")
                        ].filter(Boolean).join(" • ")}
                      </p>
                    </div>

                    {/* Bottom Action Bar */}
                    <div
                      className="daily-rec-action-row"
                      style={{
                        marginTop: "2rem",
                        paddingTop: "1.25rem",
                        borderTop: "1px solid var(--border-light)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.75rem",
                      }}
                    >
                      <button
                        onClick={handleDontShow}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.5rem",
                          padding: "0.625rem 1.25rem", borderRadius: "30px",
                          border: "1px solid var(--border-color)", background: "#fff",
                          color: "var(--text-medium)", fontWeight: 600, cursor: "pointer",
                          fontSize: "0.875rem", minHeight: "44px",
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                        Don't Show
                      </button>

                        <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
                          <button
                            onClick={handleSkip}
                            style={{
                              display: "flex", alignItems: "center", gap: "0.5rem",
                              padding: "0.625rem 1.5rem", borderRadius: "30px",
                              border: "1px solid var(--primary)", background: "#fff",
                              color: "var(--primary)", fontWeight: 700, cursor: "pointer",
                              fontSize: "0.875rem", minHeight: "44px",
                            }}
                          >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                          </svg>
                          Skip
                        </button>
                                                <button
                            onClick={() => handleSendInterest(activeProfile)}
                            style={{
                              display: "flex", alignItems: "center", gap: "0.5rem",
                              padding: "0.625rem 1.75rem", borderRadius: "30px",
                              border: "none", background: "var(--primary)",
                              color: "#fff", fontWeight: 700, cursor: "pointer",
                              fontSize: "0.875rem", minHeight: "44px",
                            }}
                          >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="white"/>
                          </svg>
                          Send Interest
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Information Section */}
              {activeProfile && (
                <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid var(--border-color)", overflow: "hidden" }}>
                  <div style={{ 
                    padding: "1.25rem 1.5rem", 
                    background: "var(--primary-light)", 
                    borderBottom: "1px solid var(--border-light)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem"
                  }}>
                    <div style={{ 
                      width: "32px", height: "32px", borderRadius: "50%", 
                      background: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--primary)"
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      Personal Information
                    </h3>
                  </div>
                  
                  <div style={{ padding: "2rem" }}>
                    <div className="daily-rec-info-grid" style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "1rem", fontSize: "0.875rem" }}>
                      <div style={{ color: "var(--text-medium)" }}>Age</div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>: {getAge(activeProfile.dob)} Years</div>

                      <div style={{ color: "var(--text-medium)" }}>Height</div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>: {activeProfile.height || "Not specified"}</div>

                      <div style={{ color: "var(--text-medium)" }}>Mother Tongue</div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>: {activeProfile.motherTongue || "Not specified"}</div>

                      <div style={{ color: "var(--text-medium)" }}>Profile Created By</div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>: {activeProfile.profileFor || "Self"}</div>

                      <div style={{ color: "var(--text-medium)" }}>Marital Status</div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>: {activeProfile.maritalStatus || "Not specified"}</div>

                      <div style={{ color: "var(--text-medium)" }}>Lives In</div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>: {[activeProfile.city, activeProfile.state].filter(Boolean).join(", ") || "Not specified"}</div>

                      <div style={{ color: "var(--text-medium)" }}>Eating Habits</div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>: {activeProfile.diet || "Not specified"}</div>

                      <div style={{ color: "var(--text-medium)" }}>Religion</div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>: {activeProfile.religion || "Not specified"}</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
