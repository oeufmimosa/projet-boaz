import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { TricolorBar } from "@/components/brand/TricolorBar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ServicesGridInteractive } from "@/components/home/ServicesGridInteractive";
import { BrandsMarquee } from "@/components/brand/BrandsMarquee";

export const metadata = {
  title: "Nos services",
  description:
    "Pompe à chaleur, isolation thermique extérieure, ballon thermodynamique, système solaire combiné : 5 expertises en rénovation énergétique avec accompagnement clé en main par des artisans RGE.",
  alternates: { canonical: "/services" },
};

const TRUST_PILLS = [
  "Artisans RGE certifiés",
  "Garantie décennale",
  "Étude personnalisée gratuite",
];

const STATS = [
  { value: "5", label: "Expertises métier" },
  { value: "100 %", label: "Artisans RGE" },
  { value: "Jusqu'à 50 k€", label: "d'aides cumulables" },
  { value: "24 h", label: "Pour être recontacté" },
];

const PROCESS_STEPS = [
  {
    icon: "🔍",
    title: "Étude personnalisée",
    body:
      "Visite technique, analyse de vos consommations et calcul précis des aides 2025 auxquelles vous pouvez prétendre.",
  },
  {
    icon: "📋",
    title: "Devis transparent",
    body:
      "Chiffrage détaillé du chantier, montant net après aides, planning d'installation et engagement par écrit.",
  },
  {
    icon: "🛠️",
    title: "Installation clé en main",
    body:
      "Pose par nos partenaires RGE, mise en service, démarches MaPrimeRénov' et CEE gérées de A à Z.",
  },
];

const PILLARS = [
  { icon: "🔍", title: "Étude sur-mesure", body: "Pas de solution standard : on dimensionne en fonction de votre logement et de vos consommations réelles." },
  { icon: "🛡️", title: "Artisans certifiés RGE", body: "Travaux réalisés par des partenaires Reconnus Garants de l'Environnement, condition sine qua non pour les aides." },
  { icon: "💰", title: "Aides maximisées", body: "MaPrimeRénov', CEE, Éco-PTZ : on calcule, on cumule et on déclare pour vous. Pas un euro de perdu." },
  { icon: "⚖️", title: "Garantie décennale", body: "Tous les chantiers couverts par une assurance décennale. Sérénité 10 ans après la mise en service." },
];

export default function ServicesIndexPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: "Nos services", href: "/services" },
        ]}
      />

      {/* a) Hero — image de fond + overlay vert + trust pills */}
      <section className="relative isolate flex min-h-[420px] items-center overflow-hidden bg-primary-800 py-16 text-text-inverse sm:min-h-[540px]">
        <Image
          src="/services/hero.jpg"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(6,26,16,0.92) 0%, rgba(6,26,16,0.78) 40%, rgba(6,26,16,0.55) 100%)",
          }}
        />
        <Container className="relative">
          <p className="font-body text-body-sm uppercase tracking-[0.18em] text-accent-500">
            Rénovation énergétique
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            Nos <span className="text-accent-500">services</span>
          </h1>
          <p className="mt-4 max-w-2xl text-body-lg text-white/90">
            Cinq expertises complémentaires pour réduire votre consommation, gagner en confort
            et valoriser votre logement — accompagnement de A à Z.
          </p>

          {/* Trust pills */}
          <ul className="mt-7 flex flex-wrap gap-2 sm:gap-3">
            {TRUST_PILLS.map((p) => (
              <li
                key={p}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-body-sm font-medium backdrop-blur-sm"
              >
                <span aria-hidden className="text-accent-500">✓</span>
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <TricolorBar />
          </div>
        </Container>
      </section>

      {/* b) Bandeau de chiffres clés (crédibilité immédiate) */}
      <Section tone="muted" className="!py-10 sm:!py-12">
        <Container>
          <ul className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {STATS.map((s) => (
              <li key={s.label} className="text-center">
                <p className="font-display text-3xl font-extrabold text-primary-800 sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-body-sm text-text-muted">{s.label}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* c) Intro + Grille services */}
      <Section className="!pb-8">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-body text-body-sm uppercase tracking-[0.18em] text-accent-600">
              Choisissez votre solution
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary-800 sm:text-4xl">
              Une expertise pour chaque besoin
            </h2>
            <p className="mt-3 text-text-muted">
              Survolez une carte pour découvrir les bénéfices clés. Cliquez pour la fiche détaillée
              avec spécifications techniques, FAQ et calcul d&apos;aides.
            </p>
          </div>
        </Container>
      </Section>
      <ServicesGridInteractive showHeader={false} showCta={false} />

      {/* c-bis) Marques proposées (sans heading) */}
      <BrandsMarquee showHeading={false} />

      {/* d) Comment ça se passe (3 étapes) */}
      <Section className="bg-primary-50">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-body text-body-sm uppercase tracking-[0.18em] text-accent-600">
              Notre méthode
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary-800 sm:text-4xl">
              Comment ça se passe
            </h2>
            <p className="mt-3 text-text-muted">
              Trois étapes claires, des artisans certifiés, zéro mauvaise surprise.
            </p>
          </div>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {PROCESS_STEPS.map((step, i) => (
              <li
                key={step.title}
                className="relative rounded-lg border border-border bg-surface p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md"
              >
                <span
                  aria-hidden
                  className="absolute -top-4 left-6 inline-flex h-8 w-8 items-center justify-center bg-accent-500 font-display text-body-sm font-bold text-primary-900"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                  {i + 1}
                </span>
                <div
                  aria-hidden
                  className="mt-2 mb-4 flex h-14 w-14 items-center justify-center bg-primary-50 text-2xl"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                  {step.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-primary-800">{step.title}</h3>
                <p className="mt-2 text-body-sm text-text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* e) Pourquoi nous choisir (4 piliers) */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-body text-body-sm uppercase tracking-[0.18em] text-accent-600">
              Nos engagements
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary-800 sm:text-4xl">
              Pourquoi nous choisir
            </h2>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2">
            {PILLARS.map((p) => (
              <li
                key={p.title}
                className="flex gap-4 rounded-lg border border-border bg-surface p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md"
              >
                <div
                  aria-hidden
                  className="flex h-14 w-14 shrink-0 items-center justify-center bg-primary-50 text-2xl"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                  {p.icon}
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-primary-800">{p.title}</h3>
                  <p className="mt-2 text-body-sm text-text-muted">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* f) CTA finale */}
      <Section tone="dark">
        <Container className="text-center">
          <p className="font-body text-body-sm uppercase tracking-[0.18em] text-accent-500">
            Prêt à passer à l&apos;action ?
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Estimez vos aides en 2 minutes
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-body-lg text-white/90">
            Notre simulateur calcule MaPrimeRénov&apos;, CEE et Éco-PTZ selon vos revenus et vos travaux.
            Sans engagement.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LinkButton href="/simulateur" variant="accent" size="lg">
              Simuler mes aides
            </LinkButton>
            <LinkButton href="/contact" variant="outline-inverse" size="lg">
              Parler à un conseiller
            </LinkButton>
          </div>
        </Container>
      </Section>
    </>
  );
}
