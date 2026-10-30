import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isDev = process.env.NODE_ENV !== 'production';
const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export function middleware(request: NextRequest) {
  // CSRF defense: block cross-site state-changing API requests
  if (request.nextUrl.pathname.startsWith('/api/') && UNSAFE_METHODS.has(request.method)) {
    const origin = request.headers.get('origin');
    const site = request.headers.get('sec-fetch-site');
    const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
    let originHost: string | null = null;
    if (origin) {
      try { originHost = new URL(origin).host; } catch { originHost = 'invalid'; }
    }
    if ((originHost && originHost !== host) || site === 'cross-site') {
      return NextResponse.json({ success: false, error: 'Cross-origin request blocked.' }, { status: 403 });
    }
  }

  const response = NextResponse.next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https: blob:;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self';
    frame-ancestors 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s{2,}/g, ' ').trim();
  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
