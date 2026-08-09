// src/lib/email/templates.ts
// Beautiful branded HTML email templates for Elite Tamil Matrimony

const BASE_STYLE = `
  font-family: 'Segoe UI', Arial, sans-serif;
  margin: 0; padding: 0; background: #FAF6F1;
`;

const BRAND_PRIMARY = '#6B1A2A';
const BRAND_GOLD = '#C8973A';

// ── Shared header + footer wrappers ───────────────────────────────────────
function emailWrapper(bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Elite Tamil Matrimony</title>
</head>
<body style="${BASE_STYLE}">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF6F1; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 32px rgba(107,26,42,0.10); border:1px solid #EDD5B8;">
          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND_PRIMARY} 0%,#9E1F33 100%); padding:28px 32px; text-align:center;">
              <div style="font-size:22px; font-weight:900; color:#fff; letter-spacing:0.5px;">
                ❤ Elite Tamil Matrimony
              </div>
              <div style="font-size:12px; color:rgba(255,255,255,0.7); margin-top:4px; letter-spacing:1px; text-transform:uppercase;">
                Find Your Perfect Match
              </div>
            </td>
          </tr>
          <!-- GOLD STRIPE -->
          <tr>
            <td style="height:4px; background:linear-gradient(90deg,${BRAND_GOLD},#E8C060,${BRAND_GOLD});"></td>
          </tr>
          <!-- BODY -->
          <tr>
            <td style="padding:40px 40px 32px;">
              ${bodyContent}
            </td>
          </tr>
          <!-- FOOTER -->
          <tr>
            <td style="background:#FAF6F1; border-top:1px solid #EDD5B8; padding:20px 32px; text-align:center;">
              <p style="font-size:11px; color:#A08060; margin:0 0 6px;">
                © ${new Date().getFullYear()} Elite Tamil Matrimony. All rights reserved.
              </p>
              <p style="font-size:11px; color:#BBA080; margin:0;">
                This is an automated email. Please do not reply to this message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── OTP Email ─────────────────────────────────────────────────────────────
export function otpEmailHtml(name: string, otp: string): string {
  const body = `
    <h1 style="font-size:24px; font-weight:900; color:${BRAND_PRIMARY}; margin:0 0 8px; line-height:1.2;">
      Verify Your Email Address
    </h1>
    <p style="font-size:15px; color:#555; margin:0 0 28px; line-height:1.6;">
      Hello <strong>${name}</strong>, welcome to Elite Tamil Matrimony!<br/>
      Use the OTP below to verify your email address. It expires in <strong>10 minutes</strong>.
    </p>

    <!-- OTP Box -->
    <div style="background:linear-gradient(135deg,#FBF5ED,#FFF8F0); border:2px dashed ${BRAND_GOLD}; border-radius:12px; padding:28px 24px; text-align:center; margin:0 0 28px;">
      <div style="font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:${BRAND_GOLD}; margin-bottom:12px;">
        Your One-Time Password
      </div>
      <div style="font-size:48px; font-weight:900; letter-spacing:14px; color:${BRAND_PRIMARY}; font-family:'Courier New',monospace; line-height:1;">
        ${otp}
      </div>
      <div style="font-size:12px; color:#A08060; margin-top:12px;">
        Valid for 10 minutes only
      </div>
    </div>

    <!-- Steps -->
    <div style="background:#FFF8F2; border-left:4px solid ${BRAND_PRIMARY}; border-radius:0 8px 8px 0; padding:16px 20px; margin:0 0 24px;">
      <p style="font-size:13px; color:#6B4030; margin:0; line-height:1.7;">
        <strong>How to use:</strong><br/>
        Enter this OTP in the verification box on your screen. If you did not request this, please ignore this email.
      </p>
    </div>

    <!-- Security note -->
    <div style="display:flex; align-items:center; gap:8px; background:#F5FBF5; border:1px solid #C8E6C9; border-radius:8px; padding:12px 16px;">
      <span style="font-size:18px;">🔒</span>
      <p style="font-size:12px; color:#3A7040; margin:0; line-height:1.5;">
        <strong>Security tip:</strong> Elite Tamil Matrimony will never call or ask you for this OTP. Keep it confidential.
      </p>
    </div>
  `;
  return emailWrapper(body);
}

export function otpEmailText(name: string, otp: string): string {
  return `Hello ${name},\n\nYour Elite Tamil Matrimony email verification OTP is: ${otp}\n\nThis OTP is valid for 10 minutes. Do not share it with anyone.\n\nIf you did not request this, please ignore this email.\n\n— Elite Tamil Matrimony Team`;
}

