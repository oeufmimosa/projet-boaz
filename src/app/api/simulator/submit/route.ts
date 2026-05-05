import { prisma } from "@/lib/prisma";
import { quoteSubmissionSchema } from "@/lib/validators/simulator";
import { sendQuoteToAdmin, sendQuoteConfirmationToUser } from "@/lib/mailer";
import { handle, ok, fail } from "@/lib/api";
import { rateLimit, ipFromHeaders } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(req: Request) {
  return handle(async () => {
    // Rate-limit anti-spam : 5 soumissions / IP / 10 min
    const ip = ipFromHeaders(req.headers);
    const rl = rateLimit(`simulator:${ip}`, 5, 10 * 60 * 1000);
    if (!rl.ok) {
      return fail(429, "Trop de soumissions, réessayez plus tard.", {
        retryAfterMs: rl.retryAfterMs,
      });
    }

    const body = await req.json();
    const data = quoteSubmissionSchema.parse(body);

    const created = await prisma.quote.create({
      data: {
        answers: JSON.stringify(data.answers),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        postalCode: data.postalCode,
        city: data.city,
      },
    });

    // Send admin + user emails in parallel; never fail the request on email error.
    const [adminResult, userResult] = await Promise.all([
      sendQuoteToAdmin({
        id: created.id,
        answers: data.answers,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        postalCode: data.postalCode,
        city: data.city,
      }),
      sendQuoteConfirmationToUser({ email: data.email, firstName: data.firstName }),
    ]);

    const ok_ = adminResult.ok && userResult.ok;
    const error = !ok_ ? [adminResult.error, userResult.error].filter(Boolean).join(" | ") : null;
    if (!ok_) logger.warn({ id: created.id, error }, "Quote email failed");

    await prisma.quote.update({
      where: { id: created.id },
      data: { emailSent: ok_, emailError: error },
    });

    // Conversion chatbox → simulateur : rattacher le lead s'il a été passé.
    if (data.chatLeadId) {
      await prisma.chatLead.update({
        where: { id: data.chatLeadId },
        data: { completed: true, convertedToQuoteId: created.id },
      }).catch(() => null);
    }

    return ok({ id: created.id });
  });
}
