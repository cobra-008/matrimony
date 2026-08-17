import { NextRequest, NextResponse } from 'next/server';
import { cancelMembership } from '@/lib/auth-store';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');
const FROM = process.env.RESEND_FROM_EMAIL ?? 'Elite Tamil Matrimony <admin@elitetamilmatrimony.com>';

export async function POST(req: NextRequest) {
  try {
    const { userId, userEmail, userName, planName } = await req.json() as {
      userId: string;
      userEmail?: string;
      userName?: string;
      planName?: string;
    };

    if (!userId) {
      return NextResponse.json({ error: 'userId is required.' }, { status: 400 });
    }

    const success = await cancelMembership(userId);
    if (!success) {
      return NextResponse.json({ error: 'Failed to cancel membership. Please contact support.' }, { status: 500 });
    }

    // Send cancellation email (non-blocking)
    if (userEmail && !userEmail.endsWith('@etm.app')) {
      const name = userName || 'Member';
      resend.emails.send({
        from: FROM,
        to: [userEmail],
        subject: 'Your Elite Tamil Matrimony membership has been cancelled',
        html: `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/></head>
<body style="font-family:Arial,sans-serif;background:#FAF6F1;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF6F1;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(107,26,42,0.10);border:1px solid #EDD5B8;">
        <tr><td style="background:linear-gradient(135deg,#6B1A2A 0%,#9E1F33 100%);padding:28px 32px;text-align:center;">
          <div style="font-size:22px;font-weight:900;color:#fff;">❤ Elite Tamil Matrimony</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.7);margin-top:4px;letter-spacing:1px;text-transform:uppercase;">Membership Cancellation</div>
        </td></tr>
        <tr><td style="height:4px;background:linear-gradient(90deg,#C8973A,#E8C060,#C8973A);"></td></tr>
        <tr><td style="padding:40px 40px 32px;">
          <p style="font-size:16px;font-weight:700;color:#222;margin:0 0 16px;">Hi ${name},</p>
          <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 16px;">
            Your <strong>${planName ?? 'Premium'}</strong> membership has been successfully cancelled. Your account has been reverted to the <strong>Free plan</strong> and all premium benefits have been removed immediately.
          </p>
          <div style="background:#FFF8E1;border:1px solid #FFD54F;border-radius:10px;padding:16px;margin:0 0 20px;">
            <p style="font-size:13px;color:#7B5800;margin:0;font-weight:600;">⚠ No Refund Policy</p>
            <p style="font-size:13px;color:#7B5800;margin:8px 0 0;">As stated in our Terms of Service, paid membership fees are non-refundable. If you believe this is an error, please contact our support team within 48 hours.</p>
          </div>
          <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 24px;">
            You can re-subscribe anytime to restore premium access. We hope to have you back as a member soon.
          </p>
          <div style="text-align:center;margin-top:16px;">
            <a href="https://elitetamilmatrimony.com/membership" style="background:linear-gradient(135deg,#6B1A2A 0%,#9E1F33 100%);color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px;display:inline-block;">View Membership Plans</a>
          </div>
          <p style="font-size:12px;color:#999;margin:24px 0 0;text-align:center;">Questions? Email us at <a href="mailto:support@elitetamilmatrimony.com" style="color:#6B1A2A;">support@elitetamilmatrimony.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
        text: `Hi ${name},\n\nYour ${planName ?? 'Premium'} membership has been cancelled and your account has been reverted to the Free plan.\n\nIMPORTANT: As per our Terms of Service, paid membership fees are non-refundable.\n\nYou can re-subscribe anytime at: https://elitetamilmatrimony.com/membership\n\nQuestions? Contact us at support@elitetamilmatrimony.com`,
      }).catch((err: unknown) => {
        console.error('[cancel-membership] Email failed:', err);
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[cancel-membership] Error:', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
