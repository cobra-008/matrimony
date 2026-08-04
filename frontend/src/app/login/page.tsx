"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Eye, EyeOff, ChevronDown, AlertCircle, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { loginWithPassword, getProfilesByMobile, loginToProfile, type RegisteredUser } from "@/lib/auth-store";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

// ── Profile Picker (shown when multiple accounts exist for a number) ──────
function ProfilePicker({
  profiles,
  mobile,
  onSelect,
  loading,
}: {
  profiles: RegisteredUser[];
  mobile: string;
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
          {profiles.length} profiles registered with <strong>+91 {mobile}</strong>
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
              {/* Avatar */}
              <div
                style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  overflow: "hidden", flexShrink: 0,
                  background: "var(--primary-light)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {p.photoUrl ? (
                  <img src={p.photoUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" opacity="0.6">
                    <circle cx="12" cy="7" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-dark)" }}>{p.name}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-medium)", marginTop: "1px" }}>
                  {[
                    age > 0 ? `${age} yrs` : null,
                    p.gender === "male" ? "Male" : p.gender === "female" ? "Female" : null,
                    p.caste,
                    p.city,
                  ].filter(Boolean).join(" \u2022 ")}
                </div>
                <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "1px" }}>
                  Profile for {p.profileFor || "Self"} \u2022 ID: {p.id.slice(0, 8).toUpperCase()}
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Login Content ────────────────────────────────────────────────────
function LoginContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillMobile = searchParams.get("mobile") || "";

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  const [mode, setMode] = useState<"otp" | "password">("otp");
  const [mobile, setMobile] = useState(prefillMobile);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Multi-profile picker state
  const [multiProfiles, setMultiProfiles] = useState<RegisteredUser[] | null>(null);

  // Real-time field errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const mobileErr = !mobile ? "Mobile Number is required."
      : mobile.length !== 10 ? "Mobile Number must be exactly 10 digits."
      : "";
    if (mobileErr) {
      setFieldErrors((prev) => ({ ...prev, mobile: mobileErr }));
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setOtpSent(true);
    toast.success(`OTP sent to +91 ${mobile}`);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error("Please enter the 6-digit OTP"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    // For dev: OTP 123456 always works
    if (otp !== "123456") {
      setLoading(false);
      toast.error("Incorrect OTP. Use 123456 for demo.");
      return;
    }

    // Fetch all profiles for this mobile
    const profiles = await getProfilesByMobile(mobile);
    console.log('[Login] profiles found for mobile:', mobile, profiles.length, profiles.map(p => ({ id: p.id.slice(0,8), name: p.name })));

    if (profiles.length === 0) {
      setLoading(false);
      toast.error("No account found with this mobile number. Please register first.");
      return;
    }

    if (profiles.length === 1) {
      // Single account — log in directly
      // loginToProfile signs into Supabase, which triggers onAuthStateChange in AuthContext
      console.log('[Login] attempting loginToProfile for:', profiles[0].id);
      const result = await loginToProfile(profiles[0].id);
      console.log('[Login] loginToProfile result:', result ? 'SUCCESS' : 'FAILED (null)');
      setLoading(false);
      if (!result) {
        toast.error("Login failed. Your account may need to be re-registered. Please check browser console (F12) for details.");
        return;
      }
      toast.success("Login successful!");
      router.push("/matches");
      return;
    }

    // Multiple accounts — show profile picker
    setLoading(false);
    setMultiProfiles(profiles);
  };

  const handleSelectProfile = async (profileId: string) => {
    setLoading(true);
    try {
      // loginToProfile signs into Supabase — AuthContext picks up the SIGNED_IN event automatically
      const result = await loginToProfile(profileId);
      if (!result) {
        toast.error("Login failed. Could not find auth credentials for this profile. Please try again or re-register.");
        setLoading(false);
        return;
      }
      toast.success("Login successful!");
      router.push("/matches");
    } catch {
      toast.error("Failed to login to this profile. Please try again.");
    }
    setLoading(false);
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = "Email or mobile number is required.";
    else if (email.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Email address is invalid.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }
    setLoading(true);
    const loggedIn = await loginWithPassword(email, password);
    setLoading(false);
    if (!loggedIn) {
      toast.error("Invalid credentials. Check your mobile number / email and password.");
      return;
    }
    toast.success("Login successful!");
    router.push("/matches");
  };


  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-page)", minHeight: "calc(100vh - 120px)", display: "flex", alignItems: "center", padding: "2.5rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: "420px" }}>
              <div style={{ background: "#fff", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
                {/* Header */}
                <div style={{ background: "var(--bm-green)", padding: "1rem 1.5rem", textAlign: "center" }}>
                  <h1 style={{ color: "#fff", fontWeight: 700, fontSize: "1.0625rem", margin: 0 }}>Login to Tamil Matrimony</h1>
                </div>

                {/* If showing profile picker */}
                {multiProfiles ? (
                  <ProfilePicker
                    profiles={multiProfiles}
                    mobile={mobile}
                    onSelect={handleSelectProfile}
                    loading={loading}
                  />
                ) : (
                  <>
                    {/* Tabs */}
                    <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)" }}>
                      {(["otp", "password"] as const).map((m) => (
                        <button key={m} onClick={() => { setMode(m); setOtpSent(false); }} style={{ flex: 1, padding: "0.75rem", background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 700, fontFamily: "var(--font-sans)", color: mode === m ? "var(--bm-orange)" : "var(--text-medium)", borderBottom: mode === m ? "2px solid var(--bm-orange)" : "2px solid transparent" }}>
                          {m === "otp" ? "Login with OTP" : "Login with Password"}
                        </button>
                      ))}
                    </div>

                    <div style={{ padding: "1.5rem" }}>
                      {mode === "otp" && !otpSent && (
                        <form onSubmit={handleSendOtp}>
                            <div style={{ marginBottom: "1.125rem" }}>
                            <label className="form-label">Mobile Number</label>
                            <div style={{ display: "flex" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "4px", border: "1.5px solid var(--border-color)", borderRight: "none", borderRadius: "var(--radius-md) 0 0 var(--radius-md)", padding: "0.625rem 0.625rem", background: "#F7F7F7", fontSize: "0.875rem", color: "var(--text-dark)", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
                                +91 <ChevronDown size={12} />
                              </div>
                              <input
                                type="tel"
                                className="form-input"
                                placeholder="Enter Mobile Number"
                                maxLength={10}
                                value={mobile}
                                onChange={(e) => {
                                  const v = e.target.value.replace(/\D/g, "");
                                  setMobile(v);
                                  if (!v) setFieldErrors((p) => ({ ...p, mobile: "Mobile Number is required." }));
                                  else if (v.length !== 10) setFieldErrors((p) => ({ ...p, mobile: "Mobile Number must be exactly 10 digits." }));
                                  else setFieldErrors((p) => { const n = { ...p }; delete n.mobile; return n; });
                                }}
                                style={{
                                  borderRadius: "0 var(--radius-md) var(--radius-md) 0",
                                  borderColor: fieldErrors.mobile ? "#D32F2F" : undefined,
                                }}
                              />
                            </div>
                            <FieldError msg={fieldErrors.mobile} />
                            {!fieldErrors.mobile && (
                              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>OTP will be sent to this number. Use 123456 to demo.</p>
                            )}
                          </div>
                          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                            {loading ? "Sending..." : "Send OTP"}
                          </button>
                        </form>
                      )}

                      {mode === "otp" && otpSent && (
                        <form onSubmit={handleVerifyOtp}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
                            <p style={{ fontSize: "0.875rem", color: "var(--text-medium)" }}>OTP sent to <strong>+91 {mobile}</strong></p>
                            <button type="button" onClick={() => setOtpSent(false)} style={{ fontSize: "0.8125rem", color: "var(--bm-orange)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: 600 }}>Change</button>
                          </div>
                          <div style={{ marginBottom: "1rem" }}>
                            <label className="form-label">Enter 6-digit OTP</label>
                            <input type="text" className="form-input" placeholder="- - - - - -" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} style={{ textAlign: "center", fontSize: "1.125rem", letterSpacing: "0.25em" }} autoFocus />
                          </div>
                          <div style={{ textAlign: "right", marginBottom: "1.125rem" }}>
                            <button type="button" onClick={() => toast.success("OTP resent")} style={{ fontSize: "0.8125rem", color: "var(--bm-orange)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: 600 }}>Resend OTP</button>
                          </div>
                          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                            {loading ? "Verifying..." : "Verify & Login"}
                          </button>
                        </form>
                      )}

                      {mode === "password" && (
                        <form onSubmit={handlePasswordLogin}>
                          <div style={{ marginBottom: "1rem" }}>
                            <label className="form-label">Email ID / Mobile Number</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Enter Email ID or Mobile Number"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                const v = e.target.value;
                                if (!v) setFieldErrors((p) => ({ ...p, email: "Email or mobile is required." }));
                                else if (v.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) setFieldErrors((p) => ({ ...p, email: "Email is invalid." }));
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
                                  const v = e.target.value;
                                  if (!v) setFieldErrors((p) => ({ ...p, password: "Password is required." }));
                                  else if (v.length < 6) setFieldErrors((p) => ({ ...p, password: "Password must be at least 6 characters." }));
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
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Trusted by 25 Lakh+ Tamil families &nbsp;&bull;&nbsp; 100% Verified Profiles &nbsp;&bull;&nbsp; Secure &amp; Private</p>
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
