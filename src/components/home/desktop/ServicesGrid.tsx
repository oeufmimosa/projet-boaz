import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { HexIcon } from "@/components/brand/HexIcon";
import { TricolorAccent } from "@/components/brand/TricolorBar";

const ICONS: Record<string, React.ReactNode> = {
  default: (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden>
      <path d="M3 12 12 3l9 9v9h-7v-6H10v6H3z" />
    </svg>
  ),
  "isolation-combles": (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden>
      <path d="M2 11 12 4l10 7v2H2zM4 14h16v6H4z" />
    </svg>
  ),
  "pompe-a-chaleur-air-eau": (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden>
      <path d="M12 2a4 4 0 0 0-3.5 5.95L4 12l4.5 4.05A4 4 0 1 0 12 22a4 4 0 0 0 3.5-5.95L20 12l-4.5-4.05A4 4 0 0 0 12 2z" />
    </svg>
  ),
  photovoltaique: (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden>
      <path d="M12 2v3M5 5l2 2M2 12h3M19 5l-2 2M22 12h-3M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21h16v-2H4z" stroke="currentColor" strokeWidth="0" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  fenetres: (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden>
      <path d="M4 3h16v18H4zM4 12h16M12 3v18" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
};

function iconFor(slug: string) {
  return ICONS[slug] ?? ICONS.default;
}

export function ServicesGrid({
  title,
  subtitle,
  services,
}: {
  title: string;
  subtitle: string;
  services: { slug: string; title: string; short: string }[];
}) {
  return (
    <Section>
      <Container>
        <div className="mb-10 max-w-2xl">
          <h2 className="text-display-md font-display">{title}</h2>
          <TricolorAccent className="mt-3" />
          <p className="mt-4 text-body-lg text-text-muted">{subtitle}</p>
        </div>
        <ul className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group flex h-full flex-col gap-4 rounded-lg border border-border bg-surface p-5 transition duration-150 hover:-translate-y-1 hover:shadow-md hover:border-primary-300"
              >
                <HexIcon tone="soft" size="md">{iconFor(s.slug)}</HexIcon>
                <div>
                  <h3 className="font-display text-display-sm">{s.title}</h3>
                  <p className="mt-1 text-body-sm text-text-muted line-clamp-2">{s.short}</p>
                </div>
                <span className="mt-auto text-body-sm font-semibold text-primary-700 transition-colors group-hover:text-primary-600">
                  En savoir plus →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
