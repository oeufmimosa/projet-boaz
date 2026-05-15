import { newsletterSchema } from "@/lib/validators/newsletter";
import { sendNewsletterSignupToAdmin } from "@/lib/mailer";
import { handle, ok, fail } from "@/lib/api";
import { rateLimit, ipFromHeaders } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(req: Request) {
  return handle(async () => {
    // Rate-limit anti-spam : 3 inscriptions / IP / minute
    const ip = ipFromHeaders(req.headers);
    const rl = rateLimit(`newsletter:${ip}`, 3, 60 * 1000);
    if (!rl.ok) {
      return fail(429, "Trop de soumissions, réessayez dans une minute.", {
        retryAfterMs: rl.retryAfterMs,
      });
    }

    const body = await req.json();
    const data = newsletterSchema.parse(body);

    const result = await sendNewsletterSignupToAdmin(data.email);
    if (!result.ok) {
      logger.warn({ email: data.email, error: result.error }, "Newsletter notif failed");
    }

    // On renvoie toujours OK côté utilisateur : on ne veut pas leaker
    // l'état du mailer ni inciter au scraping. L'erreur reste loggée serveur.
    return ok({});
  });
}
