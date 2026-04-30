import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { simulatorStepSchema } from "@/lib/validators/content";
import { verifyCsrf } from "@/lib/csrf";
import { handle, ok, fail } from "@/lib/api";

export const runtime = "nodejs";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  return handle(async () => {
    await requireAdmin();
    if (!verifyCsrf(req)) return fail(403, "CSRF invalide");
    const body = await req.json();
    const data = simulatorStepSchema.parse(body);
    await prisma.simulatorStep.update({
      where: { id: params.id },
      data: {
        order: data.order,
        key: data.key,
        label: data.label,
        helpText: data.helpText || null,
        fieldType: data.fieldType,
        required: data.required,
        options: data.options ? JSON.stringify(data.options) : null,
        config: data.config ? JSON.stringify(data.config) : null,
      },
    });
    return ok({ id: params.id });
  });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  return handle(async () => {
    await requireAdmin();
    if (!verifyCsrf(req)) return fail(403, "CSRF invalide");
    await prisma.simulatorStep.delete({ where: { id: params.id } });
    return ok({ id: params.id });
  });
}
