// src/lib/email/otp-store.ts
// Server-side in-memory OTP store with TTL.
// In production you'd use Redis or a DB table; for this app
// a module-level Map is fine since Next.js runs as a single Node process.

interface OtpEntry {
  otp: string;
  expiresAt: number; // Unix ms
  attempts: number;
}

// Map key = email (lowercase)
const store = new Map<string, OtpEntry>();

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOtp(email: string, otp: string): void {
  store.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "expired" | "mismatch" | "max_attempts" | "not_found" };

export function verifyOtp(email: string, otp: string): VerifyResult {
  const key = email.toLowerCase();
  const entry = store.get(key);

  if (!entry) return { ok: false, reason: "not_found" };
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return { ok: false, reason: "expired" };
  }
  if (entry.attempts >= MAX_ATTEMPTS) {
    store.delete(key);
    return { ok: false, reason: "max_attempts" };
  }

  entry.attempts += 1;

  if (entry.otp !== otp) {
    return { ok: false, reason: "mismatch" };
  }

  // Success — remove from store (one-time use)
  store.delete(key);
  return { ok: true };
}
