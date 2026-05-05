import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [contentCount, articlesCount, quotesCount, contactCount, stepsCount] = await Promise.all([
    prisma.content.count(),
    prisma.article.count(),
    prisma.quote.count(),
    prisma.contactMessage.count(),
    prisma.simulatorStep.count(),
  ]);

  const cards = [
    { href: "/admin/contenus", label: "Contenus", value: contentCount },
    { href: "/admin/articles", label: "Articles", value: articlesCount },
    { href: "/admin/simulateur", label: "Étapes du simulateur", value: stepsCount },
    { href: "/admin/soumissions", label: "Simulations reçues", value: quotesCount },
    { href: "/admin/soumissions", label: "Messages de contact", value: contactCount },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Tableau de bord</h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <li key={i}>
            <Link href={c.href} className="block rounded-md border border-border bg-surface p-6 hover:border-primary">
              <p className="text-sm text-text-muted">{c.label}</p>
              <p className="mt-2 text-3xl font-bold">{c.value}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
