// src/lib/email/otp-store.ts
// OTP store backed by Supabase — works in serverless environments (Vercel, Cloudflare)
// where each request can run in a different process instance.
//
// IMPORTANT: Uses the service role client so it bypasses Row Level Security.
// This file is ONLY ever imported by server-side API routes — never by client code.

import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS so we can read/write the otp_store table
// regardless of the authenticated user. Never exposed to the browser.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL    ?? "https://dummy.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY  ?? "dummy_service_role_key",
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const OTP_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeOtp(identifier: string, otp: string): Promise<void> {
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString();
  const key = identifier.toLowerCase().trim();

  // Upsert — replace any existing OTP for this identifier
  const { error } = await supabaseAdmin.from("otp_store").upsert(
    { identifier: key, otp, expires_at: expiresAt, attempts: 0 },
    { onConflict: "identifier" }
  );
  if (error) {
    console.error("[otp-store] storeOtp failed for", key, "→", error.message);
    throw new Error("Failed to store OTP.");
  }
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "expired" | "mismatch" | "max_attempts" | "not_found" };

export async function verifyOtp(identifier: string, otp: string): Promise<VerifyResult> {
  const key = identifier.toLowerCase().trim();

  const { data, error } = await supabaseAdmin
    .from("otp_store")
    .select("*")
    .eq("identifier", key)
    .single();

  if (error || !data) {
    if (error) console.error("[otp-store] verifyOtp select failed for", key, "→", error.message);
    return { ok: false, reason: "not_found" };
  }

  if (new Date(data.expires_at) < new Date()) {
    await supabaseAdmin.from("otp_store").delete().eq("identifier", key);
    return { ok: false, reason: "expired" };
  }

  if (data.attempts >= MAX_ATTEMPTS) {
    await supabaseAdmin.from("otp_store").delete().eq("identifier", key);
    return { ok: false, reason: "max_attempts" };
  }

  // Increment attempts before checking — prevents brute force even on correct guess
  await supabaseAdmin
    .from("otp_store")
    .update({ attempts: data.attempts + 1 })
    .eq("identifier", key);

  if (data.otp !== otp) return { ok: false, reason: "mismatch" };

  // Success — one-time use, delete it
  await supabaseAdmin.from("otp_store").delete().eq("identifier", key);
  return { ok: true };
}
