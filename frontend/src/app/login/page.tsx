"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Eye, EyeOff, ChevronDown, AlertCircle, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { loginWithPassword, getProfilesByMobile, getProfilesByEmail, loginToProfile, loginWithOtpSession, type RegisteredUser } from "@/lib/auth-store";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useMSG91, CAPTCHA_DIV_ID } from "@/hooks/useMSG91";

// Detect if input is an email or phone number
function detectInputType(value: string): "email" | "phone" | "unknown" {
  if (value.includes("@")) return "email";
  const digits = value.replace(/\D/g, "");
  if (digits.length >= 10) return "phone";
  return "unknown";
}

// ── Profile Picker ────────────────────────────────────────────────────────────
function ProfilePicker({
  profiles,
  identifier,
  onSelect,
  loading,
}: {
  profiles: RegisteredUser[];
  identifier: string;
  onSelect: (profileId: string) => void;
  loading: boolean;
}) {
  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
        <div
          style={{
            width: "48px", height: "48px", borderRadius: "50%",
            background: "var(--primary-light)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 0.75rem",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8">
            <circle cx="9" cy="7" r="4" /><path d="M3 21v-2c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4v2" />
            <circle cx="17" cy="7" r="3" /><path d="M21 21v-2c0-1.7-1-3.2-2.5-3.8" />
          </svg>
        </div>
        <h2 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-dark)", margin: "0 0 0.25rem" }}>
          Multiple Profiles Found
        </h2>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-medium)" }}>
          {profiles.length} profiles registered with <strong>{identifier}</strong>
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
          Select the profile you want to log in with
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {profiles.map((p) => {
          const age = p.dob ? Math.floor((Date.now() - new Date(p.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 0.875rem",
                background: "#fff",
                border: "1.5px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                cursor: loading ? "wait" : "pointer",
                textAlign: "left",
                fontFamily: "var(--font-sans)",
                transition: "border-color 0.15s, box-shadow 0.15s",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(107,26,42,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-color)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {p.photoUrl ? (
                  <img src={p.photoUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" opacity="0.6">
                    <circle cx="12" cy="7" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)" }}>{p.name}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-medium)", marginTop: "1px" }}>
                  {[age > 0 ? `${age} yrs` : null, p.gender === "male" ? "Male" : p.gender === "female" ? "Female" : null, p.caste, p.city].filter(Boolean).join(" • ")}
                </div>
                <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "1px" }}>
                  Profile for {p.profileFor || "Self"} • ID: {p.id.slice(0, 8).toUpperCase()}
                </div>
              </div>
              <ChevronRight size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Login Content ────────────────────────────────────────────────────────
function LoginContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillMobile = searchParams.get("mobile") || "";
  const msg91 = useMSG91();

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const [mode, setMode] = useState<"otp" | "password">("otp");

  // OTP mode state
  const [otpIdentifier, setOtpIdentifier] = useState(prefillMobile); // email or phone
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpType, setOtpType] = useState<"email" | "phone">("phone");

  // Password mode state
  const [pwIdentifier, setPwIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [multiProfiles, setMultiProfiles] = useState<RegisteredUser[] | null>(null);

  function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null;
    return (
      <p style={{ fontSize: "0.75rem", color: "#D32F2F", marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "4px" }} role="alert">
        <AlertCircle size={12} aria-hidden="true" />
        {msg}
      </p>
    );
  }

  // ── Send OTP ──────────────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = otpIdentifier.trim();
    if (!val) {
      setFieldErrors((p) => ({ ...p, otpId: "Please enter your email or mobile number." }));
      return;
    }

    const type = detectInputType(val);
    if (type === "unknown") {
      setFieldErrors((p) => ({ ...p, otpId: "Enter a valid email address or 10-digit mobile number." }));
      return;
    }

    if (type === "phone") {
      const digits = val.replace(/\D/g, "");
      if (digits.length !== 10) {
        setFieldErrors((p) => ({ ...p, otpId: "Mobile number must be exactly 10 digits." }));
        return;
      }
    }

    setFieldErrors({});
    setLoading(true);
    setOtpType(type);

    if (type === "email") {
      // Send real OTP via Resend
      try {
        const res = await fetch("/api/send-email-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: val }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Failed to send OTP. Please try again.");
          setLoading(false);
          return;
        }
        toast.success(`OTP sent to ${val}`);
      } catch {
        toast.error("Network error. Please try again.");
        setLoading(false);
        return;
      }
    } else {
      // Phone: send via MSG91 OTP Widget
      // Guard: if MSG91 widget failed to init (e.g. missing credentials), bail early.
      if (msg91.initError) {
        toast.error(
          msg91.initError.includes("not configured")
            ? "OTP service is not configured. Please contact support."
            : "OTP service failed to load. Please refresh the page and try again."
        );
        setLoading(false);
        return;
      }
      const digits = val.replace(/\D/g, "");
      const phone = `91${digits}`; // MSG91 format: country code + number, no '+'
      const result = await msg91.sendOtp(phone);
      if (!result.success) {
        toast.error(result.error ?? "Failed to send OTP. Please try again.");
        setLoading(false);
        return;
      }
      toast.success(`OTP sent to +91 ${digits}`);
    }

    setLoading(false);
    setOtpSent(true);
  };

  // ── Verify OTP ────────────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error("Please enter the 6-digit OTP"); return; }
    setLoading(true);

    if (otpType === "phone") {
      // Step 1: Verify OTP via MSG91 widget — returns a JWT access_token
      const verifyResult = await msg91.verifyOtp(otp);
      if (!verifyResult.success) {
        setLoading(false);
        toast.error(verifyResult.error ?? "Incorrect OTP. Please try again.");
        return;
      }
      // Step 2: Server-side validation of MSG91 JWT token
      try {
        const tokenRes = await fetch("/api/verify-msg91-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: verifyResult.accessToken }),
        });
        const tokenData = await tokenRes.json();
        if (!tokenRes.ok) {
          setLoading(false);
          toast.error(tokenData.error ?? "OTP verification failed. Please try again.");
          return;
        }
      } catch {
        setLoading(false);
        toast.error("Network error during verification. Please try again.");
        return;
      }
      // OTP verified — look up profiles by mobile
      const digits = otpIdentifier.replace(/\D/g, "");
      const profiles = await getProfilesByMobile(digits);
      if (profiles.length === 0) {
        setLoading(false);
        toast.error("No account found with this mobile number. Please register first.");
        return;
      }
      if (profiles.length === 1) {
        // Use server-side OTP login (service role) — no password required
        const res = await fetch("/api/otp-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileId: profiles[0].id }),
        });
        const loginData = await res.json();
        if (!res.ok) {
          setLoading(false);
          toast.error(loginData.error || "Login failed. Please try again.");
          return;
        }
        const result = await loginWithOtpSession(loginData.access_token, loginData.refresh_token);
        setLoading(false);
        if (!result) { toast.error("Login failed. Please try again or re-register."); return; }
        toast.success("Login successful!");
        router.push("/matches");
        return;
      }
      setLoading(false);
      setMultiProfiles(profiles);
      return;
    }

    // Email OTP — verify via API
    try {
      const res = await fetch("/api/verify-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpIdentifier.trim(), otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        toast.error(data.error || "OTP verification failed.");
        return;
      }
    } catch {
      setLoading(false);
      toast.error("Network error. Please try again.");
      return;
    }

    // OTP correct — look up profile by email
    const profiles = await getProfilesByEmail(otpIdentifier.trim());
    if (profiles.length === 0) {
      setLoading(false);
      toast.error("No account found with this email. Please register first.");
      return;
    }
    if (profiles.length === 1) {
      const result = await loginToProfile(profiles[0].id);
      setLoading(false);
      if (!result) { toast.error("Login failed. Please try again."); return; }
      toast.success("Login successful!");
      router.push("/matches");
      return;
    }
    // Multiple profiles
    setLoading(false);
    setMultiProfiles(profiles);
  };

  // ── Select profile (multi-profile picker) ────────────────────────────────
  const handleSelectProfile = async (profileId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/otp-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
      });
      const tokenData = await res.json();
      if (!res.ok) {
        toast.error(tokenData.error || "Login failed. Please try again.");
        setLoading(false);
        return;
      }
      const result = await loginWithOtpSession(tokenData.access_token, tokenData.refresh_token);
      if (!result) { toast.error("Login failed. Please try again or re-register."); setLoading(false); return; }
      toast.success("Login successful!");
      router.push("/matches");
    } catch {
      toast.error("Failed to login to this profile. Please try again.");
    }
    setLoading(false);
  };

  // ── Password login ────────────────────────────────────────────────────────
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!pwIdentifier) newErrors.email = "Email or mobile number is required.";
    else if (pwIdentifier.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pwIdentifier)) newErrors.email = "Email address is invalid.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (Object.keys(newErrors).length > 0) { setFieldErrors((p) => ({ ...p, ...newErrors })); return; }
    setLoading(true);
    const loggedIn = await loginWithPassword(pwIdentifier, password);
    setLoading(false);
    if (!loggedIn) { toast.error("Invalid credentials. Check your email / mobile number and password."); return; }
    toast.success("Login successful!");
    router.push("/matches");
  };

  const inputType = detectInputType(otpIdentifier);

  return (
    <>
      {/* MSG91 hCaptcha container — must be in DOM for exposeMethods:true to avoid grecaptcha hang */}
      <div id={CAPTCHA_DIV_ID} style={{ position: "fixed", bottom: "1rem", right: "1rem", zIndex: 0 }} />
      <Navbar />
      <main style={{ background: "var(--bg-page)", minHeight: "calc(100vh - 120px)", display: "flex", alignItems: "center", padding: "2.5rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: "420px" }}>
              <div style={{ background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
                {/* Header */}
                <div style={{ background: "var(--bm-green)", padding: "1rem 1.5rem", textAlign: "center" }}>
                  <h1 style={{ color: "#fff", fontWeight: 700, fontSize: "1.0625rem", margin: 0 }}>Login to Elite Tamil Matrimony</h1>
                </div>

                {multiProfiles ? (
                  <ProfilePicker
                    profiles={multiProfiles}
                    identifier={otpIdentifier || pwIdentifier}
                    onSelect={handleSelectProfile}
                    loading={loading}
                  />
                ) : (
                  <>
                    {/* Tabs */}
                    <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)" }}>
                      {(["otp", "password"] as const).map((m) => (
                        <button key={m} onClick={() => { setMode(m); setOtpSent(false); setFieldErrors({}); }} style={{ flex: 1, padding: "0.75rem", background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 700, fontFamily: "var(--font-sans)", color: mode === m ? "var(--bm-orange)" : "var(--text-medium)", borderBottom: mode === m ? "2px solid var(--bm-orange)" : "2px solid transparent" }}>
                          {m === "otp" ? "Login with OTP" : "Login with Password"}
                        </button>
                      ))}
                    </div>

                    <div style={{ padding: "1.5rem" }}>

                      {/* ── OTP: Step 1 — enter email or phone ── */}
                      {mode === "otp" && !otpSent && (
                        <form onSubmit={handleSendOtp}>
                          <div style={{ marginBottom: "1.125rem" }}>
                            <label className="form-label">Email Address or Mobile Number</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Enter email or 10-digit mobile"
                              value={otpIdentifier}
                              onChange={(e) => {
                                setOtpIdentifier(e.target.value);
                                setFieldErrors((p) => { const n = { ...p }; delete n.otpId; return n; });
                              }}
                              style={{ borderColor: fieldErrors.otpId ? "#D32F2F" : undefined }}
                            />
                            <FieldError msg={fieldErrors.otpId} />
                            {!fieldErrors.otpId && otpIdentifier && (
                              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                                {inputType === "email" ? "✉️ OTP will be sent to this email via Resend" :
                                 inputType === "phone" ? "📱 OTP will be sent via SMS to this number" :
                                 "Enter a valid email or 10-digit mobile number"}
                              </p>
                            )}
                          </div>
                          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                            {loading ? "Sending..." : "Send OTP"}
                          </button>
                        </form>
                      )}

                      {/* ── OTP: Step 2 — enter OTP ── */}
                      {mode === "otp" && otpSent && (
                        <form onSubmit={handleVerifyOtp}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
                            <p style={{ fontSize: "0.875rem", color: "var(--text-medium)" }}>
                              OTP sent to <strong>{otpType === "phone" ? `+91 ${otpIdentifier.replace(/\D/g, "")}` : otpIdentifier}</strong>
                            </p>
                            <button type="button" onClick={() => { setOtpSent(false); setOtp(""); }} style={{ fontSize: "0.8125rem", color: "var(--bm-orange)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: 600 }}>Change</button>
                          </div>
                          <div style={{ marginBottom: "1rem" }}>
                            <label className="form-label">Enter 6-digit OTP</label>
                            <input type="text" className="form-input" placeholder="- - - - - -" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} style={{ textAlign: "center", fontSize: "1.125rem", letterSpacing: "0.25em" }} autoFocus />
                          </div>
                          <div style={{ textAlign: "right", marginBottom: "1.125rem" }}>
                            <button type="button" onClick={async () => {
                              // Resend via MSG91 retryOtp (null = default channel)
                              if (otpType === "phone") {
                                const result = await msg91.retryOtp(null);
                                if (!result.success) {
                                  toast.error(result.error ?? "Failed to resend OTP.");
                                } else {
                                  toast.success("OTP resent successfully.");
                                }
                              } else {
                                handleSendOtp({ preventDefault: () => {} } as React.FormEvent);
                              }
                            }} style={{ fontSize: "0.8125rem", color: "var(--bm-orange)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: 600 }}>Resend OTP</button>
                          </div>
                          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                            {loading ? "Verifying..." : "Verify & Login"}
                          </button>
                        </form>
                      )}

                      {/* ── Password login ── */}
                      {mode === "password" && (
                        <form onSubmit={handlePasswordLogin}>
                          <div style={{ marginBottom: "1rem" }}>
                            <label className="form-label">Email ID / Mobile Number</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Enter Email ID or Mobile Number"
                              value={pwIdentifier}
                              onChange={(e) => {
                                setPwIdentifier(e.target.value);
                                if (!e.target.value) setFieldErrors((p) => ({ ...p, email: "Email or mobile is required." }));
                                else if (e.target.value.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) setFieldErrors((p) => ({ ...p, email: "Email is invalid." }));
                                else setFieldErrors((p) => { const n = { ...p }; delete n.email; return n; });
                              }}
                              style={{ borderColor: fieldErrors.email ? "#D32F2F" : undefined }}
                            />
                            <FieldError msg={fieldErrors.email} />
                          </div>
                          <div style={{ marginBottom: "0.375rem" }}>
                            <label className="form-label">Password</label>
                            <div style={{ position: "relative" }}>
                              <input
                                type={showPassword ? "text" : "password"}
                                className="form-input"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => {
                                  setPassword(e.target.value);
                                  if (!e.target.value) setFieldErrors((p) => ({ ...p, password: "Password is required." }));
                                  else if (e.target.value.length < 6) setFieldErrors((p) => ({ ...p, password: "Password must be at least 6 characters." }));
                                  else setFieldErrors((p) => { const n = { ...p }; delete n.password; return n; });
                                }}
                                style={{ paddingRight: "2.5rem", borderColor: fieldErrors.password ? "#D32F2F" : undefined }}
                              />
                              <button type="button" onClick={() => setShowPassword((v) => !v)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}>
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                            <FieldError msg={fieldErrors.password} />
                          </div>
                          <div style={{ textAlign: "right", marginBottom: "1.125rem" }}>
                            <Link href="/forgot-password" style={{ fontSize: "0.8125rem", color: "var(--bm-orange)", textDecoration: "none", fontWeight: 600 }}>Forgot Password?</Link>
                          </div>
                          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                            {loading ? "Logging in..." : "Login"}
                          </button>
                        </form>
                      )}

                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1rem 0" }}>
                        <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
                        <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>OR</span>
                        <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
                      </div>

                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: "0.875rem", color: "var(--text-medium)", marginBottom: "0.75rem" }}>Not registered yet?</p>
                        <Link href="/register" className="btn btn-green" style={{ width: "100%", justifyContent: "center", display: "flex" }}>Register Free</Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div style={{ marginTop: "1.25rem", textAlign: "center" }}>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Trusted by 25 Lakh+ Tamil families &nbsp;•&nbsp; 100% Verified Profiles &nbsp;•&nbsp; Secure &amp; Private</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg-page)" }} />}>
      <LoginContent />
    </Suspense>
  );
}
