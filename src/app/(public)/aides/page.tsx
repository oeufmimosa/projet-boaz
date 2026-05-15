import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { TricolorBar } from "@/components/brand/TricolorBar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqJsonLd } from "@/components/seo/StructuredData";

/**
 * Page d'information sur les aides 2025 à la rénovation énergétique.
 *
 * Sources publiques citées (à recouper annuellement) :
 *  - https://www.maprimerenov.gouv.fr/                (barèmes par profil)
 *  - https://france-renov.gouv.fr/                    (cadre général)
 *  - https://www.ademe.fr/                            (prix de marché)
 *  - https://www.economie.gouv.fr/cedef/cee           (CEE)
 *  - https://www.service-public.fr/particuliers/vosdroits/F32937  (Éco-PTZ)
 *  - https://www.economie.gouv.fr/particuliers/tva-renovation     (TVA 5,5 %)
 *
 * ⚠️ Les barèmes MaPrimeRénov' et CEE changent au 1er janvier de chaque année.
 *    Cette page contient des fourchettes volontairement larges pour rester
 *    valides dans le temps. Le client doit revérifier au prochain millésime.
 */

export const metadata: Metadata = {
  title: "Aides à la rénovation énergétique 2026",
  description:
    "MaPrimeRénov' et TVA réduite à 5,5 % : les dispositifs d'aides disponibles en 2026 pour financer vos travaux. Vérifiez votre éligibilité gratuitement en 2 minutes.",
  alternates: { canonical: "/aides" },
  openGraph: {
    title: "Aides à la rénovation énergétique 2026",
    description:
      "MaPrimeRénov' et TVA réduite à 5,5 % : dispositifs d'aides applicables en 2026. Étude gratuite et personnalisée.",
    url: "/aides",
    type: "article",
  },
};

const FAQ = [
  {
    q: "Puis-je cumuler MaPrimeRénov' et la TVA réduite ?",
    a: "Oui. MaPrimeRénov' et la TVA réduite à 5,5 % sont cumulables sous conditions. La TVA réduite s'applique automatiquement sur le devis pour les travaux éligibles, et MaPrimeRénov' est versée séparément selon votre profil. Notre conseiller calcule votre montant total mobilisable en fonction de vos travaux, de votre logement et de votre profil de revenus.",
  },
  {
    q: "Comment fonctionne MaPrimeRénov' ?",
    a: "MaPrimeRénov' est une aide d'État versée par l'Anah, calculée selon vos revenus et le type de travaux. Elle se décline en quatre profils (Bleu, Jaune, Violet, Rose) selon votre revenu fiscal de référence et la composition de votre foyer. Plus vos revenus sont modestes, plus l'aide est élevée.",
  },
  {
    q: "Faut-il avancer l'argent pour les travaux ?",
    a: "MaPrimeRénov' est versée après les travaux (le client avance). Pour les ménages aux revenus très modestes (profil Bleu), une avance peut être versée si le dossier est validé. La TVA réduite à 5,5 % est, elle, appliquée directement sur le devis : vous ne payez que le montant TTC réduit dès le départ.",
  },
  {
    q: "Mon logement est-il éligible ?",
    a: "MaPrimeRénov' est ouverte aux propriétaires (occupants ou bailleurs) dont le logement a plus de 15 ans, occupé en résidence principale au moins 8 mois par an. La TVA à 5,5 % s'applique aux logements de plus de 2 ans. Notre étude vérifie l'éligibilité de votre logement.",
  },
  {
    q: "Combien de temps pour recevoir MaPrimeRénov' ?",
    a: "MaPrimeRénov' est généralement versée 2 à 4 mois après la fin des travaux et le dépôt du dossier complet. Notre service administratif suit le versement de votre aide jusqu'à son encaissement.",
  },
  {
    q: "Y a-t-il d'autres aides ?",
    a: "Oui, certaines collectivités locales (régions, départements, communes) proposent des aides complémentaires (ex. aides régionales pour le solaire dans le Sud). Les caisses de retraite et l'Anah ont aussi des dispositifs spécifiques (programme « Habiter mieux »). Notre conseiller vous oriente sur les aides locales applicables à votre adresse.",
  },
];

