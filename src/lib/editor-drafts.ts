import { prisma } from "./prisma";
import type { EditorDraft } from "@/components/editor/EditorContext";

/**
 * Récupère tous les drafts en cours côté serveur pour amorcer l'EditorContext.
 * Utilisé dans les pages /admin/editor/*.
 */
export async function loadAllDrafts(): Promise<EditorDraft[]> {
  // Content drafts
  const contents = await prisma.content.findMany({
    where: { draftValue: { not: null } as never },
  }).catch(() => []);

  // Media drafts
  const medias = await prisma.mediaAsset.findMany({
    where: { draftUrl: { not: null } as never },
  }).catch(() => []);

  const out: EditorDraft[] = [];
  for (const c of contents) {
    const r = c as unknown as Record<string, unknown>;
    const draftValue = r.draftValue as string | null;
    if (draftValue !== null && draftValue !== undefined) {
      out.push({ key: c.key, value: draftValue, type: "content" });
    }
  }
  for (const m of medias) {
    const r = m as unknown as Record<string, unknown>;
    const draftUrl = r.draftUrl as string | null;
    if (m.key && draftUrl) {
      out.push({ key: m.key, url: draftUrl, type: "image" });
    }
  }
  return out;
}
