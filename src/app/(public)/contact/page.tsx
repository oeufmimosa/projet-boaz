import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { TricolorBar } from "@/components/brand/TricolorBar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LinkButton } from "@/components/ui/Button";
import { ContactForm } from "@/components/contact/ContactForm";
import { getContent } from "@/lib/content";
import { getAssetByKey } from "@/lib/media";

export const metadata = {
  title: "Contact",
  description:
    "Une question, un projet de rénovation énergétique ? Notre équipe vous répond sous 24h ouvrées. Email, téléphone et formulaire en ligne.",
  alternates: { canonical: "/contact" },
};

const COORDONNEES = [
  {
    label: "Email",
    value: "contact@example.com",
    href: "mailto:contact@example.com",
    helper: "Réponse sous 24h ouvrées",
    icon: <MailIcon />,
  },
  {
    label: "Téléphone",
    value: "01 23 45 67 89",
    href: "tel:+33123456789",
    helper: "Du lundi au vendredi, 9h–18h",
    icon: <PhoneIcon />,
  },
  {
    label: "Horaires",
    value: "Lun – Ven · 9h – 18h",
    helper: "Réponse aux urgences sous 2h ouvrées",
    icon: <ClockIcon />,
  },
];

export default async function ContactPage() {
  const [title, heroImg] = await Promise.all([
    getContent("contact.hero.title", "Contactez-nous"),
    getAssetByKey("contact.hero"),
  ]);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      {/* Hero — fond image (asset key contact.hero) avec overlay vert pour lisibilité */}
      <section className="relative isolate flex min-h-[420px] items-center overflow-hidden bg-primary-800 py-16 text-text-inverse sm:min-h-[520px]">
        {heroImg && (
          <Image
            src={heroImg.url}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-10 object-cover scale-90 translate-x-[8%]"
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
              ? "linear-gradient(90deg, rgba(6,26,16,0.92) 0%, rgba(6,26,16,0.78) 40%, rgba(6,26,16,0.55) 100%)"
              : "var(--color-primary-800)",
          }}
        />
        <Container className="relative">
          <p className="font-body text-body-sm uppercase tracking-[0.18em] text-accent-500">
            Une question, un projet&nbsp;?
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-body-lg text-white/90">
            Notre équipe vous accompagne dans votre projet de rénovation énergétique :
            étude personnalisée, calcul d&apos;aides, mise en relation avec un artisan RGE.
          </p>
          <div className="mt-6">
            <TricolorBar />
          </div>
        </Container>
      </section>

      <Section>
        <Container className="max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr]">
            {/* Colonne gauche — coordonnées */}
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-primary-800 sm:text-3xl">
                  Nos coordonnées
                </h2>
                <p className="mt-2 text-text-muted">
                  Choisissez le canal qui vous convient — réponse garantie par un conseiller
                  réel, jamais un bot.
                </p>
              </div>

              <ul className="space-y-3">
                {COORDONNEES.map((c) => (
                  <li
                    key={c.label}
                    className="flex items-start gap-4 rounded-lg border border-border bg-surface p-5 shadow-sm transition hover:border-primary-300 hover:shadow-md"
                  >
                    <div
                      aria-hidden
                      className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary-50 text-primary-700"
                      style={{
                        clipPath:
                          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      }}
                    >
                      {c.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-body-sm font-semibold uppercase tracking-wide text-text-muted">
                        {c.label}
                      </p>
                      {c.href ? (
                        <a
                          href={c.href}
                          className="mt-1 block break-words font-display text-lg font-semibold text-primary-800 hover:text-primary-700"
                        >
                          {c.value}
                        </a>
                      ) : (
                        <p className="mt-1 font-display text-lg font-semibold text-primary-800">
                          {c.value}
                        </p>
                      )}
                      <p className="mt-1 text-body-sm text-text-muted">{c.helper}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Encart simulateur */}
              <div className="rounded-lg border border-accent-500/40 bg-accent-500/5 p-6">
                <p className="font-body text-body-sm uppercase tracking-[0.18em] text-accent-600">
                  Plus rapide
                </p>
                <h3 className="mt-2 font-display text-xl font-bold text-primary-800">
                  Estimez vos aides en 2 minutes
                </h3>
                <p className="mt-2 text-body-sm text-text-muted">
                  Notre simulateur calcule MaPrimeRénov&apos;, CEE et Éco-PTZ en fonction
                  de vos revenus et de vos travaux. Sans engagement.
                </p>
                <div className="mt-4">
                  <LinkButton href="/simulateur" variant="primary" size="md">
                    Lancer le simulateur
                  </LinkButton>
                </div>
              </div>
            </div>

            {/* Colonne droite — formulaire */}
            <div className="rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-2xl font-bold text-primary-800 sm:text-3xl">
                Écrivez-nous
              </h2>
              <p className="mt-2 text-text-muted">
                Décrivez votre projet en quelques lignes. Un conseiller vous recontacte
                sous 24h ouvrées.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>

              <p className="mt-6 text-body-sm text-text-muted">
                Vos données sont utilisées uniquement pour vous recontacter. Voir notre{" "}
                <a href="/confidentialite" className="text-primary-700 underline hover:text-primary-800">
                  politique de confidentialité
                </a>
                .
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
