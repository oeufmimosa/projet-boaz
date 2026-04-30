/**
 * Centralised, typed access to env vars.
 * Throws at boot if a critical secret is missing in production.
 */
function required(name: string, fallback?: string): string {
  const value = process.env[name];
  if (value && value.length > 0) return value;
  if (fallback !== undefined) return fallback;
  if (process.env.NODE_ENV === "production") {
    throw new Error(`Missing required env var: ${name}`);
  }
  return "";
}

function num(name: string, fallback: number): number {
  const v = process.env[name];
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function bool(name: string, fallback: boolean): boolean {
  const v = process.env[name];
  if (!v) return fallback;
  return ["1", "true", "yes", "on"].includes(v.toLowerCase());
}

export const env = {
  databaseUrl: required("DATABASE_URL", "file:./dev.db"),
  authSecret: required("AUTH_SECRET", "dev-only-insecure-secret-change-me"),
  sessionTtlDays: num("SESSION_TTL_DAYS", 7),

  loginRateLimit: {
    max: num("LOGIN_RATE_LIMIT_MAX", 5),
    windowMs: num("LOGIN_RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
  },

  upload: {
    maxBytes: num("UPLOAD_MAX_BYTES", 5 * 1024 * 1024),
    dir: required("UPLOAD_DIR", "public/uploads"),
    publicPrefix: required("PUBLIC_UPLOAD_PREFIX", "/uploads"),
  },

  smtp: {
    host: process.env.SMTP_HOST ?? "",
    port: num("SMTP_PORT", 587),
    secure: bool("SMTP_SECURE", false),
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
    from: required("MAIL_FROM", "Projet Boaz <no-reply@example.com>"),
    adminEmail: required("ADMIN_NOTIFICATION_EMAIL", "admin@example.com"),
  },

  site: {
    name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Projet Boaz",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  },

  isProd: process.env.NODE_ENV === "production",
  logLevel: process.env.LOG_LEVEL ?? "info",
};
