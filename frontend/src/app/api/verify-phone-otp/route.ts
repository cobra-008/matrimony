import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/email/otp-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp } = body as { phone: string; otp: string };
    
    if (!phone || !otp) {
      return NextResponse.json({ error: 'Phone and OTP are required.' }, { status: 400 });
    }
    
    const digits = phone.replace(/\D/g, '');
    const normalizedPhone = digits.length === 10 ? `+91${digits}` : `+${digits}`;
    
    const result = await verifyOtp(normalizedPhone, otp);
    
    if (!result.ok) {
      const messages: Record<string, string> = {
        expired: 'OTP has expired. Please request a new one.',
        mismatch: 'Incorrect OTP. Please try again.',
        max_attempts: 'Too many incorrect attempts. Please request a new OTP.',
        not_found: 'OTP not found. Please request a new one.',
      };
      return NextResponse.json(
        { error: messages[result.reason] ?? 'Verification failed.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true, verified: true });
  } catch (err) {
    console.error('[verify-phone-otp] Unexpected error:', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
