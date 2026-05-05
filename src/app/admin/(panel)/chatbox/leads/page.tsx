import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Chatbox — Leads" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export default async function ChatLeadsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;
  const [items, total] = await Promise.all([
    prisma.chatLead.findMany({ orderBy: { createdAt: "desc" }, skip, take: PAGE_SIZE }),
    prisma.chatLead.count(),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Leads chatbox</h1>
        <a
          href="/api/chatbox/leads/export"
          className="text-body-sm text-primary-700 hover:underline"
        >
          Exporter CSV
        </a>
      </div>

      {items.length === 0 ? (
        <p className="text-text-muted">Aucun lead pour le moment.</p>
      ) : (
        <table className="w-full overflow-hidden rounded-md border border-border bg-surface text-body-sm">
          <thead className="bg-surface-2 text-left">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Projet</th>
              <th className="p-3">Logement</th>
              <th className="p-3">Statut chat</th>
              <th className="p-3">CP / Ville</th>
              <th className="p-3">Converti</th>
              <th className="p-3">—</th>
            </tr>
          </thead>
          <tbody>
            {items.map((l) => {
              const a = safeParse(l.answers);
              return (
                <tr key={l.id} className="border-t border-border">
                  <td className="p-3">{new Date(l.createdAt).toLocaleString("fr-FR")}</td>
                  <td className="p-3">{a.step1 ?? "—"}</td>
                  <td className="p-3">{a.step2 ?? "—"}</td>
                  <td className="p-3">{l.completed ? "Complété" : "Abandonné"}</td>
                  <td className="p-3">{l.postalCode ?? "—"} {l.city ?? ""}</td>
                  <td className="p-3">{l.convertedToQuoteId ? "✓" : "—"}</td>
                  <td className="p-3"><Link href={`/admin/chatbox/leads/${l.id}`} className="text-primary-700">voir</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {pages > 1 && (
        <nav className="mt-4 flex items-center gap-2 text-body-sm" aria-label="Pagination">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`?page=${p}`}
              className={`rounded-md px-3 py-1 ${p === page ? "bg-primary-700 text-text-inverse" : "border border-border"}`}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

function safeParse(s: string): Record<string, string> {
  try { return JSON.parse(s); } catch { return {}; }
}
