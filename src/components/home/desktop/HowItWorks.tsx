import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { TricolorAccent } from "@/components/brand/TricolorBar";

export function HowItWorks({
  title,
  steps,
}: {
  title: string;
  steps: { title: string; description: string }[];
}) {
  return (
    <Section tone="muted" className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 hex-pattern opacity-50" />
      <Container className="relative">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-display-md font-display">{title}</h2>
          <TricolorAccent className="mt-3" />
        </div>
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {steps.map((s, i) => (
            <li key={i} className="relative rounded-lg bg-surface p-6 shadow-sm">
              <NumberedHex n={i + 1} />
              <h3 className="mt-4 font-display text-display-sm">{s.title}</h3>
              <p className="mt-2 text-body text-text-muted">{s.description}</p>

              {/* Connecteur en pointillés vers l'étape suivante (desktop) */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="hidden lg:block absolute right-[-22px] top-12 h-1 w-10 border-t-2 border-dashed border-primary-400"
                />
              )}
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

function NumberedHex({ n }: { n: number }) {
  return (
    <span className="relative inline-flex h-16 w-14 items-center justify-center">
      <svg viewBox="0 0 56 64" className="absolute inset-0 h-full w-full" aria-hidden>
        <path d="M28 2 52 16v32L28 62 4 48V16Z" fill="var(--color-primary-700)" />
      </svg>
      <span className="relative font-display text-display-sm text-accent-500">{n}</span>
    </span>
  );
}
