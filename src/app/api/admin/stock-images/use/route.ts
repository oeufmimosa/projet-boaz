import { z } from "zod";
import { handle, ok, fail } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { verifyCsrf } from "@/lib/csrf";
import { prisma } from "@/lib/prisma";
import { processImage } from "@/lib/image-processor";
import {
  searchStockImages,
  trackUnsplashDownload,
  buildAttribution,
  type StockImageSource,
  type StockImageResult,
} from "@/lib/stock-images";
import { resolveSpec } from "@/lib/imageSpecs";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

/** Minimal mime → extension map (évite une dep externe pour 4 cas). */
function extFromMime(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
    case "image/jpg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    default:
      return "jpg";
  }
}

const bodySchema = z.object({
  imageKey: z.string().min(1).max(200),
  query: z.string().min(1).max(200),
  stockId: z.string().min(1).max(100),
  source: z.enum(["unsplash", "pexels"]),
  /** Si true, on persiste en draft (pattern habituel admin). Sinon publish direct. */
  draft: z.boolean().optional().default(true),
});

/**
 * POST /api/admin/stock-images/use
 *
 * Récupère l'image stock identifiée par `stockId` (en relançant la même
 * recherche que l'admin a faite et en retrouvant la photo par id), la
 * télécharge, la passe par le pipeline `processImage` (sharp + variantes
 * WebP + blurDataURL), persiste un MediaAsset avec attribution complète et,
 * pour Unsplash, ping le tracking download.
 *
 * Pourquoi relancer la recherche : on ne fait pas confiance à un payload
 * client qui contiendrait directement l'URL haute résolution — on la
 * redécouvre côté serveur depuis l'API officielle pour éviter les
 * substitutions et garantir l'attribution exacte.
 */
export async function POST(req: Request) {
  return handle(async () => {
    const user = await requireAdmin();
    if (!verifyCsrf(req)) return fail(403, "CSRF invalide");

    const json = await req.json();
    const body = bodySchema.parse(json);

    // Re-lance la recherche pour retrouver la photo par id (cf. note ci-dessus).
    const search = await searchStockImages(body.query, {
      source: body.source as StockImageSource,
      perPage: 24,
    });
    if (search.apiKeyMissing) {
      return fail(503, `Clé d'API ${body.source.toUpperCase()} non configurée`);
    }
    if (search.error) {
      return fail(502, `Erreur API ${body.source}: ${search.error}`);
    }

    const photo: StockImageResult | undefined = search.results.find(
      (r) => r.id === body.stockId,
    );
    if (!photo) {
      // Fallback : tenter une recherche page 2 (couvre le cas où l'admin a
      // cliqué sur un résultat hors de la première page). Sinon refus.
      const search2 = await searchStockImages(body.query, {
        source: body.source as StockImageSource,
        perPage: 24,
        page: 2,
      });
      const photo2 = search2.results.find((r) => r.id === body.stockId);
      if (!photo2) {
        return fail(404, "Image stock introuvable — veuillez la rechercher à nouveau");
      }
      return persistStockImage(photo2, body, user.email);
    }

    return persistStockImage(photo, body, user.email);
  });
}

async function persistStockImage(
  photo: StockImageResult,
  body: z.infer<typeof bodySchema>,
  adminEmail: string,
) {
  // Téléchargement haute résolution
  const dl = await fetch(photo.url, { cache: "no-store" });
  if (!dl.ok) {
    return fail(502, `Téléchargement de l'image échoué (HTTP ${dl.status})`);
  }
  const buffer = Buffer.from(await dl.arrayBuffer());
  const contentType = dl.headers.get("content-type") ?? "image/jpeg";
  const mimeType = contentType.split(";")[0]!.trim();
  const ext = extFromMime(mimeType);
  const safeStockId = photo.id.replace(/[^a-z0-9_-]/gi, "");
  const originalName = `${photo.source}-${safeStockId}.${ext}`;

  // Spec pour recadrage cible si la clé impose des dimensions précises
  const spec = resolveSpec(body.imageKey);
  const processed = await processImage({
    buffer,
    mimeType,
    originalName,
    targetWidth: spec?.width,
    targetHeight: spec?.height,
  });

  const attr = buildAttribution(photo);
  const variantsJson = JSON.stringify(processed.variants);

  // Persistance MediaAsset (mêmes règles que /api/upload : si clé existe,
  // on met à jour le draft ; sinon création).
  const existing = await prisma.mediaAsset.findUnique({ where: { key: body.imageKey } });

  let mediaAssetId: string;
  if (existing && body.draft) {
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
        draftUpdatedBy: adminEmail,
        attribution: attr.attribution,
        attributionUrl: attr.attributionUrl,
        licenseType: attr.licenseType,
      } as never,
    });
    mediaAssetId = existing.id;
  } else {
    const created = await prisma.mediaAsset.create({
      data: {
        key: body.imageKey,
        filename: processed.filename,
        originalName,
        mimeType: processed.mimeType,
        size: processed.size,
        url: processed.url,
        width: processed.width,
        height: processed.height,
        blurDataURL: processed.blurDataURL,
        variants: variantsJson,
        attribution: attr.attribution,
        attributionUrl: attr.attributionUrl,
        licenseType: attr.licenseType,
        ...(body.draft
          ? {
              draftFilename: processed.filename,
              draftUrl: processed.url,
              draftWidth: processed.width,
              draftHeight: processed.height,
              draftBlurDataURL: processed.blurDataURL,
              draftVariants: variantsJson,
              draftUpdatedAt: new Date(),
              draftUpdatedBy: adminEmail,
            }
          : {}),
      } as never,
    });
    mediaAssetId = created.id;
  }

  // AuditLog
  await prisma.auditLog.create({
    data: {
      adminEmail,
      action: "upload",
      key: body.imageKey,
      after: `${photo.source}:${photo.id} → ${processed.url}`,
    },
  });

  // Tracking Unsplash (best-effort, non bloquant)
  if (photo.source === "unsplash") {
    trackUnsplashDownload(photo.id).catch((err) => {
      logger.warn({ err, photoId: photo.id }, "Unsplash tracking failed");
    });
  }

  return ok({
    id: mediaAssetId,
    key: body.imageKey,
    url: processed.url,
    width: processed.width,
    height: processed.height,
    attribution: attr.attribution,
    attributionUrl: attr.attributionUrl,
    licenseType: attr.licenseType,
  });
}
