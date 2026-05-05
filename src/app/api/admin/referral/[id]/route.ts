import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { verifyCsrf } from "@/lib/csrf";
import { handle, ok, fail } from "@/lib/api";
import { logger } from "@/lib/logger";
import { sendReferralConfirmationToSponsor } from "@/lib/mailer";
import { REFERRAL_STATUSES } from "@/lib/validators/referral";

export const runtime = "nodejs";

const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("status"), status: z.enum(REFERRAL_STATUSES) }),
  z.object({ action: z.literal("notes"), notes: z.string().max(5000) }),
  z.object({
    action: z.literal("pay"),
    amount: z.number().int().min(0).max(10_000),
    paidAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date AAAA-MM-JJ requise"),
  }),
  z.object({ action: z.literal("resend-sponsor") }),
]);

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  return handle(async () => {
    const user = await requireAdmin();
    if (!verifyCsrf(req)) return fail(403, "CSRF invalide");

    const body = await req.json();
    const data = actionSchema.parse(body);

    const referral = await prisma.referral.findUnique({ where: { id: params.id } });
    if (!referral) return fail(404, "Parrainage introuvable");

    switch (data.action) {
      case "status": {
        await prisma.referral.update({
          where: { id: referral.id },
          data: { status: data.status },
        });
        await prisma.auditLog.create({
          data: {
            adminEmail: user.email,
            action: "referral_status",
            key: referral.id,
            before: referral.status,
            after: data.status,
          },
        });
        return ok({ status: data.status });
      }
      case "notes": {
        await prisma.referral.update({
          where: { id: referral.id },
          data: { internalNotes: data.notes || null },
        });
        await prisma.auditLog.create({
          data: {
            adminEmail: user.email,
            action: "referral_notes",
            key: referral.id,
            before: referral.internalNotes,
            after: data.notes || null,
          },
        });
        return ok({ ok: true });
      }
      case "pay": {
        await prisma.referral.update({
          where: { id: referral.id },
          data: {
            rewardAmount: data.amount,
            rewardPaidAt: new Date(`${data.paidAt}T12:00:00`),
            status: "PAID",
          },
        });
        await prisma.auditLog.create({
          data: {
            adminEmail: user.email,
            action: "referral_paid",
            key: referral.id,
            after: `${data.amount}€ on ${data.paidAt}`,
          },
        });
        return ok({ paid: true });
      }
      case "resend-sponsor": {
        const result = await sendReferralConfirmationToSponsor({
          id: referral.id,
          sponsorTitle: referral.sponsorTitle,
          sponsorLastName: referral.sponsorLastName,
          sponsorFirstName: referral.sponsorFirstName,
          sponsorEmail: referral.sponsorEmail,
          sponsorPhone: referral.sponsorPhone,
          refereeFirstName: referral.refereeFirstName,
          refereeLastName: referral.refereeLastName,
          refereeEmail: referral.refereeEmail,
          refereePhone: referral.refereePhone,
          refereePostalCode: referral.refereePostalCode,
          projectType: referral.projectType,
          message: referral.message,
        });
        if (!result.ok) {
          logger.warn({ id: referral.id, error: result.error }, "Resend sponsor failed");
          return fail(500, result.error ?? "Échec de l'envoi");
        }
        await prisma.referral.update({
          where: { id: referral.id },
          data: { sponsorEmailSent: true },
        });
        await prisma.auditLog.create({
          data: {
            adminEmail: user.email,
            action: "referral_resend_sponsor",
            key: referral.id,
          },
        });
        return ok({ resent: true });
      }
    }
  });
}
