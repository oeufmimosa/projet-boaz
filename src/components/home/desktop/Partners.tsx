import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { TricolorAccent } from "@/components/brand/TricolorBar";

export function Partners({ title, items }: { title: string; items: { name: string }[] }) {
  return (
    <Section>
      <Container>
        <div className="mb-8 max-w-2xl">
          <h2 className="text-display-md font-display">{title}</h2>
          <TricolorAccent className="mt-3" />
        </div>
        <ul className="grid grid-cols-3 gap-3 md:grid-cols-5">
          {items.map((p, i) => (
            <li key={i} className="flex h-20 items-center justify-center rounded-md border border-border bg-surface px-3 text-body-sm font-semibold text-text-muted">
              {p.name}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
