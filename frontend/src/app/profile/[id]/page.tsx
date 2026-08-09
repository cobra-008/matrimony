"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MOCK_PROFILES, MOCK_GROOM_PROFILES } from "@/data/mock-profiles";
import { Heart, BookmarkPlus, MessageCircle, Phone, Share2, Flag, ArrowLeft, ChevronRight, Edit2, CheckCircle, Camera, UserCircle, Briefcase, Star, FileText, MapPin, Crown, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { getUserById, sendInterest, shortlistProfile } from "@/lib/auth-store";
import { useAuth } from "@/context/AuthContext";
import { useMembership } from "@/hooks/useMembership";
import { ProfileViewSkeleton } from "@/components/ui/Skeleton";
import { useRouter } from "next/navigation";

const ALL_PROFILES = [...MOCK_PROFILES, ...MOCK_GROOM_PROFILES];

// ── SECTION CARD ─────────────────────────────────────────────────────
function SectionCard({
  title,
  onEdit,
  children,
  noPad,
  id,
}: {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
  noPad?: boolean;
  id?: string;
}) {
  return (
    <div
      id={id}
      style={{
        background: "#fff",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-xl)",
        marginBottom: "1rem",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "0.875rem 1.125rem",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
        }}
      >
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--primary)", margin: 0 }}>
          {title}
        </h2>
        {onEdit && (
          <button
            onClick={onEdit}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "var(--primary-light)",
              border: "none",
              borderRadius: "var(--radius-full)",
              padding: "4px 12px",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              color: "var(--primary)",
              fontFamily: "var(--font-sans)",
            }}
          >
            <Edit2 size={12} />
            Edit Profile
          </button>
        )}
      </div>
      {/* Body */}
      <div style={{ padding: noPad ? 0 : "1rem 1.125rem" }}>{children}</div>
    </div>
  );
}

