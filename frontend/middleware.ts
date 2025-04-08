import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Allow access to login, signup, and homepage without token
  if (
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup") ||
    request.nextUrl.pathname === "/" // Home page is public
  ) {
    return NextResponse.next(); // Allow these paths to be accessed without authentication
  }

  // Protect routes under /dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url)); // Redirect if no token
    }
  }

  return NextResponse.next(); // Continue with the request for protected routes
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/"], // Include home page in the matcher
};
