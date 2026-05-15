import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { TricolorBar } from "@/components/brand/TricolorBar";
import { BrandsMarquee } from "@/components/brand/BrandsMarquee";
import { Icon } from "@/components/ui/Icon";
import { SpecsTabs } from "@/components/services/SpecsTabs";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ServiceJsonLd, FaqJsonLd } from "@/components/seo/StructuredData";
import { SERVICES_LIST, getService, isValidServiceSlug } from "@/lib/services";
import { getAssetByKey } from "@/lib/media";

export async function generateStaticParams() {
  return SERVICES_LIST.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = getService(params.slug);
  if (!service) return {};
  return {
    title: `${service.label} : prix, aides 2025, fonctionnement`,
    description: `${service.short} ${service.aides} Estimez vos aides en 2 minutes.`.slice(0, 160),
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.label} — Groupe Climat Hexagone`,
      description: service.short,
      url: `/services/${service.slug}`,
      type: "article",
    },
  };
}

/**
 * Mapping slug → image servie a gauche du bloc "Avantages" sur la page produit.
 * Si pas d'entree pour un slug, le bloc reste en 2 colonnes (avantages | aides).
 * Pour ajouter une marque : depose le fichier dans public/services/<slug>-advantages.jpg
 * et ajoute l'entree ci-dessous.
 */
const ADVANTAGES_IMAGES: Record<string, string> = {
  "isolation-thermique-exterieure": "/services/isolation-thermique-exterieure-advantages.jpg",
};

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  if (!isValidServiceSlug(params.slug)) notFound();
  const service = getService(params.slug)!;
  const others = SERVICES_LIST.filter((s) => s.slug !== service.slug);
  const otherCards = await Promise.all(
    others.map(async (s) => ({
      slug: s.slug,
      label: s.label,
      image: await getAssetByKey(`home.services.cards.${s.slug}.image`),
    })),
  );
  const advantagesImg = ADVANTAGES_IMAGES[service.slug];
  // Image hero : on tente d'abord la clé dédiée services.<slug>.hero, puis on
  // retombe sur celle de la card home `home.services.cards.<slug>.image` (déjà
  // déposée et utilisée dans la grille « Nos solutions »).
  const heroImg =
    (await getAssetByKey(`services.${service.slug}.hero`)) ??
    (await getAssetByKey(`home.services.cards.${service.slug}.image`));

  return (
    <>
      <ServiceJsonLd
        name={service.label}
        description={service.description}
        slug={service.slug}
      />
      {service.faq.length > 0 && <FaqJsonLd items={service.faq} />}

      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.label, href: `/services/${service.slug}` },
        ]}
      />

      <section className="border-b border-border bg-primary-800 py-16 text-text-inverse">
        <Container className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-body text-body-sm uppercase tracking-[0.18em] text-accent-500">
              Service
            </p>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-5xl">
              {service.label}
            </h1>
            <p className="mt-4 text-body-lg text-white/90">{service.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href="/simulateur" variant="accent" size="lg">
                Estimer mes aides en 2 min
              </LinkButton>
              <LinkButton href="/contact" variant="outline-inverse" size="lg">
                Être recontacté
              </LinkButton>
            </div>
            <div className="mt-6">
              <TricolorBar />
            </div>
          </div>
          <div className="flex items-center justify-center">
            {heroImg ? (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/10 shadow-lg">
                <Image
                  src={heroImg.url}
                  alt={`Photo illustrant ${service.label}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  {...(heroImg.blurDataURL
                    ? { placeholder: "blur" as const, blurDataURL: heroImg.blurDataURL }
                    : {})}
                />
                <div
                  aria-hidden
                  className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center bg-accent-500 text-primary-900 shadow-md"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                  <Icon name={service.icon} className="h-6 w-6" />
                </div>
              </div>
            ) : (
              <div
                aria-hidden
                className="flex h-48 w-48 items-center justify-center bg-white/10 text-text-inverse backdrop-blur sm:h-56 sm:w-56"
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
              >
                <Icon name={service.icon} className="h-20 w-20" strokeWidth={1.4} />
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Marques proposées — uniquement sur les pages PAC, juste sous le hero */}
      {service.slug.startsWith("pompe-a-chaleur") && <BrandsMarquee />}

      <Section>
        <Container
          className={
            advantagesImg
              ? "grid gap-8 md:grid-cols-3 md:items-stretch"
              : "grid gap-10 md:grid-cols-2"
          }
        >
          {advantagesImg && (
            <div className="relative h-full min-h-[200px] overflow-hidden rounded-lg border border-border shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={advantagesImg}
                alt={`Illustration ${service.label}`}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <div>
            <h2 className="font-display text-2xl font-bold text-primary-800">Avantages</h2>
            <ul className="mt-4 space-y-3">
              {service.advantages.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center bg-accent-500 text-xs font-bold text-primary-900"
                    style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                  >
                    ✓
                  </span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="font-display text-2xl font-bold text-primary-800">Aides disponibles</h2>
            <p className="mt-3 text-text-muted">{service.aides}</p>
            {service.aidesNote && (
              <p className="mt-2 text-body-sm italic text-text-muted">{service.aidesNote}</p>
            )}
            <div className="mt-5">
              <LinkButton href="/aides" variant="outline">
                Voir toutes les aides
              </LinkButton>
            </div>
          </div>
        </Container>
      </Section>

      {service.specs && service.specs.length > 0 && (
        <Section tone="muted">
          <Container className="max-w-4xl">
            <div className="mb-8 text-center sm:mb-10">
              <p className="font-body text-body-sm uppercase tracking-[0.18em] text-accent-600">
                Fiche technique
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold text-primary-800 sm:text-3xl">
                Spécifications techniques indicatives
              </h2>
              <p className="mt-3 text-text-muted">
                Cliquez sur une catégorie pour voir le détail.
              </p>
            </div>

            <SpecsTabs groups={service.specs} />

            <p className="mt-8 text-center text-body-sm text-text-muted">
              Une étude personnalisée affine ces valeurs selon votre logement, votre
              zone climatique et vos consommations réelles.
            </p>
            <p className="mt-3 text-center text-body-sm italic text-text-muted">
              Les informations techniques présentées sur cette page sont fournies à titre
              indicatif et correspondent à des configurations couramment installées. Les
              équipements, marques, performances, puissances, options et caractéristiques
              peuvent varier selon l&apos;étude du logement, le dimensionnement réalisé, la
              zone climatique et le matériel effectivement installé par nos partenaires.
            </p>
          </Container>
        </Section>
      )}

      {service.faq.length > 0 && (
        <Section className="bg-primary-50">
          <Container className="max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-primary-800 sm:text-3xl">
              Questions fréquentes
            </h2>
            <p className="mt-2 text-text-muted">
              Tout ce que vous devez savoir avant de vous lancer.
            </p>
            <ul className="mt-8 space-y-3">
              {service.faq.map((item, i) => (
                <li key={i}>
                  <details className="group rounded-lg border border-border bg-surface p-5 open:border-primary-300 open:shadow-sm">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display font-semibold text-primary-800">
                      <span>{item.q}</span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                        className="mt-0.5 shrink-0 transition-transform group-open:rotate-180"
                      >
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </summary>
                    <p className="mt-3 text-body text-text-muted">{item.a}</p>
                  </details>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-body-sm italic text-text-muted">
              Informations données à titre indicatif. Les caractéristiques techniques,
              performances, économies estimées et aides disponibles peuvent varier selon
              le logement, les équipements installés, la configuration du projet et la
              réglementation en vigueur. Une étude personnalisée permet de confirmer les
              éléments applicables à votre situation.
            </p>
          </Container>
        </Section>
      )}

      <Section tone="muted">
        <Container>
          <h2 className="font-display text-2xl font-bold text-primary-800">Autres services</h2>
          <ul className="mt-8 flex flex-wrap gap-4">
            {otherCards.map((p) => (
              <li key={p.slug}>
                <Link href={`/services/${p.slug}`} className="products-marquee-item">
                  <div className="relative h-[130px] w-full overflow-hidden bg-primary-900">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image.url}
                        alt={p.label}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-900"
                      />
                    )}
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-2/5"
                      style={{ background: "linear-gradient(to top, rgba(10,42,26,0.92), transparent)" }}
                    />
                  </div>
                  <div className="flex flex-1 items-center bg-primary-900 px-3 py-2 text-white">
                    <p className="line-clamp-2 font-display text-xs font-bold leading-tight">
                      {p.label}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
