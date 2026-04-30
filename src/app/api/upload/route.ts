import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { storage, UploadError } from "@/lib/storage";
import { verifyCsrf } from "@/lib/csrf";
import { handle, ok, fail } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(req: Request) {
  return handle(async () => {
    await requireAdmin();
    if (!verifyCsrf(req)) return fail(403, "CSRF invalide");

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new UploadError(400, "Fichier manquant");

    const buffer = Buffer.from(await file.arrayBuffer());
    const stored = await storage.save({
      buffer,
      originalName: file.name,
      mimeType: file.type,
    });

    const created = await prisma.mediaAsset.create({
      data: {
        filename: stored.filename,
        originalName: file.name,
        mimeType: stored.mimeType,
        size: stored.size,
        url: stored.url,
      },
    });

    return ok({
      id: created.id,
      key: created.key,
      url: created.url,
      originalName: created.originalName,
      size: created.size,
    });
  });
}
