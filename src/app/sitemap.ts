import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { SERVICES_LIST } from "@/lib/services";
import { REALISATIONS } from "@/lib/realisations";

const SITE = env.site.url;

/**
 * Sitemap dynamique. Inclut les routes statiques + les services + les
 * réalisations. Les routes admin, simulateur et pages de remerciement
 * sont exclues (cf. `app/robots.ts`).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`,                priority: 1.0, changeFrequency: "weekly", lastModified: now },
    { url: `${SITE}/qui-sommes-nous`, priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${SITE}/services`,        priority: 0.9, changeFrequency: "monthly", lastModified: now },
    { url: `${SITE}/parrainage`,      priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${SITE}/aides`,           priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${SITE}/contact`,         priority: 0.5, changeFrequency: "yearly",  lastModified: now },
    { url: `${SITE}/mentions-legales`,  priority: 0.2, changeFrequency: "yearly", lastModified: now },
    { url: `${SITE}/cgu`,               priority: 0.2, changeFrequency: "yearly", lastModified: now },
    { url: `${SITE}/confidentialite`,   priority: 0.2, changeFrequency: "yearly", lastModified: now },
    { url: `${SITE}/cookies`,           priority: 0.2, changeFrequency: "yearly", lastModified: now },
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

  return [...staticRoutes, ...serviceRoutes, ...realisationRoutes];
}
