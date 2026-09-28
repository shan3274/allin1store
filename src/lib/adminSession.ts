/**
 * Owner-console session: a signed, expiring token in an httpOnly cookie.
 * Uses Web Crypto so it runs in both the Edge middleware and Node route handlers.
 */
export const ADMIN_COOKIE = 'kirana_admin';
export const ADMIN_SESSION_HOURS = 12;

export function getAdminPasscode(): string | null {
  const configured = process.env.ADMIN_PASSCODE?.trim();
  if (configured) return configured;
  // Convenience default for local development only — production must set ADMIN_PASSCODE.
  return process.env.NODE_ENV === 'production' ? null : 'admin123';
}

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || `${getAdminPasscode() ?? ''}::kirana-admin`;
}

const enc = new TextEncoder();

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createAdminToken(): Promise<string> {
  const exp = Date.now() + ADMIN_SESSION_HOURS * 3600_000;
  return `${exp}.${await hmac(String(exp))}`;
}

export async function verifyAdminToken(token: string | undefined | null): Promise<boolean> {
  if (!token || !getAdminPasscode()) return false;
  const [expStr, sig] = token.split('.');
  const exp = Number(expStr);
  if (!exp || !sig || exp < Date.now()) return false;
  return safeEqual(sig, await hmac(expStr));
}
