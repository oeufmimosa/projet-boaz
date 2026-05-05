import { env } from "@/lib/env";

/**
 * Helpers JSON-LD typés. Chaque composant rend un `<script type="application/ld+json">`
 * — sans `dangerouslySetInnerHTML` astuces : Next 14 sérialise correctement
 * un script avec un objet JS enfant via `JSON.stringify`.
 *
 * À monter une seule fois par page concernée. Le bloc `Organization` est
 * monté globalement dans le RootLayout pour être présent partout.
 */

const SITE_URL = env.site.url;
const SITE_NAME = "Groupe Climat Hexagone";
const LOGO_URL = `${SITE_URL}/icon.svg`;

// Echappement défense en profondeur : si un titre d'article contient
// littéralement "</script>" l'analyseur HTML couperait le bloc et
// exécuterait ce qui suit. On encode aussi `<` et `>` au cas où, plus
// les séparateurs de ligne U+2028 / U+2029 qui cassent JSONP en JS strict.
function safeJsonForScript(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(new RegExp(String.fromCharCode(0x2028), "g"), "\\u2028")
    .replace(new RegExp(String.fromCharCode(0x2029), "g"), "\\u2029");
}

function jsonLd(data: object) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonForScript(data) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Organization — à monter globalement dans le root layout
// ─────────────────────────────────────────────────────────────────────────────

export function OrganizationJsonLd() {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    description:
      "Spécialiste français de la rénovation énergétique : pompe à chaleur, photovoltaïque, isolation thermique extérieure, ballon thermodynamique, chauffe-eau solaire.",
    areaServed: {
      "@type": "Country",
      name: "France",
    },
    // TODO client : remplir adresse postale, téléphone et SIRET réels.
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["French"],
      },
    ],
    sameAs: [
      // TODO client : URLs réseaux sociaux réels
    ],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// WebSite — sur la home (active la "search box" Google si configurée)
// ─────────────────────────────────────────────────────────────────────────────

export function WebSiteJsonLd() {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "fr-FR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/simulateur?source={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Service — pour les pages /services/[slug]
// ─────────────────────────────────────────────────────────────────────────────

export function ServiceJsonLd({
  name,
  description,
  slug,
}: {
  name: string;
  description: string;
  slug: string;
}) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    url: `${SITE_URL}/services/${slug}`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: { "@type": "Country", name: "France" },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQPage — pour la home, /aides, /parrainage, etc.
// ─────────────────────────────────────────────────────────────────────────────

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// BreadcrumbList — pour les pages internes (services, blog, etc.)
// ─────────────────────────────────────────────────────────────────────────────

export function BreadcrumbJsonLd({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${SITE_URL}${item.href}`,
    })),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Article — pour les pages /blog/[slug]
// ─────────────────────────────────────────────────────────────────────────────

export function ArticleJsonLd({
  title,
  description,
  slug,
  publishedAt,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt: Date | string;
  image?: string;
}) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${SITE_URL}/blog/${slug}`,
    datePublished: typeof publishedAt === "string" ? publishedAt : publishedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: `Équipe ${SITE_NAME}`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: LOGO_URL },
    },
    image: image ? [image] : [LOGO_URL],
    inLanguage: "fr-FR",
  });
}
