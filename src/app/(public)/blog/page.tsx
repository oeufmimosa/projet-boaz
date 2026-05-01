import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { Placeholder } from "@/components/ui/Placeholder";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Blog" };

export default async function BlogIndexPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 30,
  });

  return (
    <Section>
      <Container>
        <h1 className="mb-10 text-3xl font-bold sm:text-4xl">Blog</h1>
        {articles.length === 0 ? (
          <p className="text-text-muted">Aucun article pour le moment.</p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <li key={a.id}>
                <Link href={`/blog/${a.slug}`} className="block rounded-md border border-border bg-surface hover:border-primary">
                  {a.coverImage ? (
                    <img src={a.coverImage} alt="" className="aspect-video w-full rounded-t object-cover" />
                  ) : (
                    <Placeholder label={a.title} ratio="16/9" className="rounded-b-none" />
                  )}
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">{a.title}</h2>
                    {a.excerpt && <p className="mt-1 text-sm text-text-muted line-clamp-3">{a.excerpt}</p>}
                    {a.publishedAt && (
                      <p className="mt-3 text-xs text-text-muted">
                        {new Date(a.publishedAt).toLocaleDateString("fr-FR")}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
