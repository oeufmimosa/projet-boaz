import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { TricolorBar } from "@/components/brand/TricolorBar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ServicesGridInteractive } from "@/components/home/ServicesGridInteractive";

export const metadata = {
  title: "Nos services",
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
          { label: "Nos services", href: "/services" },
        ]}
      />
      <section className="relative isolate flex min-h-[420px] items-center overflow-hidden bg-primary-800 py-16 text-text-inverse sm:min-h-[540px]">
        <Image
          src="/services/hero.jpg"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(6,26,16,0.92) 0%, rgba(6,26,16,0.78) 40%, rgba(6,26,16,0.55) 100%)",
          }}
        />
        <Container className="relative">
          <p className="font-body text-body-sm uppercase tracking-[0.18em] text-accent-500">
            Rénovation énergétique
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
            Nos services
          </h1>
          <p className="mt-4 max-w-2xl text-body-lg text-white/90">
            Six expertises complémentaires pour réduire votre consommation, gagner en confort
            et valoriser votre logement. Survolez une carte pour voir le détail.
          </p>
          <div className="mt-6">
            <TricolorBar />
          </div>
        </Container>
      </section>

      <ServicesGridInteractive showHeader={false} showCta={false} />
    </>
  );
}
