"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, Phone, Upload, X, Check, AlertCircle, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { registerUser, saveCompatibilityAnswers } from "@/lib/auth-store";
import { uploadProfilePhoto } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useMSG91 } from "@/hooks/useMSG91";
import {
  RELIGIONS, RELIGION_TO_CASTES, CASTE_TO_SUBCASTE, MOTHER_TONGUES, HEIGHTS,
  EDUCATION_LEVELS, OCCUPATIONS, INCOME_RANGES, INDIAN_STATES,
  CITIES_BY_STATE, MARITAL_STATUS, EATING_HABITS, DHOSHAM_OPTIONS,
  PROFILE_FOR_OPTIONS,
} from "@/data/matrimony-data";
import {
  COMPATIBILITY_QUESTIONS,
} from "@/data/compatibility-questions";
import SearchableSelect from "@/components/ui/SearchableSelect";

// HEIGHTS is {value: number (cm), label: string}[] — use cm as option value
const HEIGHT_OPTIONS = HEIGHTS.map((h) => ({ value: String(h.value), label: h.label }));
// INCOME_RANGES is {value, label}[] — flatten to label strings
const INCOME_OPTIONS = INCOME_RANGES.map((r) => r.label);
// Max DOB for 18+ validation — computed once at module load (never during render)
const MAX_DOB_DATE = new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

// DOB dropdown helpers
const MONTHS = [
  { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" },
  { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" },
  { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" },
  { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" },
];

function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

function dobPartsToString(day: string, month: string, year: string): string {
  if (!day || !month || !year) return "";
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 60 }, (_, i) => CURRENT_YEAR - 18 - i); // 18..78 years ago

// ── Inline field error display ────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p style={{
      fontSize: "0.75rem",
      color: "#D32F2F",
      marginTop: "0.25rem",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    }} role="alert">
      <AlertCircle size={12} aria-hidden="true" />
      {msg}
    </p>
  );
}

// ── Validation helpers ────────────────────────────────────────────────────
function validateEmail(v: string): string {
  if (!v.trim()) return "";
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(v)) return "Email is invalid.";
  return "";
}

function validatePassword(v: string): string {
  if (!v) return "";
  if (v.length < 6) return "Password must contain at least 6 characters.";
  return "";
}

function validateMobile(v: string): string {
  if (!v) return "Mobile Number is required.";
  if (v.length !== 10) return "Mobile Number must be exactly 10 digits.";
  if (!/^\d{10}$/.test(v)) return "Mobile Number must contain only digits.";
  return "";
}

function validateDob(v: string): string {
  if (!v) return "Date of Birth is required.";
  if (v > MAX_DOB_DATE) return "You must be at least 18 years old.";
  return "";
}

