import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { simulatorStepSchema } from "@/lib/validators/content";
import { verifyCsrf } from "@/lib/csrf";
import { handle, ok, fail } from "@/lib/api";

export const runtime = "nodejs";

/** Public: list all steps (for the wizard / modal). */
export async function GET() {
  return handle(async () => {
    const rows = await prisma.simulatorStep.findMany({ orderBy: { order: "asc" } });
    return ok(rows.map((s) => {
      // Le client Prisma typé peut ne pas avoir encore les nouveaux champs
      // si le `prisma generate` n'a pas pu se rejouer (DLL verrouillée).
      // On lit en runtime via index access.
      const r = s as unknown as Record<string, unknown>;
      return {
        id: s.id,
        order: s.order,
        key: s.key,
        label: s.label,
        helpText: s.helpText,
        fieldType: s.fieldType,
        required: s.required,
        options: s.options ? JSON.parse(s.options) : undefined,
        config: s.config ? JSON.parse(s.config) : undefined,
        illustrationKey: (r.illustrationKey as string | null) ?? null,
        encouragement:   (r.encouragement   as string | null) ?? null,
        helpTooltip:     (r.helpTooltip     as string | null) ?? null,
      };
    }));
  });
}

/** Admin: create a step. */
export async function POST(req: Request) {
  return handle(async () => {
    await requireAdmin();
    if (!verifyCsrf(req)) return fail(403, "CSRF invalide");

    const body = await req.json();
    const data = simulatorStepSchema.parse(body);
    const created = await prisma.simulatorStep.create({
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
    return ok({ id: created.id });
  });
}
