import { Container } from "@/components/ui/Container";

const ITEMS = [
  { value: "37 ans", label: "D'expérience" },
  { value: "100 %",  label: "Étude personnalisée" },
  { value: "100 %",  label: "Équipements certifiés" },
  { value: "100 %",  label: "Intervention en France métropolitaine" },
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
              <p className="font-display text-display-sm text-primary-700">
                <span className="figure-pulse-mobile">{it.value}</span>
              </p>
              <p className="mt-1 text-body-sm text-text-muted">{it.label}</p>
            </li>
          ))}
        </ul>
        <style>{`
          @keyframes figure-pulse-mobile {
            0%, 100% { opacity: 1; }
            50%      { opacity: 0.55; }
          }
          .figure-pulse-mobile {
            animation: figure-pulse-mobile 1.6s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .figure-pulse-mobile { animation: none; }
          }
        `}</style>
      </Container>
    </section>
  );
}
