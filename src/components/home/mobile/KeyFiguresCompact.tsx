import { Container } from "@/components/ui/Container";
import { PlaceholderValue, isPlaceholderValue } from "@/components/home/PlaceholderValue";

/**
 * Chiffres clés version mobile, version condensée.
 * ⚠️ Les valeurs `[X]` sont des placeholders bloquants : elles doivent
 * être remplacées par le client avant mise en production publique.
 * Cf. docs/content-review/home.md.
 */
const ITEMS = [
  { value: "[X]+",    label: "Chantiers réalisés" },
  { value: "[X] %",   label: "Clients satisfaits" },
  { value: "[X] ans", label: "D'expérience" },
  { value: "100 %",   label: "Artisans RGE" },
];

export function KeyFiguresCompact() {
  return (
    <section className="bg-bg py-8">
      <Container>
        <ul className="grid grid-cols-2 gap-3">
          {ITEMS.map((it, i) => {
            const isPh = isPlaceholderValue(it.value);
            return (
              <li
                key={i}
                data-content={isPh ? "placeholder" : undefined}
                className={`rounded-md border bg-surface px-4 py-4 text-center ${
                  isPh ? "border-accent-500/60 ring-1 ring-accent-500/40" : "border-border"
                }`}
              >
                <p className="font-display text-display-sm text-primary-700">
                  <PlaceholderValue value={it.value} />
                </p>
                <p className="mt-1 text-body-sm text-text-muted">{it.label}</p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
