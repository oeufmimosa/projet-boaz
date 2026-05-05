import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { verifyCsrf } from "@/lib/csrf";
import { publishSchema } from "@/lib/validators/editor";
import { audit } from "@/lib/audit";
import { handle, ok, fail } from "@/lib/api";

export const runtime = "nodejs";

/**
 * POST /api/admin/publish : copie tous les drafts (ou un sous-ensemble) en
 * valeurs publiées. Atomique par clé.
 */
export async function POST(req: Request) {
  return handle(async () => {
    const user = await requireAdmin();
    if (!verifyCsrf(req)) return fail(403, "CSRF invalide");

    const body = await req.json().catch(() => ({}));
    const data = publishSchema.parse(body);
    const filterKeys = data.keys && data.keys.length > 0 ? data.keys : null;

    // Content drafts → published
    const contentRows = await prisma.content.findMany({
      where: filterKeys
        ? { key: { in: filterKeys }, draftValue: { not: null } as never }
        : ({ draftValue: { not: null } } as never),
    });
    for (const c of contentRows) {
      const r = c as unknown as Record<string, unknown>;
      const draftValue = r.draftValue as string | null;
      if (draftValue === null || draftValue === undefined) continue;
      const before = c.value;
      await prisma.content.update({
        where: { id: c.id },
        data: {
          value: draftValue,
          draftValue: null,
          draftUpdatedAt: null,
          draftUpdatedBy: null,
          publishedAt: new Date(),
        } as never,
      });
      await audit({
        adminEmail: user.email,
        action: "publish",
        key: c.key,
        before,
        after: draftValue,
      });
    }

    // MediaAsset drafts → published
    const mediaRows = await prisma.mediaAsset.findMany({
      where: filterKeys
        ? { key: { in: filterKeys }, draftUrl: { not: null } as never }
        : ({ draftUrl: { not: null } } as never),
    });
    for (const m of mediaRows) {
      const r = m as unknown as Record<string, unknown>;
      const draftUrl = r.draftUrl as string | null;
      if (!draftUrl) continue;
      const before = m.url;
      await prisma.mediaAsset.update({
        where: { id: m.id },
        data: {
          url: draftUrl,
          draftUrl: null,
          draftUpdatedAt: null,
          draftUpdatedBy: null,
        } as never,
      });
      await audit({
        adminEmail: user.email,
        action: "publish",
        key: m.key,
        before,
        after: draftUrl,
      });
    }

    return ok({
      contentPublished: contentRows.length,
      mediaPublished: mediaRows.length,
    });
  });
}
