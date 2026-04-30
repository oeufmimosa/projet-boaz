import { prisma } from "./prisma";

/**
 * Fetch a single content value by key with a fallback.
 * Always cast safely — DB may not have the key in fresh installs.
 */
export async function getContent(key: string, fallback = ""): Promise<string> {
  const row = await prisma.content.findUnique({ where: { key } });
  return row?.value ?? fallback;
}

/**
 * Fetch many keys at once. Returns a Map of key→value (missing keys absent).
 */
export async function getContents(keys: string[]): Promise<Map<string, string>> {
  const rows = await prisma.content.findMany({ where: { key: { in: keys } } });
  return new Map(rows.map((r) => [r.key, r.value]));
}

/** Like getContent, but parses JSON. Returns fallback on parse error or missing. */
export async function getJsonContent<T>(key: string, fallback: T): Promise<T> {
  const value = await getContent(key);
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/** Convenience: fetch all keys with a given prefix. */
export async function getContentsByPrefix(prefix: string): Promise<Map<string, string>> {
  const rows = await prisma.content.findMany({
    where: { key: { startsWith: prefix } },
  });
  return new Map(rows.map((r) => [r.key, r.value]));
}
