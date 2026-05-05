import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ArticleJsonLd } from "@/components/seo/StructuredData";
import { MarkdownRenderer, type InlineImageInfo } from "@/components/article/MarkdownRenderer";
import { getAssetByKey } from "@/lib/media";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const a = await prisma.article.findUnique({ where: { slug: params.slug } });
  if (!a || !a.published) return { robots: { index: false, follow: false } };
  return {
    title: a.title,
    description: a.excerpt ?? undefined,
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: {
      title: a.title,
      description: a.excerpt ?? undefined,
      url: `/blog/${a.slug}`,
      type: "article",
      publishedTime: a.publishedAt?.toISOString(),
      modifiedTime: a.updatedAt?.toISOString(),
      images: a.coverImage ? [a.coverImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: a.title,
      description: a.excerpt ?? undefined,
      images: a.coverImage ? [a.coverImage] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: {
      inlineImages: {
        orderBy: { position: "asc" },
        include: { mediaAsset: true },
      },
    },
  });
  if (!article || !article.published) notFound();

  const inlineImages: InlineImageInfo[] = article.inlineImages.map((row) => ({
    position: row.position,
    src: row.mediaAsset.url,
    alt: row.caption ?? `Image illustrative — ${article.title}`,
    width: row.mediaAsset.width ?? undefined,
    height: row.mediaAsset.height ?? undefined,
    caption: row.caption,
    attribution: row.mediaAsset.attribution,
    attributionUrl: row.mediaAsset.attributionUrl,
  }));

  // Cover : MediaAsset (par clé `article.cover.{slug}`) prioritaire sur le
  // champ legacy `coverImage` (URL placehold.co seedée).
  const coverAsset = await getAssetByKey(`article.cover.${article.slug}`);
  const coverUrl = coverAsset?.url ?? article.coverImage ?? null;
  const coverBlur = coverAsset?.blurDataURL ?? null;
  const coverAttribution = coverAsset?.attribution ?? null;
  const coverAttributionUrl = coverAsset?.attributionUrl ?? null;

  return (
    <>
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt ?? ""}
        slug={article.slug}
        publishedAt={article.publishedAt ?? article.createdAt}
        image={coverUrl ?? undefined}
      />

      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: article.title, href: `/blog/${article.slug}` },
        ]}
      />

      <Section>
        <Container className="max-w-3xl">
          <p className="text-body-sm uppercase tracking-[0.18em] text-accent-600">Article</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-primary-800 sm:text-5xl">
            {article.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-body-sm text-text-muted">
            {article.publishedAt && (
              <time dateTime={article.publishedAt.toISOString()}>
                Publié le {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            )}
            <span aria-hidden>•</span>
            <span>L'équipe Groupe Climat Hexagone</span>
          </div>

          {coverUrl && (
            <figure className="mt-8 overflow-hidden rounded-lg border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverUrl}
                alt={`Illustration de l'article : ${article.title}`}
                className="w-full"
                loading="eager"
                decoding="async"
              />
              {coverAttribution && (
                <figcaption className="border-t border-border bg-surface-2 px-4 py-2 text-xs text-text-muted">
                  {coverAttributionUrl ? (
                    <a
                      href={coverAttributionUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="hover:underline"
                    >
                      {coverAttribution}
                    </a>
                  ) : (
                    coverAttribution
                  )}
                </figcaption>
              )}
            </figure>
          )}
          {/* Le champ blurDataURL n'est pas utilisé ici (img classique) — il
              servira si on bascule sur next/image. */}
          {coverBlur && null}

          <article className="prose prose-neutral mt-8 max-w-none prose-headings:font-display prose-headings:text-primary-800 prose-a:text-primary-700 prose-strong:text-primary-900">
            <MarkdownRenderer content={article.content} inlineImages={inlineImages} />
          </article>

          <div className="mt-12 flex justify-between border-t border-border pt-6">
            <Link href="/blog" className="text-body-sm font-semibold text-primary-700 hover:underline">
              ← Tous les articles
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
