import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { verifyCsrf } from "@/lib/csrf";
import { testimonialSchema } from "@/lib/validators/testimonial";
import { handle, ok, fail } from "@/lib/api";

export const runtime = "nodejs";

const tm = () =>
  (prisma as unknown as {
    testimonial: {
      update: (a: unknown) => Promise<{ id: string }>;
      delete: (a: unknown) => Promise<unknown>;
    };
  }).testimonial;

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  return handle(async () => {
    await requireAdmin();
    if (!verifyCsrf(req)) return fail(403, "CSRF invalide");
    const body = await req.json();
    const data = testimonialSchema.parse(body);
    await tm().update({
      where: { id: params.id },
      data: { ...data, context: data.context || null },
    });
    return ok({ id: params.id });
  });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  return handle(async () => {
    await requireAdmin();
    if (!verifyCsrf(req)) return fail(403, "CSRF invalide");
    await tm().delete({ where: { id: params.id } }).catch(() => null);
    return ok({ id: params.id });
  });
}
