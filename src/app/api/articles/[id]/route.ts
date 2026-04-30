import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { articleSchema } from "@/lib/validators/content";
import { verifyCsrf } from "@/lib/csrf";
import { handle, ok, fail } from "@/lib/api";

export const runtime = "nodejs";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  return handle(async () => {
    await requireAdmin();
    if (!verifyCsrf(req)) return fail(403, "CSRF invalide");
    const body = await req.json();
    const data = articleSchema.parse(body);
    const existing = await prisma.article.findUnique({ where: { id: params.id } });
    if (!existing) return fail(404, "Introuvable");

    await prisma.article.update({
      where: { id: params.id },
      data: {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt || null,
        content: data.content,
        coverImage: data.coverImage || null,
        published: data.published,
        publishedAt: data.published
          ? (existing.publishedAt ?? new Date())
          : null,
      },
    });
    return ok({ id: params.id });
  });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  return handle(async () => {
    await requireAdmin();
    if (!verifyCsrf(req)) return fail(403, "CSRF invalide");
    await prisma.article.delete({ where: { id: params.id } }).catch(() => {});
    return ok({ id: params.id });
  });
}
