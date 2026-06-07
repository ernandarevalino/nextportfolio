import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
