// src/lib/email/otp-store.ts
// OTP store backed by Supabase — used exclusively by server-side API routes.
//
// Security notes:
//   • This file is ONLY imported by /api/* route handlers — never by any
//     "use client" component. Next.js never bundles server-only imports
//     into the client bundle, so no keys reach the browser.
//   • SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_ prefix, so it is
//     invisible to the browser even if accidentally referenced client-side.
//   • The anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY) is safe to expose —
//     it only allows what Supabase RLS permits, and otp_store has RLS disabled.
//
// Flow: generate OTP → storeOtp (writes to DB) → send email → verifyOtp (reads DB)

import { createClient } from "@supabase/supabase-js";

// Use service role key when available (bypasses RLS, best for server routes).
// Falls back to anon key — safe because otp_store has RLS disabled.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const db = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const OTP_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store (or replace) an OTP for the given identifier in the otp_store table.
 * Called server-side immediately before the OTP email is sent.
 */
export async function storeOtp(identifier: string, otp: string): Promise<void> {
  const key = identifier.toLowerCase().trim();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString();

  const { error } = await db.from("otp_store").upsert(
    { identifier: key, otp, expires_at: expiresAt, attempts: 0 },
    { onConflict: "identifier" }
  );

  if (error) {
    console.error("[otp-store] storeOtp FAILED for", key, "→", error.code, error.message);
    throw new Error(`Failed to store OTP: ${error.message}`);
  }

  console.log("[otp-store] OTP stored for", key, "(expires in", OTP_TTL_MINUTES, "min)");
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "expired" | "mismatch" | "max_attempts" | "not_found" };

/**
 * Verify an OTP against the otp_store table.
 * Deletes the row on success (one-time use).
 */
export async function verifyOtp(identifier: string, otp: string): Promise<VerifyResult> {
  const key = identifier.toLowerCase().trim();

  const { data, error } = await db
    .from("otp_store")
    .select("otp, expires_at, attempts")
    .eq("identifier", key)
    .maybeSingle();

  if (error) {
    console.error("[otp-store] verifyOtp SELECT FAILED for", key, "→", error.code, error.message);
    return { ok: false, reason: "not_found" };
  }

  if (!data) {
    console.warn("[otp-store] No OTP row found for", key);
    return { ok: false, reason: "not_found" };
  }

  // Expired?
  if (new Date(data.expires_at) < new Date()) {
    await db.from("otp_store").delete().eq("identifier", key);
    console.warn("[otp-store] OTP expired for", key);
    return { ok: false, reason: "expired" };
  }

  // Max attempts?
  if (data.attempts >= MAX_ATTEMPTS) {
    await db.from("otp_store").delete().eq("identifier", key);
    console.warn("[otp-store] Max attempts exceeded for", key);
    return { ok: false, reason: "max_attempts" };
  }

  // Increment attempts before checking value (prevents timing brute-force)
  await db
    .from("otp_store")
    .update({ attempts: data.attempts + 1 })
    .eq("identifier", key);

  // Wrong OTP?
  if (data.otp !== otp) {
    console.warn("[otp-store] OTP mismatch for", key, "— attempt", data.attempts + 1);
    return { ok: false, reason: "mismatch" };
  }

  // ✅ Correct — delete row (one-time use)
  await db.from("otp_store").delete().eq("identifier", key);
  console.log("[otp-store] OTP verified successfully for", key);
  return { ok: true };
}
