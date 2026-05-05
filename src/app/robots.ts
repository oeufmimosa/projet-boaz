import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

/**
 * Politique d'indexation : tout ouvert sauf les espaces privés (admin, API,
 * simulateur, pages de remerciement). Le sitemap est exposé pour Googlebot.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api",
          "/api/",
          "/simulateur/merci",
          "/parrainage/merci",
          "/styleguide",
        ],
      },
    ],
    sitemap: `${env.site.url}/sitemap.xml`,
    host: env.site.url,
  };
}
