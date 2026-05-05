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
  title: "Aides à la rénovation énergétique 2025",
  description:
    "MaPrimeRénov', primes CEE, éco-PTZ, TVA 5,5 % : cumulez les aides 2025 pour vos travaux. Vérifiez votre éligibilité gratuitement en 2 minutes.",
  alternates: { canonical: "/aides" },
  openGraph: {
    title: "Aides à la rénovation énergétique 2025",
    description:
      "Cumulez MaPrimeRénov' + CEE + Éco-PTZ + TVA 5,5 % pour financer vos travaux. Étude gratuite et personnalisée.",
    url: "/aides",
    type: "article",
  },
};

const FAQ = [
  {
    q: "Puis-je cumuler plusieurs aides à la rénovation ?",
    a: "Oui. MaPrimeRénov', les primes CEE, l'éco-PTZ et la TVA réduite à 5,5 % sont cumulables sous conditions. Notre conseiller calcule votre montant total mobilisable en fonction de vos travaux, de votre logement et de votre profil de revenus. L'éco-PTZ peut financer le reste à charge après aides.",
  },
  {
    q: "Quelle est la différence entre MaPrimeRénov' et les CEE ?",
    a: "MaPrimeRénov' est une aide d'État versée par l'Anah, calculée selon vos revenus et le type de travaux. Les CEE (Certificats d'Économies d'Énergie) sont des primes versées par les fournisseurs d'énergie (EDF, TotalEnergies, etc.) pour respecter leurs obligations légales. Les deux sont cumulables.",
  },
  {
    q: "Faut-il avancer l'argent pour les travaux ?",
    a: "MaPrimeRénov' est versée après les travaux (le client avance). Pour les ménages aux revenus très modestes (profil Bleu), une avance peut être versée si le dossier est validé. Les primes CEE sont en général déduites directement du devis (mode \"signataire\" via votre installateur). L'éco-PTZ permet de financer le reste à charge sans intérêts.",
  },
  {
    q: "Mon logement est-il éligible ?",
    a: "MaPrimeRénov' est ouverte aux propriétaires (occupants ou bailleurs) dont le logement a plus de 15 ans, occupé en résidence principale au moins 8 mois par an. L'éco-PTZ exige aussi un logement de plus de 2 ans. La TVA à 5,5 % s'applique aux logements de plus de 2 ans. Notre étude vérifie l'éligibilité de votre logement.",
  },
  {
    q: "Combien de temps pour recevoir les aides ?",
    a: "Variable selon le dispositif : MaPrimeRénov' est versée 2 à 4 mois après la fin des travaux et le dépôt du dossier complet. Les primes CEE sont généralement déduites au devis (instantanées). L'éco-PTZ est mis en place avec votre banque avant le début du chantier. Notre service administratif suit le versement de chaque aide.",
  },
  {
    q: "Y a-t-il d'autres aides ?",
    a: "Oui, certaines collectivités locales (régions, départements, communes) proposent des aides complémentaires (ex. aides régionales pour le solaire en Occitanie). Les caisses de retraite et l'Anah ont aussi des dispositifs spécifiques (programme \"Habiter mieux\"). Notre conseiller vous oriente sur les aides locales applicables à votre adresse.",
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
            Aides à la rénovation énergétique 2025
          </h1>
          <p className="mt-4 text-body-lg text-white/90">
            Quatre dispositifs cumulables financent vos travaux : MaPrimeRénov',
            les Certificats d'Économies d'Énergie (CEE), l'éco-prêt à taux zéro
            et la TVA réduite à 5,5 %. Notre conseiller calcule votre montant
            mobilisable lors d'une étude gratuite.
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

      {/* Tableau récapitulatif */}
      <Section>
        <Container className="max-w-5xl">
          <h2 className="font-display text-2xl font-bold text-primary-800 sm:text-3xl">
            Tableau récapitulatif
          </h2>
          <p className="mt-3 text-text-muted">
            Une vue d'ensemble des dispositifs publics 2025. Le détail dispositif
            par dispositif suit en dessous.
          </p>
          <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full text-body-sm">
              <thead className="bg-surface-2 text-left">
                <tr>
                  <th className="p-4 font-display text-primary-800">Aide</th>
                  <th className="p-4 font-display text-primary-800">Pour qui</th>
                  <th className="p-4 font-display text-primary-800">Pour quels travaux</th>
                  <th className="p-4 font-display text-primary-800">Montant</th>
                  <th className="p-4 font-display text-primary-800">Cumulable ?</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-4 font-semibold">MaPrimeRénov'</td>
                  <td className="p-4">Propriétaires (occupants ou bailleurs)</td>
                  <td className="p-4">PAC, ITE, CESI, SSC, ballon thermo, isolation, rénovation globale</td>
                  <td className="p-4">Variable selon profil et travaux</td>
                  <td className="p-4">Oui</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-4 font-semibold">Primes CEE</td>
                  <td className="p-4">Tous propriétaires et locataires (sous conditions)</td>
                  <td className="p-4">Liste large : isolation, chauffage performant, ventilation</td>
                  <td className="p-4">Variable selon opérateur</td>
                  <td className="p-4">Oui (avec MaPrimeRénov')</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-4 font-semibold">Éco-PTZ</td>
                  <td className="p-4">Propriétaires (logement &gt; 2 ans)</td>
                  <td className="p-4">Bouquet de travaux ou rénovation globale</td>
                  <td className="p-4">Jusqu'à 50 000 €, 20 ans, 0 % d'intérêts</td>
                  <td className="p-4">Oui</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-4 font-semibold">TVA 5,5 %</td>
                  <td className="p-4">Tous (logement &gt; 2 ans)</td>
                  <td className="p-4">Travaux d'amélioration énergétique éligibles</td>
                  <td className="p-4">Réduction directe sur le devis</td>
                  <td className="p-4">Oui</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-body-sm text-text-muted">
            Source : <a href="https://france-renov.gouv.fr/" className="underline" target="_blank" rel="noopener noreferrer">France Rénov'</a> &middot; <a href="https://www.maprimerenov.gouv.fr/" className="underline" target="_blank" rel="noopener noreferrer">MaPrimeRénov'</a> &middot; barèmes 2025 (à revérifier annuellement).
          </p>
        </Container>
      </Section>

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

      {/* CEE */}
      <Section id="cee">
        <Container className="max-w-5xl">
          <h2 className="font-display text-2xl font-bold text-primary-800 sm:text-3xl">
            Primes CEE — Certificats d'Économies d'Énergie
          </h2>
          <p className="mt-3 text-text-muted">
            Les <strong>CEE</strong> sont versés par les fournisseurs d'énergie
            (EDF, TotalEnergies, Engie, etc.) pour respecter leurs obligations
            légales d'économies d'énergie. Concrètement, vous touchez une prime
            <strong> directement déduite de votre devis</strong> dans la majorité
            des cas (mécanisme dit du « tiers signataire »).
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-surface p-6">
              <h3 className="font-display text-lg font-semibold text-primary-800">
                Comment ça marche ?
              </h3>
              <ol className="mt-4 space-y-2 text-body-sm">
                <li><strong>1.</strong> Vous choisissez un fournisseur d'énergie partenaire (ou nous le sélectionnons selon les meilleures offres du moment)</li>
                <li><strong>2.</strong> La prime est calculée selon le type de travaux, votre profil de revenus et la zone climatique</li>
                <li><strong>3.</strong> Le devis affiche directement le montant déduit. Vous ne payez que le reste à charge</li>
              </ol>
            </div>
            <div className="rounded-lg border border-accent-500/40 bg-accent-500/5 p-6">
              <h3 className="font-display text-lg font-semibold text-primary-800">
                Coup de pouce CEE
              </h3>
              <p className="mt-3 text-body-sm">
                Pour le remplacement d'une vieille chaudière fioul/gaz par une
                pompe à chaleur ou pour une rénovation globale, des primes
                <strong> bonifiées</strong> existent (« Coup de pouce
                Chauffage », « Coup de pouce Rénovation performante »). Notre
                conseiller vérifie systématiquement votre éligibilité.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-5 text-body-sm text-amber-900">
            ⚠️ <strong>Disclaimer fourchettes CEE :</strong> les montants des primes CEE varient
            <strong> par opérateur et par travaux</strong>, et changent en fonction
            du marché des certificats. Pour une PAC air-eau, comptez en ordre de
            grandeur entre 2 500 € et 5 000 € de prime CEE pour un foyer modeste,
            mais les chiffres exacts ne peuvent être donnés qu'au moment du devis.
            Nous garantissons toujours le meilleur tarif disponible à l'instant T.
          </div>

          <p className="mt-4 text-body-sm text-text-muted">
            Source : <a href="https://www.economie.gouv.fr/cedef/cee" className="underline" target="_blank" rel="noopener noreferrer">economie.gouv.fr — CEE</a>. <strong>TODO client : revérifier annuellement.</strong>
          </p>
        </Container>
      </Section>

      {/* Éco-PTZ */}
      <Section tone="muted" id="eco-ptz">
        <Container className="max-w-5xl">
          <h2 className="font-display text-2xl font-bold text-primary-800 sm:text-3xl">
            Éco-prêt à taux zéro (éco-PTZ)
          </h2>
          <p className="mt-3 text-text-muted">
            L'éco-PTZ est un <strong>prêt à 0 % d'intérêts</strong> proposé par les
            banques partenaires. Il finance les travaux d'efficacité énergétique
            (ou le reste à charge après MaPrimeRénov' + CEE) sans alourdir vos mensualités.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            <li className="rounded-lg border border-border bg-surface p-5">
              <p className="font-display text-3xl font-extrabold text-accent-600">50 000 €</p>
              <p className="mt-1 text-body-sm text-text-muted">Montant maximum (rénovation globale ou bouquet ≥ 3 travaux)</p>
            </li>
            <li className="rounded-lg border border-border bg-surface p-5">
              <p className="font-display text-3xl font-extrabold text-accent-600">20 ans</p>
              <p className="mt-1 text-body-sm text-text-muted">Durée maximum de remboursement</p>
            </li>
            <li className="rounded-lg border border-border bg-surface p-5">
              <p className="font-display text-3xl font-extrabold text-accent-600">0 %</p>
              <p className="mt-1 text-body-sm text-text-muted">Intérêts à votre charge (l'État subventionne la banque)</p>
            </li>
          </ul>
          <p className="mt-6 text-body-sm text-text-muted">
            Conditions : logement de plus de 2 ans, résidence principale, travaux réalisés par un artisan RGE.
            Le montant maximum dépend du nombre de travaux engagés (15 000 € pour un seul geste, 25 000 € pour deux,
            jusqu'à 50 000 € pour un bouquet ≥ 3 travaux ou une rénovation globale).
            Source : <a href="https://www.service-public.fr/particuliers/vosdroits/F32937" className="underline" target="_blank" rel="noopener noreferrer">service-public.fr — éco-PTZ</a>.
          </p>
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
            Notre simulateur calcule votre montant mobilisable en cumulant
            MaPrimeRénov', CEE et éco-PTZ, sans inscription ni engagement.
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
