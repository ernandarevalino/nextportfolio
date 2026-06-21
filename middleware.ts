import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['id', 'en'],
  defaultLocale: 'id',
  localePrefix: 'as-needed'
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all routes starting with /admin
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("sb-access-token");

    if (!token) {
      // Redirect unauthenticated users to the login page
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Do not apply i18n middleware to /login, /api, or static assets
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Apply i18n middleware to public routes
  return intlMiddleware(request);
}

export const config = {
  // Match both admin routes and public i18n routes
  matcher: [
    "/admin/:path*",
    "/",
    "/(id|en)/:path*",
    "/((?!login|admin|api|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)"
  ],
};
