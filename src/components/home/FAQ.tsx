import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";

export function FAQ({ title, items }: { title: string; items: { q: string; a: string }[] }) {
  return (
    <Section className="bg-muted/30">
      <Container className="max-w-3xl">
        <h2 className="mb-8 text-2xl font-bold sm:text-3xl">{title}</h2>
        <ul className="space-y-3">
          {items.map((it, i) => (
            <li key={i}>
              <details className="group rounded border border-border bg-white p-4">
                <summary className="cursor-pointer list-none text-base font-medium flex items-center justify-between">
                  <span>{it.q}</span>
                  <span className="text-muted-fg group-open:rotate-180 transition" aria-hidden>▾</span>
                </summary>
                <p className="mt-3 text-sm text-muted-fg">{it.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
