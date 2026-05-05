import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { Placeholder } from "@/components/ui/Placeholder";
import { prisma } from "@/lib/prisma";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Blog — Rénovation énergétique, aides et bonnes pratiques",
  description:
    "Guides, conseils et explications sur MaPrimeRénov', les CEE, la pompe à chaleur, l'isolation et le photovoltaïque. Articles rédigés par notre équipe d'experts.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 30,
  });

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: "Blog", href: "/blog" },
        ]}
      />

      <Section>
        <Container>
          <header className="mb-10 max-w-2xl">
            <p className="text-body-sm uppercase tracking-[0.18em] text-accent-600">Notre blog</p>
            <h1 className="mt-3 font-display text-3xl font-extrabold text-primary-800 sm:text-5xl">
              Conseils, guides et actualités rénovation
            </h1>
            <p className="mt-4 text-body-lg text-text-muted">
              MaPrimeRénov', pompe à chaleur, isolation, photovoltaïque : nos articles vous aident
              à comprendre les aides 2025 et à préparer vos travaux sans surprise.
            </p>
          </header>

          {articles.length === 0 ? (
            <p className="text-text-muted">Aucun article pour le moment.</p>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/blog/${a.slug}`}
                    className="group block h-full overflow-hidden rounded-lg border border-border bg-surface transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md"
                  >
                    {a.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.coverImage}
                        alt={`Illustration de l'article : ${a.title}`}
                        className="aspect-video w-full object-cover"
                      />
                    ) : (
                      <Placeholder label={a.title} ratio="16/9" className="rounded-b-none" />
                    )}
                    <div className="p-5">
                      <h2 className="font-display text-lg font-semibold text-primary-800 group-hover:text-primary-700">
                        {a.title}
                      </h2>
                      {a.excerpt && (
                        <p className="mt-2 text-body-sm text-text-muted line-clamp-3">{a.excerpt}</p>
                      )}
                      {a.publishedAt && (
                        <p className="mt-3 text-xs text-text-muted">
                          {new Date(a.publishedAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
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
    </>
  );
}
