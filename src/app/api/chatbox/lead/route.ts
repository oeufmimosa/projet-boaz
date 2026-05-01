import { prisma } from "@/lib/prisma";
import { chatLeadCreateSchema } from "@/lib/validators/chatbox";
import { handle, ok } from "@/lib/api";

export const runtime = "nodejs";

/**
 * Public POST — appelé juste avant la transition vers le simulateur
 * (et aussi, optionnellement, en lead "abandonné" lorsque l'utilisateur
 * ferme la chatbox en cours de flux). Retourne l'ID pour permettre la
 * conversion ultérieure (rapprochement avec un Quote).
 */
export async function POST(req: Request) {
  return handle(async () => {
    const body = await req.json();
    const data = chatLeadCreateSchema.parse(body);
    const created = await prisma.chatLead.create({
      data: {
        answers: JSON.stringify(data.answers),
        postalCode: data.postalCode ?? null,
        city: data.city ?? null,
        completed: data.completed,
      },
    });
    return ok({ id: created.id });
  });
}
