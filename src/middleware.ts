import { NextRequest, NextResponse } from "next/server";

/**
 * Edge middleware: cheap pre-check only.
 * - Redirects /admin/* without a session cookie to /admin/login.
 * - Ensures a CSRF cookie is set for any /admin/* visit.
 *
 * Real session validity (DB lookup) and CSRF verification happen inside
 * Node runtime route handlers — middleware cannot import Prisma.
 */
const SESSION_COOKIE = "bz_session";
const CSRF_COOKIE = "bz_csrf";

function randomToken(len = 24): string {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";
  const isAdminApi = pathname.startsWith("/api/") && requiresAdminApi(pathname);

  if (isAdminPage && !isAdminLogin) {
    const session = req.cookies.get(SESSION_COOKIE)?.value;
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();

  // Ensure CSRF cookie exists on any /admin or /api/admin context
  if (isAdminPage || isAdminApi) {
    if (!req.cookies.get(CSRF_COOKIE)) {
      res.cookies.set(CSRF_COOKIE, randomToken(), {
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
  }

  return res;
}

function requiresAdminApi(pathname: string): boolean {
  // Admin-only API surface (CSRF cookie issued for these too).
  const protectedPrefixes = [
    "/api/content",
    "/api/upload",
    "/api/articles",
    "/api/submissions",
    "/api/simulator/steps",
  ];
  return protectedPrefixes.some((p) => pathname.startsWith(p));
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
