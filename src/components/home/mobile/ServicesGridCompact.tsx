import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { TricolorAccent } from "@/components/brand/TricolorBar";
import { HexIcon } from "@/components/brand/HexIcon";

/** Top services mobile : 6 maximum, ceux qui convertissent le plus. */
const TOP_SLUGS = [
  "isolation-combles",
  "pompe-a-chaleur-air-eau",
  "photovoltaique",
  "fenetres",
  "chaudiere",
  "audit-energetique",
] as const;

export function ServicesGridCompact({
  services,
}: {
  services: { slug: string; title: string }[];
}) {
  const map = new Map(services.map((s) => [s.slug, s]));
  const items = TOP_SLUGS.map((slug) => map.get(slug)).filter((x): x is { slug: string; title: string } => Boolean(x));

  return (
    <section className="bg-bg py-10">
      <Container>
        <h2 className="text-display-md font-display">Nos travaux</h2>
        <TricolorAccent className="mt-2" />

        <ul className="mt-6 grid grid-cols-2 gap-3">
          {items.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/travaux/${s.slug}`}
                className="flex h-full items-center gap-3 rounded-md border border-border bg-surface p-3"
              >
                <HexIcon tone="soft" size="sm">
                  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden>
                    <path d="M3 12 12 3l9 9v9h-7v-6H10v6H3z" />
                  </svg>
                </HexIcon>
                <p className="flex-1 text-body-sm font-semibold leading-tight">{s.title}</p>
                <span aria-hidden className="text-primary-700">→</span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/travaux"
          className="mt-4 inline-flex font-semibold text-primary-700 hover:text-primary-600"
        >
          Voir tous les travaux →
        </Link>
      </Container>
    </section>
  );
}
