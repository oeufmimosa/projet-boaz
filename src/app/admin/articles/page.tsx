import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LinkButton } from "@/components/ui/Button";

export const metadata = { title: "Articles (admin)" };
export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Articles</h1>
        <LinkButton href="/admin/articles/nouveau">+ Nouvel article</LinkButton>
      </div>
      <ul className="divide-y divide-border rounded border border-border bg-white">
        {articles.map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-3 p-4">
            <div>
              <Link href={`/admin/articles/${a.id}`} className="font-medium hover:text-primary">{a.title}</Link>
              <p className="text-xs text-muted-fg">/{a.slug} — {a.published ? "Publié" : "Brouillon"}</p>
            </div>
            <p className="text-xs text-muted-fg">{new Date(a.updatedAt).toLocaleDateString("fr-FR")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
