import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { contentUpsertSchema } from "@/lib/validators/content";
import { verifyCsrf } from "@/lib/csrf";
import { handle, ok, fail } from "@/lib/api";

export const runtime = "nodejs";

export async function GET() {
  return handle(async () => {
    await requireAdmin();
    const items = await prisma.content.findMany({ orderBy: { key: "asc" } });
    return ok(items);
  });
}

export async function PUT(req: Request) {
  return handle(async () => {
    await requireAdmin();
    if (!verifyCsrf(req)) return fail(403, "CSRF invalide");
    const body = await req.json();
    const data = contentUpsertSchema.parse(body);
    const upserted = await prisma.content.upsert({
      where: { key: data.key },
      create: { key: data.key, value: data.value, type: data.type },
      update: { value: data.value, type: data.type },
    });
    return ok({ id: upserted.id });
  });
}

export async function DELETE(req: Request) {
  return handle(async () => {
    await requireAdmin();
    if (!verifyCsrf(req)) return fail(403, "CSRF invalide");
    const url = new URL(req.url);
    const key = url.searchParams.get("key");
    if (!key) return fail(400, "key requis");
    await prisma.content.delete({ where: { key } }).catch(() => {});
    return ok({ key });
  });
}
