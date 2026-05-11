import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

type PillarIconName = "search" | "gear" | "wrench" | "refresh";

const PILLARS: Array<{ iconName: PillarIconName; title: string; body: string }> = [
  { iconName: "search",  title: "Étude personnalisée",   body: "Analyse de votre logement et de vos besoins." },
  { iconName: "gear",    title: "Solutions performantes", body: "Matériel certifié et technologies de pointe." },
  { iconName: "wrench",  title: "Installation soignée",   body: "Par nos partenaires installateurs RGE agréés." },
  { iconName: "refresh", title: "Suivi & entretien",      body: "Maintenance et accompagnement long terme." },
];

function PillarIcon({ name }: { name: PillarIconName }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case "gear":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case "wrench":
      return (
        <svg {...common}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case "refresh":
      return (
        <svg {...common}>
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M8 16H3v5" />
        </svg>
      );
  }
}

/**
 * Section "Notre expertise" condensée — version courte des 4 piliers
 * de la page /qui-sommes-nous. Utilisée sur la home, après les services.
 */
export function ExpertiseSection() {
  return (
    <Section tone="muted">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-body text-body-sm uppercase tracking-[0.18em] text-accent-600">
            Notre expertise
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-primary-800 sm:text-4xl">
            Une équipe à votre service
          </h2>
          <p className="mt-3 text-text-muted">
            Quatre piliers qui structurent chacun de nos chantiers.
          </p>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <li
              key={p.title}
              className="rounded-lg border border-border bg-surface p-5 text-center shadow-sm"
            >
              <div
                aria-hidden
                className="mx-auto flex h-14 w-14 items-center justify-center bg-primary-50 text-primary-700"
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
              >
                <PillarIcon name={p.iconName} />
              </div>
              <h3 className="mt-3 font-display font-semibold text-primary-800">{p.title}</h3>
              <p className="mt-1 text-body-sm text-text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <LinkButton href="/qui-sommes-nous" variant="outline" size="lg">
            En savoir plus sur nous
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}