// ---- Pill button selector ----
function PillGroup({ label, options, value, onChange, required }: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{ display: "block", fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)", marginBottom: "0.625rem" }}>
        {label}{required && <span style={{ color: "var(--primary)", marginLeft: "2px" }}>*</span>}
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }} role="group" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            style={{
              padding: "0.4375rem 1.125rem",
              borderRadius: "var(--radius-full)",
              border: "1.5px solid " + (value === opt ? "var(--primary)" : "var(--border-color)"),
              background: value === opt ? "var(--primary)" : "#fff",
              color: value === opt ? "#fff" : "var(--text-dark)",
              fontWeight: value === opt ? 700 : 400,
              fontSize: "0.875rem",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (value !== opt) {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.color = "var(--primary)";
              }
            }}
            onMouseLeave={(e) => {
              if (value !== opt) {
                e.currentTarget.style.borderColor = "var(--border-color)";
                e.currentTarget.style.color = "var(--text-dark)";
              }
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---- Floated label select — accepts string[] or {value,label}[] ----
function FloatSelect({ label, value, onChange, options, placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[] | { value: string; label: string }[];
  placeholder?: string;
}) {
  const normalized = (options as Array<string | { value: string; label: string }>).map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  return (
    <div style={{ position: "relative", marginBottom: "1rem" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-select"
        aria-label={label}
        style={{ paddingTop: value ? "1.375rem" : "0.75rem", paddingBottom: value ? "0.375rem" : "0.75rem" }}
      >
        <option value="">{placeholder || `Select ${label}`}</option>
        {normalized.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {value && (
        <span style={{ position: "absolute", top: "0.3125rem", left: "0.875rem", fontSize: "0.6875rem", color: "var(--primary)", fontWeight: 700, pointerEvents: "none", letterSpacing: "0.02em" }}>
          {label}
        </span>
      )}
    </div>
  );
}

// ---- Step progress bar ----
function StepProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round(((step) / total) * 100);
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)" }}>Step {step} of {total}</span>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)" }}>{pct}% complete</span>
      </div>
      <div style={{ height: "5px", background: "var(--border-light)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: "linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)",
            borderRadius: "var(--radius-full)",
            transition: "width 0.4s ease",
          }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Registration progress: ${pct}%`}
        />
      </div>
    </div>
  );
}

// ---- Step header ----
function StepHeader({ step, total, title, onBack }: { step: number; total: number; title: string; onBack?: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {onBack && (
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "var(--text-dark)", display: "flex" }}>
            <ChevronLeft size={20} />
          </button>
        )}
        <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-dark)", margin: 0 }}>{title}</h2>
      </div>
      <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-muted)" }}>Step {step}/{total}</span>
    </div>
  );
}

// ---- Main Register Wizard ----
function RegisterWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refresh } = useAuth();
  const msg91 = useMSG91();

  // Data passed from homepage form
  const initProfileFor = searchParams.get("profileFor") || "";
  const initName = searchParams.get("name") || "";
  const initMobile = searchParams.get("mobile") || "";

  // Step state:
  //   0 = Basic info (profile_for / name / mobile / DOB / gender) — pre-filled from homepage if applicable
  //   1 = Personal & Religious Details
  //   2 = Education & Career
  //   3 = Add Photo
  // ALWAYS start at step 0 so DOB and gender are always collected.
  // Homepage pre-fills name/mobile but DOB/gender still need to be entered.
  const [step, setStep] = useState(0);

  // Form data
  const [form, setForm] = useState({
    profileFor: initProfileFor,
    name: initName,
    mobile: initMobile,
    dob: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    gender: "",
    password: "",
    email: "",
    // Step 1
    height: "",
    physicalStatus: "Normal",
    maritalStatus: MARITAL_STATUS[0].label,
    religion: "",
    caste: "",
    subcaste: "",
    motherTongue: "Tamil",
    // Step 2
    education: "",
    occupation: "",
    income: "",
    state: "",
    city: "",
    diet: "",
    star: "",
    rasi: "",
    // Step 3 — Partner Preferences
    partnerAgeMin: 22,
    partnerAgeMax: 35,
    partnerReligion: "",
    partnerMaritalStatus: [] as string[],
    partnerState: "",
    // Step 5 — Photo
    photoUrl: "",
    about: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);  // ← prevents double-submit

  // Compatibility answers (step 4)
  const [compatAnswers, setCompatAnswers] = useState<Record<string, string>>({});

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  // DOB derived values
  const dobDayOptions = form.dobMonth && form.dobYear
    ? Array.from({ length: daysInMonth(Number(form.dobMonth), Number(form.dobYear)) }, (_, i) => i + 1)
    : Array.from({ length: 31 }, (_, i) => i + 1);

  // Sync dob string whenever parts change
  const updateDobPart = (part: "dobDay" | "dobMonth" | "dobYear", val: string) => {
    const next = { ...form, [part]: val };
    // Clamp day if month change makes it invalid
    if (part === "dobMonth" || part === "dobYear") {
      const maxDay = next.dobMonth && next.dobYear ? daysInMonth(Number(next.dobMonth), Number(next.dobYear)) : 31;
      if (Number(next.dobDay) > maxDay) next.dobDay = String(maxDay);
    }
    const dobStr = dobPartsToString(next.dobDay, next.dobMonth, next.dobYear);
    setForm({ ...next, dob: dobStr });
  };

  // Derived: castes based on religion
  const castes = form.religion && RELIGION_TO_CASTES[form.religion] ? RELIGION_TO_CASTES[form.religion] : [];

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpResendSeconds, setOtpResendSeconds] = useState(0);

  // Email OTP state
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [emailOtpSending, setEmailOtpSending] = useState(false);
  const [emailOtpVerifying, setEmailOtpVerifying] = useState(false);
  const [emailResendSecs, setEmailResendSecs] = useState(0);

  // Real-time field errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const setFieldError = (field: string, msg: string) => {
    setFieldErrors((prev) => ({ ...prev, [field]: msg }));
  };
  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  // Countdown timer for OTP resend
  const startResendTimer = () => {
    setOtpResendSeconds(30);
    const interval = setInterval(() => {
      setOtpResendSeconds((s) => {
        if (s <= 1) { clearInterval(interval); return 0; }
        return s - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (!form.mobile || form.mobile.length < 10) { toast.error("Enter valid 10-digit mobile number"); return; }
    setOtp("");
    // Phone must have country code without '+': 91XXXXXXXXXX
    const phone = `91${form.mobile.replace(/\D/g, "")}`;
    const result = await msg91.sendOtp(phone);
    if (!result.success) {
      toast.error(result.error ?? "Failed to send OTP. Please try again.");
      return;
    }
    setOtpSent(true);
    setOtpModalOpen(true);
    startResendTimer();
    toast.success(`OTP sent to +91 ${form.mobile}`);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) { toast.error("Enter the 6-digit OTP"); return; }
    // Step 1: Verify OTP via MSG91 widget — returns a JWT access_token
    const verifyResult = await msg91.verifyOtp(otp);
    if (!verifyResult.success) {
      toast.error(verifyResult.error ?? "Incorrect OTP. Please try again.");
      setOtp("");
      return;
    }
    // Step 2: Server-side validation of the MSG91 JWT token
    try {
      const res = await fetch("/api/verify-msg91-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: verifyResult.accessToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "OTP verification failed. Please try again.");
        setOtp("");
        return;
      }
    } catch {
      toast.error("Network error during verification. Please try again.");
      setOtp("");
      return;
    }
    setOtpVerified(true);
    setOtpModalOpen(false);
    toast.success("Mobile verified successfully!");
  };

  const handleResendOtp = async () => {
    if (otpResendSeconds > 0) return;
    setOtp("");
    startResendTimer();
    // Use retryOtp with null = default channel (SMS)
    const result = await msg91.retryOtp(null);
    if (!result.success) {
      toast.error(result.error ?? "Failed to resend OTP.");
      return;
    }
    toast.success(`OTP resent to +91 ${form.mobile}`);
  };

  // ── Email OTP handlers ──────────────────────────────────────────────────
  const startEmailResendTimer = () => {
    setEmailResendSecs(60);
    const interval = setInterval(() => {
      setEmailResendSecs(s => { if (s <= 1) { clearInterval(interval); return 0; } return s - 1; });
    }, 1000);
  };

  const handleSendEmailOtp = async () => {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailRe.test(form.email)) {
      setFieldError("email", "Please enter a valid email address."); return;
    }
    setEmailOtpSending(true);
    try {
      const res = await fetch("/api/send-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim(), name: form.name || "there" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send OTP.");
      setEmailOtpSent(true);
      setEmailOtp("");
      startEmailResendTimer();
      toast.success(`OTP sent to ${form.email}`);
    } catch (e: unknown) {
      toast.error((e as Error).message);
    } finally { setEmailOtpSending(false); }
  };

  const handleVerifyEmailOtp = async () => {
    if (emailOtp.length !== 6) { toast.error("Enter the 6-digit OTP."); return; }
    setEmailOtpVerifying(true);
    try {
      const res = await fetch("/api/verify-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim(), otp: emailOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Verification failed.");
      setEmailOtpVerified(true);
      clearFieldError("email");
      toast.success("Email verified successfully!");
    } catch (e: unknown) {
      toast.error((e as Error).message);
      setEmailOtp("");
    } finally { setEmailOtpVerifying(false); }
  };

  const handleResendEmailOtp = () => {
    if (emailResendSecs > 0) return;
    setEmailOtp("");
    handleSendEmailOtp();
  };


  const validateStep0 = () => {
    const newErrors: Record<string, string> = {};
    if (!form.profileFor) newErrors.profileFor = "Please select who this profile is for.";
    if (!form.name.trim()) newErrors.name = "Name is required.";
    const mobileErr = validateMobile(form.mobile);
    if (mobileErr) newErrors.mobile = mobileErr;
    const dobErr = validateDob(form.dob);
    if (dobErr) newErrors.dob = dobErr;
    if (!form.gender) newErrors.gender = "Please select your gender.";
    if (!otpVerified) newErrors.otp = "Please verify your mobile number.";
    if (form.email) {
      const emailErr = validateEmail(form.email);
      if (emailErr) newErrors.email = emailErr;
    }
    if (form.password) {
      const pwErr = validatePassword(form.password);
      if (pwErr) newErrors.password = pwErr;
    }
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...newErrors }));
      return false;
    }
    return true;
  };

  // ---- Step 1: Personal & Religious Details ----
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!form.height) newErrors.height = "Please select your height.";
    if (!form.maritalStatus) newErrors.maritalStatus = "Please select marital status.";
    if (!form.religion) newErrors.religion = "Please select a religion.";
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...newErrors }));
      return false;
    }
    return true;
  };

  // ---- Step 2: Education & Career ----
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!form.education) newErrors.education = "Please select your highest education.";
    if (!form.occupation) newErrors.occupation = "Please select your occupation.";
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...newErrors }));
      return false;
    }
    return true;
  };

  // ---- Final registration (with double-submit guard) ----
  const handleComplete = async () => {
    if (isSubmitting) return;          // ← block repeated calls

    // Final required-field check (covers users who started from homepage pre-fill)
    if (!form.name.trim())            { toast.error("Please enter your name"); return; }
    if (!form.mobile || form.mobile.length < 10) { toast.error("Please enter a valid mobile number"); return; }
    if (!form.dob)                    { toast.error("Please enter your date of birth"); return; }
    if (!form.gender)                 { toast.error("Please select your gender"); return; }
    if (!otpVerified)                 { toast.error("Please verify your mobile number first"); return; }

    setIsSubmitting(true);
    try {
      const newUser = await registerUser({
        profileFor: form.profileFor || "Myself",
        name: form.name,
        mobile: form.mobile,
        email: form.email || undefined,
        password: form.password || `ETM_${form.mobile}_2024`,
        dob: form.dob,                 // guaranteed non-empty by guard above
        gender: form.gender as "male" | "female",
        height: form.height,
        physicalStatus: form.physicalStatus,
        maritalStatus: form.maritalStatus,
        religion: form.religion,
        caste: form.caste,
        subcaste: form.subcaste,
        motherTongue: form.motherTongue,
        education: form.education,
        occupation: form.occupation,
        income: form.income,
        state: form.state,
        city: form.city,
        diet: form.diet,
        star: form.star,
        rasi: form.rasi,
        about: form.about,
        photoUrl: form.photoUrl || undefined,
        // Partner preferences
        partnerAgeMin: form.partnerAgeMin || 22,
        partnerAgeMax: form.partnerAgeMax || 35,
        partnerReligion: form.partnerReligion && form.partnerReligion !== "Any" ? form.partnerReligion : undefined,
        partnerMaritalStatus: form.partnerMaritalStatus.length > 0 ? form.partnerMaritalStatus : undefined,
        partnerCountry: form.partnerState && form.partnerState !== "Any" ? "India" : undefined,
      });

      // Save compatibility questionnaire answers (non-fatal if it fails)
      if (newUser.id && Object.keys(compatAnswers).length > 0) {
        saveCompatibilityAnswers(newUser.id, compatAnswers).catch(e =>
          console.warn('[register] Failed to save compatibility answers:', e)
        );
      }

      // Upload photo to Supabase Storage if file was selected
      if (photoFile && newUser.id) {
        try {
          const photoUrl = await uploadProfilePhoto(newUser.id, photoFile);
          const { updateProfile } = await import("@/lib/auth-store");
          await updateProfile(newUser.id, { photoUrl });
        } catch (photoErr) {
          console.warn("Photo upload failed:", photoErr);
          // Non-fatal — user can add photo later
        }
      }

      await refresh();
      toast.success("Profile created successfully! Welcome to Elite Tamil Matrimony");
      router.push("/matches");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      // Map Supabase rate-limit error to a user-friendly message
      if (msg.toLowerCase().includes("security purposes") || msg.toLowerCase().includes("rate") || msg.toLowerCase().includes("42")) {
        toast.error("Please wait a moment before trying again (Supabase rate limit). Try after 1 minute.");
      } else {
        toast.error(msg);
      }
      setIsSubmitting(false);          // ← only reset on error; success navigates away
    }
  };

  // =====================================
  // RENDER STEPS
  // =====================================
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
      {/* Minimal header */}
      <header style={{ background: "#fff", borderBottom: "1px solid var(--border-color)", padding: "0.75rem 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img
              src="/logo.svg"
              alt="Elite Tamil Matrimony"
              style={{ height: "40px", width: "auto" }}
            />
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "var(--text-medium)" }}>
            Need help? Call
            <a href="tel:+914412345678" style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>
              +91 44 1234 5678
            </a>
          </div>
        </div>
      </header>

      {/* ── OTP VERIFICATION MODAL ─────────────────────────────────── */}
      {otpModalOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(26,10,14,0.65)",
            backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem",
          }}
          role="dialog" aria-modal="true" aria-label="OTP Verification"
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "var(--radius-xl)",
              padding: "2rem 1.75rem",
              maxWidth: "380px", width: "100%",
              boxShadow: "0 20px 60px rgba(107,26,42,0.25)",
              position: "relative",
              animation: "slideUp 0.3s ease",
            }}
          >
            {/* Close */}
            <button
              onClick={() => setOtpModalOpen(false)}
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: "4px" }}
              aria-label="Close OTP dialog"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {/* Phone icon with brand colors */}
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: "64px", height: "64px", borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--primary-light), #FFF8F0)",
                  border: "2px solid var(--primary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1rem",
                }}
              >
                <Phone size={28} style={{ color: "var(--primary)" }} />
              </div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-dark)", margin: "0 0 0.375rem" }}>
                Verify Your Mobile
              </h2>
              <p style={{ fontSize: "0.875rem", color: "var(--text-medium)", margin: 0 }}>
                OTP has been sent to
              </p>
              <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--primary)", margin: "0.25rem 0 0" }}>
                +91 {form.mobile.replace(/(\d{5})(\d{5})/, "$1 $2")}
              </p>
            </div>

            {/* 6-box OTP input */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.8125rem", color: "var(--text-medium)", marginBottom: "0.75rem", textAlign: "center", letterSpacing: "0.02em" }}>
                ENTER 6-DIGIT OTP
              </label>
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <input
                    key={i}
                    id={`otp-box-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i] || ""}
                    autoFocus={i === 0}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      const arr = otp.split("");
                      arr[i] = val;
                      const next = arr.join("").slice(0, 6);
                      setOtp(next);
                      // Auto-focus next box
                      if (val && i < 5) {
                        (document.getElementById(`otp-box-${i + 1}`) as HTMLInputElement)?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[i] && i > 0) {
                        (document.getElementById(`otp-box-${i - 1}`) as HTMLInputElement)?.focus();
                      }
                    }}
                    style={{
                      width: "44px", height: "52px",
                      textAlign: "center", fontSize: "1.375rem", fontWeight: 800,
                      border: `2px solid ${otp[i] ? "var(--primary)" : "var(--border-color)"}`,
                      borderRadius: "var(--radius-lg)",
                      background: otp[i] ? "var(--primary-light)" : "#fff",
                      color: "var(--primary)",
                      outline: "none",
                      transition: "all 0.15s",
                      fontFamily: "var(--font-sans)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Verify button */}
            <button
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6}
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", opacity: otp.length !== 6 ? 0.6 : 1, cursor: otp.length !== 6 ? "not-allowed" : "pointer" }}
            >
              Verify &amp; Proceed
            </button>

            {/* Resend */}
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0 0 0.375rem" }}>
                Didn&apos;t receive OTP?
              </p>
              <button
                onClick={handleResendOtp}
                disabled={otpResendSeconds > 0}
                style={{
                  background: "none", border: "none", cursor: otpResendSeconds > 0 ? "not-allowed" : "pointer",
                  fontSize: "0.875rem", fontWeight: 700,
                  color: otpResendSeconds > 0 ? "var(--text-muted)" : "var(--primary)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {otpResendSeconds > 0
                  ? `Resend OTP in ${otpResendSeconds}s`
                  : "Resend OTP"}
              </button>
            </div>

            {/* MSG91 handles OTP delivery — no dev hint needed */}
          </div>
        </div>
      )}

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "1.5rem 1.25rem" }}>

        {/* ===== STEP 0: Basic Info ===== */}
        {step === 0 && (
          <div className="animate-fade-in-up">
            <StepProgressBar step={1} total={5} />
            <StepHeader step={1} total={5} title="Create your profile" />
            <div className="register-card" style={{ background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", padding: "1.5rem" }}>
              {/* Profile for */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)", marginBottom: "0.625rem" }}>
                  This profile is for <span style={{ color: "var(--primary)", marginLeft: "2px" }}>*</span>
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }} role="group" aria-label="Profile for">
                  {PROFILE_FOR_OPTIONS.map((opt) => (
                    <button key={opt.value} type="button" onClick={() => set("profileFor", opt.label)}
                      aria-pressed={form.profileFor === opt.label}
                      style={{
                        padding: "0.4375rem 1.125rem",
                        borderRadius: "var(--radius-full)",
                        border: "1.5px solid " + (form.profileFor === opt.label ? "var(--primary)" : "var(--border-color)"),
                        background: form.profileFor === opt.label ? "var(--primary)" : "#fff",
                        color: form.profileFor === opt.label ? "#fff" : "var(--text-dark)",
                        fontWeight: form.profileFor === opt.label ? 700 : 400,
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => { if (form.profileFor !== opt.label) { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--primary)"; } }}
                      onMouseLeave={(e) => { if (form.profileFor !== opt.label) { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-dark)"; } }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div style={{ marginBottom: "1rem" }}>
                <label className="form-label">
                  {form.profileFor && form.profileFor !== "Myself" ? `${form.profileFor.replace("My ", "")}'s Name` : "Your Name"}
                  <span style={{ color: "var(--primary)", marginLeft: "2px" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={(e) => {
                    set("name", e.target.value);
                    if (!e.target.value.trim()) setFieldError("name", "Name is required.");
                    else clearFieldError("name");
                  }}
                  aria-required="true"
                  style={{ borderColor: fieldErrors.name ? "#D32F2F" : undefined }}
                />
                <FieldError msg={fieldErrors.name} />
              </div>

              {/* Gender */}
              <div style={{ marginBottom: "1.25rem" }}>
                <PillGroup
                  label="Gender"
                  options={["Male", "Female"]}
                  value={form.gender === "male" ? "Male" : form.gender === "female" ? "Female" : ""}
                  onChange={(v) => {
                    set("gender", v.toLowerCase());
                    clearFieldError("gender");
                  }}
                  required
                />
                <FieldError msg={fieldErrors.gender} />
              </div>

              {/* Date of Birth — three dropdowns with leap year support */}
              <div style={{ marginBottom: "1rem" }}>
                <label className="form-label">Date of Birth <span style={{ color: "var(--primary)" }}>*</span></label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: "0.5rem" }}>
                  {/* Day */}
                  <select
                    className="form-select"
                    value={form.dobDay}
                    onChange={(e) => {
                      updateDobPart("dobDay", e.target.value);
                      clearFieldError("dob");
                    }}
                    aria-label="Day of birth"
                    style={{ borderColor: fieldErrors.dob ? "#D32F2F" : undefined }}
                  >
                    <option value="">DD</option>
                    {dobDayOptions.map((d) => (
                      <option key={d} value={String(d)}>{String(d).padStart(2, "0")}</option>
                    ))}
                  </select>
                  {/* Month */}
                  <select
                    className="form-select"
                    value={form.dobMonth}
                    onChange={(e) => {
                      updateDobPart("dobMonth", e.target.value);
                      clearFieldError("dob");
                    }}
                    aria-label="Month of birth"
                    style={{ borderColor: fieldErrors.dob ? "#D32F2F" : undefined }}
                  >
                    <option value="">Month</option>
                    {MONTHS.map((m) => (
                      <option key={m.value} value={String(m.value)}>{m.label}</option>
                    ))}
                  </select>
                  {/* Year */}
                  <select
                    className="form-select"
                    value={form.dobYear}
                    onChange={(e) => {
                      updateDobPart("dobYear", e.target.value);
                      clearFieldError("dob");
                    }}
                    aria-label="Year of birth"
                    style={{ borderColor: fieldErrors.dob ? "#D32F2F" : undefined }}
                  >
                    <option value="">YYYY</option>
                    {YEAR_OPTIONS.map((y) => (
                      <option key={y} value={String(y)}>{y}</option>
                    ))}
                  </select>
                </div>
                {form.dob && (
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    {(() => {
                      const age = Math.floor((Date.now() - new Date(form.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
                      return `Age: ${age} years`;
                    })()}
                  </p>
                )}
                <FieldError msg={fieldErrors.dob} />
              </div>

              {/* Mobile + OTP */}
              <div style={{ marginBottom: "1rem" }}>
                <label className="form-label">Mobile Number <span style={{ color: "var(--primary)" }}>*</span></label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", border: "1.5px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "0.625rem 0.625rem", background: "#F7F7F7", fontSize: "0.875rem", color: "var(--text-dark)", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
                    +91 <ChevronDown size={12} />
                  </div>
                  <input
                    type="tel" className="form-input" placeholder="Enter Mobile Number" maxLength={10}
                    value={form.mobile}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "");
                      set("mobile", v);
                      const err = validateMobile(v);
                      if (err) setFieldError("mobile", err);
                      else clearFieldError("mobile");
                    }}
                    disabled={otpVerified} style={{ flex: 1, opacity: otpVerified ? 0.7 : 1, borderColor: fieldErrors.mobile ? "#D32F2F" : undefined }}
                    aria-required="true"
                  />
                  {otpVerified ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--success)", fontWeight: 700, fontSize: "0.8125rem", flexShrink: 0 }}>
                      <Check size={15} /> Verified
                    </div>
                  ) : (
                    <button
                      type="button" onClick={handleSendOtp}
                      style={{ background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", padding: "0 0.875rem", fontWeight: 700, fontSize: "0.8125rem", cursor: "pointer", fontFamily: "var(--font-sans)", flexShrink: 0, whiteSpace: "nowrap" }}
                    >
                      {otpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                  )}
                </div>
                <FieldError msg={fieldErrors.mobile} />
                {!fieldErrors.mobile && (
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    {otpVerified ? "Mobile number verified ✓" : "OTP will be sent to this number"}
                  </p>
                )}
                {fieldErrors.otp && <FieldError msg={fieldErrors.otp} />}
              </div>

              {/* Optional password */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label className="form-label" htmlFor="password-input">Set Password <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--text-muted)" }}>(optional)</span></label>
                <input
                  id="password-input"
                  type="password"
                  className="form-input"
                  placeholder="Create a login password (min 6 characters)"
                  value={form.password}
                  onChange={(e) => {
                    set("password", e.target.value);
                    const err = validatePassword(e.target.value);
                    if (err) setFieldError("password", err);
                    else clearFieldError("password");
                  }}
                  style={{ borderColor: fieldErrors.password ? "#D32F2F" : undefined }}
                />
                <FieldError msg={fieldErrors.password} />
              </div>

              {/* ── Email with OTP Verification ── */}
              <div style={{ marginBottom: "1.5rem", background: "var(--bg-page)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "1rem 1.125rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.625rem" }}>
                  <Mail size={15} style={{ color: "var(--primary)" }} />
                  <label className="form-label" style={{ margin: 0, fontSize: "0.9375rem" }}>
                    Email Address <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--text-muted)" }}>(optional — get payment receipts)</span>
                  </label>
                </div>

                {!emailOtpVerified ? (
                  <>
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="your@email.com"
                        value={form.email}
                        disabled={emailOtpSent}
                        onChange={(e) => {
                          set("email", e.target.value);
                          clearFieldError("email");
                          setEmailOtpSent(false);
                          setEmailOtpVerified(false);
                        }}
                        style={{ flex: 1, borderColor: fieldErrors.email ? "#D32F2F" : undefined, opacity: emailOtpSent ? 0.7 : 1 }}
                      />
                      {!emailOtpSent ? (
                        <button
                          type="button"
                          onClick={handleSendEmailOtp}
                          disabled={emailOtpSending || !form.email.trim()}
                          style={{ background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", padding: "0 0.875rem", fontWeight: 700, fontSize: "0.8125rem", cursor: emailOtpSending || !form.email.trim() ? "not-allowed" : "pointer", fontFamily: "var(--font-sans)", flexShrink: 0, whiteSpace: "nowrap", opacity: emailOtpSending || !form.email.trim() ? 0.6 : 1 }}
                        >
                          {emailOtpSending ? "Sending…" : "Send OTP"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setEmailOtpSent(false); setEmailOtp(""); }}
                          style={{ background: "none", border: "1.5px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "0 0.75rem", fontWeight: 700, fontSize: "0.8125rem", cursor: "pointer", fontFamily: "var(--font-sans)", flexShrink: 0, color: "var(--text-medium)", whiteSpace: "nowrap" }}
                        >
                          Change
                        </button>
                      )}
                    </div>
                    <FieldError msg={fieldErrors.email} />

                    {emailOtpSent && (
                      <div style={{ marginTop: "0.75rem" }}>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                          OTP sent to <strong>{form.email}</strong>
                        </p>
                        <div style={{ display: "flex", gap: "6px", marginBottom: "0.5rem" }}>
                          {[0,1,2,3,4,5].map(i => (
                            <input
                              key={i}
                              id={`email-otp-reg-${i}`}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={emailOtp[i] || ""}
                              autoFocus={i === 0 && emailOtpSent}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                const arr = emailOtp.split("");
                                arr[i] = val;
                                const next = arr.join("").slice(0, 6);
                                setEmailOtp(next);
                                if (val && i < 5) (document.getElementById(`email-otp-reg-${i+1}`) as HTMLInputElement)?.focus();
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Backspace" && !emailOtp[i] && i > 0)
                                  (document.getElementById(`email-otp-reg-${i-1}`) as HTMLInputElement)?.focus();
                              }}
                              style={{ width: "38px", height: "42px", textAlign: "center", fontSize: "1.125rem", fontWeight: 800, border: `2px solid ${emailOtp[i] ? "var(--primary)" : "var(--border-color)"}`, borderRadius: "var(--radius-md)", background: emailOtp[i] ? "var(--primary-light)" : "#fff", color: "var(--primary)", outline: "none", fontFamily: "var(--font-sans)" }}
                            />
                          ))}
                          <button
                            type="button"
                            onClick={handleVerifyEmailOtp}
                            disabled={emailOtpVerifying || emailOtp.length !== 6}
                            style={{ background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", padding: "0 0.875rem", fontWeight: 700, fontSize: "0.8125rem", cursor: emailOtpVerifying || emailOtp.length !== 6 ? "not-allowed" : "pointer", fontFamily: "var(--font-sans)", flexShrink: 0, opacity: emailOtpVerifying || emailOtp.length !== 6 ? 0.6 : 1 }}
                          >
                            {emailOtpVerifying ? "…" : "Verify"}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={handleResendEmailOtp}
                          disabled={emailResendSecs > 0}
                          style={{ background: "none", border: "none", cursor: emailResendSecs > 0 ? "not-allowed" : "pointer", fontSize: "0.75rem", fontWeight: 700, color: emailResendSecs > 0 ? "var(--text-muted)" : "var(--primary)", fontFamily: "var(--font-sans)" }}
                        >
                          {emailResendSecs > 0 ? `Resend in ${emailResendSecs}s` : "Resend OTP"}
                        </button>
                      </div>
                    )}

                    {!emailOtpSent && (
                      <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "0.375rem" }}>
                        We&apos;ll send a 6-digit OTP to verify your email.
                      </p>
                    )}
                  </>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--success)", fontSize: "0.875rem", fontWeight: 600 }}>
                    <Check size={15} />
                    <span>Email verified: <strong>{form.email}</strong></span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => { if (validateStep0()) setStep(1); }}
                className="btn btn-primary animate-pulse-rose"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Continue
              </button>

              <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", textAlign: "center", marginTop: "0.75rem" }}>
                By continuing, you agree to our{" "}
                <a href="/terms" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>Terms</a>
                {" "}and{" "}
                <a href="/privacy" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>Privacy Policy</a>
              </p>
            </div>
          </div>
        )}

        {/* ===== STEP 1: Personal & Religious Details ===== */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <StepProgressBar step={2} total={5} />
            <StepHeader step={2} total={5} title="Personal and Religious Details" onBack={() => setStep(step - 1)} />
            <div className="register-card" style={{ background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", padding: "1.5rem" }}>
              <h3 style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border-light)" }}>
                Personal Details
              </h3>

              {/* Height */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)", marginBottom: "0.5rem" }}>
                  {form.profileFor && form.profileFor !== "Myself" ? `${form.profileFor.replace("My ", "")}'s` : "Your"} Height <span style={{ color: "var(--primary)" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    className="form-select"
                    value={form.height}
                    onChange={(e) => set("height", e.target.value)}
                    aria-required="true"
                  >
                    <option value="">Select height</option>
                    {HEIGHT_OPTIONS.map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Physical status */}
              <PillGroup
                label={`${form.profileFor && form.profileFor !== "Myself" ? form.profileFor.replace("My ", "") + "'s " : ""}Physical status`}
                options={["Normal", "Physically challenged"]}
                value={form.physicalStatus}
                onChange={(v) => set("physicalStatus", v)}
              />

              {/* Marital status */}
              <PillGroup
                label={`${form.profileFor && form.profileFor !== "Myself" ? form.profileFor.replace("My ", "") + "'s " : ""}Marital status`}
                options={MARITAL_STATUS.map((m) => m.label)}
                value={form.maritalStatus}
                onChange={(v) => set("maritalStatus", v)}
              />

              <h3 style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border-light)", marginTop: "0.5rem" }}>
                Religion &amp; Community
              </h3>

              <FloatSelect
                label="Religion"
                value={form.religion}
                onChange={(v) => {
                  set("religion", v);
                  set("caste", "");
                  set("subcaste", "");
                  if (v) clearFieldError("religion");
                  else setFieldError("religion", "Please select a religion.");
                }}
                options={RELIGIONS}
              />
              <FieldError msg={fieldErrors.religion} />
              {castes.length > 0 && (
                <FloatSelect label="Caste" value={form.caste} onChange={(v) => { set("caste", v); set("subcaste", ""); }} options={castes} />
              )}

              {/* ── SUB-CASTE SECTION ── */}
              {form.caste && (() => {
                const subcasteList = CASTE_TO_SUBCASTE[form.caste] || [];
                // Show searchable dropdown whenever there are sub-caste options
                const hasOptions = subcasteList.length >= 1;

                return (
                  <div style={{ marginBottom: "1rem" }}>
                    {hasOptions ? (
                      <SearchableSelect
                        label="Sub-caste (optional)"
                        value={form.subcaste}
                        onChange={(v) => set("subcaste", v)}
                        options={subcasteList}
                        disabled={!form.caste}
                        placeholder="Select sub-caste"
                      />
                    ) : (
                      // No sub-caste data for this caste — show disabled field
                      <div>
                        <label className="form-label">
                          Sub-caste <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(not applicable)</span>
                        </label>
                        <div
                          className="form-input"
                          style={{ color: "var(--text-muted)", background: "#F7F7F7", cursor: "not-allowed" }}
                          aria-label="No sub-castes available"
                        >
                          No sub-castes available for {form.caste}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              <FloatSelect label="Mother Tongue" value={form.motherTongue} onChange={(v) => set("motherTongue", v)} options={MOTHER_TONGUES} />

              <button
                type="button"
                onClick={() => { if (validateStep1()) setStep(2); }}
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 2: Education & Career / Location ===== */}
        {step === 2 && (
          <div className="animate-fade-in-up">
            <StepProgressBar step={3} total={5} />
            <StepHeader step={3} total={5} title="Education and Career" onBack={() => setStep(1)} />
            <div className="register-card" style={{ background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", padding: "1.5rem" }}>
              <FloatSelect
                label="Highest Education"
                value={form.education}
                onChange={(v) => {
                  set("education", v);
                  if (v) clearFieldError("education");
                  else setFieldError("education", "Please select your education.");
                }}
                options={EDUCATION_LEVELS}
              />
              <FieldError msg={fieldErrors.education} />
              <FloatSelect
                label="Occupation"
                value={form.occupation}
                onChange={(v) => {
                  set("occupation", v);
                  if (v) clearFieldError("occupation");
                  else setFieldError("occupation", "Please select your occupation.");
                }}
                options={OCCUPATIONS}
              />
              <FieldError msg={fieldErrors.occupation} />
              <FloatSelect label="Annual Income (Rs.)" value={form.income} onChange={(v) => set("income", v)} options={INCOME_OPTIONS} />

              <div style={{ marginBottom: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-light)" }}>
                <h3 style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)", marginBottom: "1rem" }}>Location</h3>
                <FloatSelect
                  label="State"
                  value={form.state}
                  onChange={(v) => { set("state", v); set("city", ""); }}
                  options={INDIAN_STATES}
                />
                {form.state && CITIES_BY_STATE[form.state] ? (
                  <FloatSelect
                    label="City"
                    value={form.city}
                    onChange={(v) => set("city", v)}
                    options={CITIES_BY_STATE[form.state]}
                    placeholder="Select city"
                  />
                ) : form.state ? (
                  <div style={{ marginBottom: "1rem" }}>
                    <label className="form-label" htmlFor="city-input">City</label>
                    <input
                      id="city-input"
                      type="text"
                      className="form-input"
                      placeholder="Enter your city"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                    />
                  </div>
                ) : null}
              </div>

              <div style={{ paddingTop: "0.75rem", borderTop: "1px solid var(--border-light)", marginBottom: "0.5rem" }}>
                <h3 style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)", marginBottom: "1rem" }}>Lifestyle</h3>
                <PillGroup label="Diet" options={EATING_HABITS.map((e) => e.label).filter((l) => l !== "Doesn't Matter")} value={form.diet} onChange={(v) => set("diet", v)} />
              </div>

              <button
                type="button"
                onClick={() => { if (validateStep2()) setStep(3); }}
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 3: Partner Preferences ===== */}
        {step === 3 && (
          <div className="animate-fade-in-up">
            <StepProgressBar step={4} total={6} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <button onClick={() => setStep(2)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "var(--text-dark)", display: "flex" }}>
                  <ChevronLeft size={20} />
                </button>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-dark)", margin: 0 }}>Partner Preferences</h2>
              </div>
              <button
                onClick={() => setStep(4)}
                style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: "var(--primary)", fontWeight: 700, fontSize: "0.875rem", fontFamily: "var(--font-sans)" }}
              >
                Skip
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
            <div className="register-card" style={{ background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", padding: "1.5rem" }}>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                Tell us what you&apos;re looking for in a partner. Matches will be scored based on your preferences.
              </p>

              {/* Partner Age Range */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)", marginBottom: "0.625rem" }}>
                  Partner Age Range
                </label>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <select
                    className="form-select"
                    value={form.partnerAgeMin}
                    onChange={e => setForm(f => ({ ...f, partnerAgeMin: Number(e.target.value) }))}
                    style={{ flex: 1 }}
                  >
                    {Array.from({ length: 35 }, (_, i) => 18 + i).map(age => (
                      <option key={age} value={age}>{age} yrs</option>
                    ))}
                  </select>
                  <span style={{ color: "var(--text-muted)", fontWeight: 600, flexShrink: 0 }}>to</span>
                  <select
                    className="form-select"
                    value={form.partnerAgeMax}
                    onChange={e => setForm(f => ({ ...f, partnerAgeMax: Number(e.target.value) }))}
                    style={{ flex: 1 }}
                  >
                    {Array.from({ length: 35 }, (_, i) => 18 + i).map(age => (
                      <option key={age} value={age}>{age} yrs</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Partner Religion */}
              <FloatSelect
                label="Partner Religion"
                value={form.partnerReligion}
                onChange={v => setForm(f => ({ ...f, partnerReligion: v }))}
                options={["Any", ...RELIGIONS]}
                placeholder="Any religion"
              />

              {/* Partner Marital Status */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)", marginBottom: "0.625rem" }}>
                  Acceptable Marital Status
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {MARITAL_STATUS.map(m => {
                    const selected = form.partnerMaritalStatus.includes(m.label);
                    return (
                      <button
                        key={m.label}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, partnerMaritalStatus: selected ? f.partnerMaritalStatus.filter(x => x !== m.label) : [...f.partnerMaritalStatus, m.label] }))}
                        style={{
                          padding: "0.4375rem 1rem",
                          borderRadius: "var(--radius-full)",
                          border: `1.5px solid ${selected ? "var(--primary)" : "var(--border-color)"}`,
                          background: selected ? "var(--primary)" : "#fff",
                          color: selected ? "#fff" : "var(--text-dark)",
                          fontWeight: selected ? 700 : 400,
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred State */}
              <FloatSelect
                label="Preferred State"
                value={form.partnerState}
                onChange={v => setForm(f => ({ ...f, partnerState: v }))}
                options={["Any", ...INDIAN_STATES]}
                placeholder="Any state"
              />

              <button
                type="button"
                onClick={() => setStep(4)}
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}
              >
                Save & Continue
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 4: Compatibility Questions ===== */}
        {step === 4 && (() => {
          const categories = Array.from(new Set(COMPATIBILITY_QUESTIONS.map(q => q.category)));
          const answeredCount = Object.keys(compatAnswers).length;
          const totalQ = COMPATIBILITY_QUESTIONS.length;
          return (
            <div className="animate-fade-in-up">
              <StepProgressBar step={5} total={6} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <button onClick={() => setStep(3)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "var(--text-dark)", display: "flex" }}>
                    <ChevronLeft size={20} />
                  </button>
                  <div>
                    <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-dark)", margin: 0 }}>Compatibility Questions</h2>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "2px 0 0" }}>{answeredCount}/{totalQ} answered</p>
                  </div>
                </div>
                <button
                  onClick={() => setStep(5)}
                  style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: "var(--primary)", fontWeight: 700, fontSize: "0.875rem", fontFamily: "var(--font-sans)" }}
                >
                  Skip
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>

              <div className="register-card" style={{ background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", padding: "1.5rem" }}>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                  These 21 questions help us calculate a compatibility score between you and potential matches. Answers are private — only the score is shared.
                </p>

                {categories.map(category => (
                  <div key={category} style={{ marginBottom: "1.75rem" }}>
                    <h3 style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border-light)" }}>
                      {category}
                    </h3>
                    {COMPATIBILITY_QUESTIONS.filter(q => q.category === category).map(q => (
                      <div key={q.id} style={{ marginBottom: "1.25rem" }}>
                        <label style={{ display: "block", fontWeight: 600, fontSize: "0.9rem", color: "var(--text-dark)", marginBottom: "0.625rem", lineHeight: 1.45 }}>
                          {q.question}
                        </label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                          {q.options.map(opt => {
                            const selected = compatAnswers[q.id] === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setCompatAnswers(prev => ({ ...prev, [q.id]: opt.value }))}
                                style={{
                                  padding: "0.4rem 0.875rem",
                                  borderRadius: "var(--radius-full)",
                                  border: `1.5px solid ${selected ? "var(--primary)" : "var(--border-color)"}`,
                                  background: selected ? "var(--primary)" : "#fff",
                                  color: selected ? "#fff" : "var(--text-dark)",
                                  fontWeight: selected ? 700 : 400,
                                  fontSize: "0.8125rem",
                                  cursor: "pointer",
                                  fontFamily: "var(--font-sans)",
                                  transition: "all 0.15s ease",
                                }}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                {answeredCount > 0 && answeredCount < totalQ && (
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                    {totalQ - answeredCount} question{totalQ - answeredCount !== 1 ? "s" : ""} unanswered — you can still continue.
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}
                >
                  {answeredCount > 0 ? `Save & Continue (${answeredCount}/${totalQ} answered)` : "Skip for now"}
                </button>
              </div>
            </div>
          );
        })()}

        {/* ===== STEP 5: Add Photo ===== */}

        {step === 5 && (
          <div className="animate-fade-in-up">
            <StepProgressBar step={6} total={6} />
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <button onClick={() => setStep(4)} aria-label="Go back" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "var(--text-dark)", display: "flex" }}>
                  <ChevronLeft size={20} />
                </button>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-dark)", margin: 0 }}>Add photo</h2>
              </div>
              <button
                onClick={handleComplete}
                disabled={isSubmitting}
                style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: isSubmitting ? "not-allowed" : "pointer", color: isSubmitting ? "#aaa" : "var(--primary)", fontWeight: 700, fontSize: "0.875rem", fontFamily: "var(--font-sans)", opacity: isSubmitting ? 0.5 : 1 }}
              >
                {isSubmitting ? "Creating..." : "Skip for now"}
                {!isSubmitting && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>}
              </button>
            </div>

            <div className="register-card" style={{ background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", padding: "1.75rem" }}>
              {/* Avatar preview */}
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "1.25rem" }}>
                <div
                  style={{
                    width: "100px",
                    height: "110px",
                    border: "2px solid var(--primary)",
                    borderRadius: "var(--radius-lg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--primary-light)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {form.photoUrl ? (
                    <>
                      <img src={form.photoUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button
                        onClick={() => set("photoUrl", "")}
                        style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0, color: "#fff" }}
                      >
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    /* Avatar illustration — brand maroon/gold colors */
                    <svg width="64" height="72" viewBox="0 0 64 72" fill="none">
                      <circle cx="32" cy="22" r="16" fill="#6B1A2A" opacity="0.12" />
                      <circle cx="32" cy="22" r="12" fill="#6B1A2A" opacity="0.30" />
                      <path d="M8 72 C8 52 20 44 32 44 C44 44 56 52 56 72" fill="#6B1A2A" opacity="0.25" />
                      <circle cx="32" cy="22" r="8" fill="#6B1A2A" />
                      <circle cx="29" cy="20" r="1.5" fill="white" />
                      <circle cx="35" cy="20" r="1.5" fill="white" />
                      <path d="M28 26 Q32 29 36 26" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      <rect x="22" y="30" width="20" height="16" rx="2" fill="#C8973A" opacity="0.6" />
                    </svg>
                  )}
                </div>
              </div>

              <h3 style={{ fontWeight: 700, fontSize: "1.0625rem", color: "var(--text-dark)", marginBottom: "0.875rem" }}>
                Add photo for better responses
              </h3>

              <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-dark)", marginBottom: "0.625rem" }}>
                Benefits of adding photo
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-medium)" strokeWidth="1.5">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                  </svg>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-medium)" }}>90% members prefer to contact only profiles with photo</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-medium)" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.63 19 19.5 19.5 0 0 1 4.69 12"/>
                    <path d="M1 1l22 22M4.69 4.69A19.79 19.79 0 0 0 1.73 11.6a2 2 0 0 0 .27 1.15L3 14"/>
                  </svg>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-medium)" }}>10 times more responses</span>
                </div>
              </div>

              <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)", marginBottom: "1.25rem" }}>
                Members prefer viewing profiles with photos
              </p>

              <label
                htmlFor="photo-upload"
                style={{
                  display: "block",
                  background: "var(--primary)",
                  color: "#fff",
                  borderRadius: "var(--radius-full)",
                  padding: "0.75rem",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  cursor: "pointer",
                  letterSpacing: "0.01em",
                }}
              >
                Add photo now
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPhotoFile(file);
                    const reader = new FileReader();
                    reader.onloadend = () => set("photoUrl", reader.result as string);
                    reader.readAsDataURL(file);
                    toast.success("Photo selected! It will be uploaded on registration.");
                  }
                }}
              />

              {form.photoUrl && (
                <button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", marginTop: "0.75rem", opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
                >
                  {isSubmitting ? "Creating your profile..." : "Complete Registration"}
                </button>
              )}

              {/* Always show a complete button (even without photo) */}
              {!form.photoUrl && (
                <button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", marginTop: "0.75rem", opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
                >
                  {isSubmitting ? "Creating your profile..." : "Continue without photo"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)" }}>
        <p style={{ color: "var(--text-medium)" }}>Loading...</p>
      </div>
    }>
      <RegisterWizard />
    </Suspense>
  );
}
