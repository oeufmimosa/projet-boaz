import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { toCsv } from "@/lib/csv";
import { handle, fail } from "@/lib/api";

export const runtime = "nodejs";

export async function GET() {
  return handle(async () => {
    await requireAdmin();
    const rows = await prisma.referral.findMany({ orderBy: { createdAt: "desc" } });
    if (rows.length === 0) return fail(204, "Aucune donnée");

    const csv = toCsv(
      rows.map((r) => ({
        id: r.id,
        createdAt: r.createdAt.toISOString(),
        status: r.status,
        sponsorTitle: r.sponsorTitle ?? "",
        sponsorFirstName: r.sponsorFirstName,
        sponsorLastName: r.sponsorLastName,
        sponsorEmail: r.sponsorEmail,
        sponsorPhone: r.sponsorPhone ?? "",
        refereeFirstName: r.refereeFirstName,
        refereeLastName: r.refereeLastName,
        refereeEmail: r.refereeEmail ?? "",
        refereePhone: r.refereePhone ?? "",
        refereePostalCode: r.refereePostalCode,
        projectType: r.projectType,
        message: r.message ?? "",
        consentGiven: r.consentGiven ? "1" : "0",
        consentTimestamp: r.consentTimestamp.toISOString(),
        rewardAmount: r.rewardAmount ?? "",
        rewardPaidAt: r.rewardPaidAt ? r.rewardPaidAt.toISOString() : "",
        adminEmailSent: r.adminEmailSent ? "1" : "0",
        sponsorEmailSent: r.sponsorEmailSent ? "1" : "0",
        refereeEmailSent: r.refereeEmailSent ? "1" : "0",
        emailErrors: r.emailErrors ?? "",
        internalNotes: r.internalNotes ?? "",
      })),
    );

    return new Response(csv, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="parrainages-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  });
}
