// src/lib/email/otp-store.ts
// OTP store backed by Supabase — works in serverless environments (Vercel, Cloudflare)
// where each request can run in a different process instance.

import { supabase } from "@/lib/supabase";

const OTP_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeOtp(identifier: string, otp: string): Promise<void> {
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString();
  const key = identifier.toLowerCase();

  // Upsert — replace any existing OTP for this identifier
  await supabase.from("otp_store").upsert(
    { identifier: key, otp, expires_at: expiresAt, attempts: 0 },
    { onConflict: "identifier" }
  );
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "expired" | "mismatch" | "max_attempts" | "not_found" };

export async function verifyOtp(identifier: string, otp: string): Promise<VerifyResult> {
  const key = identifier.toLowerCase();

  const { data, error } = await supabase
    .from("otp_store")
    .select("*")
    .eq("identifier", key)
    .single();

  if (error || !data) return { ok: false, reason: "not_found" };

  if (new Date(data.expires_at) < new Date()) {
    await supabase.from("otp_store").delete().eq("identifier", key);
    return { ok: false, reason: "expired" };
  }

  if (data.attempts >= MAX_ATTEMPTS) {
    await supabase.from("otp_store").delete().eq("identifier", key);
    return { ok: false, reason: "max_attempts" };
  }

  // Increment attempts
  await supabase
    .from("otp_store")
    .update({ attempts: data.attempts + 1 })
    .eq("identifier", key);

  if (data.otp !== otp) return { ok: false, reason: "mismatch" };

  // Success — one-time use, delete it
  await supabase.from("otp_store").delete().eq("identifier", key);
  return { ok: true };
}
