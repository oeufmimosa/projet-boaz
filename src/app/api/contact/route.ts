import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validators/contact";
import { sendContactMessage } from "@/lib/mailer";
import { handle, ok, fail } from "@/lib/api";
import { rateLimit, ipFromHeaders } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(req: Request) {
  return handle(async () => {
    // Rate-limit anti-spam : 3 soumissions / IP / minute
    const ip = ipFromHeaders(req.headers);
    const rl = rateLimit(`contact:${ip}`, 3, 60 * 1000);
    if (!rl.ok) {
      return fail(429, "Trop de soumissions, réessayez dans une minute.", {
        retryAfterMs: rl.retryAfterMs,
      });
    }

    const body = await req.json();
    const data = contactSchema.parse(body);

    const created = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message,
      },
    });

    const result = await sendContactMessage({ id: created.id, ...data, phone: data.phone || null });
    if (!result.ok) {
      logger.warn({ id: created.id, error: result.error }, "Contact email failed");
    }
    await prisma.contactMessage.update({
      where: { id: created.id },
      data: { emailSent: result.ok, emailError: result.error ?? null },
    });

    return ok({ id: created.id });
  });
}
