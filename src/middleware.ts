import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession, getSession } from './lib/auth';

export async function middleware(request: NextRequest) {
  // Update session on every request if needed
  await updateSession(request);

  const { pathname } = request.nextUrl;

  // Root path is now public
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Public paths that do not require authentication
  const publicPaths = ['/login', '/signup', '/api/auth/login', '/api/auth/signup', '/share'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (!isPublicPath && !pathname.startsWith('/_next') && pathname !== '/favicon.ico') {
    const session = await getSession();
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