// ── Payment Confirmation Email ─────────────────────────────────────────────
export function paymentConfirmationHtml(opts: {
  name: string;
  plan: string;
  amount: number;
  paymentId: string;
  planPeriod: string;
  planFeatures: string[];
  expiryDate: string;
}): string {
  const featuresHtml = opts.planFeatures.map(f => `
    <tr>
      <td style="padding:6px 0; font-size:13px; color:#333; border-bottom:1px solid #F0E8DA;">
        <span style="color:${BRAND_GOLD}; margin-right:8px; font-weight:700;">✓</span>${f}
      </td>
    </tr>
  `).join('');

  const body = `
    <!-- Success Icon -->
    <div style="text-align:center; margin-bottom:28px;">
      <div style="width:72px; height:72px; background:linear-gradient(135deg,${BRAND_PRIMARY},#9E1F33); border-radius:50%; display:inline-flex; align-items:center; justify-content:center; margin-bottom:16px; box-shadow:0 6px 20px rgba(107,26,42,0.25);">
        <span style="font-size:32px; line-height:1;">✓</span>
      </div>
      <h1 style="font-size:26px; font-weight:900; color:${BRAND_PRIMARY}; margin:0 0 6px;">
        Payment Confirmed! 🎉
      </h1>
      <p style="font-size:15px; color:#777; margin:0;">
        Your membership is now active
      </p>
    </div>

    <!-- Plan Badge -->
    <div style="background:linear-gradient(135deg,${BRAND_GOLD},#E8C060); border-radius:50px; padding:10px 24px; text-align:center; margin:0 0 28px; display:block;">
      <span style="font-size:16px; font-weight:900; color:#fff; letter-spacing:0.5px;">
        ⭐ ${opts.plan} Member
      </span>
    </div>

    <!-- Greeting -->
    <p style="font-size:15px; color:#444; margin:0 0 24px; line-height:1.7;">
      Dear <strong>${opts.name}</strong>,<br/>
      Thank you for choosing Elite Tamil Matrimony! Your <strong>${opts.plan}</strong> membership has been successfully activated. We wish you the very best in finding your perfect life partner.
    </p>

    <!-- Receipt Box -->
    <div style="background:#FAF6F1; border:1px solid #EDD5B8; border-radius:12px; padding:20px 24px; margin:0 0 28px;">
      <h2 style="font-size:14px; font-weight:700; color:${BRAND_PRIMARY}; margin:0 0 16px; text-transform:uppercase; letter-spacing:1px;">
        Payment Receipt
      </h2>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:13px; color:#888; padding:5px 0;">Plan</td>
          <td style="font-size:13px; color:#222; font-weight:700; text-align:right;">${opts.plan} Membership</td>
        </tr>
        <tr>
          <td style="font-size:13px; color:#888; padding:5px 0;">Validity</td>
          <td style="font-size:13px; color:#222; font-weight:700; text-align:right;">${opts.planPeriod}</td>
        </tr>
        <tr>
          <td style="font-size:13px; color:#888; padding:5px 0;">Valid until</td>
          <td style="font-size:13px; color:#222; font-weight:700; text-align:right;">${opts.expiryDate}</td>
        </tr>
        <tr>
          <td style="font-size:13px; color:#888; padding:5px 0; border-top:1px solid #EDD5B8; padding-top:10px; margin-top:5px;">Payment ID</td>
          <td style="font-size:11px; color:#666; font-family:'Courier New',monospace; text-align:right; border-top:1px solid #EDD5B8; padding-top:10px;">${opts.paymentId}</td>
        </tr>
        <tr>
          <td style="font-size:15px; font-weight:900; color:${BRAND_PRIMARY}; padding-top:12px; border-top:2px solid ${BRAND_GOLD};">Amount Paid</td>
          <td style="font-size:18px; font-weight:900; color:${BRAND_PRIMARY}; text-align:right; padding-top:12px; border-top:2px solid ${BRAND_GOLD};">₹${opts.amount.toLocaleString('en-IN')}</td>
        </tr>
      </table>
    </div>

    <!-- Features Included -->
    <div style="margin:0 0 28px;">
      <h2 style="font-size:14px; font-weight:700; color:${BRAND_PRIMARY}; margin:0 0 12px; text-transform:uppercase; letter-spacing:1px;">
        What's Included in Your Plan
      </h2>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${featuresHtml}
      </table>
    </div>

    <!-- CTA Button -->
    <div style="text-align:center; margin:0 0 24px;">
      <a href="https://elitetamilmatrimony.com/matches"
         style="display:inline-block; background:linear-gradient(135deg,${BRAND_PRIMARY},#9E1F33); color:#fff; font-size:15px; font-weight:700; text-decoration:none; padding:14px 36px; border-radius:50px; box-shadow:0 4px 16px rgba(107,26,42,0.3); letter-spacing:0.3px;">
        Start Finding Matches →
      </a>
    </div>

    <!-- Support note -->
    <p style="font-size:12px; color:#A08060; text-align:center; margin:0; line-height:1.6;">
      Questions? Email us at <a href="mailto:support@elitetamilmatrimony.com" style="color:${BRAND_PRIMARY}; text-decoration:none; font-weight:700;">support@elitetamilmatrimony.com</a><br/>
      or call us at <a href="tel:+914412345678" style="color:${BRAND_PRIMARY}; text-decoration:none; font-weight:700;">+91 44 1234 5678</a>
    </p>
  `;
  return emailWrapper(body);
}

export function paymentConfirmationText(opts: {
  name: string;
  plan: string;
  amount: number;
  paymentId: string;
  planPeriod: string;
  expiryDate: string;
}): string {
  return `Dear ${opts.name},\n\nYour payment for Elite Tamil Matrimony ${opts.plan} membership has been confirmed!\n\nPayment ID: ${opts.paymentId}\nAmount: ₹${opts.amount.toLocaleString('en-IN')}\nPlan: ${opts.plan} (${opts.planPeriod})\nValid until: ${opts.expiryDate}\n\nStart finding your matches at: https://elitetamilmatrimony.com/matches\n\nFor support: support@elitetamilmatrimony.com\n\n— Elite Tamil Matrimony Team`;
}
