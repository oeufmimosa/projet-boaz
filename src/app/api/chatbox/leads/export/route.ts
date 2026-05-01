import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { toCsv } from "@/lib/csv";
import { handle, fail } from "@/lib/api";

export const runtime = "nodejs";

export async function GET() {
  return handle(async () => {
    await requireAdmin();
    const rows = await prisma.chatLead.findMany({ orderBy: { createdAt: "desc" } });
    if (rows.length === 0) return fail(204, "Aucune donnée");
    const csv = toCsv(rows.map((r) => ({
      id: r.id,
      createdAt: r.createdAt.toISOString(),
      answers: r.answers,
      postalCode: r.postalCode ?? "",
      city: r.city ?? "",
      completed: r.completed ? "1" : "0",
      convertedToQuoteId: r.convertedToQuoteId ?? "",
    })));
    return new Response(csv, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="chatbox-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  });
}
