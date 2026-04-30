import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { articleSchema } from "@/lib/validators/content";
import { verifyCsrf } from "@/lib/csrf";
import { handle, ok, fail } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(req: Request) {
  return handle(async () => {
    await requireAdmin();
    if (!verifyCsrf(req)) return fail(403, "CSRF invalide");
    const body = await req.json();
    const data = articleSchema.parse(body);
    const created = await prisma.article.create({
      data: {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt || null,
        content: data.content,
        coverImage: data.coverImage || null,
        published: data.published,
        publishedAt: data.published ? new Date() : null,
      },
    });
    return ok({ id: created.id });
  });
}
