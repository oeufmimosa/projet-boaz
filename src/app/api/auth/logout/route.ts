import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revokeSessionByToken, SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) await revokeSessionByToken(token).catch(() => {});
  cookies().delete(SESSION_COOKIE);
  // Form-based logout from sidebar — redirect back to login
  return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"));
}
