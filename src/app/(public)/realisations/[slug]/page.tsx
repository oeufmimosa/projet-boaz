import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { TricolorBar } from "@/components/brand/TricolorBar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import {
  REALISATIONS,
  getRealisation,
  isValidRealisationSlug,
  formatEuros,
} from "@/lib/realisations";
import { env } from "@/lib/env";

export async function generateStaticParams() {
  return REALISATIONS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const r = getRealisation(params.slug);
  if (!r) return {};
  return {
    title: `${r.title} — Réalisation`,
    description: `${r.housingType} de ${r.surface} m² (${r.yearBuilt}) à ${r.location}. Aides obtenues : ${formatEuros(r.aidesObtainedEuros)}. Économies estimées : ${formatEuros(r.yearlySavingsEuros)}/an.`.slice(0, 160),
    alternates: { canonical: `/realisations/${r.slug}` },
    openGraph: {
      title: r.title,
      description: `Chantier réalisé à ${r.location}. ${r.works[0]}.`,
      url: `/realisations/${r.slug}`,
      type: "article",
      images: [r.coverImage],
    },
  };
}

/**
 * JSON-LD `Article` (sous-type d'item) pour la fiche réalisation.
 * Schema.org `Project` n'est pas pleinement reconnu par Google ; on utilise
 * `Article` qui rend correctement les rich snippets pour les pages éditoriales.
 */
