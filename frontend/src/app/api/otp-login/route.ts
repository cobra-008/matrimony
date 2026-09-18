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

    // 1. Fetch exact user email directly from Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.getUserById(profileId);

    if (authError || !authData.user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const targetEmail = authData.user.email;
    if (!targetEmail) {
      return NextResponse.json({ error: "User has no email." }, { status: 400 });
    }

    // 2. Generate a magic link for the exact auth user — admin only
    //    This creates a one-time sign-in link without needing the password.
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: targetEmail,
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
