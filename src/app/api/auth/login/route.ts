import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyPassword, issueSession, sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth";
import { loginSchema } from "@/lib/validators/content";
import { rateLimit, ipFromHeaders } from "@/lib/rate-limit";
import { env } from "@/lib/env";
import { fail, ok, handle } from "@/lib/api";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(req: Request) {
  return handle(async () => {
    const ip = ipFromHeaders(req.headers);
    const rl = rateLimit(`login:${ip}`, env.loginRateLimit.max, env.loginRateLimit.windowMs);
    if (!rl.ok) {
      return fail(429, `Trop de tentatives. Réessayez dans ${Math.ceil(rl.retryAfterMs / 1000)}s.`);
    }

    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.adminUser.findUnique({ where: { email } });
    const valid = user ? await verifyPassword(password, user.passwordHash) : false;

    await prisma.loginAttempt.create({
      data: { ip, email, success: !!(user && valid) },
    });

    if (!user || !valid) {
      logger.warn({ ip, email }, "Login failed");
      return fail(401, "Identifiants invalides");
    }

    const { token, expiresAt } = await issueSession(user.id);
    cookies().set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
    return ok({ email: user.email });
  });
}
