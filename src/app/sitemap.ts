import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { SERVICES_LIST } from "@/lib/services";
import { REALISATIONS } from "@/lib/realisations";
import { prisma } from "@/lib/prisma";

const SITE = env.site.url;

/**
 * Sitemap dynamique. Inclut les routes statiques + les services + les
 * articles publiés. Les routes admin, simulateur et pages de remerciement
 * sont exclues (cf. `app/robots.ts`).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`,                priority: 1.0, changeFrequency: "weekly", lastModified: now },
    { url: `${SITE}/qui-sommes-nous`, priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${SITE}/services`,        priority: 0.9, changeFrequency: "monthly", lastModified: now },
    { url: `${SITE}/realisations`,    priority: 0.7, changeFrequency: "monthly", lastModified: now },
    { url: `${SITE}/parrainage`,      priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${SITE}/aides`,           priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${SITE}/blog`,            priority: 0.6, changeFrequency: "weekly",  lastModified: now },
    { url: `${SITE}/contact`,         priority: 0.5, changeFrequency: "yearly",  lastModified: now },
    { url: `${SITE}/mentions-legales`,  priority: 0.2, changeFrequency: "yearly", lastModified: now },
    { url: `${SITE}/cgu`,               priority: 0.2, changeFrequency: "yearly", lastModified: now },
    { url: `${SITE}/confidentialite`,   priority: 0.2, changeFrequency: "yearly", lastModified: now },
    { url: `${SITE}/cookies`,           priority: 0.2, changeFrequency: "yearly", lastModified: now },
    { url: `${SITE}/credits`,           priority: 0.2, changeFrequency: "monthly", lastModified: now },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = SERVICES_LIST.map((s) => ({
    url: `${SITE}/services/${s.slug}`,
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: now,
  }));

  const realisationRoutes: MetadataRoute.Sitemap = REALISATIONS.map((r) => ({
    url: `${SITE}/realisations/${r.slug}`,
    priority: 0.6,
    changeFrequency: "monthly",
    lastModified: now,
  }));

  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true, publishedAt: true },
    });
    articleRoutes = articles.map((a) => ({
      url: `${SITE}/blog/${a.slug}`,
      priority: 0.6,
      changeFrequency: "monthly" as const,
      lastModified: a.updatedAt ?? a.publishedAt ?? now,
    }));
  } catch {
    // En CI ou si la DB est indisponible, on laisse le sitemap statique.
  }

  return [...staticRoutes, ...serviceRoutes, ...realisationRoutes, ...articleRoutes];
}
