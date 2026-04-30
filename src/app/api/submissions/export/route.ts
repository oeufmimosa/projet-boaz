import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { toCsv } from "@/lib/csv";
import { handle, fail } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(req: Request) {
  return handle(async () => {
    await requireAdmin();
    const url = new URL(req.url);
    const type = url.searchParams.get("type") === "contact" ? "contact" : "quote";

    let csv = "";
    if (type === "quote") {
      const rows = await prisma.quote.findMany({ orderBy: { createdAt: "desc" } });
      csv = toCsv(rows.map((r) => ({
        id: r.id,
        createdAt: r.createdAt.toISOString(),
        firstName: r.firstName ?? "",
        lastName: r.lastName ?? "",
        email: r.email ?? "",
        phone: r.phone ?? "",
        postalCode: r.postalCode ?? "",
        city: r.city ?? "",
        emailSent: r.emailSent ? "1" : "0",
        answers: r.answers,
      })));
    } else {
      const rows = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
      csv = toCsv(rows.map((r) => ({
        id: r.id,
        createdAt: r.createdAt.toISOString(),
        name: r.name,
        email: r.email,
        phone: r.phone ?? "",
        message: r.message,
        emailSent: r.emailSent ? "1" : "0",
      })));
    }

    if (!csv) return fail(204, "Aucune donnée");

    return new Response(csv, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="${type}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  });
}
