import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { TricolorBar } from "@/components/brand/TricolorBar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SERVICES_LIST } from "@/lib/services";

export const metadata = {
  title: "Nos services de rénovation énergétique",
  description:
    "Pompe à chaleur, photovoltaïque, isolation thermique extérieure, ballon thermodynamique, CESI, SSC : 6 services et un accompagnement clé en main par des artisans RGE.",
  alternates: { canonical: "/services" },
};

export default function ServicesIndexPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: "Services", href: "/services" },
        ]}
      />
      <section className="bg-primary-800 py-16 text-text-inverse">
        <Container>
          <p className="font-body text-body-sm uppercase tracking-[0.18em] text-accent-500">
            Nos services
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
            Rénovation énergétique sur-mesure
          </h1>
          <p className="mt-4 max-w-2xl text-body-lg text-white/90">
            Six expertises complémentaires pour réduire votre consommation, gagner en confort
            et valoriser votre logement. Sélectionnez le service qui vous intéresse.
          </p>
          <div className="mt-6">
            <TricolorBar />
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES_LIST.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-border bg-surface p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary-300 hover:shadow-md"
                >
                  <div
                    aria-hidden
                    className="flex h-16 w-16 items-center justify-center bg-primary-50 text-3xl"
                    style={{
                      clipPath:
                        "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                  >
                    {s.icon}
                  </div>
                  <h2 className="mt-4 font-display text-xl font-semibold text-primary-800 group-hover:text-primary-700">
                    {s.label}
                  </h2>
                  <p className="mt-2 flex-1 text-body-sm text-text-muted">{s.short}</p>
                  <span className="mt-4 inline-flex items-center text-body-sm font-semibold text-primary-700">
                    En savoir plus →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