const PROFILS = [
  {
    name: "Bleu",
    color: "from-sky-500 to-sky-600",
    text: "text-sky-50",
    label: "Revenus très modestes",
    // TODO client/SEO : revérifier les plafonds annuellement.
    // Source : https://www.maprimerenov.gouv.fr/prestataires/conditions-revenus
    revenusIDF:  "Jusqu'à ~23 500 € (1 personne) — IDF",
    revenusProv: "Jusqu'à ~17 000 € (1 personne) — Province",
    montantNote: "Aides les plus élevées, taux de financement majoré (jusqu'à 90 % du coût HT pour certains travaux d'efficacité énergétique).",
  },
  {
    name: "Jaune",
    color: "from-amber-400 to-amber-500",
    text: "text-amber-900",
    label: "Revenus modestes",
    revenusIDF:  "~23 500 à 28 700 € (1 personne) — IDF",
    revenusProv: "~17 000 à 21 800 € (1 personne) — Province",
    montantNote: "Aides élevées, taux de financement intermédiaire.",
  },
  {
    name: "Violet",
    color: "from-violet-500 to-violet-600",
    text: "text-violet-50",
    label: "Revenus intermédiaires",
    revenusIDF:  "~28 700 à 40 000 € (1 personne) — IDF",
    revenusProv: "~21 800 à 30 500 € (1 personne) — Province",
    montantNote: "Aides modérées, plafonnées par travaux.",
  },
  {
    name: "Rose",
    color: "from-pink-400 to-pink-500",
    text: "text-pink-50",
    label: "Revenus supérieurs",
    revenusIDF:  "Au-delà de ~40 000 € (1 personne) — IDF",
    revenusProv: "Au-delà de ~30 500 € (1 personne) — Province",
    montantNote: "Aides limitées, principalement orientées vers les rénovations globales et les gestes les plus impactants.",
  },
];

