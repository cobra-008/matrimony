import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Admin client — uses service role key, NEVER exposed to the browser
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_service_role_key',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: NextRequest) {
  try {
    const { profileId } = await req.json();

    if (!profileId) {
      return NextResponse.json({ error: "profileId is required." }, { status: 400 });
    }

    // 1. Verify the profile actually exists
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, auth_email, mobile")
      .eq("id", profileId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    // 2. Generate a magic link for the auth user — admin only
    //    This creates a one-time sign-in link without needing the password.
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: profile.auth_email || `${profile.mobile}@etm.app`,
    });

    if (linkError || !linkData) {
      console.error("[otp-login] generateLink error:", linkError);
      return NextResponse.json({ error: "Failed to create session." }, { status: 500 });
    }

    // 3. Exchange the OTP token for a real session
    const url = new URL(linkData.properties.action_link);
    const token_hash = url.searchParams.get("token") || linkData.properties.hashed_token;
    const type = url.searchParams.get("type") || "magiclink";

    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.verifyOtp({
      token_hash,
      type: type as "magiclink",
    });

    if (sessionError || !sessionData.session) {
      console.error("[otp-login] verifyOtp error:", sessionError);
      return NextResponse.json({ error: "Failed to establish session." }, { status: 500 });
    }

    return NextResponse.json({
      access_token: sessionData.session.access_token,
      refresh_token: sessionData.session.refresh_token,
    });
  } catch (err) {
    console.error("[otp-login] Unexpected error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
