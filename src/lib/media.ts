import { prisma } from "@/lib/prisma";

/**
 * Lecture d'un MediaAsset par sa clé (lecture publiée, pas le draft).
 * Renvoie null si pas trouvé — laisse le composant gérer son fallback.
 */
export async function getAssetByKey(key: string): Promise<{
  url: string;
  blurDataURL: string | null;
  width: number | null;
  height: number | null;
  attribution: string | null;
  attributionUrl: string | null;
} | null> {
  try {
    const a = await prisma.mediaAsset.findUnique({ where: { key } });
    if (!a) return null;
    const r = a as unknown as Record<string, unknown>;
    return {
      url: a.url,
      blurDataURL: a.blurDataURL ?? null,
      width: a.width ?? null,
      height: a.height ?? null,
      attribution: (r.attribution as string | null) ?? null,
      attributionUrl: (r.attributionUrl as string | null) ?? null,
    };
  } catch {
    return null;
  }
}
