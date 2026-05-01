import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { TricolorAccent } from "@/components/brand/TricolorBar";

export function KeyFigures({
  title,
  items,
}: {
  title: string;
  items: { value: string; label: string }[];
}) {
  return (
    <Section tone="dark" className="text-text-inverse">
      <Container>
        <div className="mb-10 max-w-2xl">
          <h2 className="text-display-md font-display text-text-inverse">{title}</h2>
          <TricolorAccent className="mt-3" />
        </div>
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {items.map((it, i) => (
            <li key={i} className="rounded-lg border border-primary-700 bg-primary-800 p-6 text-center">
              <p className="font-display text-display-lg text-accent-500">{it.value}</p>
              <TricolorAccent className="mx-auto mt-2" width={28} height={2} />
              <p className="mt-3 text-body-sm text-primary-200">{it.label}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
