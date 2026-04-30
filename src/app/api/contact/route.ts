import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validators/contact";
import { sendContactMessage } from "@/lib/mailer";
import { handle, ok } from "@/lib/api";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(req: Request) {
  return handle(async () => {
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
