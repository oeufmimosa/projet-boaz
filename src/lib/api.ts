import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { logger } from "./logger";
import { AuthError } from "./auth";
import { UploadError } from "./storage";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function fail(status: number, message: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

/**
 * Wraps a route handler to translate common errors into HTTP responses.
 *
 * Next.js' `DYNAMIC_SERVER_USAGE` est lancé par le framework pendant la
 * static analysis quand une route utilise `cookies()` / `headers()` /
 * `searchParams`. Ce n'est pas une erreur applicative — Next attrape ce
 * digest pour basculer la route en mode dynamic. On laisse passer.
 */
function isDynamicServerUsage(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const r = err as { digest?: unknown };
  return typeof r.digest === "string" && r.digest === "DYNAMIC_SERVER_USAGE";
}

export async function handle(fn: () => Promise<Response> | Response): Promise<Response> {
  try {
    return await fn();
  } catch (err) {
    if (isDynamicServerUsage(err)) throw err;
    if (err instanceof ZodError) {
      return fail(400, "Validation échouée", { issues: err.flatten() });
    }
    if (err instanceof AuthError) {
      return fail(401, err.message);
    }
    if (err instanceof UploadError) {
      return fail(err.status, err.message);
    }
    logger.error({ err }, "Unhandled API error");
    return fail(500, "Erreur interne");
  }
}
