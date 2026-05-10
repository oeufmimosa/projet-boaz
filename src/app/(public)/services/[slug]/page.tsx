import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { TricolorBar } from "@/components/brand/TricolorBar";
import { BrandsMarquee } from "@/components/brand/BrandsMarquee";
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
  const others = SERVICES_LIST.filter((s) => s.slug !== service.slug).slice(0, 3);
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
                  className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center bg-accent-500 text-2xl text-primary-900 shadow-md"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                  {service.icon}
                </div>
              </div>
            ) : (
              <div
                aria-hidden
                className="flex h-48 w-48 items-center justify-center bg-white/10 text-7xl backdrop-blur sm:h-56 sm:w-56"
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
              >
                {service.icon}
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
                Spécifications techniques
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
          </Container>
        </Section>
      )}

      <Section tone="muted">
        <Container>
          <h2 className="font-display text-2xl font-bold text-primary-800">Autres services</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="block rounded-lg border border-border bg-surface p-5 transition hover:border-primary-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span aria-hidden className="text-2xl">{s.icon}</span>
                    <span className="font-display font-semibold text-primary-800">{s.label}</span>
                  </div>
                  <p className="mt-2 text-body-sm text-text-muted">{s.short}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
