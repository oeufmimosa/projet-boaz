import { prisma } from "@/lib/prisma";
import { chatLeadCreateSchema } from "@/lib/validators/chatbox";
import { handle, ok, fail } from "@/lib/api";
import { rateLimit, ipFromHeaders } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Public POST — appelé juste avant la transition vers le simulateur
 * (et aussi, optionnellement, en lead "abandonné" lorsque l'utilisateur
 * ferme la chatbox en cours de flux). Retourne l'ID pour permettre la
 * conversion ultérieure (rapprochement avec un Quote).
 */
export async function POST(req: Request) {
  return handle(async () => {
    // Rate-limit anti-spam : 5 leads / IP / minute
    const ip = ipFromHeaders(req.headers);
    const rl = rateLimit(`chatlead:${ip}`, 5, 60 * 1000);
    if (!rl.ok) {
      return fail(429, "Trop de soumissions, réessayez plus tard.", {
        retryAfterMs: rl.retryAfterMs,
      });
    }

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
