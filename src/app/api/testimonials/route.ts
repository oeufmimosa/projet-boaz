import { prisma } from "@/lib/prisma";
import { handle, ok } from "@/lib/api";

export const runtime = "nodejs";

export async function GET() {
  return handle(async () => {
    // Cast as any : le client Prisma typé sera régénéré au prochain restart.
    const rows = await (prisma as unknown as { testimonial: { findMany: (a: unknown) => Promise<unknown[]> } })
      .testimonial.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
        take: 50,
      });
    return ok(rows);
  });
}
