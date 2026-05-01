import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { verifyCsrf } from "@/lib/csrf";
import { testimonialSchema } from "@/lib/validators/testimonial";
import { handle, ok, fail } from "@/lib/api";

export const runtime = "nodejs";

const tm = () =>
  (prisma as unknown as {
    testimonial: {
      findMany: (a: unknown) => Promise<unknown[]>;
      create: (a: unknown) => Promise<{ id: string }>;
    };
  }).testimonial;

export async function GET() {
  return handle(async () => {
    await requireAdmin();
    const rows = await tm().findMany({ orderBy: { order: "asc" } });
    return ok(rows);
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    await requireAdmin();
    if (!verifyCsrf(req)) return fail(403, "CSRF invalide");
    const body = await req.json();
    const data = testimonialSchema.parse(body);
    const created = await tm().create({
      data: { ...data, context: data.context || null },
    });
    return ok({ id: created.id });
  });
}
