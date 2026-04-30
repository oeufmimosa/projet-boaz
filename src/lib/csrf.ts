import crypto from "node:crypto";
import { cookies } from "next/headers";
import { env } from "./env";

export const CSRF_COOKIE = "bz_csrf";
export const CSRF_HEADER = "x-csrf-token";

/**
 * Double-submit cookie pattern.
 * - Cookie is set on first GET to /admin/*; readable by client-side fetch headers.
 * - Mutating routes require the same value to appear in CSRF_HEADER.
 * - Cookie is NOT httpOnly so the client can echo it; it's protected by SameSite=Lax.
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

export function ensureCsrfCookie(): string {
  const store = cookies();
  const existing = store.get(CSRF_COOKIE)?.value;
  if (existing) return existing;
  const token = generateCsrfToken();
  store.set(CSRF_COOKIE, token, {
    httpOnly: false,
    sameSite: "lax",
    secure: env.isProd,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return token;
}

export function verifyCsrf(req: Request): boolean {
  const cookieValue = cookies().get(CSRF_COOKIE)?.value;
  const headerValue = req.headers.get(CSRF_HEADER);
  if (!cookieValue || !headerValue) return false;
  if (cookieValue.length !== headerValue.length) return false;
  // constant-time compare
  return crypto.timingSafeEqual(Buffer.from(cookieValue), Buffer.from(headerValue));
}
