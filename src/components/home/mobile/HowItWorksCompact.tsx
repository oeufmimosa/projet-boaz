import { Container } from "@/components/ui/Container";
import { TricolorAccent } from "@/components/brand/TricolorBar";

/** 3 étapes mobile (vs 4 desktop). */
const STEPS = [
  { title: "Vous simulez", description: "Quelques questions pour estimer vos aides." },
  { title: "On vous met en relation", description: "Avec un artisan RGE de votre région." },
  { title: "Vos travaux démarrent", description: "Suivi de A à Z, aides versées directement." },
];

export function HowItWorksCompact() {
  return (
    <section className="bg-surface-2 py-10">
      <Container>
        <h2 className="text-display-md font-display">Comment ça marche</h2>
        <TricolorAccent className="mt-2" />

        <ol className="mt-6 space-y-4">
          {STEPS.map((s, i) => (
            <li key={i} className="flex items-start gap-4 rounded-md bg-surface p-4">
              <span className="relative inline-flex h-12 w-11 shrink-0 items-center justify-center">
                <svg viewBox="0 0 56 64" className="absolute inset-0 h-full w-full" aria-hidden>
                  <path d="M28 2 52 16v32L28 62 4 48V16Z" fill="var(--color-primary-700)" />
                </svg>
                <span className="relative font-display font-bold text-accent-500">{i + 1}</span>
              </span>
              <div>
                <p className="font-display text-display-sm leading-tight">{s.title}</p>
                <p className="mt-1 text-body text-text-muted">{s.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