function RealisationArticleJsonLd({
  slug,
  title,
  description,
  image,
}: {
  slug: string;
  title: string;
  description: string;
  image: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${env.site.url}/realisations/${slug}`,
    image: [image],
    author: {
      "@type": "Organization",
      name: "Équipe Groupe Climat Hexagone",
    },
    publisher: {
      "@type": "Organization",
      name: "Groupe Climat Hexagone",
      logo: {
        "@type": "ImageObject",
        url: `${env.site.url}/icon.svg`,
      },
    },
    inLanguage: "fr-FR",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RealisationDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  if (!isValidRealisationSlug(params.slug)) notFound();
  const r = getRealisation(params.slug)!;
  const others = REALISATIONS.filter((x) => x.slug !== r.slug).slice(0, 3);

  return (
    <>
      <RealisationArticleJsonLd
        slug={r.slug}
        title={r.title}
        description={`${r.housingType} de ${r.surface} m² (${r.yearBuilt}) à ${r.location} — ${r.works[0]}`}
        image={r.coverImage}
      />

      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
          { label: "Nos réalisations", href: "/qui-sommes-nous#realisations" },
          { label: r.title, href: `/realisations/${r.slug}` },
        ]}
      />

      {/* ⚠️ Si placeholder, encart visible en haut de page */}
      {r.placeholder && (
        <div
          data-content="placeholder"
          className="border-b border-accent-500/40 bg-accent-500/5 py-3 ring-1 ring-accent-500/30"
        >
          <Container>
            <p className="text-body-sm text-amber-900">
              <strong>Cas fictif réaliste</strong> — chiffres d'ordre de grandeur
              cohérents avec les barèmes publics 2025. À remplacer par un cas
              réel avec consentement RGPD avant mise en production.
            </p>
          </Container>
        </div>
      )}

      {/* Hero avec photo */}
      <section className="bg-primary-800 py-12 text-text-inverse sm:py-16">
        <Container className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-body text-body-sm uppercase tracking-[0.18em] text-accent-500">
              Réalisation · {r.region}
            </p>
            <h1 className="mt-3 font-display text-2xl font-extrabold leading-tight sm:text-4xl">
              {r.title}
            </h1>
            <p className="mt-4 text-body-lg text-white/90">
              {r.housingType} de {r.surface} m² construite en {r.yearBuilt}, située à {r.location}.
              Profil MaPrimeRénov' du foyer : <strong>{r.profileMpr}</strong>.
            </p>
            <div className="mt-6">
              <TricolorBar />
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={r.coverImage}
            alt={`Photo avant/après du chantier ${r.title}`}
            className="aspect-[3/2] w-full rounded-lg border border-white/10 object-cover"
          />
        </Container>
      </section>

      {/* Chiffres clés */}
      <Section>
        <Container>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <li className="rounded-lg border border-border bg-surface p-5 text-center">
              <p className="font-display text-2xl font-extrabold text-primary-800">
                {formatEuros(r.totalCostEuros)}
              </p>
              <p className="mt-1 text-body-sm text-text-muted">Coût TTC du chantier</p>
            </li>
            <li className="rounded-lg border border-accent-500/40 bg-accent-500/5 p-5 text-center">
              <p className="font-display text-2xl font-extrabold text-accent-600">
                {formatEuros(r.aidesObtainedEuros)}
              </p>
              <p className="mt-1 text-body-sm text-text-muted">Aides cumulées obtenues</p>
            </li>
            <li className="rounded-lg border border-border bg-surface p-5 text-center">
              <p className="font-display text-2xl font-extrabold text-primary-800">
                {formatEuros(r.yearlySavingsEuros)}
              </p>
              <p className="mt-1 text-body-sm text-text-muted">Économies estimées par an</p>
            </li>
            <li className="rounded-lg border border-border bg-surface p-5 text-center">
              <p className="font-display text-2xl font-extrabold text-primary-800">
                {r.durationDays}
              </p>
              <p className="mt-1 text-body-sm text-text-muted">Jours de chantier</p>
            </li>
          </ul>
        </Container>
      </Section>

      {/* Travaux + Aides */}
      <Section tone="muted">
        <Container className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-primary-800">Travaux réalisés</h2>
            <ul className="mt-4 space-y-3">
              {r.works.map((w, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center bg-accent-500 text-xs font-bold text-primary-900"
                    style={{
                      clipPath:
                        "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                  >
                    ✓
                  </span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="font-display text-2xl font-bold text-primary-800">Aides obtenues</h2>
            <p className="mt-2 text-body-sm text-text-muted">
              Détail du financement public mobilisé pour ce chantier (profil MaPrimeRénov' {r.profileMpr}).
            </p>
            <ul className="mt-4 space-y-2">
              {r.aidesDetail.map((a, i) => (
                <li
                  key={i}
                  className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-2 last:border-0"
                >
                  <span className="text-body-sm">{a.name}</span>
                  <span className="font-display font-semibold text-primary-700">{a.amount}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <LinkButton href="/aides" variant="outline" size="sm">
                En savoir plus sur les aides
              </LinkButton>
            </div>
          </div>
        </Container>
      </Section>

      {/* Témoignage client */}
      <Section>
        <Container className="max-w-3xl">
          <div
            data-content={r.placeholder ? "placeholder" : undefined}
            className={`relative overflow-hidden rounded-lg border bg-surface p-8 shadow-sm sm:p-10 ${
              r.placeholder
                ? "border-accent-500/40 ring-1 ring-accent-500/30"
                : "border-border"
            }`}
          >
            <span
              aria-hidden
              className="absolute -right-2 -top-4 select-none font-display text-[7rem] leading-none text-primary-100 pointer-events-none"
            >
              &rdquo;
            </span>
            <div className="relative">
              <p className="text-accent-500" aria-label="5 étoiles">★★★★★</p>
              <blockquote className="mt-3 font-display text-lg italic text-primary-900 sm:text-xl">
                « {r.quote} »
              </blockquote>
              <p className="mt-4 text-body-sm">
                <span className="font-semibold">{r.customerName}</span>
                <span className="text-text-muted"> — {r.location}</span>
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Autres réalisations */}
      <Section tone="muted">
        <Container>
          <h2 className="font-display text-2xl font-bold text-primary-800">
            Autres réalisations
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {others.map((x) => (
              <li key={x.slug}>
                <Link
                  href={`/realisations/${x.slug}`}
                  className="block rounded-lg border border-border bg-surface p-5 transition hover:border-primary-300 hover:shadow-md"
                >
                  <p className="text-body-sm uppercase tracking-wide text-accent-600">
                    {x.location}
                  </p>
                  <h3 className="mt-1 font-display font-semibold text-primary-800">
                    {x.title}
                  </h3>
                  <p className="mt-2 text-body-sm text-text-muted">
                    Aides obtenues : <strong>{formatEuros(x.aidesObtainedEuros)}</strong>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* CTA finale */}
      <Section>
        <Container className="text-center">
          <h2 className="font-display text-3xl font-bold text-primary-800 sm:text-4xl">
            Votre projet, étudié comme ce chantier
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LinkButton href="/simulateur" variant="primary" size="lg">
              Estimer mes aides en 2 min
            </LinkButton>
            <LinkButton href="/contact" variant="outline" size="lg">
              Parler à un conseiller
            </LinkButton>
          </div>
        </Container>
      </Section>
    </>
  );
}
