import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

const PILLARS = [
  { icon: "🔍", title: "Étude personnalisée", body: "Analyse de votre logement et de vos besoins." },
  { icon: "⚙️", title: "Solutions performantes", body: "Matériel certifié et technologies de pointe." },
  { icon: "🛠️", title: "Installation soignée", body: "Par nos partenaires installateurs RGE agréés." },
  { icon: "🔄", title: "Suivi & entretien", body: "Maintenance et accompagnement long terme." },
];

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
                className="mx-auto flex h-14 w-14 items-center justify-center bg-primary-50 text-2xl"
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
              >
                {p.icon}
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
