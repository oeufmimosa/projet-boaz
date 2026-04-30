import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";

export function KeyFigures({
  title,
  items,
}: {
  title: string;
  items: { value: string; label: string }[];
}) {
  return (
    <Section>
      <Container>
        <h2 className="mb-10 text-2xl font-bold sm:text-3xl">{title}</h2>
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {items.map((it, i) => (
            <li key={i} className="rounded border border-border bg-white p-6 text-center">
              <p className="text-3xl font-bold text-primary">{it.value}</p>
              <p className="mt-1 text-sm text-muted-fg">{it.label}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
