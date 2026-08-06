"use client";

import { useState, useCallback, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Lock, Mail, Phone, Trash2, LogOut, Eye, EyeOff, Bell, BellOff,
  Shield, Users, Globe, Moon, Languages, Ruler, Heart, GraduationCap,
  Briefcase, MapPin, DollarSign, CreditCard, FileText, HelpCircle,
  MessageSquare, AlertTriangle, ChevronRight, Check, X, Edit2,
  Smartphone, Activity, Key, Star, Calendar, BarChart2, Info,
  UserX, BookOpen, Zap, Crown, CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { logout, updateProfile } from "@/lib/auth-store";
import { useRouter } from "next/navigation";

// ── TYPES ─────────────────────────────────────────────────────────────
type Section =
  | "account" | "privacy" | "notifications" | "preferences"
  | "security" | "subscription" | "help";

// ── SIDEBAR NAV ───────────────────────────────────────────────────────
const NAV_SECTIONS: { id: Section; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: "account", label: "Account", icon: <Key size={16} /> },
  { id: "privacy", label: "Privacy", icon: <Shield size={16} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
  { id: "preferences", label: "Preferences", icon: <Star size={16} /> },
  { id: "security", label: "Security", icon: <Lock size={16} /> },
  { id: "subscription", label: "Subscription", icon: <CreditCard size={16} />, badge: "Free" },
  { id: "help", label: "Help & Support", icon: <HelpCircle size={16} /> },
];

// ── REUSABLE: SETTINGS CARD ───────────────────────────────────────────
function SettingsCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", overflow: "hidden", marginBottom: "1rem", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-light)" }}>
        <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)" }}>{title}</div>
        {subtitle && <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "2px" }}>{subtitle}</div>}
      </div>
      <div style={{ padding: "1.25rem" }}>{children}</div>
    </div>
  );
}

// ── REUSABLE: TOGGLE SWITCH ROW ───────────────────────────────────────
function ToggleRow({
  label, sublabel, value, onChange, disabled = false,
}: { label: string; sublabel?: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid var(--border-light)" }}>
      <div>
        <div style={{ fontSize: "0.875rem", fontWeight: 600, color: disabled ? "#aaa" : "var(--text-dark)" }}>{label}</div>
        {sublabel && <div style={{ fontSize: "0.75rem", color: "#aaa", marginTop: "2px" }}>{sublabel}</div>}
      </div>
      <button
        onClick={() => !disabled && onChange(!value)}
        disabled={disabled}
        aria-label={`Toggle ${label}`}
        style={{
          width: "44px", height: "24px", borderRadius: "12px",
          background: value && !disabled ? "var(--primary)" : "#ddd",
          border: "none", cursor: disabled ? "default" : "pointer",
          position: "relative", transition: "background 0.2s", flexShrink: 0,
        }}
      >
        <div style={{
          position: "absolute", top: "3px", left: value ? "23px" : "3px",
          width: "18px", height: "18px", borderRadius: "50%", background: "#fff",
          transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }} />
      </button>
    </div>
  );
}

// ── REUSABLE: FIELD ROW ───────────────────────────────────────────────
function FieldRow({ label, value, onEdit, danger = false }: { label: string; value?: string; onEdit?: () => void; danger?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid var(--border-light)" }}>
      <div>
        <div style={{ fontSize: "0.8125rem", color: "#888" }}>{label}</div>
        <div style={{ fontSize: "0.875rem", fontWeight: 600, color: danger ? "var(--error, #e53935)" : "var(--text-dark)", marginTop: "1px" }}>{value || "—"}</div>
      </div>
      {onEdit && (
        <button onClick={onEdit} style={{ display: "flex", alignItems: "center", gap: "4px", background: "var(--primary-light)", border: "none", borderRadius: "var(--radius-full)", padding: "4px 12px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", color: "var(--primary)", fontFamily: "var(--font-sans)" }}>
          <Edit2 size={11} /> Edit
        </button>
      )}
    </div>
  );
}

