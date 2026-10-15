import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Fast session gate: cookie presence decides instantly (no DB round-trip per click).
// Real session validity is enforced by BetterAuth on every /api/* call (401) and
// the store falls back to empty data when APIs reject, so a stale cookie shows
// nothing instead of someone else's data.
const SESSION_COOKIES = ["better-auth.session_token", "__Secure-better-auth.session_token"];

export function middleware(req: NextRequest) {
  const hasSession = SESSION_COOKIES.some((c) => req.cookies.has(c));
  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/business-hub/:path*",
    "/business-assistant/:path*",
    "/messages/:path*",
    "/gmail/:path*",
    "/tasks/:path*",
    "/reminders/:path*",
    "/followups/:path*",
    "/calendar/:path*",
    "/connect/:path*",
    "/ai-tools/:path*",
    "/content/:path*",
    "/social/:path*",
    "/analytics/:path*",
    "/assistant/:path*",
    "/business-brain/:path*",
    "/myday/:path*",
    "/important/:path*",
    "/drive/:path*",
    "/meet/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/subscription/:path*",
  ],
};
