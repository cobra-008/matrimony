import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
  const token  = req.cookies.get("admin_session")?.value;
  const secret = process.env.ADMIN_JWT_SECRET;

  if (!token || !secret) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  try {
    const key = new TextEncoder().encode(secret);
    await jwtVerify(token, key);
    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