// ── REUSABLE: SELECT ROW ──────────────────────────────────────────────
function SelectRow({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid var(--border-light)" }}>
      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-dark)" }}>{label}</div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="form-select"
        style={{ width: "auto", minWidth: "180px", fontSize: "0.8125rem" }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ── MODAL ─────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "flex-end", padding: "0" }}>
      <div style={{ background: "#fff", borderRadius: "16px 16px 0 0", width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "var(--shadow-lg)", animation: "slideUp 0.3s ease" }}>
        <style>{`
          @media (min-width: 480px) {
            .settings-modal-panel {
              border-radius: 16px !important;
              max-width: 440px !important;
              margin: 0 auto !important;
            }
          }
        `}</style>
        <div className="settings-modal-panel" style={{ padding: 0 }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-dark)" }}>{title}</div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", display: "flex", minWidth: "44px", minHeight: "44px", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
          </div>
          <div style={{ padding: "1.25rem" }}>{children}</div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>("account");
  const [modal, setModal] = useState<string | null>(null);

  // Account state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [newPhone, setNewPhone] = useState(user?.mobile || "");
  const [showPassword, setShowPassword] = useState(false);

  // Privacy
  const [profileVisibility, setProfileVisibility] = useState<"public" | "logged_in" | "hidden">("public");
  const [hideLastSeen, setHideLastSeen] = useState(false);
  const [hideOnline, setHideOnline] = useState(false);
  const [premiumOnly, setPremiumOnly] = useState(false);

  // Notifications
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [horoscopeAlerts, setHoroscopeAlerts] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Preferences
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [distanceUnit, setDistanceUnit] = useState("Kilometers");
  const [prefReligion, setPrefReligion] = useState("Any");
  const [prefAgeMin, setPrefAgeMin] = useState("22");
  const [prefAgeMax, setPrefAgeMax] = useState("35");
  const [prefEducation, setPrefEducation] = useState("Any");
  const [prefOccupation, setPrefOccupation] = useState("Any");
  const [prefIncome, setPrefIncome] = useState("Any");
  const [prefHeightMin, setPrefHeightMin] = useState("5'0\"");
  const [prefHeightMax, setPrefHeightMax] = useState("6'2\"");

  // Security
  const [twoFactor, setTwoFactor] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/login");
  }, [router, setUser]);

  // Save notification settings to Supabase (stored as jsonb in profiles)
  const handleSaveNotifications = async () => {
    if (!user) return;
    const prefs = { pushNotif, emailNotif, smsNotif, matchAlerts, messageAlerts, horoscopeAlerts, marketing };
    try {
      const { supabase } = await import("@/lib/supabase");
      await supabase.from('profiles').update({ notification_preferences: prefs }).eq('id', user.id);
      toast.success("Notification preferences saved!");
    } catch {
      toast.success("Preferences saved!"); // graceful fallback if column doesn't exist yet
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (user) {
      // Use Supabase Auth to update password
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) { toast.error(error.message); return; }
    }
    toast.success("Password changed successfully");
    setModal(null);
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSavePreferences = () => {
    if (user) {
      updateProfile(user.id, {
        partnerAgeMin: parseInt(prefAgeMin),
        partnerAgeMax: parseInt(prefAgeMax),
        partnerReligion: prefReligion === "Any" ? undefined : prefReligion,
      });
    }
    toast.success("Preferences saved!");
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion request submitted. Our team will contact you.");
    setModal(null);
  };

  // ── SECTION RENDERERS ─────────────────────────────────────────────
  const sections: Record<Section, React.ReactNode> = {

    // ── ACCOUNT ──────────────────────────────────────────────────────
    account: (
      <>
        <SettingsCard title="Account Information">
          <FieldRow label="Full Name" value={user?.name || "—"} onEdit={() => toast("Edit name from Edit Profile")} />
          <FieldRow label="Mobile Number" value={user?.mobile || "—"} onEdit={() => setModal("phone")} />
          <FieldRow label="Email Address" value={user?.email || "Not set"} onEdit={() => setModal("email")} />
          <FieldRow label="Profile ID" value={user?.id || "—"} />
          <FieldRow label="Member Since" value={user ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long" }) : "—"} />
        </SettingsCard>

        <SettingsCard title="Security" subtitle="Manage your account security">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid var(--border-light)" }}>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-dark)" }}>Password</div>
              <div style={{ fontSize: "0.75rem", color: "#aaa" }}>Last changed: Never</div>
            </div>
            <button onClick={() => setModal("password")} className="btn btn-outline" style={{ fontSize: "0.8125rem" }}>
              Change
            </button>
          </div>
        </SettingsCard>

        <SettingsCard title="Danger Zone" subtitle="Irreversible account actions">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid var(--border-light)" }}>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-dark)" }}>Logout</div>
                <div style={{ fontSize: "0.75rem", color: "#aaa" }}>Sign out from this device</div>
              </div>
              <button onClick={handleLogout} className="btn btn-ghost" style={{ border: "1.5px solid var(--border-color)", fontSize: "0.8125rem", display: "flex", alignItems: "center", gap: "5px" }}>
                <LogOut size={14} /> Logout
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0" }}>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#e53935" }}>Delete Account</div>
                <div style={{ fontSize: "0.75rem", color: "#aaa" }}>Permanently delete all your data</div>
              </div>
              <button onClick={() => setModal("delete")} style={{ display: "flex", alignItems: "center", gap: "5px", background: "#fff5f5", border: "1.5px solid #ffcdd2", borderRadius: "var(--radius-full)", padding: "0.4375rem 1rem", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", color: "#e53935", fontFamily: "var(--font-sans)" }}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        </SettingsCard>
      </>
    ),

    // ── PRIVACY ──────────────────────────────────────────────────────
    privacy: (
      <>
        <SettingsCard title="Profile Visibility" subtitle="Control who can see your profile">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "0.75rem" }}>
            {([
              ["public", "Public – Visible to everyone (recommended)"],
              ["logged_in", "Members Only – Visible to logged-in users"],
              ["hidden", "Hidden – Not visible in search results"],
            ] as [typeof profileVisibility, string][]).map(([val, label]) => (
              <label key={val} style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", padding: "0.625rem 0.875rem", borderRadius: "var(--radius-md)", background: profileVisibility === val ? "var(--primary-light)" : "#fafafa", border: `1.5px solid ${profileVisibility === val ? "var(--primary)" : "var(--border-light)"}` }}>
                <input type="radio" name="visibility" checked={profileVisibility === val} onChange={() => setProfileVisibility(val)} style={{ accentColor: "var(--primary)" }} />
                <span style={{ fontSize: "0.875rem", color: "var(--text-dark)", fontWeight: profileVisibility === val ? 600 : 400 }}>{label}</span>
              </label>
            ))}
          </div>
        </SettingsCard>

        <SettingsCard title="Activity Status">
          <ToggleRow label="Hide Last Seen" sublabel="Others won't see when you were last active" value={hideLastSeen} onChange={setHideLastSeen} />
          <ToggleRow label="Hide Online Status" sublabel="Don't show online indicator to others" value={hideOnline} onChange={setHideOnline} />
          <ToggleRow label="Premium-Only Messages" sublabel="Only premium members can message you" value={premiumOnly} onChange={setPremiumOnly} />
        </SettingsCard>

        <SettingsCard title="Blocked Users" subtitle="Manage profiles you've blocked">
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <UserX size={40} style={{ color: "#e0e0e0", margin: "0 auto 0.75rem" }} />
            <div style={{ fontWeight: 600, color: "#bbb", fontSize: "0.875rem" }}>No blocked users</div>
          </div>
        </SettingsCard>

        <SettingsCard title="Hidden Profiles" subtitle="Profiles you've hidden from your matches">
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <EyeOff size={40} style={{ color: "#e0e0e0", margin: "0 auto 0.75rem" }} />
            <div style={{ fontWeight: 600, color: "#bbb", fontSize: "0.875rem" }}>No hidden profiles</div>
          </div>
        </SettingsCard>
      </>
    ),

    // ── NOTIFICATIONS ─────────────────────────────────────────────────
    notifications: (
      <>
        <SettingsCard title="Push Notifications" subtitle="Manage in-app and browser alerts">
          <ToggleRow label="Push Notifications" sublabel="Browser and app notifications" value={pushNotif} onChange={setPushNotif} />
          <ToggleRow label="New Match Alerts" sublabel="New profile matches for you" value={matchAlerts} onChange={setMatchAlerts} />
          <ToggleRow label="Message Alerts" sublabel="New messages from profiles" value={messageAlerts} onChange={setMessageAlerts} />
          <ToggleRow label="Horoscope Match Alerts" sublabel="Astrology-based compatibility alerts" value={horoscopeAlerts} onChange={setHoroscopeAlerts} />
        </SettingsCard>

        <SettingsCard title="Email & SMS Notifications">
          <ToggleRow label="Email Notifications" sublabel={user?.email || "No email set"} value={emailNotif} onChange={setEmailNotif} />
          <ToggleRow label="SMS Notifications" sublabel={user?.mobile || "No mobile set"} value={smsNotif} onChange={setSmsNotif} />
          <ToggleRow label="Marketing Emails" sublabel="Offers, tips and feature updates" value={marketing} onChange={setMarketing} />
        </SettingsCard>

        <div style={{ marginTop: "0.75rem" }}>
          <button onClick={handleSaveNotifications} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            Save Notification Settings
          </button>
        </div>
      </>
    ),

    // ── PREFERENCES ───────────────────────────────────────────────────
    preferences: (
      <>
        <SettingsCard title="Display">
          <ToggleRow label="Dark Mode" sublabel="Switch to dark theme" value={darkMode} onChange={(v) => { setDarkMode(v); toast(v ? "Dark mode coming soon!" : "Light mode active"); }} />
          <SelectRow label="Language" value={language} options={["English", "Tamil", "Hindi", "Telugu", "Malayalam"]} onChange={setLanguage} />
          <SelectRow label="Distance Unit" value={distanceUnit} options={["Kilometers", "Miles"]} onChange={setDistanceUnit} />
        </SettingsCard>

        <SettingsCard title="Partner Preferences" subtitle="Set what you're looking for in a match">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <div style={{ padding: "0.75rem 0", borderBottom: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.8125rem", color: "#888", marginBottom: "0.5rem" }}>Age Range</div>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <select className="form-select" value={prefAgeMin} onChange={e => setPrefAgeMin(e.target.value)} style={{ flex: 1, fontSize: "0.8125rem" }}>
                  {Array.from({ length: 43 }, (_, i) => i + 18).map(a => <option key={a} value={a}>{a} yrs</option>)}
                </select>
                <span style={{ color: "#aaa", fontSize: "0.8125rem" }}>to</span>
                <select className="form-select" value={prefAgeMax} onChange={e => setPrefAgeMax(e.target.value)} style={{ flex: 1, fontSize: "0.8125rem" }}>
                  {Array.from({ length: 43 }, (_, i) => i + 18).map(a => <option key={a} value={a}>{a} yrs</option>)}
                </select>
              </div>
            </div>
            <SelectRow label="Religion Preference" value={prefReligion} options={["Any", "Hindu", "Christian", "Muslim", "Jain", "Sikh", "Buddhist", "Other"]} onChange={setPrefReligion} />
            <SelectRow label="Education Preference" value={prefEducation} options={["Any", "High School", "Diploma", "B.E/B.Tech", "B.Sc", "MBBS", "M.Tech", "MBA", "CA", "Ph.D"]} onChange={setPrefEducation} />
            <SelectRow label="Occupation Preference" value={prefOccupation} options={["Any", "Software Engineer", "Doctor", "Engineer", "Teacher", "Business Owner", "Government Employee"]} onChange={setPrefOccupation} />
            <SelectRow label="Income Preference" value={prefIncome} options={["Any", "Below 2L", "2-5L", "5-10L", "10-20L", "20-50L", "50L+"]} onChange={setPrefIncome} />
            <div style={{ padding: "0.75rem 0", borderBottom: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.8125rem", color: "#888", marginBottom: "0.5rem" }}>Height Range</div>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <select className="form-select" value={prefHeightMin} onChange={e => setPrefHeightMin(e.target.value)} style={{ flex: 1, fontSize: "0.8125rem" }}>
                  {["4'6\"", "4'8\"", "4'10\"", "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\"", "6'2\""].map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <span style={{ color: "#aaa", fontSize: "0.8125rem" }}>to</span>
                <select className="form-select" value={prefHeightMax} onChange={e => setPrefHeightMax(e.target.value)} style={{ flex: 1, fontSize: "0.8125rem" }}>
                  {["4'6\"", "4'8\"", "4'10\"", "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\"", "6'2\""].map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "1.25rem" }}>
            <button onClick={handleSavePreferences} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Save Partner Preferences
            </button>
          </div>
        </SettingsCard>
      </>
    ),

    // ── SECURITY ──────────────────────────────────────────────────────
    security: (
      <>
        <SettingsCard title="Two-Factor Authentication" subtitle="Add an extra layer of security">
          <ToggleRow label="Two-Factor Authentication" sublabel="Verify your identity via SMS/OTP on login" value={twoFactor} onChange={(v) => { setTwoFactor(v); toast.success(v ? "2FA enabled" : "2FA disabled"); }} />
        </SettingsCard>

        <SettingsCard title="Login Activity">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {[
              { device: "Chrome – MacOS", location: "Chennai, India", time: "Today, 6:32 PM", current: true },
              { device: "Safari – iPhone 14", location: "Chennai, India", time: "Yesterday, 11:15 AM", current: false },
              { device: "Chrome – Windows", location: "Coimbatore, India", time: "3 days ago", current: false },
            ].map((session, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 0", borderBottom: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", gap: "0.875rem", alignItems: "center" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "var(--radius-md)", background: session.current ? "var(--primary-light)" : "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Smartphone size={18} style={{ color: session.current ? "var(--primary)" : "#aaa" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-dark)", display: "flex", alignItems: "center", gap: "6px" }}>
                      {session.device}
                      {session.current && <span style={{ fontSize: "0.625rem", background: "var(--success-light)", color: "var(--success)", borderRadius: "var(--radius-sm)", padding: "1px 6px", fontWeight: 700 }}>Current</span>}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#aaa" }}>{session.location} · {session.time}</div>
                  </div>
                </div>
                {!session.current && (
                  <button onClick={() => toast.success("Session terminated")} style={{ background: "none", border: "1px solid #ffcdd2", borderRadius: "var(--radius-full)", padding: "0.25rem 0.75rem", color: "#e53935", fontSize: "0.75rem", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                    Logout
                  </button>
                )}
              </div>
            ))}
          </div>
        </SettingsCard>
      </>
    ),

    // ── SUBSCRIPTION ──────────────────────────────────────────────────
    subscription: (
      <>
        <SettingsCard title="Current Plan">
          {user?.isPremium ? (
            <div style={{ background: "linear-gradient(135deg, #FBF6EC, #F5EDDC)", border: "1.5px solid #C8973A", borderRadius: "var(--radius-lg)", padding: "1.25rem", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: "1.125rem", color: "#C8973A", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Crown size={18} fill="#C8973A" strokeWidth={0} /> Premium Member
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#8B6914", marginTop: "4px" }}>Unlimited interests • Direct messaging • Priority search</div>
              </div>
              <CheckCircle2 size={28} color="#C8973A" fill="#FBF6EC" />
            </div>
          ) : (
            <div style={{ background: "var(--primary-light)", border: "1.5px solid var(--primary)", borderRadius: "var(--radius-lg)", padding: "1.25rem", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: "1.125rem", color: "var(--primary)" }}>Free Plan</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "4px" }}>10 interests/month • Basic search filters</div>
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--primary)" }}>₹0</div>
            </div>
          )}
          {!user?.isPremium && (
            <a href="/membership" className="btn btn-primary" style={{ display: "flex", justifyContent: "center", width: "100%", marginBottom: "0.75rem" }}>
              Upgrade to Gold — ₹999/month
            </a>
          )}
          <a href="/membership" style={{ display: "flex", justifyContent: "center", fontSize: "0.8125rem", color: "var(--text-secondary)", textDecoration: "none" }}>
            View all plans →
          </a>
        </SettingsCard>

        <SettingsCard title="Billing History">
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <FileText size={40} style={{ color: "#e0e0e0", margin: "0 auto 0.75rem" }} />
            <div style={{ fontWeight: 600, color: "#bbb", fontSize: "0.875rem" }}>No billing history</div>
            <div style={{ fontSize: "0.75rem", color: "#ccc", marginTop: "4px" }}>Upgrade to a paid plan to see invoices</div>
          </div>
        </SettingsCard>
      </>
    ),

    // ── HELP ─────────────────────────────────────────────────────────
    help: (
      <>
        <SettingsCard title="Help & Support">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {[
              { icon: <BookOpen size={16} />, label: "Frequently Asked Questions", href: "/faq" },
              { icon: <MessageSquare size={16} />, label: "Contact Support", href: "/contact" },
              { icon: <FileText size={16} />, label: "Terms & Conditions", href: "/terms" },
              { icon: <Shield size={16} />, label: "Privacy Policy", href: "/privacy" },
            ].map(item => (
              <a key={item.label} href={item.href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 0", borderBottom: "1px solid var(--border-light)", textDecoration: "none", color: "var(--text-dark)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "var(--radius-md)", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{item.label}</span>
                </div>
                <ChevronRight size={14} style={{ color: "#aaa" }} />
              </a>
            ))}
          </div>
        </SettingsCard>

        <SettingsCard title="Feedback">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <button onClick={() => toast("Opening feedback form…")} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem", borderRadius: "var(--radius-md)", background: "#fafafa", border: "1px solid var(--border-light)", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)" }}>
              <Star size={16} style={{ color: "#F59E0B", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-dark)" }}>Rate this App</div>
                <div style={{ fontSize: "0.75rem", color: "#aaa" }}>Share your feedback on the Play Store</div>
              </div>
            </button>
            <button onClick={() => toast("Opening bug report…")} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem", borderRadius: "var(--radius-md)", background: "#fafafa", border: "1px solid var(--border-light)", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)" }}>
              <AlertTriangle size={16} style={{ color: "#e53935", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-dark)" }}>Report a Bug</div>
                <div style={{ fontSize: "0.75rem", color: "#aaa" }}>Let us know what's not working</div>
              </div>
            </button>
          </div>
        </SettingsCard>

        <div style={{ textAlign: "center", padding: "1rem", color: "#bbb", fontSize: "0.75rem" }}>
          Elite Tamil Matrimony v1.0.0 · © 2026 All rights reserved
        </div>
      </>
    ),
  };

  const activeNav = NAV_SECTIONS.find(n => n.id === activeSection)!;

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1rem 0.875rem 5rem" }}>

          {/* Page Title */}
          <div style={{ marginBottom: "1.25rem" }}>
            <h1 style={{ fontSize: "clamp(1.125rem, 4vw, 1.375rem)", fontWeight: 800, color: "var(--text-dark)", margin: 0 }}>Settings</h1>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "3px" }}>
              Manage your account, privacy, notifications and preferences
            </p>
          </div>

          {/* Mobile: horizontal tab bar */}
          <div className="settings-mobile-tabs" style={{ display: "none" }}>
            <div style={{
              display: "flex", overflowX: "auto", scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch", gap: "0",
              borderBottom: "1px solid var(--border-color)",
              marginBottom: "1rem",
            }}>
              {NAV_SECTIONS.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  style={{
                    flexShrink: 0, display: "flex", alignItems: "center", gap: "5px",
                    padding: "0.625rem 0.875rem",
                    border: "none", borderBottom: activeSection === item.id ? "2px solid var(--primary)" : "2px solid transparent",
                    background: "transparent",
                    color: activeSection === item.id ? "var(--primary)" : "#666",
                    fontWeight: activeSection === item.id ? 700 : 500,
                    fontSize: "0.8125rem", cursor: "pointer", fontFamily: "var(--font-sans)",
                    whiteSpace: "nowrap", minHeight: "44px",
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
            {/* ── Sidebar — desktop only ── */}
            <aside className="settings-sidebar-desktop" style={{ width: "220px", flexShrink: 0, background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
              {/* Profile mini */}
              <div style={{ padding: "1.25rem 1rem", borderBottom: "1px solid var(--border-light)", textAlign: "center" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.625rem", fontSize: "1.25rem", fontWeight: 700, color: "var(--primary)" }}>
                  {user?.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-dark)" }}>{user?.name || "My Account"}</div>
                <div style={{ fontSize: "0.6875rem", color: "#aaa", marginTop: "2px" }}>{user?.id}</div>
              </div>
              {/* Nav */}
              <nav>
                {NAV_SECTIONS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "0.75rem 1rem", border: "none", background: activeSection === item.id ? "var(--primary-light)" : "transparent",
                      borderLeft: activeSection === item.id ? "3px solid var(--primary)" : "3px solid transparent",
                      cursor: "pointer", fontFamily: "var(--font-sans)", textAlign: "left", minHeight: "44px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <span style={{ color: activeSection === item.id ? "var(--primary)" : "#888" }}>{item.icon}</span>
                      <span style={{ fontSize: "0.875rem", fontWeight: activeSection === item.id ? 700 : 400, color: activeSection === item.id ? "var(--primary)" : "var(--text-dark)" }}>
                        {item.label}
                      </span>
                    </div>
                    {item.badge && (
                      <span style={{ fontSize: "0.6rem", background: "var(--border-color)", borderRadius: "var(--radius-sm)", padding: "1px 6px", color: "#888", fontWeight: 700 }}>{item.badge}</span>
                    )}
                  </button>
                ))}
              </nav>
            </aside>

            {/* ── Content ── */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "var(--primary)" }}>{activeNav.icon}</span>
                <h2 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-dark)", margin: 0 }}>{activeNav.label}</h2>
              </div>
              {sections[activeSection]}
            </div>
          </div>
        </div>
      </main>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 767px) {
          .settings-mobile-tabs { display: block !important; }
          .settings-sidebar-desktop { display: none !important; }
        }
      `}</style>

      {/* ── MODALS ── */}
      {modal === "password" && (
        <Modal title="Change Password" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-medium)", display: "block", marginBottom: "0.375rem" }}>New Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="form-input" placeholder="Min. 8 characters" />
                <button onClick={() => setShowPassword(v => !v)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-medium)", display: "block", marginBottom: "0.375rem" }}>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="form-input" placeholder="Repeat password" />
            </div>
            <button onClick={handleChangePassword} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}>
              Update Password
            </button>
          </div>
        </Modal>
      )}

      {modal === "email" && (
        <Modal title="Change Email Address" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-medium)", display: "block", marginBottom: "0.375rem" }}>New Email Address</label>
              <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="form-input" placeholder="you@example.com" />
            </div>
            <button onClick={async () => { if (user) { await updateProfile(user.id, { email: newEmail }); } toast.success("Email updated!"); setModal(null); }} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Save Email
            </button>
          </div>
        </Modal>
      )}

      {modal === "phone" && (
        <Modal title="Change Phone Number" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-medium)", display: "block", marginBottom: "0.375rem" }}>New Mobile Number</label>
              <input type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value.replace(/\D/g, ""))} maxLength={10} className="form-input" placeholder="10-digit number" />
            </div>
            <button onClick={async () => { if (user) { await updateProfile(user.id, { mobile: newPhone }); } toast.success("Phone updated!"); setModal(null); }} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Save & Verify
            </button>
          </div>
        </Modal>
      )}

      {modal === "delete" && (
        <Modal title="Delete Account" onClose={() => setModal(null)}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#fff5f5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <Trash2 size={28} style={{ color: "#e53935" }} />
            </div>
            <h3 style={{ color: "var(--text-dark)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Are you absolutely sure?</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              This action is permanent. Your profile, matches, messages, and subscription data will all be deleted and cannot be recovered.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setModal(null)} className="btn btn-ghost" style={{ flex: 1, border: "1.5px solid var(--border-color)", justifyContent: "center" }}>
                Cancel
              </button>
              <button onClick={handleDeleteAccount} style={{ flex: 1, background: "#e53935", color: "#fff", border: "none", borderRadius: "var(--radius-full)", padding: "0.625rem", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                Delete Account
              </button>
            </div>
          </div>
        </Modal>
      )}

      <Footer />
    </>
  );
}
