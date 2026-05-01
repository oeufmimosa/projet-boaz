import { Container } from "@/components/ui/Container";

const ITEMS = [
  { value: "+50 000", label: "Chantiers réalisés" },
  { value: "1,2 Md€", label: "Aides obtenues" },
  { value: "9/10",    label: "Satisfaction client" },
  { value: "100 %",   label: "Artisans RGE" },
];

export function KeyFiguresCompact() {
  return (
    <section className="bg-bg py-8">
      <Container>
        <ul className="grid grid-cols-2 gap-3">
          {ITEMS.map((it, i) => (
            <li
              key={i}
              className="rounded-md border border-border bg-surface px-4 py-4 text-center"
            >
              <p className="font-display text-display-sm text-primary-700">{it.value}</p>
              <p className="mt-1 text-body-sm text-text-muted">{it.label}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