export default function AidesPage() {
  return (
    <>
      <FaqJsonLd items={FAQ} />

      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: "Aides", href: "/aides" },
        ]}
      />

      {/* Hero */}
      <section className="bg-primary-800 py-16 text-text-inverse">
        <Container className="max-w-3xl">
          <p className="font-body text-body-sm uppercase tracking-[0.18em] text-accent-500">
            Financement de vos travaux
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-5xl">
            Aides à la rénovation énergétique 2026
          </h1>
          <p className="mt-4 text-body-lg text-white/90">
            MaPrimeRénov' et TVA réduite à 5,5 % : les principaux dispositifs
            d&apos;aides applicables en 2026 pour financer vos travaux. Notre
            conseiller calcule votre montant mobilisable selon votre situation
            lors d&apos;une étude gratuite.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href="/simulateur" variant="accent" size="lg">
              Estimer mes aides en 2 min
            </LinkButton>
          </div>
          <div className="mt-6">
            <TricolorBar />
          </div>
        </Container>
      </section>

      {/* Détail par dispositif */}

      {/* MaPrimeRénov' */}
      <Section tone="muted" id="maprimerenov">
        <Container className="max-w-5xl">
          <h2 className="font-display text-2xl font-bold text-primary-800 sm:text-3xl">
            MaPrimeRénov' — quatre profils, des montants variables
          </h2>
          <p className="mt-3 text-text-muted">
            MaPrimeRénov' est l'aide d'État versée par l'Anah. Elle se décline
            en <strong>quatre profils</strong> selon vos revenus fiscaux de
            référence et la composition du foyer. Plus vos revenus sont modestes,
            plus l'aide est élevée. Votre profil détermine aussi le taux de
            financement maximum applicable à chaque type de travaux.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {PROFILS.map((p) => (
              <li
                key={p.name}
                className={`rounded-lg bg-gradient-to-br ${p.color} ${p.text} p-6 shadow-sm`}
              >
                <p className="font-display text-2xl font-extrabold">Profil {p.name}</p>
                <p className="mt-1 text-body-sm opacity-90">{p.label}</p>
                <p className="mt-4 text-body-sm">{p.revenusIDF}</p>
                <p className="text-body-sm">{p.revenusProv}</p>
                <p className="mt-4 text-body-sm font-semibold">{p.montantNote}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-body-sm text-text-muted">
            Source : <a href="https://www.maprimerenov.gouv.fr/prestataires/conditions-revenus" className="underline" target="_blank" rel="noopener noreferrer">maprimerenov.gouv.fr — conditions de revenus</a>. Les plafonds exacts dépendent
            de la composition du foyer et de la zone géographique (IDF / Province).
            Notre simulateur intègre la grille officielle pour vous donner le
            chiffre applicable à votre situation. <strong>TODO client : revérifier annuellement.</strong>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href="/simulateur" variant="primary" size="md">
              Vérifier mon profil
            </LinkButton>
            <a
              href="https://www.maprimerenov.gouv.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center px-5 font-display font-semibold text-primary-700 underline-offset-4 hover:underline"
            >
              Site officiel MaPrimeRénov' →
            </a>
          </div>
        </Container>
      </Section>

      {/* TVA 5,5 % */}
      <Section id="tva">
        <Container className="max-w-5xl">
          <h2 className="font-display text-2xl font-bold text-primary-800 sm:text-3xl">
            TVA réduite à 5,5 %
          </h2>
          <p className="mt-3 text-text-muted">
            Les travaux d'amélioration énergétique éligibles bénéficient d'une
            <strong> TVA à 5,5 %</strong> au lieu de 20 % (taux normal) ou 10 %
            (taux intermédiaire). Cette réduction est <strong>automatique</strong> et apparaît
            directement sur votre devis.
          </p>
          <p className="mt-4 text-body-sm text-text-muted">
            Travaux concernés : isolation thermique, chauffage performant, eau chaude
            sanitaire renouvelable, équipements de production d'énergie renouvelable.
            Conditions : logement de plus de 2 ans, occupé en résidence principale ou secondaire,
            artisan certifié RGE. Source : <a href="https://www.economie.gouv.fr/particuliers/tva-renovation" className="underline" target="_blank" rel="noopener noreferrer">economie.gouv.fr — TVA rénovation</a>.
          </p>
        </Container>
      </Section>

      {/* Aides locales */}
      <Section tone="muted" id="aides-locales">
        <Container className="max-w-5xl">
          <h2 className="font-display text-2xl font-bold text-primary-800 sm:text-3xl">
            Aides locales et complémentaires
          </h2>
          <p className="mt-3 text-text-muted">
            Certaines régions, départements et communes proposent des aides
            complémentaires aux dispositifs nationaux. Le programme « Habiter
            mieux » de l'Anah, les aides des caisses de retraite, ou des
            subventions régionales (notamment pour le solaire dans le Sud) peuvent
            s'ajouter à votre plan de financement.
          </p>
          <p className="mt-4 text-body-sm text-text-muted">
            Notre conseiller vous oriente sur les aides locales applicables à
            votre adresse exacte lors de l'étude personnalisée.
          </p>
        </Container>
      </Section>

      {/* FAQ */}
      <Section id="faq">
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-primary-800 sm:text-3xl">
            Questions fréquentes
          </h2>
          <ul className="mt-8 space-y-3">
            {FAQ.map((item, i) => (
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

      {/* CTA finale */}
      <Section tone="muted">
        <Container className="text-center">
          <h2 className="font-display text-3xl font-bold text-primary-800 sm:text-4xl">
            Estimez votre dossier d'aides en 2 minutes
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-text-muted">
            Notre simulateur estime les dispositifs d&apos;aides applicables à votre
            situation (MaPrimeRénov&apos;, TVA réduite et aides locales éventuelles),
            sans inscription ni engagement.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LinkButton href="/simulateur" variant="primary" size="lg">
              Démarrer ma simulation
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
