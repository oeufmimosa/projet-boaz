import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { TricolorAccent } from "@/components/brand/TricolorBar";
import { ServiceCard, type ServiceCardData } from "./ServiceCard";
import { getContent, getJsonContent } from "@/lib/content";
import { getAssetByKey } from "@/lib/media";

/**
 * Grille interactive des 6 services sur la home, façon Effy : photo en
 * pleine card + titre permanent + overlay révélé au hover (desktop).
 *
 * Données :
 *   - Photo  → MediaAsset clé `home.services.cards.{slug}.image`
 *   - Texte  → `Content` clés `home.services.cards.{slug}.{shortLabel|description|benefits}`
 *   - Intro  → `home.services.label`, `home.services.title`, `home.services.subtitle`
 *
 * Tout est éditable côté admin (modale stock images + clés Content).
 */

const SLUGS = [
  "pompe-a-chaleur",
  "panneau-photovoltaique",
  "isolation-thermique-exterieure",
  "chauffe-eau-solaire-individuel",
  "ballon-thermodynamique",
  "systeme-solaire-combine",
] as const;

const DEFAULT_TITLES: Record<typeof SLUGS[number], string> = {
  "pompe-a-chaleur":               "Pompe à chaleur",
  "panneau-photovoltaique":         "Panneau photovoltaïque",
  "isolation-thermique-exterieure": "Isolation thermique extérieure",
  "chauffe-eau-solaire-individuel": "Chauffe-eau solaire",
  "ballon-thermodynamique":         "Ballon thermodynamique",
  "systeme-solaire-combine":        "Système solaire combiné",
};

async function loadCardData(slug: typeof SLUGS[number]): Promise<ServiceCardData> {
  const [shortLabel, description, benefits, image] = await Promise.all([
    getContent(`home.services.cards.${slug}.shortLabel`, ""),
    getContent(`home.services.cards.${slug}.description`, ""),
    getJsonContent<string[]>(`home.services.cards.${slug}.benefits`, []),
    getAssetByKey(`home.services.cards.${slug}.image`),
  ]);
  return {
    slug,
    title: DEFAULT_TITLES[slug],
    shortLabel,
    description,
    benefits,
    href: `/services/${slug}`,
    image: image ? { url: image.url, blurDataURL: image.blurDataURL } : null,
  };
}

export async function ServicesGridInteractive() {
  const [label, title, subtitle, ...cards] = await Promise.all([
    getContent("home.services.label", "Nos solutions"),
    getContent("home.services.title", "Des solutions pour chaque besoin énergétique"),
    getContent(
      "home.services.subtitle",
      "Pompe à chaleur, photovoltaïque, isolation : nos six expertises pour réduire vos consommations et profiter des aides 2025.",
    ),
    ...SLUGS.map((s) => loadCardData(s)),
  ] as const);

  return (
    <section className="bg-bg py-16 sm:py-20 lg:py-24">
      <Container>
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-body-sm font-semibold uppercase tracking-wide text-primary-700">
            {label}
          </p>
          <h2 className="font-display text-display-md font-bold text-text">
            {title}
          </h2>
          <TricolorAccent className="mx-auto mt-4" />
          <p className="mx-auto mt-6 max-w-2xl text-body-lg text-text-muted">
            {subtitle}
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <li key={card.slug}>
              <ServiceCard service={card} />
            </li>
          ))}
        </ul>

        <div className="mt-12 text-center">
          <LinkButton href="/services" variant="outline" size="lg">
            Voir toutes nos expertises
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
