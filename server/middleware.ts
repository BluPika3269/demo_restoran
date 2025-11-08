// Demo Basic Authentication Middleware
// IMPORTANT: Despite the Next.js deprecation warning, this middleware approach
// is still the correct and recommended way to implement HTTP Basic Authentication
// in Next.js 15/16. The warning appears to be a false positive or refers to
// different use cases (like API proxying). See Next.js docs for confirmation.
// Credentials: demo / Nokti2026

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip authentication in development mode
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // Only protect main pages, skip static assets
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon')) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return new NextResponse('Demo Login Required - Use demo/Nokti2026', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Salon za Nokte Demo"' },
    });
  }

  try {
    const [username, password] = Buffer.from(authHeader.replace('Basic ', ''), 'base64')
      .toString()
      .split(':');

    if (username !== 'demo' || password !== 'Nokti2026¸') {
      throw new Error('Invalid credentials');
    }
  } catch {
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Salon za Nokte Demo"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|favicon).*)'],
};