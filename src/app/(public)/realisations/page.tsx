import type { Metadata } from "next";
import Image from "next/image";
import { TricolorAccent } from "@/components/brand/TricolorBar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LinkButton } from "@/components/ui/Button";
import { Section } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

const TITLE = "Nos réalisations";
const DESCRIPTION =
  "Pompes à chaleur, ballons d’eau chaude et régulation du chauffage. Découvrez nos installations en photos.";
const HERO_IMAGE = "/realisations/chantiers/eau-chaude-local-technique.jpg";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/realisations" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/realisations",
    images: [{ url: HERO_IMAGE, alt: "Ballons et circuit de chauffage dans un local technique" }],
  },
};

const COMPARISON = [
  {
    label: "Avant",
    src: "/realisations/chantiers/chauffage-avant.jpg",
    alt: "Chaudière murale ouverte et vase d’expansion bleu dans la buanderie",
    caption: "Le chauffage du logement était assuré par la chaudière murale d’origine.",
    labelColor: "bg-primary-900 text-text-inverse",
  },
  {
    label: "Après",
    src: "/realisations/chantiers/chauffage-apres.jpg",
    alt: "Module mural blanc, ballon et vase d’expansion rouge dans la même buanderie",
    caption: "Modernisation du chauffage avec pose d’un nouveau module, raccordement du ballon et reprise du circuit existant.",
    labelColor: "bg-accent-500 text-primary-900",
  },
];

const GALLERY = [
  {
    src: "/realisations/chantiers/pac-facade-brique.jpg",
    alt: "Unité extérieure grise devant un mur de briques",
    title: "Chauffage par pompe à chaleur",
    caption: "Installation d’une pompe à chaleur pour le chauffage de la maison, avec intégration de l’unité extérieure sur la terrasse.",
  },
  {
    src: HERO_IMAGE,
    alt: "Ballon Atlantic et vase d’expansion rouge dans un local technique",
    title: "Chauffage et eau chaude sanitaire",
    caption: "Installation d’un ballon d’eau chaude sanitaire Atlantic et raccordement du circuit de chauffage.",
  },
  {
    src: "/realisations/chantiers/pac-exterieure-sur-plots.jpg",
    alt: "Unité Thomson sur plots et dalles au pied d’un mur blanc",
    title: "Raccordement d’une pompe à chaleur",
    caption: "Pose d’une pompe à chaleur avec raccordement électrique et passage des liaisons sous goulotte en façade.",
  },
  {
    src: "/realisations/chantiers/chauffage-plafond-bas.jpg",
    alt: "Ballon, module mural et tuyaux rouges et bleus sous une poutre basse",
    title: "Installation sous plafond bas",
    caption: "Intégration du chauffage et de la production d’eau chaude sanitaire dans un local à faible hauteur sous plafond.",
  },
  {
    src: "/realisations/chantiers/pac-et-panneaux-solaires.jpg",
    alt: "Groupe extérieur noir au pied d’un bâtiment équipé de panneaux solaires",
    title: "Pompe à chaleur et équipement solaire",
    caption: "Installation d’une pompe à chaleur pour chauffer une maison équipée de panneaux solaires.",
  },
  {
    src: "/realisations/chantiers/thermostat-ambiance.jpg",
    alt: "Thermostat Honeywell Home devant un appareil de chauffage Chappée",
    title: "Thermostat d’ambiance",
    caption: "Installation et réglage d’un thermostat programmable pour adapter le chauffage aux horaires du foyer.",
  },
  {
    src: "/realisations/chantiers/ballon-espace-etroit.jpg",
    alt: "Ballon blanc et vase d’expansion rouge au fond d’un local étroit",
    title: "Chauffage en espace réduit",
    caption: "Installation du circuit de chauffage dans un local étroit, avec des raccordements adaptés pour préserver le passage.",
  },
  {
    src: "/realisations/chantiers/circuit-hydraulique.jpg",
    alt: "Modules Watts, manomètres et tuyauteries isolées bleues",
    title: "Pompe à chaleur bi-zone",
    caption: "Installation d’une pompe à chaleur avec un kit bi-zone pour alimenter un plancher chauffant et des radiateurs.",
  },
  {
    src: "/realisations/chantiers/eau-chaude-buanderie.jpg",
    alt: "Ballon Atlantic sur support et module mural à côté d’un évier de buanderie",
    title: "Production d’eau chaude sanitaire",
    caption: "Pose et raccordement d’un ballon d’eau chaude sanitaire en buanderie, en complément de l’installation de chauffage.",
  },
];

export default function RealisationsPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: TITLE, href: "/realisations" },
        ]}
      />

      <section className="relative isolate overflow-hidden bg-primary-900 text-text-inverse">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[center_55%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(6, 26, 16, 0.96) 0%, rgba(6, 26, 16, 0.85) 45%, rgba(6, 26, 16, 0.48) 100%)",
          }}
        />
        <Container className="py-14 sm:py-20">
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            Nos <span className="text-accent-500">réalisations</span>
          </h1>
          <p className="mt-4 max-w-xl text-body-lg text-white/90">{DESCRIPTION}</p>
          <TricolorAccent className="mt-6" width={64} />
        </Container>
      </section>

      <Section className="bg-primary-50">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-3xl font-bold text-primary-800 sm:text-4xl">
              Un chauffage rénové, avant et après
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:gap-5">
              {COMPARISON.map((photo) => (
                <figure
                  key={photo.src}
                  className="relative min-w-0 overflow-hidden rounded-lg border border-border bg-surface shadow-sm"
                >
                  <div className="relative aspect-[3/4] bg-primary-100">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 959px) 50vw, 440px"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="p-3 text-body-sm text-text-muted sm:p-5 sm:text-body">
                    <span
                      className={`absolute left-2 top-2 rounded-full px-3 py-1 text-body-sm font-semibold shadow-sm sm:left-4 sm:top-4 ${photo.labelColor}`}
                    >
                      {photo.label}
                    </span>
                    {photo.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="font-display text-3xl font-bold text-primary-800 sm:text-4xl">
            Nos installations en images
          </h2>
          <ul className="mt-6 grid gap-5 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {GALLERY.map((photo) => (
              <li key={photo.src}>
                <figure className="h-full overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
                  <div className="relative aspect-[4/5] bg-primary-100">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 380px"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="p-5">
                    <h3 className="font-display text-lg font-bold text-primary-800">{photo.title}</h3>
                    <p className="mt-2 text-body-sm text-text-muted">{photo.caption}</p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="dark">
        <Container className="text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Vous avez un projet de rénovation ?
          </h2>
          <LinkButton href="/contact" variant="accent" size="lg" className="mt-6">
            Nous contacter
          </LinkButton>
        </Container>
      </Section>
    </>
  );
}
