// src/app/api/notify-expiry/route.ts
// Called on page load (client-side) to check if plan is expiring in 7 days.
// Sends an email + creates an in-app notification record if it hasn't been sent yet.

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');
const FROM = process.env.RESEND_FROM_EMAIL ?? 'Elite Tamil Matrimony <admin@elitetamilmatrimony.com>';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json() as { userId: string };
    if (!userId) return NextResponse.json({ skipped: true });

    // Fetch the profile to check expiry
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('name, email, auth_email, membership_plan, membership_expiry')
      .eq('id', userId)
      .single();

    if (error || !profile) return NextResponse.json({ skipped: true });
    if (!profile.membership_plan || !profile.membership_expiry) return NextResponse.json({ skipped: true });

    const expiryDate = new Date(profile.membership_expiry);
    const now = new Date();
    const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Only notify if expiring in 7 days or fewer (but not already expired)
    if (daysLeft > 7 || daysLeft <= 0) return NextResponse.json({ skipped: true });

    // Check if we already sent a 7-day notice for this expiry cycle
    // We use a notifications table to track this. If it doesn't exist, we just send anyway.
    const notifKey = `expiry_7d_${userId}_${expiryDate.toISOString().slice(0, 10)}`;
    const { data: existingNotif } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', userId)
      .eq('type', notifKey)
      .maybeSingle();

    if (existingNotif) return NextResponse.json({ skipped: true, reason: 'already_notified' });

    const name = profile.name || 'Member';
    const planName = profile.membership_plan;
    const expiryStr = expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const recipientEmail = profile.email || profile.auth_email;

    // 1. Create in-app notification (non-fatal if notifications table doesn't exist yet)
    try {
      await supabase.from('notifications').insert({
        user_id: userId,
        type: notifKey,
        title: `Your ${planName} plan expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
        message: `Your ${planName} membership will expire on ${expiryStr}. Renew now to keep your premium access.`,
        is_read: false,
        created_at: new Date().toISOString(),
      });
    } catch {
      // ignore — table may not exist yet
    }

    // 2. Send expiry warning email
    if (recipientEmail && !recipientEmail.endsWith('@etm.app')) {
      const isMock = !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_dummy_key_for_build';
      if (!isMock) {
        resend.emails.send({
          from: FROM,
          to: [recipientEmail],
          subject: `⚠️ Your ${planName} membership expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
          html: `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/></head>
<body style="font-family:Arial,sans-serif;background:#FAF6F1;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF6F1;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(107,26,42,0.10);border:1px solid #EDD5B8;">
        <tr><td style="background:linear-gradient(135deg,#6B1A2A 0%,#9E1F33 100%);padding:28px 32px;text-align:center;">
          <div style="font-size:22px;font-weight:900;color:#fff;">❤ Elite Tamil Matrimony</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.7);margin-top:4px;letter-spacing:1px;text-transform:uppercase;">Membership Expiry Notice</div>
        </td></tr>
        <tr><td style="height:4px;background:linear-gradient(90deg,#C8973A,#E8C060,#C8973A);"></td></tr>
        <tr><td style="padding:40px 40px 32px;">
          <p style="font-size:16px;font-weight:700;color:#222;margin:0 0 16px;">Hi ${name},</p>
          <div style="background:#FFF8E1;border:1px solid #FFD54F;border-radius:10px;padding:16px 20px;margin:0 0 20px;text-align:center;">
            <div style="font-size:32px;font-weight:900;color:#7B5800;">⏳ ${daysLeft} day${daysLeft === 1 ? '' : 's'} left</div>
            <div style="font-size:14px;color:#7B5800;margin-top:6px;">Your <strong>${planName}</strong> plan expires on <strong>${expiryStr}</strong></div>
          </div>
          <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 20px;">
            Don't lose your premium benefits — renew your plan today to keep enjoying unlimited contact reveals, AI match scores, and priority profile listing.
          </p>
          <div style="text-align:center;margin-top:8px;">
            <a href="https://elitetamilmatrimony.com/membership" style="background:linear-gradient(135deg,#6B1A2A 0%,#9E1F33 100%);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;display:inline-block;">Renew My ${planName} Plan</a>
          </div>
          <p style="font-size:12px;color:#999;margin:24px 0 0;text-align:center;">Questions? Contact us at <a href="mailto:support@elitetamilmatrimony.com" style="color:#6B1A2A;">support@elitetamilmatrimony.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
          text: `Hi ${name},\n\nYour ${planName} membership expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'} (${expiryStr}).\n\nRenew now: https://elitetamilmatrimony.com/membership\n\nQuestions? Contact us at support@elitetamilmatrimony.com`,
        }).catch((err: unknown) => {
          console.error('[notify-expiry] Email failed:', err);
        });
      }
    }

    return NextResponse.json({ success: true, daysLeft, planName });
  } catch (err) {
    console.error('[notify-expiry] Error:', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
