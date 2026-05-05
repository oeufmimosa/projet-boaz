import { prisma } from "@/lib/prisma";
import { referralSchema } from "@/lib/validators/referral";
import {
  sendReferralToAdmin,
  sendReferralConfirmationToSponsor,
  sendReferralIntroductionToReferee,
} from "@/lib/mailer";
import { handle, ok, fail } from "@/lib/api";
import { rateLimit, ipFromHeaders } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

/**
 * POST /api/referral
 * - Valide la soumission (zod : champs parrain + filleul + consentement RGPD)
 * - Stocke en base
 * - Envoie 3 emails (admin / parrain / filleul si email fourni)
 * - Met à jour les flags `*EmailSent` pour le suivi admin
 * - Rate-limit : 5 soumissions par IP / 10 minutes
 */
export async function POST(req: Request) {
  return handle(async () => {
    const ip = ipFromHeaders(req.headers);
    const rl = rateLimit(`referral:${ip}`, 5, 10 * 60 * 1000);
    if (!rl.ok) {
      return fail(429, "Trop de soumissions, réessayez plus tard.", {
        retryAfterMs: rl.retryAfterMs,
      });
    }

    const body = await req.json();
    const data = referralSchema.parse(body);

    const created = await prisma.referral.create({
      data: {
        sponsorTitle: data.sponsorTitle || null,
        sponsorLastName: data.sponsorLastName,
        sponsorFirstName: data.sponsorFirstName,
        sponsorEmail: data.sponsorEmail,
        sponsorPhone: data.sponsorPhone || null,
        refereeFirstName: data.refereeFirstName,
        refereeLastName: data.refereeLastName,
        refereeEmail: data.refereeEmail || null,
        refereePhone: data.refereePhone || null,
        refereePostalCode: data.refereePostalCode,
        projectType: data.projectType,
        message: data.message || null,
        consentGiven: data.consentGiven,
        consentTimestamp: new Date(),
        ipAddress: ip,
        rewardAmount: 1000,
        status: "PENDING",
      },
    });

    const mailPayload = {
      id: created.id,
      sponsorTitle: created.sponsorTitle,
      sponsorLastName: created.sponsorLastName,
      sponsorFirstName: created.sponsorFirstName,
      sponsorEmail: created.sponsorEmail,
      sponsorPhone: created.sponsorPhone,
      refereeFirstName: created.refereeFirstName,
      refereeLastName: created.refereeLastName,
      refereeEmail: created.refereeEmail,
      refereePhone: created.refereePhone,
      refereePostalCode: created.refereePostalCode,
      projectType: created.projectType,
      message: created.message,
    };

    const [adminRes, sponsorRes, refereeRes] = await Promise.all([
      sendReferralToAdmin(mailPayload),
      sendReferralConfirmationToSponsor(mailPayload),
      created.refereeEmail
        ? sendReferralIntroductionToReferee(mailPayload)
        : Promise.resolve({ ok: false, error: "no-email" } as const),
    ]);

    const errors: string[] = [];
    if (!adminRes.ok) errors.push(`admin:${adminRes.error ?? "unknown"}`);
    if (!sponsorRes.ok) errors.push(`sponsor:${sponsorRes.error ?? "unknown"}`);
    if (created.refereeEmail && !refereeRes.ok) {
      errors.push(`referee:${refereeRes.error ?? "unknown"}`);
    }
    if (errors.length) {
      logger.warn({ id: created.id, errors }, "Referral: some emails failed");
    }

    await prisma.referral.update({
      where: { id: created.id },
      data: {
        adminEmailSent: adminRes.ok,
        sponsorEmailSent: sponsorRes.ok,
        refereeEmailSent: Boolean(created.refereeEmail) && refereeRes.ok,
        emailErrors: errors.length ? errors.join(" | ") : null,
      },
    });

    return ok({ id: created.id });
  });
}