// ── INFO TABLE ROW ────────────────────────────────────────────────────
function InfoRow({
  label,
  value,
  addLink,
  isOwnProfile,
}: {
  label: string;
  value?: string | null;
  addLink?: boolean;
  isOwnProfile?: boolean;
}) {
  return (
    <tr>
      <td
        style={{
          padding: "0.4375rem 0",
          width: "45%",
          fontSize: "0.8125rem",
          color: "#888",
          fontWeight: 400,
          verticalAlign: "top",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        {label}
      </td>
      <td
        style={{
          padding: "0.4375rem 0 0.4375rem 0.5rem",
          fontSize: "0.8125rem",
          verticalAlign: "top",
          borderBottom: "1px solid var(--border-light)",
          color: value ? "var(--text-dark)" : undefined,
          fontWeight: value ? 500 : 400,
        }}
      >
        <span style={{ marginRight: "0.375rem", color: "#ccc" }}>:</span>
        {value ? (
          value
        ) : addLink && isOwnProfile ? (
          <a
            href="/settings"
            style={{
              color: "var(--primary)",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "0.8125rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "2px",
            }}
          >
            Add
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 2 }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
        ) : (
          <span style={{ color: "#ccc" }}>—</span>
        )}
      </td>
    </tr>
  );
}

// ── OWN PROFILE FALLBACK ──────────────────────────────────────────────
// Shown when clicking "View My Profile" for a registered user whose ID
// is not in mock data (ETM + timestamp IDs from registration)
function OwnProfileFallback({ id }: { id: string }) {
  const { user } = useAuth();
  const [storeUser, setStoreUser] = useState(user);
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    if (!user) {
      getUserById(id).then(u => {
        setStoreUser(u || null);
        setLoading(false);
      });
    } else {
      setStoreUser(user);
      setLoading(false);
    }
  }, [id, user]);

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" }}>
          {loading ? (
            <ProfileViewSkeleton />
          ) : (
            <>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <Link href="/matches" style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--primary)", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}>
              <ArrowLeft size={14} /> Back
            </Link>
            <span style={{ color: "#ccc" }}>›</span>
            <span style={{ fontSize: "0.875rem", color: "#888" }}>My Profile</span>
          </div>

          <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-color)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
            {/* Hero banner */}
            <div style={{ background: "var(--gradient-hero)", padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", border: "3px solid rgba(255,255,255,0.5)", overflow: "hidden", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {storeUser?.photoUrl
                    ? <img src={storeUser.photoUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <UserCircle size={48} style={{ color: "rgba(255,255,255,0.7)" }} />
                  }
                </div>
                <div>
                  <h1 style={{ color: "#fff", fontWeight: 800, fontSize: "1.375rem", margin: 0 }}>{storeUser?.name || "My Profile"}</h1>
                  <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8125rem", marginTop: "4px" }}>{storeUser?.id || id}</div>
                  {storeUser?.isVerified && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px", color: "#fff", fontSize: "0.75rem" }}>
                      <CheckCircle size={13} fill="#fff" stroke="var(--primary)" strokeWidth={2} /> Verified
                    </div>
                  )}
                </div>
              </div>
              <Link href="/profile/edit" style={{ background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: "var(--radius-full)", padding: "0.5rem 1.25rem", color: "#fff", fontWeight: 700, fontSize: "0.8125rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "5px" }}>
                <Edit2 size={13} /> Edit Profile
              </Link>
            </div>

            {/* Content */}
            <div style={{ padding: "2rem" }}>
              {!storeUser ? (
                <div style={{ textAlign: "center", padding: "3rem 0" }}>
                  <UserCircle size={64} style={{ color: "var(--border-color)", margin: "0 auto 1rem" }} />
                  <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>Profile not found. Please log in again.</p>
                  <Link href="/login" className="btn btn-primary">Go to Login</Link>
                </div>
              ) : (
                <>
                  {/* Profile completion — specific missing fields */}
                  {(() => {
                    const missing: { label: string; section: string; icon: React.ReactNode }[] = [];
                    if (!storeUser.photoUrl) missing.push({ label: "Add Photo", section: "photo", icon: <Camera size={14} /> });
                    if (!storeUser.education && !storeUser.occupation) missing.push({ label: "Professional Details", section: "professional", icon: <Briefcase size={14} /> });
                    if (!storeUser.star && !storeUser.rasi) missing.push({ label: "Horoscope", section: "religion", icon: <Star size={14} /> });
                    if (!storeUser.about) missing.push({ label: "About Me", section: "about", icon: <FileText size={14} /> });
                    if (!storeUser.city) missing.push({ label: "Location", section: "location", icon: <MapPin size={14} /> });
                    if (!storeUser.partnerAgeMin) missing.push({ label: "Partner Preferences", section: "partner", icon: <Heart size={14} /> });

                    const totalFields = 10;
                    const filled = totalFields - missing.length;
                    const pct = Math.round((filled / totalFields) * 100);

                    if (missing.length === 0) return null;
                    return (
                      <div style={{ background: "#fff8f0", border: "1px solid #ffcc80", borderRadius: "var(--radius-lg)", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.625rem" }}>
                          <div>
                            <div style={{ fontWeight: 700, color: "#E65100", fontSize: "0.9375rem" }}>Complete Your Profile</div>
                            <div style={{ fontSize: "0.75rem", color: "#888", marginTop: "2px" }}>Profile completeness score {pct}%
                              <span style={{ display: "inline-block", width: "60px", height: "6px", background: "#e0e0e0", borderRadius: "3px", verticalAlign: "middle", margin: "0 4px" }}>
                                <span style={{ display: "block", height: "100%", width: `${pct}%`, background: "#4CAF50", borderRadius: "3px" }} />
                              </span>
                            </div>
                          </div>
                          <Link href="/profile/edit" style={{ fontSize: "0.75rem", color: "#E65100", fontWeight: 600, textDecoration: "none" }}>Edit all →</Link>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                          {missing.map((m) => (
                            <Link
                              key={m.section}
                              href={`/profile/edit?section=${m.section}`}
                              style={{
                                display: "flex", alignItems: "center", gap: "5px",
                                padding: "0.3125rem 0.75rem",
                                background: "#fff", border: "1px solid #ffcc80",
                                borderRadius: "20px",
                                fontSize: "0.8125rem", color: "#E65100",
                                fontWeight: 600, textDecoration: "none",
                              }}
                            >
                              {m.icon} {m.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Details grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    {[
                      ["Full Name", storeUser.name],
                      ["Gender", storeUser.gender ? (storeUser.gender === "male" ? "Male" : "Female") : "—"],
                      ["Date of Birth", storeUser.dob || "Not set"],
                      ["Religion", storeUser.religion || "Not set"],
                      ["Community", storeUser.caste || "Not set"],
                      ["Mother Tongue", storeUser.motherTongue || "Tamil"],
                      ["Education", storeUser.education || "Not set"],
                      ["Occupation", storeUser.occupation || "Not set"],
                      ["Annual Income", storeUser.income || "Not set"],
                      ["Location", [storeUser.city, storeUser.state, storeUser.country].filter(Boolean).join(", ") || "Not set"],
                      ["Height", storeUser.height || "Not set"],
                      ["Marital Status", storeUser.maritalStatus || "Never Married"],
                      ["Star", storeUser.star || "Not set"],
                      ["Raasi", storeUser.rasi || "Not set"],
                    ].map(([label, value]) => (
                      <div key={label} style={{ padding: "0.75rem 0", borderBottom: "1px solid var(--border-light)", display: "flex", gap: "0.75rem" }}>
                        <span style={{ color: "#888", fontSize: "0.8125rem", minWidth: "130px", flexShrink: 0 }}>{label}</span>
                        <span style={{ fontSize: "0.8125rem", color: value === "Not set" ? "#ccc" : "var(--text-dark)", fontWeight: 500 }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* About */}
                  {storeUser.about && (
                    <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#fafafa", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.375rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>About Me</div>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-dark)", lineHeight: 1.6 }}>{storeUser.about}</p>
                    </div>
                  )}

                  {/* Photo upload CTA */}
                  {!storeUser.photoUrl && (
                    <div style={{ marginTop: "1.5rem", border: "2px dashed var(--border-color)", borderRadius: "var(--radius-lg)", padding: "2rem", textAlign: "center" }}>
                      <Camera size={32} style={{ color: "var(--border-color)", margin: "0 auto 0.75rem" }} />
                      <p style={{ fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>No photo added yet</p>
                      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "1rem" }}>Profiles with photos get 8x more responses</p>
                      <Link href="/profile/edit?section=photo" className="btn btn-outline">Add Photo</Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

// ── SIDEBAR ITEMS ─────────────────────────────────────────────────────
const SIDEBAR_ITEMS = [
  "Basic Information",
  "Family Details",
  "Lifestyle",
  "Partner Preference",
  "Gallery",
  "Horoscope",
];

export default function ProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const { can } = useMembership();
  const canMessage     = can("messages");
  const canViewContact = can("contacts");
  const canHoroscope   = can("horoscope_view");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dbProfile, setDbProfile] = useState<Awaited<ReturnType<typeof getUserById>> | null>(null);

  // Try to find profile from mock data first (fast path)
  const mockProfile = ALL_PROFILES.find((p) => p.id === id);

  useEffect(() => {
    if (!mockProfile) {
      // Not in mock data — try Supabase
      getUserById(id).then(p => {
        setDbProfile(p);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, mockProfile]);

  const [interested, setInterested] = useState(false);
  const [shortlisted, setShortlisted] = useState(false);
  const [activeSection, setActiveSection] = useState("Basic Information");

  const handleSendInterest = async () => {
    if (!user) { toast.error("Please login"); return; }
    await sendInterest(user.id, id);
    setInterested(v => !v);
    toast.success(interested ? "Interest withdrawn" : `Interest sent!`);
  };

  const handleShortlist = async () => {
    if (!user) { toast.error("Please login"); return; }
    if (!shortlisted) await shortlistProfile(user.id, id);
    setShortlisted(v => !v);
    toast.success(shortlisted ? "Removed from shortlist" : "Added to shortlist");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
          <ProfileViewSkeleton />
        </main>
        <Footer />
      </>
    );
  }

  // If not in mock data and not in DB, show own profile fallback
  if (!mockProfile && !dbProfile) {
    return <OwnProfileFallback id={id} />;
  }

  const profile = mockProfile || dbProfile;

  if (!profile) return null;

  const photo =
    profile.photoUrl ||
    (profile.gender === "male"
      ? "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600"
      : "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=600");

  const pronoun = profile.gender === "female" ? "her" : "him";
  const isOwnProfile = user?.id === profile.id;

  return (
    <>
      <Navbar />
      <style>{`
        @media (max-width: 899px) {
          .profile-sidebar { display: none !important; }
          .profile-info-body { flex-direction: column !important; }
          .profile-photo-col { width: 100% !important; }
          .profile-photo-img { width: 100% !important; height: 220px !important; border-radius: var(--radius-lg) !important; }
          .profile-actions-col { flex-direction: row !important; flex-wrap: wrap !important; align-items: center !important; width: 100% !important; margin-top: 0.75rem !important; }
          .profile-attr-grid { grid-template-columns: 1fr !important; }
          .profile-edu-grid { grid-template-columns: 1fr !important; }
          .profile-main-wrap { padding: 0.75rem 0.75rem 5rem !important; }
        }
        @media (min-width: 480px) and (max-width: 899px) {
          .profile-info-body { flex-direction: row !important; }
          .profile-photo-col { width: 130px !important; flex-shrink: 0 !important; }
          .profile-photo-img { width: 130px !important; height: 170px !important; }
          .profile-actions-col { width: 130px !important; margin-top: 0 !important; }
        }
      `}</style>
      <main style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
        <div
          className="profile-main-wrap"
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "1.25rem 1rem 2.5rem",
          }}
        >
          {/* Breadcrumb */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              marginBottom: "1.25rem",
              fontSize: "0.8125rem",
              color: "#888",
            }}
          >
            <Link
              href="/matches"
              style={{
                color: "var(--primary)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontWeight: 600,
              }}
            >
              <ArrowLeft size={13} />
              Back to Matches
            </Link>
            <ChevronRight size={12} style={{ color: "#ccc" }} />
            <span>{profile.name}</span>
          </div>

          <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
            {/* ── LEFT SIDEBAR — desktop only ── */}
            <aside
              className="profile-sidebar"
              style={{
                width: "200px",
                flexShrink: 0,
                background: "#fff",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {/* Sidebar profile mini */}
              <div
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid var(--border-light)",
                  textAlign: "center",
                }}
              >
                <img
                  src={photo}
                  alt={profile.name}
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    objectFit: "contain",
                    background: "#F8F0F0",
                    objectPosition: "top",
                    border: "2px solid var(--primary-light)",
                    display: "block",
                    margin: "0 auto 0.5rem",
                  }}
                />
                <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-dark)" }}>
                  {profile.name.split(" ")[0]}
                </div>
                <div style={{ fontSize: "0.6875rem", color: "#888", marginTop: "2px" }}>
                  {profile.id}
                </div>
              </div>

              {/* Nav items */}
              {SIDEBAR_ITEMS.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveSection(item);
                    const sectionId = item.replace(/\s+/g, '-');
                    const element = document.getElementById(`section-${sectionId}`);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "0.625rem 1rem",
                    border: "none",
                    borderLeft:
                      activeSection === item
                        ? "3px solid var(--primary)"
                        : "3px solid transparent",
                    background:
                      activeSection === item ? "var(--primary-light)" : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "0.8125rem",
                    fontWeight: activeSection === item ? 700 : 400,
                    color: activeSection === item ? "var(--primary)" : "var(--text-dark)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {item}
                  <ChevronRight size={12} style={{ color: "#ccc", flexShrink: 0 }} />
                </button>
              ))}
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* ══════════════════════════════════════════════════
                  1. PERSONAL INFORMATION — AT THE TOP
                  (photo + name + key details + action buttons)
                  ══════════════════════════════════════════════════ */}
              <div
                style={{
                  background: "#fff",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-xl)",
                  marginBottom: "1rem",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {/* Pink top bar */}
                <div
                  style={{
                    background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                    padding: "0.75rem 1.125rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
                    {isOwnProfile ? "My Profile" : "Profile Details"}
                  </span>
                  {isOwnProfile && (
                    <button
                      onClick={() => router.push("/profile/edit")}
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        border: "1px solid rgba(255,255,255,0.4)",
                        borderRadius: "var(--radius-full)",
                        padding: "4px 12px",
                        color: "white",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      <Edit2 size={11} />
                      Edit Profile
                    </button>
                  )}
                </div>

                {/* Personal info body */}
                <div className="profile-info-body" style={{ padding: "1.25rem", display: "flex", gap: "1rem" }}>
                  {/* Photo */}
                  <div className="profile-photo-col" style={{ flexShrink: 0, position: "relative" }}>
                    <img
                      src={photo}
                      alt={profile.name}
                      className="profile-photo-img"
                      style={{
                        width: "130px",
                        height: "160px",
                        objectFit: "contain",
                        background: "#F8F0F0",
                        objectPosition: "top",
                        borderRadius: "var(--radius-lg)",
                        display: "block",
                        border: "2px solid var(--border-light)",
                      }}
                    />
                    {/* Online dot */}
                    {profile.isOnline && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: "8px",
                          right: "8px",
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: "#22C55E",
                          border: "2px solid #fff",
                        }}
                      />
                    )}
                    {isOwnProfile && (
                      <button
                        onClick={() => router.push("/profile/edit?section=photo")}
                        style={{
                          display: "block",
                          width: "100%",
                          marginTop: "6px",
                          background: "none",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          padding: "3px 0",
                          fontSize: "0.6875rem",
                          color: "var(--primary)",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "var(--font-sans)",
                          textAlign: "center",
                        }}
                      >
                        Add/Edit Photos
                      </button>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    {/* Name + Verified */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "4px",
                      }}
                    >
                      <h1
                        style={{
                          fontSize: "1.375rem",
                          fontWeight: 700,
                          color: "var(--text-dark)",
                          margin: 0,
                        }}
                      >
                        {profile.name}
                      </h1>
                      {profile.isVerified && (
                        <CheckCircle
                          size={18}
                          style={{ color: "var(--success)", flexShrink: 0 }}
                          fill="var(--success)"
                          stroke="white"
                          strokeWidth={2.5}
                        />
                      )}
                    </div>

                    {/* Profile created for */}
                    <div
                      style={{
                        fontSize: "0.8125rem",
                        color: "#888",
                        marginBottom: "0.625rem",
                      }}
                    >
                      Profile created for{" "}
                      {profile.gender === "female" ? "Friend" : "Son"}
                    </div>

                    {/* Key attributes */}
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-medium)",
                        lineHeight: 2,
                      }}
                    >
                      <div>
                        <strong style={{ fontWeight: 600 }}>{profile.age} Yrs</strong>,{" "}
                        {profile.height || "5 Ft 4 In"} / 163 Cms
                      </div>
                      <div>
                        {profile.religion}, {profile.community}
                      </div>
                      <div>{profile.location}</div>
                      <div>
                        {profile.education},{" "}
                        {profile.occupation === "Not Working"
                          ? "Not working"
                          : profile.occupation}
                      </div>
                      {/* Phone (blurred) — only show Edit/Verify to own profile */}
                      {isOwnProfile && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginTop: "4px",
                          }}
                        >
                          <Phone size={13} style={{ color: "var(--primary)" }} />
                          <span
                            style={{
                              filter: "blur(4px)",
                              userSelect: "none",
                              fontSize: "0.8125rem",
                              color: "var(--text-dark)",
                              fontWeight: 600,
                            }}
                          >
                            +91-9342024748
                          </span>
                          <a
                            href="/membership"
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--primary)",
                              fontWeight: 700,
                              textDecoration: "none",
                            }}
                          >
                            Edit / Verify
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right — action column */}
                  <div
                    className="profile-actions-col"
                    style={{
                      flexShrink: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      alignItems: "flex-end",
                    }}
                  >
                    {/* Profile Preview (only for own profile) */}
                    {isOwnProfile && (
                      <a
                        href={`/profile/${profile.id}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "0.4375rem 0.875rem",
                          border: "1.5px solid var(--primary)",
                          borderRadius: "var(--radius-full)",
                          color: "var(--primary)",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        Profile Preview
                      </a>
                    )}

                    {/* Action buttons for other profiles */}
                    {!isOwnProfile && (
                      <>
                        {/* Send Interest */}
                        <button
                          onClick={() => {
                            setInterested((v) => !v);
                            toast.success(
                              interested ? "Interest withdrawn" : `Interest sent to ${profile.name}!`
                            );
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "0.4375rem 0.875rem",
                            background: interested ? "var(--primary)" : "#fff",
                            border: "1.5px solid var(--primary)",
                            borderRadius: "var(--radius-full)",
                            color: interested ? "#fff" : "var(--primary)",
                            fontWeight: 700,
                            fontSize: "0.8125rem",
                            cursor: "pointer",
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          <Heart size={13} fill={interested ? "white" : "none"} />
                          {interested ? "Interest Sent" : "Send Interest"}
                        </button>

                        {/* Shortlist */}
                        <button
                          onClick={() => {
                            setShortlisted((v) => !v);
                            toast.success(
                              shortlisted ? "Removed from shortlist" : "Added to shortlist"
                            );
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "0.4375rem 0.875rem",
                            background: shortlisted ? "var(--success)" : "#fff",
                            border: "1.5px solid var(--success)",
                            borderRadius: "var(--radius-full)",
                            color: shortlisted ? "#fff" : "var(--success)",
                            fontWeight: 600,
                            fontSize: "0.8125rem",
                            cursor: "pointer",
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          <BookmarkPlus size={13} />
                          {shortlisted ? "Shortlisted" : "Shortlist"}
                        </button>

                        {/* Message — Gold+ functional */}
                        {canMessage ? (
                          <Link
                            href={`/messages?partnerId=${id}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "0.4375rem 0.875rem",
                              background: "#fff",
                              border: "1.5px solid #6B1A2A",
                              borderRadius: "var(--radius-full)",
                              color: "#6B1A2A",
                              fontWeight: 600,
                              fontSize: "0.8125rem",
                              cursor: "pointer",
                              fontFamily: "var(--font-sans)",
                              textDecoration: "none",
                            }}
                          >
                            <MessageCircle size={13} />
                            Message
                          </Link>
                        ) : (
                          <Link
                            href="/membership"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "0.4375rem 0.875rem",
                              background: "#FFF8E8",
                              border: "1.5px solid #E8D5B7",
                              borderRadius: "var(--radius-full)",
                              color: "#C8973A",
                              fontWeight: 600,
                              fontSize: "0.8125rem",
                              cursor: "pointer",
                              fontFamily: "var(--font-sans)",
                              textDecoration: "none",
                            }}
                          >
                            <Crown size={12} />
                            Message (Gold+)
                          </Link>
                        )}

                        {/* Share + Report */}
                        <div style={{ display: "flex", gap: "0.75rem", marginTop: "4px" }}>
                          <button
                            onClick={() => {
                              navigator.clipboard?.writeText(window.location.href);
                              toast.success("Profile link copied");
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              color: "#888",
                              fontFamily: "var(--font-sans)",
                              display: "flex",
                              alignItems: "center",
                              gap: "3px",
                            }}
                          >
                            <Share2 size={12} /> Share
                          </button>
                          <button
                            onClick={() => toast("Report submitted")}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              color: "#888",
                              fontFamily: "var(--font-sans)",
                              display: "flex",
                              alignItems: "center",
                              gap: "3px",
                            }}
                          >
                            <Flag size={12} /> Report
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* ══════════════════════════════════════════════════
                  2. UPLOAD PHOTOS PROMPT (only if isOwnProfile and no photo)
                  ══════════════════════════════════════════════════ */}
              {isOwnProfile && !profile.photoUrl && (
                <div
                  style={{
                    background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
                    borderRadius: "var(--radius-xl)",
                    padding: "1rem 1.25rem",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                  }}
                >
                  <div style={{ color: "white" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "3px" }}>
                      Photos are the first thing that prospects look at.
                    </p>
                    <p style={{ fontSize: "0.8125rem", opacity: 0.9 }}>
                      Add your photo and get 10 times more responses!
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.625rem", flexShrink: 0 }}>
                    <button
                      onClick={() => toast("Skipped")}
                      style={{
                        padding: "0.4375rem 1rem",
                        border: "1px solid rgba(255,255,255,0.5)",
                        borderRadius: "var(--radius-full)",
                        background: "transparent",
                        color: "white",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => router.push("/profile/edit?section=photo")}
                      style={{
                        padding: "0.4375rem 1.25rem",
                        border: "none",
                        borderRadius: "var(--radius-full)",
                        background: "white",
                        color: "var(--primary)",
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      Upload Photos Now
                    </button>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  PHOTO GALLERY
                  ══════════════════════════════════════════════════ */}
              {profile.photos && profile.photos.length > 0 && (
                <SectionCard id="section-Photo-Gallery" title={`Photo Gallery (${profile.photos.length})`} onEdit={isOwnProfile ? () => router.push("/profile/edit?section=photo") : undefined}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "1rem" }}>
                    {profile.photos.sort((a, b) => a.sortOrder - b.sortOrder).map(p => (
                      <div key={p.id} style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", aspectRatio: "3/4", border: "1px solid var(--border-color)" }}>
                        <img src={p.url} alt="Gallery photo" style={{ width: "100%", height: "100%", objectFit: "contain", background: "#F8F0F0" }} />
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}
              {/* ══════════════════════════════════════════════════
                  3. BASIC INFORMATION
                  ══════════════════════════════════════════════════ */}
              <SectionCard id="section-Basic-Information" title="Basic Information" onEdit={isOwnProfile ? () => router.push("/profile/edit?section=basic") : undefined}>
                {/* About Me */}
                <div style={{ marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "0.375rem" }}>
                    About Me
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-medium)", lineHeight: 1.65 }}>
                    My {profile.gender === "female" ? "friend" : "son"} has completed{" "}
                    {profile.education || "Bachelor's degree"}. Currently{" "}
                    {profile.occupation === "Not Working"
                      ? "not working"
                      : `working as ${profile.occupation}`}{" "}
                    and lives in {profile.location || "Chennai"}.
                  </p>
                </div>

                {/* Two-column attribute table */}
                <div className="profile-attr-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1.5rem" }}>
                  {/* Left column */}
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <InfoRow label="Profile created for" value={profile.gender === "female" ? "Friend" : "Son"} />
                      <InfoRow label="Body Type" addLink isOwnProfile={isOwnProfile} />
                      <InfoRow label="Physical Status" value="Normal" />
                      <InfoRow label="Weight" addLink isOwnProfile={isOwnProfile} />
                      <InfoRow label="Marital Status" value="Never Married" />
                      <InfoRow label="Drinking Habits" addLink isOwnProfile={isOwnProfile} />
                    </tbody>
                  </table>
                  {/* Right column */}
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <InfoRow label="Name" value={profile.name} />
                      <InfoRow label="Age" value={`${profile.age} Years`} />
                      <InfoRow label="Height" value={profile.height || "5 Ft 4 In / 163 Cms"} />
                      <InfoRow label="Mother Tongue" value="Tamil" />
                      <InfoRow label="Eating Habits" addLink isOwnProfile={isOwnProfile} />
                      <InfoRow label="Smoking Habits" addLink isOwnProfile={isOwnProfile} />
                    </tbody>
                  </table>
                </div>

                {/* Education & Career sub-section */}
                <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--border-light)" }}>
                  <h3 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "0.625rem" }}>
                    Education & Career
                  </h3>
                  <div className="profile-edu-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.25rem 1.5rem", fontSize: "0.8125rem" }}>
                    {[
                      ["Qualification", profile.education || "B.E Computer Science"],
                      ["Occupation", profile.occupation || "Software Engineer"],
                      ["Company", "Infosys"],
                      ["Annual Income", profile.income || "₹12 - 15 Lakh"],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", gap: "0.5rem", padding: "0.375rem 0", borderBottom: "1px solid var(--border-light)" }}>
                        <span style={{ color: "#888", minWidth: "100px", flexShrink: 0 }}>{k}</span>
                        <span style={{ color: "var(--text-dark)", fontWeight: 500 }}>
                          <span style={{ color: "#ccc", marginRight: "4px" }}>:</span>
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              {/* ══════════════════════════════════════════════════
                  4. RELIGION INFORMATION (Mapped from Lifestyle / Religion)
                  ══════════════════════════════════════════════════ */}
              <SectionCard id="section-Lifestyle" title="Religion & Lifestyle Information" onEdit={isOwnProfile ? () => router.push("/profile/edit?section=religion") : undefined}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <InfoRow label="Religion" value={profile.religion || "Hindu"} />
                    <InfoRow
                      label="Caste / Sub Caste"
                      value={profile.community}
                    />
                    <InfoRow label="Gothra(m)" value="—" />
                    <InfoRow label="Star / Raasi" value="Hastha / Kanya (Virgo)" />
                    <InfoRow label="Dosh" value="No" />
                  </tbody>
                </table>
              </SectionCard>

              {/* ══════════════════════════════════════════════════
                  5. LOCATION DETAILS
                  ══════════════════════════════════════════════════ */}
              <SectionCard id="section-Location" title="Location Details" onEdit={isOwnProfile ? () => router.push("/profile/edit?section=location") : undefined}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <InfoRow label="Country" value="India" />
                    <InfoRow label="State" value="Tamil Nadu" />
                    <InfoRow label="City" value={profile.location?.split(",")[0] || "Chennai"} />
                    <InfoRow label="Residency Status" value="Citizen" />
                  </tbody>
                </table>
              </SectionCard>

              {/* ══════════════════════════════════════════════════
                  6. FAMILY DETAILS
                  ══════════════════════════════════════════════════ */}
              <SectionCard id="section-Family-Details" title="Family Details" onEdit={isOwnProfile ? () => router.push("/profile/edit?section=family") : undefined}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <InfoRow label="Family Values" value="Traditional" />
                    <InfoRow label="Family Type" value="Nuclear Family" />
                    <InfoRow label="Family Status" value="Middle Class" />
                    <InfoRow label="Father's Occupation" value="Business" />
                    <InfoRow label="Mother's Occupation" value="Homemaker" />
                    <InfoRow label="No. of Brothers" value="1" />
                    <InfoRow label="No. of Sisters" value="0" />
                  </tbody>
                </table>
              </SectionCard>

              {/* ══════════════════════════════════════════════════
                  7. HOROSCOPE DETAILS
                  ══════════════════════════════════════════════════ */}
              <SectionCard id="section-Horoscope" title="Horoscope Details" onEdit={isOwnProfile ? () => router.push("/profile/edit?section=horoscope") : undefined}>
                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                  <table style={{ flex: 1, borderCollapse: "collapse", minWidth: "200px" }}>
                    <tbody>
                      <InfoRow label="Date of Birth" value="••/••/••••" />
                      <InfoRow label="Time of Birth" value="Not specified" />
                      <InfoRow label="Place of Birth" value="Chennai" />
                      <InfoRow label="Country of Birth" value="India" />
                    </tbody>
                  </table>
                  <div
                    style={{
                      flex: 1,
                      minWidth: "160px",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-lg)",
                      padding: "1rem",
                      textAlign: "center",
                      background: "var(--primary-light)",
                    }}
                  >
                    <p style={{ fontSize: "0.8125rem", color: "var(--primary)", fontWeight: 600, marginBottom: "0.625rem", display: "flex", alignItems: "center", gap: "5px", justifyContent: "center" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                      Horoscope chart
                    </p>
                    {canHoroscope ? (
                      <button
                        onClick={() => toast("Horoscope chart will open here.")}
                        style={{
                          background: "var(--primary)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "var(--radius-full)",
                          padding: "0.375rem 1rem",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        View Horoscope
                      </button>
                    ) : (
                      <Link
                        href="/membership"
                        style={{
                          background: "var(--primary)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "var(--radius-full)",
                          padding: "0.375rem 1rem",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          fontFamily: "var(--font-sans)",
                          textDecoration: "none",
                          display: "inline-block",
                        }}
                      >
                        Upgrade to View
                      </Link>
                    )}
                  </div>
                </div>
              </SectionCard>

              {/* ══════════════════════════════════════════════════
                  8. CONTACT DETAILS (locked)
                  ══════════════════════════════════════════════════ */}
              <SectionCard id="section-Contact-Details" title="Contact Details">
                <div style={{ textAlign: "center", padding: "0.75rem 0" }}>
                  <div
                    style={{
                      fontSize: "0.9375rem",
                      color: "var(--text-dark)",
                      marginBottom: "0.75rem",
                      filter: canViewContact ? "none" : "blur(4px)",
                      userSelect: canViewContact ? "auto" : "none",
                      fontWeight: 600,
                    }}
                  >
                    +91 {profile.mobile || "98765 43210"}
                  </div>
                  {canViewContact ? (
                    <a
                      href={`tel:+91${profile.mobile || "9876543210"}`}
                      style={{
                        background: "#10b981", // Green color for Call Now
                        color: "#fff",
                        border: "none",
                        borderRadius: "var(--radius-full)",
                        padding: "0.5rem 1.75rem",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                        textDecoration: "none",
                        display: "inline-block",
                      }}
                    >
                      Call Now
                    </a>
                  ) : (
                    <Link
                      href="/membership"
                      style={{
                        background: "var(--primary)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "var(--radius-full)",
                        padding: "0.5rem 1.75rem",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                        boxShadow: "var(--shadow-pink)",
                        textDecoration: "none",
                        display: "inline-block",
                      }}
                    >
                      Upgrade to View Contact
                    </Link>
                  )}
                </div>
              </SectionCard>
            </div>

            {/* ── RIGHT PANEL — Partner Preferences etc. ── */}
            {isOwnProfile && (
              <aside
                style={{
                  width: "220px",
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {/* Add Partner Preferences */}
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-xl)",
                    padding: "1rem",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start", marginBottom: "0.875rem" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "var(--primary-light)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Heart size={16} style={{ color: "var(--primary)" }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-dark)" }}>
                        Add Partner Preferences
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "#888", marginTop: "2px" }}>
                        To find your perfect match
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/profile/edit?section=partner"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      color: "var(--primary)",
                      fontWeight: 700,
                      fontSize: "0.8125rem",
                      textDecoration: "none",
                    }}
                  >
                    Add Partner Preferences ▶
                  </Link>
                </div>

                {/* Add Photos */}
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-xl)",
                    padding: "1rem",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start", marginBottom: "0.875rem" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "#E3F2FD",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Camera size={20} color="#1565C0" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-dark)" }}>
                        Add Photos
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "#888", marginTop: "2px", lineHeight: 1.4 }}>
                        Photos are the first things members look for in a profile.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/profile/edit?section=photo"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      color: "var(--primary)",
                      fontWeight: 700,
                      fontSize: "0.8125rem",
                      textDecoration: "none",
                    }}
                  >
                    Add Photos Now ▶
                  </Link>
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
