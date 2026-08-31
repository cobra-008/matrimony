// src/lib/email/templates.ts
// Beautiful branded HTML email templates for Elite Tamil Matrimony

const BASE_STYLE = `
  font-family: 'Segoe UI', Arial, sans-serif;
  margin: 0; padding: 0; background: #FAF6F1;
`;

const BRAND_PRIMARY = '#6B1A2A';
const BRAND_GOLD = '#C8973A';
const LOGO_URL = 'https://elitetamilmatrimony.com/logo-full.jpg';

// â”€â”€ Shared header + footer wrappers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
            <td style="background:linear-gradient(135deg,${BRAND_PRIMARY} 0%,#9E1F33 100%); padding:24px 32px; text-align:center;">
              <img src="${LOGO_URL}" alt="Elite Tamil Matrimony" width="180" style="max-width:180px; height:auto; display:inline-block; border-radius:6px;" />
              <div style="font-size:11px; color:rgba(255,255,255,0.65); margin-top:8px; letter-spacing:1.5px; text-transform:uppercase;">
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
              <p style="font-size:11px; color:#A08060; margin:0 0 4px;">
                &copy; ${new Date().getFullYear()} Elite Tamil Matrimony. All rights reserved.
              </p>
              <p style="font-size:11px; color:#A08060; margin:0 0 4px;">
                support@elitetamilmatrimony.com &nbsp;|&nbsp; +91 93606 53547
              </p>
              <p style="font-size:10px; color:#BBA080; margin:0 0 6px;">
                2nd Floor, Sona College of Technology, Sona Valliappa Block,<br/>
                Sona Incubation Foundation, Junction Main Rd, Salem, Tamil Nadu 636005
              </p>
              <p style="font-size:10px; color:#C4A080; margin:0;">
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

// â”€â”€ OTP Email â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    <table cellpadding="0" cellspacing="0" width="100%" style="background:#F5FBF5; border:1px solid #C8E6C9; border-radius:8px;">
      <tr>
        <td style="padding:12px 16px; vertical-align:top; width:28px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3A7040" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </td>
        <td style="padding:12px 16px 12px 0;">
          <p style="font-size:12px; color:#3A7040; margin:0; line-height:1.5;">
            <strong>Security tip:</strong> Elite Tamil Matrimony will never call or ask you for this OTP. Keep it confidential.
          </p>
        </td>
      </tr>
    </table>
  `;
  return emailWrapper(body);
}

export function otpEmailText(name: string, otp: string): string {
  return `Hello ${name},\n\nYour Elite Tamil Matrimony email verification OTP is: ${otp}\n\nThis OTP is valid for 10 minutes. Do not share it with anyone.\n\nIf you did not request this, please ignore this email.\n\nâ€” Elite Tamil Matrimony Team`;
}

// â”€â”€ Payment Confirmation Email â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        <span style="color:${BRAND_GOLD}; margin-right:8px; font-weight:700;">&#10003;</span>${f}
      </td>
    </tr>
  `).join('');

  const body = `
    <!-- Success Icon -->
    <div style="text-align:center; margin-bottom:28px;">
      <div style="width:72px; height:72px; background:linear-gradient(135deg,${BRAND_PRIMARY},#9E1F33); border-radius:50%; display:inline-block; margin-bottom:16px; box-shadow:0 6px 20px rgba(107,26,42,0.25); line-height:72px; text-align:center;">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h1 style="font-size:26px; font-weight:900; color:${BRAND_PRIMARY}; margin:0 0 6px;">
        Payment Confirmed!
      </h1>
      <p style="font-size:15px; color:#777; margin:0;">
        Your membership is now active
      </p>
    </div>

    <!-- Plan Badge -->
    <div style="background:linear-gradient(135deg,${BRAND_GOLD},#E8C060); border-radius:50px; padding:10px 24px; text-align:center; margin:0 0 28px;">
      <span style="font-size:16px; font-weight:900; color:#fff; letter-spacing:0.5px;">
        ${opts.plan} Member
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
          <td style="font-size:13px; color:#888; padding:5px 0; border-top:1px solid #EDD5B8; padding-top:10px;">Payment ID</td>
          <td style="font-size:11px; color:#666; font-family:'Courier New',monospace; text-align:right; border-top:1px solid #EDD5B8; padding-top:10px;">${opts.paymentId}</td>
        </tr>
        <tr>
          <td style="font-size:15px; font-weight:900; color:${BRAND_PRIMARY}; padding-top:12px; border-top:2px solid ${BRAND_GOLD};">Amount Paid</td>
          <td style="font-size:18px; font-weight:900; color:${BRAND_PRIMARY}; text-align:right; padding-top:12px; border-top:2px solid ${BRAND_GOLD};">&#8377;${opts.amount.toLocaleString('en-IN')}</td>
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
        Start Finding Matches &rarr;
      </a>
    </div>

    <!-- Support note -->
    <p style="font-size:12px; color:#A08060; text-align:center; margin:0; line-height:1.6;">
      Questions? Email us at <a href="mailto:support@elitetamilmatrimony.com" style="color:${BRAND_PRIMARY}; text-decoration:none; font-weight:700;">support@elitetamilmatrimony.com</a><br/>
      or call us at <a href="tel:+919360653547" style="color:${BRAND_PRIMARY}; text-decoration:none; font-weight:700;">+91 93606 53547</a>
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
  return `Dear ${opts.name},\n\nYour payment for Elite Tamil Matrimony ${opts.plan} membership has been confirmed!\n\nPayment ID: ${opts.paymentId}\nAmount: Rs.${opts.amount.toLocaleString('en-IN')}\nPlan: ${opts.plan} (${opts.planPeriod})\nValid until: ${opts.expiryDate}\n\nStart finding your matches at: https://elitetamilmatrimony.com/matches\n\nFor support: support@elitetamilmatrimony.com | +91 93606 53547\n\nâ€” Elite Tamil Matrimony Team`;
}
