import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { TricolorBar } from "@/components/brand/TricolorBar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { REALISATIONS, formatEuros } from "@/lib/realisations";
import { env } from "@/lib/env";
import { getAssetByKey } from "@/lib/media";

export const metadata: Metadata = {
  title: "Nos réalisations — chantiers de rénovation énergétique",
  description:
    "Découvrez 6 chantiers réalisés par notre équipe : pompe à chaleur, isolation thermique extérieure, photovoltaïque, ballon thermodynamique. Coûts, aides obtenues et économies réelles.",
  alternates: { canonical: "/realisations" },
  openGraph: {
    title: "Nos réalisations — Groupe Climat Hexagone",
    description:
      "Cas clients réels avec coûts, aides MaPrimeRénov' obtenues et économies sur la facture énergétique.",
    url: "/realisations",
    type: "website",
  },
};

/**
 * JSON-LD `ItemList` pour la page de listing — référence Google les 6 réalisations
 * comme une collection cliquable.
 */
function RealisationsItemListJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Réalisations Groupe Climat Hexagone",
    itemListElement: REALISATIONS.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${env.site.url}/realisations/${r.slug}`,
      name: r.title,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function RealisationsIndexPage() {
  const heroImg = await getAssetByKey("realisations.hero");
  return (
    <>
      <RealisationsItemListJsonLd />
      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: "Nos réalisations", href: "/realisations" },
        ]}
      />

      <section className="relative isolate overflow-hidden bg-primary-900 py-16 text-text-inverse">
        {heroImg && (
          <Image
            src={heroImg.url}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-10 object-cover"
            {...(heroImg.blurDataURL
              ? { placeholder: "blur" as const, blurDataURL: heroImg.blurDataURL }
              : {})}
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background: heroImg
              ? "linear-gradient(180deg, rgba(6,26,16,0.78) 0%, rgba(6,26,16,0.55) 50%, rgba(6,26,16,0.92) 100%)"
              : "var(--color-primary-800)",
          }}
        />
        <Container className="relative">
          <p className="font-body text-body-sm uppercase tracking-[0.18em] text-accent-500">
            Nos chantiers
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-5xl">
            Six réalisations, six histoires
          </h1>
          <p className="mt-4 max-w-2xl text-body-lg text-white/90">
            Pompe à chaleur, isolation thermique extérieure, photovoltaïque, ballon thermodynamique :
            voici comment notre équipe a accompagné des propriétaires partout en France.
            Coûts, aides obtenues et économies réelles, sans simulation marketing.
          </p>
          <div className="mt-6">
            <TricolorBar />
          </div>
        </Container>
      </section>

      {/* ⚠️ Disclaimer encart visible utilisateur — supprimer une fois les
           cas réels substitués par le client. */}
      <Section tone="muted">
        <Container className="max-w-4xl">
          <div
            data-content="placeholder"
            className="rounded-lg border border-accent-500/40 bg-accent-500/5 p-5 text-body-sm text-amber-900 ring-1 ring-accent-500/30"
          >
            <strong>Note pour la phase de mise en page :</strong> les six réalisations
            ci-dessous sont des <strong>cas fictifs réalistes</strong> destinés à valider
            la structure et le rendu. Les chiffres d'aides correspondent à des ordres
            de grandeur 2025 cohérents mais ne proviennent pas de dossiers réels. Avant
            mise en production, le client doit substituer ces cas par des chantiers
            vérifiables avec consentement écrit RGPD du client final.
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {REALISATIONS.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/realisations/${r.slug}`}
                  data-content={r.placeholder ? "placeholder" : undefined}
                  className={`group flex h-full flex-col overflow-hidden rounded-lg border bg-surface transition hover:-translate-y-0.5 hover:shadow-md ${
                    r.placeholder
                      ? "border-accent-500/40 ring-1 ring-accent-500/20"
                      : "border-border hover:border-primary-300"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.coverImage}
                    alt={`Photo avant/après — ${r.title}`}
                    className="aspect-[3/2] w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-body-sm uppercase tracking-wide text-accent-600">
                      {r.location}
                    </p>
                    <h2 className="mt-2 font-display text-lg font-semibold text-primary-800 group-hover:text-primary-700">
                      {r.title}
                    </h2>
                    <ul className="mt-3 space-y-1 text-body-sm text-text-muted">
                      <li>
                        <strong className="text-text">Aides obtenues :</strong>{" "}
                        {formatEuros(r.aidesObtainedEuros)}
                      </li>
                      <li>
                        <strong className="text-text">Économies/an :</strong>{" "}
                        {formatEuros(r.yearlySavingsEuros)}
                      </li>
                      <li>
                        <strong className="text-text">Durée :</strong> {r.durationDays} jours
                      </li>
                    </ul>
                    <span className="mt-auto pt-4 text-body-sm font-semibold text-primary-700">
                      Voir le chantier →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="muted">
        <Container className="text-center">
          <h2 className="font-display text-3xl font-bold text-primary-800 sm:text-4xl">
            Votre projet, étudié comme ces réalisations
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-text-muted">
            Chaque chantier commence par une étude personnalisée et un calcul d'aides détaillé.
          </p>
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
