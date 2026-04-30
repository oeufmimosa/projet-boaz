/**
 * In-memory sliding window rate limiter.
 * Keyed by arbitrary string (e.g. IP). Sufficient for a single-instance app.
 * For multi-instance, swap with Redis or a DB-backed counter.
 */
type Bucket = { hits: number[] };
const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterMs: number;
}

export function rateLimit(
  key: string,
  max: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);
  if (bucket.hits.length >= max) {
    const retryAfterMs = windowMs - (now - bucket.hits[0]);
    buckets.set(key, bucket);
    return { ok: false, remaining: 0, retryAfterMs };
  }
  bucket.hits.push(now);
  buckets.set(key, bucket);
  return { ok: true, remaining: max - bucket.hits.length, retryAfterMs: 0 };
}

export function ipFromHeaders(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
