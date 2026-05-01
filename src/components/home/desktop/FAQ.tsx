import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { TricolorAccent } from "@/components/brand/TricolorBar";

export function FAQ({ title, items }: { title: string; items: { q: string; a: string }[] }) {
  return (
    <Section tone="muted">
      <Container className="max-w-3xl">
        <div className="mb-8">
          <h2 className="text-display-md font-display">{title}</h2>
          <TricolorAccent className="mt-3" />
        </div>
        <ul className="space-y-3">
          {items.map((it, i) => (
            <li key={i}>
              <details className="group rounded-lg bg-surface border border-border p-5 open:border-primary-300 open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-display-sm font-display">
                  <span>{it.q}</span>
                  <span
                    aria-hidden
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-primary-700 transition-transform group-open:rotate-45"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-body text-text-muted">{it.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
