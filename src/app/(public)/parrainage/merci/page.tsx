import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { TricolorBar } from "@/components/brand/TricolorBar";
import { LinkButton } from "@/components/ui/Button";

export const metadata = {
  title: "Merci pour votre parrainage",
  robots: { index: false, follow: false },
};

const TIMELINE = [
  {
    title: "Filleul contacté",
    body: "Notre équipe prend contact avec votre filleul sous 48 h pour évaluer son projet.",
    when: "Sous 48 h",
  },
  {
    title: "Projet validé",
    body: "Si le projet est éligible, nous mettons votre filleul en relation avec un installateur RGE partenaire.",
    when: "Selon le projet",
  },
  {
    title: "Prime versée",
    body: "Une fois les travaux réalisés, votre prime de jusqu'à 1 000 € est versée dans les 30 jours.",
    when: "30 jours max",
  },
];

export default function ParrainageMerciPage() {
  return (
    <Section>
      <Container className="max-w-3xl text-center">
        <div
          aria-hidden
          className="mx-auto flex h-20 w-20 items-center justify-center bg-accent-500 text-3xl text-primary-900"
          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
        >
          ✓
        </div>
        <h1 className="mt-6 font-display text-4xl font-extrabold text-primary-800 sm:text-5xl">
          Merci pour votre confiance&nbsp;!
        </h1>
        <p className="mt-4 text-body-lg text-text-muted">
          Votre parrainage a bien été enregistré. Vous recevez une confirmation par email.
        </p>
        <div className="mt-6 flex justify-center">
          <TricolorBar />
        </div>

        <ol className="mt-12 grid gap-4 text-left">
          {TIMELINE.map((step, i) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-lg border border-border bg-surface p-5 shadow-sm"
            >
              <div
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary-700 font-display font-bold text-white"
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
              >
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-display text-lg font-semibold text-primary-800">{step.title}</h2>
                  <span className="text-body-sm font-semibold text-accent-600">{step.when}</span>
                </div>
                <p className="mt-1 text-body-sm text-text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <LinkButton href="/" variant="primary">
            Retour à l'accueil
          </LinkButton>
          <Link
            href="/parrainage"
            className="inline-flex h-11 items-center px-5 font-display font-semibold text-primary-700 underline-offset-4 hover:underline"
          >
            Parrainer un autre proche
          </Link>
        </div>
      </Container>
    </Section>
  );
}
