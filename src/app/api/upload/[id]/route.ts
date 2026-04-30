import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { verifyCsrf } from "@/lib/csrf";
import { handle, ok, fail } from "@/lib/api";

export const runtime = "nodejs";

const patchSchema = z.object({
  key: z.string().trim().max(120).regex(/^[a-z0-9._-]*$/i, "Clé invalide").optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  return handle(async () => {
    await requireAdmin();
    if (!verifyCsrf(req)) return fail(403, "CSRF invalide");
    const body = await req.json();
    const data = patchSchema.parse(body);
    const newKey = data.key && data.key.length > 0 ? data.key : null;

    if (newKey) {
      // Detach any other asset that currently owns this key (key is unique).
      await prisma.mediaAsset.updateMany({ where: { key: newKey, NOT: { id: params.id } }, data: { key: null } });
    }

    await prisma.mediaAsset.update({ where: { id: params.id }, data: { key: newKey } });
    return ok({ id: params.id, key: newKey });
  });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  return handle(async () => {
    await requireAdmin();
    if (!verifyCsrf(req)) return fail(403, "CSRF invalide");
    const asset = await prisma.mediaAsset.findUnique({ where: { id: params.id } });
    if (!asset) return ok({ id: params.id });
    await storage.delete(asset.filename);
    await prisma.mediaAsset.delete({ where: { id: params.id } });
    return ok({ id: params.id });
  });
}
