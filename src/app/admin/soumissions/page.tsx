import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Soumissions" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: { tab?: string; page?: string };
}) {
  const tab = searchParams.tab === "contact" ? "contact" : "quote";
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const [quotes, quotesTotal, messages, messagesTotal] = await Promise.all([
    tab === "quote"
      ? prisma.quote.findMany({ orderBy: { createdAt: "desc" }, skip, take: PAGE_SIZE })
      : Promise.resolve([]),
    tab === "quote" ? prisma.quote.count() : Promise.resolve(0),
    tab === "contact"
      ? prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, skip, take: PAGE_SIZE })
      : Promise.resolve([]),
    tab === "contact" ? prisma.contactMessage.count() : Promise.resolve(0),
  ]);

  const total = tab === "quote" ? quotesTotal : messagesTotal;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Soumissions</h1>
      <div className="mb-6 flex gap-2 border-b border-border">
        <Link href="?tab=quote" className={tabClass(tab === "quote")}>Simulations</Link>
        <Link href="?tab=contact" className={tabClass(tab === "contact")}>Messages contact</Link>
        <a
          href={`/api/submissions/export?type=${tab}`}
          className="ml-auto text-sm text-primary hover:underline"
        >
          Exporter CSV
        </a>
      </div>

      {tab === "quote" ? <QuotesTable items={quotes} /> : <MessagesTable items={messages} />}

      <Pager current={page} pages={pages} tab={tab} />
    </div>
  );
}

function tabClass(active: boolean) {
  return `px-4 py-2 text-sm border-b-2 ${active ? "border-primary text-primary" : "border-transparent text-muted-fg"}`;
}

function QuotesTable({ items }: { items: { id: string; firstName: string | null; lastName: string | null; email: string | null; phone: string | null; postalCode: string | null; city: string | null; emailSent: boolean; createdAt: Date }[] }) {
  if (items.length === 0) return <p className="text-muted-fg">Aucune simulation.</p>;
  return (
    <table className="w-full overflow-hidden rounded border border-border bg-white text-sm">
      <thead className="bg-muted/50 text-left">
        <tr>
          <th className="p-3">Date</th><th className="p-3">Nom</th>
          <th className="p-3">Email</th><th className="p-3">Téléphone</th>
          <th className="p-3">CP / Ville</th><th className="p-3">Email</th>
          <th className="p-3">—</th>
        </tr>
      </thead>
      <tbody>
        {items.map((q) => (
          <tr key={q.id} className="border-t border-border">
            <td className="p-3">{new Date(q.createdAt).toLocaleString("fr-FR")}</td>
            <td className="p-3">{q.firstName} {q.lastName}</td>
            <td className="p-3">{q.email}</td>
            <td className="p-3">{q.phone}</td>
            <td className="p-3">{q.postalCode} {q.city}</td>
            <td className="p-3">{q.emailSent ? "✓" : "✗"}</td>
            <td className="p-3"><Link href={`/admin/soumissions/${q.id}?type=quote`} className="text-primary">voir</Link></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MessagesTable({ items }: { items: { id: string; name: string; email: string; phone: string | null; createdAt: Date }[] }) {
  if (items.length === 0) return <p className="text-muted-fg">Aucun message.</p>;
  return (
    <table className="w-full overflow-hidden rounded border border-border bg-white text-sm">
      <thead className="bg-muted/50 text-left">
        <tr>
          <th className="p-3">Date</th><th className="p-3">Nom</th>
          <th className="p-3">Email</th><th className="p-3">Téléphone</th>
          <th className="p-3">—</th>
        </tr>
      </thead>
      <tbody>
        {items.map((m) => (
          <tr key={m.id} className="border-t border-border">
            <td className="p-3">{new Date(m.createdAt).toLocaleString("fr-FR")}</td>
            <td className="p-3">{m.name}</td>
            <td className="p-3">{m.email}</td>
            <td className="p-3">{m.phone}</td>
            <td className="p-3"><Link href={`/admin/soumissions/${m.id}?type=contact`} className="text-primary">voir</Link></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Pager({ current, pages, tab }: { current: number; pages: number; tab: string }) {
  if (pages <= 1) return null;
  return (
    <nav className="mt-4 flex items-center gap-2 text-sm" aria-label="Pagination">
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={`?tab=${tab}&page=${p}`}
          className={`rounded px-3 py-1 ${p === current ? "bg-primary text-primary-fg" : "border border-border"}`}
        >
          {p}
        </Link>
      ))}
    </nav>
  );
}
