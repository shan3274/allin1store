import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifyAdminToken } from '@/lib/adminSession';

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const authed = await verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value);

  if (pathname === '/admin/login') {
    return authed ? NextResponse.redirect(new URL('/admin', req.url)) : NextResponse.next();
  }

  if (!authed) {
    const login = new URL('/admin/login', req.url);
    login.searchParams.set('next', pathname + search);
    return NextResponse.redirect(login);
  }

  const res = NextResponse.next();
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
