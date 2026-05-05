import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { verifyCsrf } from "@/lib/csrf";
import { draftSetSchema, contentKeySchema } from "@/lib/validators/editor";
import { audit } from "@/lib/audit";
import { handle, ok, fail } from "@/lib/api";

export const runtime = "nodejs";

/**
 * PUT /api/admin/draft : pose un draft sur Content (type=content) ou
 * MediaAsset.draftUrl (type=image). Idempotent.
 */
export async function PUT(req: Request) {
  return handle(async () => {
    const user = await requireAdmin();
    if (!verifyCsrf(req)) return fail(403, "CSRF invalide");

    const body = await req.json();
    const data = draftSetSchema.parse(body);

    if (data.type === "content") {
      if (data.value === undefined) return fail(400, "value requis pour type=content");
      const before = await prisma.content.findUnique({ where: { key: data.key } });
      // upsert avec draftValue ; on ne touche pas au value publié
      await prisma.content.upsert({
        where: { key: data.key },
        update: {
          draftValue: data.value,
          draftUpdatedAt: new Date(),
          draftUpdatedBy: user.email,
        } as never,
        create: {
          key: data.key,
          value: "",                  // pas de valeur publiée tant que pas publish
          type: "TEXT",
          draftValue: data.value,
          draftUpdatedAt: new Date(),
          draftUpdatedBy: user.email,
        } as never,
      });
      await audit({
        adminEmail: user.email,
        action: "draft_set",
        key: data.key,
        before: before?.value,
        after: data.value,
      });
      return ok({ key: data.key });
    }

    // type=image : pose draftUrl sur MediaAsset (la création de l'asset s'est
    // faite dans /api/upload?draft=true). Ici on relie juste l'asset au key.
    if (!data.url) return fail(400, "url requis pour type=image");
    const asset = await prisma.mediaAsset.findFirst({ where: { url: data.url } });
    if (!asset) return fail(404, "MediaAsset non trouvé pour cette URL");

    // Détache un éventuel asset précédent qui aurait cette key
    await prisma.mediaAsset.updateMany({
      where: { key: data.key, NOT: { id: asset.id } },
      data: { key: null },
    });
    await prisma.mediaAsset.update({
      where: { id: asset.id },
      data: {
        key: data.key,
        draftUrl: asset.url,
        draftUpdatedAt: new Date(),
        draftUpdatedBy: user.email,
      } as never,
    });
    await audit({
      adminEmail: user.email,
      action: "draft_set",
      key: data.key,
      after: asset.url,
    });
    return ok({ key: data.key, url: asset.url });
  });
}

/**
 * DELETE /api/admin/draft?key=... : annule un draft (un seul ou tous).
 */
export async function DELETE(req: Request) {
  return handle(async () => {
    const user = await requireAdmin();
    if (!verifyCsrf(req)) return fail(403, "CSRF invalide");

    const url = new URL(req.url);
    const key = url.searchParams.get("key");
    const target = key ? contentKeySchema.parse(key) : null;

    if (target) {
      await prisma.content.updateMany({
        where: { key: target },
        data: { draftValue: null, draftUpdatedAt: null, draftUpdatedBy: null } as never,
      });
      await prisma.mediaAsset.updateMany({
        where: { key: target },
        data: { draftUrl: null, draftUpdatedAt: null, draftUpdatedBy: null } as never,
      });
      await audit({ adminEmail: user.email, action: "discard", key: target });
    } else {
      await prisma.content.updateMany({
        where: { draftValue: { not: null } } as never,
        data: { draftValue: null, draftUpdatedAt: null, draftUpdatedBy: null } as never,
      });
      await prisma.mediaAsset.updateMany({
        where: { draftUrl: { not: null } } as never,
        data: { draftUrl: null, draftUpdatedAt: null, draftUpdatedBy: null } as never,
      });
      await audit({ adminEmail: user.email, action: "discard" });
    }
    return ok({ key: target });
  });
}
