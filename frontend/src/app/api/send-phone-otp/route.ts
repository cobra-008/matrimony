import { NextRequest, NextResponse } from 'next/server';
import { storeOtp, generateOtp } from '@/lib/email/otp-store';

// Rate limiting: simple in-memory store for dev. In production, use Redis or Supabase.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(phone: string): boolean {
  const now = Date.now();
  const key = `phone:${phone}`;
  const entry = rateLimitMap.get(key);
  
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + 5 * 60 * 1000 }); // 5 min window
    return true;
  }
  
  if (entry.count >= 3) return false; // max 3 OTPs per 5 min
  entry.count++;
  return true;
}

async function sendSmsOtp(phone: string, otp: string): Promise<{ success: boolean; error?: string }> {
  const provider = process.env.SMS_PROVIDER; // 'twilio' | 'msg91' | 'textlocal'
  
  if (provider === 'twilio') {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM_NUMBER;
    
    if (!accountSid || !authToken || !from) {
      return { success: false, error: 'SMS provider not configured.' };
    }
    
    const body = `Your Elite Tamil Matrimony OTP is: ${otp}. Valid for 10 minutes. Do not share this with anyone.`;
    
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ To: phone, From: from, Body: body }).toString(),
      }
    );
    
    if (!response.ok) {
      const err = await response.json();
      console.error('[send-phone-otp] Twilio error:', err);
      return { success: false, error: 'SMS delivery failed.' };
    }
    
    return { success: true };
  }
  
  if (provider === 'msg91') {
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;
    const senderId = process.env.MSG91_SENDER_ID || 'ELITETM';
    
    if (!authKey) {
      return { success: false, error: 'SMS provider not configured.' };
    }
    
    const response = await fetch('https://api.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'authkey': authKey },
      body: JSON.stringify({
        template_id: templateId,
        sender: senderId,
        short_url: '0',
        mobiles: phone,
        otp,
      }),
    });
    
    if (!response.ok) {
      return { success: false, error: 'SMS delivery failed.' };
    }
    
    return { success: true };
  }
  
  // No provider configured
  console.warn('[send-phone-otp] No SMS_PROVIDER configured. OTP generated but not sent:', otp);
  return { success: true };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = body as { phone: string };
    
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
    }
    
    // Normalize: strip spaces/dashes, ensure +91 prefix
    const digits = phone.replace(/\D/g, '');
    const normalizedPhone = digits.length === 10 ? `+91${digits}` : `+${digits}`;
    
    if (digits.length < 10) {
      return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 });
    }
    
    // Rate limiting
    if (!checkRateLimit(normalizedPhone)) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please wait 5 minutes before trying again.' },
        { status: 429 }
      );
    }
    
    // Generate and store OTP (10 min TTL, 5 attempts max)
    // In development mode, if no provider is set, fallback to 123456 so the user can test the flow.
    const provider = process.env.SMS_PROVIDER;
    const otp = (!provider || provider === 'dummy') ? '123456' : generateOtp();
    
    await storeOtp(normalizedPhone, otp);
    
    // Send via SMS provider
    const result = await sendSmsOtp(normalizedPhone, otp);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? 'Unable to send OTP. Please try again.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[send-phone-otp] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
