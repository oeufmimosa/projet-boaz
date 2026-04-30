import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { Placeholder } from "@/components/ui/Placeholder";

export function Partners({ title, items }: { title: string; items: { name: string; logo?: string }[] }) {
  return (
    <Section>
      <Container>
        <h2 className="mb-8 text-2xl font-bold sm:text-3xl">{title}</h2>
        <ul className="grid grid-cols-2 items-center gap-6 sm:grid-cols-3 md:grid-cols-5">
          {items.map((p, i) => (
            <li key={i} className="flex h-20 items-center justify-center rounded border border-border bg-white p-3">
              <Placeholder label={p.name} ratio="3/1" className="border-0" />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
