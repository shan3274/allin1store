import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, ADMIN_SESSION_HOURS, createAdminToken, getAdminPasscode, safeEqual } from '@/lib/adminSession';

// Basic per-instance brute-force protection: 5 failed attempts per IP per 15 minutes.
const WINDOW_MS = 15 * 60_000;
const MAX_FAILS = 5;
const failures = new Map<string, { count: number; first: number }>();

function clientIp(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: NextRequest) {
  const passcode = getAdminPasscode();
  if (!passcode) {
    return NextResponse.json(
      { error: 'Owner login is not configured. Set ADMIN_PASSCODE in the server environment.' },
      { status: 503 }
    );
  }

  const ip = clientIp(req);
  const rec = failures.get(ip);
  if (rec && Date.now() - rec.first < WINDOW_MS && rec.count >= MAX_FAILS) {
    return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 });
  }

  let body: { passcode?: unknown } = {};
  try {
    body = await req.json();
  } catch {}
  const attempt = typeof body.passcode === 'string' ? body.passcode : '';

  if (!safeEqual(attempt, passcode)) {
    const fresh = !rec || Date.now() - rec.first >= WINDOW_MS;
    failures.set(ip, fresh ? { count: 1, first: Date.now() } : { count: rec!.count + 1, first: rec!.first });
    return NextResponse.json({ error: 'Incorrect passcode.' }, { status: 401 });
  }

  failures.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await createAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_HOURS * 3600,
  });
  return res;
}
