import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { verifyCsrf } from "@/lib/csrf";
import { processImage } from "@/lib/image-processor";
import { resolveSpec, checkDimensions } from "@/lib/imageSpecs";
import { env } from "@/lib/env";
import { audit } from "@/lib/audit";
import { handle, ok, fail } from "@/lib/api";

export const runtime = "nodejs";

/**
 * POST /api/upload
 * Champs FormData :
 *  - file (File, requis)
 *  - imageKey (string, optionnel) — clé de spec à respecter
 *  - draft (string "true"|"false") — pose en draftUrl si true (défaut)
 *  - autoResize (string "true"|"false") — recadre côté serveur aux dimensions cibles
 *
 * Génère via sharp : original (éventuellement recadré), variantes WebP 1x/2x/0.5x,
 * et un blurDataURL.
 */
export async function POST(req: Request) {
  return handle(async () => {
    const user = await requireAdmin();
    if (!verifyCsrf(req)) return fail(403, "CSRF invalide");

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return fail(400, "Fichier manquant");
    if (file.size > env.upload.maxBytes) return fail(413, `Fichier trop lourd (max ${env.upload.maxBytes} octets)`);

    const imageKey = (form.get("imageKey") as string) || null;
    const isDraft = (form.get("draft") as string) !== "false";
    const autoResize = (form.get("autoResize") as string) === "true";

    const buffer = Buffer.from(await file.arrayBuffer());
    const spec = imageKey ? resolveSpec(imageKey) : null;
    const targetWidth = spec && autoResize ? spec.width : undefined;
    const targetHeight = spec && autoResize ? spec.height : undefined;

    const processed = await processImage({
      buffer,
      mimeType: file.type || "application/octet-stream",
      originalName: file.name,
      targetWidth,
      targetHeight,
    });

    let dimWarning: string | undefined;
    if (spec && processed.width && processed.height) {
      const dim = checkDimensions(spec, processed.width, processed.height);
      if (!dim.ok) dimWarning = dim.message;
    }

    const variantsJson = JSON.stringify(processed.variants);

    // Si la clé est déjà associée à un asset, on met à jour son draft.
    if (imageKey && isDraft) {
      const existing = await prisma.mediaAsset.findUnique({ where: { key: imageKey } });
      if (existing) {
        await prisma.mediaAsset.update({
          where: { id: existing.id },
          data: {
            draftFilename: processed.filename,
            draftUrl: processed.url,
            draftWidth: processed.width,
            draftHeight: processed.height,
            draftBlurDataURL: processed.blurDataURL,
            draftVariants: variantsJson,
            draftUpdatedAt: new Date(),
            draftUpdatedBy: user.email,
          } as never,
        });
        await audit({
          adminEmail: user.email,
          action: "upload",
          key: imageKey,
          before: existing.url,
          after: processed.url,
        });
        return ok({
          id: existing.id,
          key: imageKey,
          url: processed.url,
          width: processed.width,
          height: processed.height,
          dimWarning,
        });
      }
    }

    // Création d'un nouvel asset
    const created = await prisma.mediaAsset.create({
      data: {
        key: imageKey ?? null,
        filename: processed.filename,
        originalName: file.name,
        mimeType: processed.mimeType,
        size: processed.size,
        url: processed.url,
        width: processed.width,
        height: processed.height,
        blurDataURL: processed.blurDataURL,
        variants: variantsJson,
        ...(isDraft ? {
          draftFilename: processed.filename,
          draftUrl: processed.url,
          draftWidth: processed.width,
          draftHeight: processed.height,
          draftBlurDataURL: processed.blurDataURL,
          draftVariants: variantsJson,
          draftUpdatedAt: new Date(),
          draftUpdatedBy: user.email,
        } : {}),
      } as never,
    });

    await audit({
      adminEmail: user.email,
      action: "upload",
      key: imageKey ?? null,
      after: processed.url,
    });

    return ok({
      id: created.id,
      key: created.key,
      url: created.url,
      width: processed.width,
      height: processed.height,
      dimWarning,
    });
  });
}
