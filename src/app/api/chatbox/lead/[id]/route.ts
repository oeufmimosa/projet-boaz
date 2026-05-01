import { prisma } from "@/lib/prisma";
import { chatLeadUpdateSchema } from "@/lib/validators/chatbox";
import { handle, ok } from "@/lib/api";

export const runtime = "nodejs";

/**
 * Public PATCH — utilisé pour marquer un lead comme "completed" au moment
 * du clic sur "Voir mes aides", ou pour rattacher l'ID du Quote produit
 * (conversion). Les routes admin restent CSRF-protégées via /admin.
 */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  return handle(async () => {
    const body = await req.json();
    const data = chatLeadUpdateSchema.parse(body);
    await prisma.chatLead.update({
      where: { id: params.id },
      data: {
        ...(data.completed !== undefined ? { completed: data.completed } : {}),
        ...(data.convertedToQuoteId ? { convertedToQuoteId: data.convertedToQuoteId } : {}),
      },
    }).catch(() => null);
    return ok({ id: params.id });
  });
}
