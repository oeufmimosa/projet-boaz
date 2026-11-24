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
    images: [{ url: HERO_IMAGE, alt: "Ballons et circuit de chauffage hydraulique" }],
  },
};

const CHANTIER = {
  title:
    "Installation d’une pompe à chaleur Air/Eau de marque Atlantic en remplacement d’une chaudière fioul",
  photos: [
    {
      src: "/realisations/chantiers/pac-atlantic-local-technique.jpg",
      alt: "Pompe à chaleur Atlantic installée en local technique, avec ballon d’eau chaude sanitaire et vase d’expansion",
    },
    {
      src: "/realisations/chantiers/pac-atlantic-exterieur.jpg",
      alt: "Groupe extérieur Atlantic de la pompe à chaleur air/eau, posé au sol contre un mur en pierre",
    },
  ],
};

const GALLERY = [
  {
    src: "/realisations/chantiers/pac-air-eau-monobloc-r290.jpg",
    alt: "Pompe à chaleur Air/Eau monobloc haute température au R290, ballon d’eau chaude sanitaire et ballon tampon en local technique",
    title: "Pose d’une pompe à chaleur Air/Eau monobloc (haute température au R290) avec ballon d’eau chaude sanitaire",
    caption: "",
  },
  {
    src: "/realisations/chantiers/pac-monobloc-ht-ballon-ecs.jpg",
    alt: "Pompe à chaleur monobloc haute température et ballon d’eau chaude sanitaire 200 L en local technique",
    title: "Pose d’une pompe à chaleur monobloc haute température ainsi que d’un ballon d’eau chaude sanitaire 200 L",
    caption: "",
  },
  {
    src: HERO_IMAGE,
    alt: "Module intérieur de pompe à chaleur monobloc Thaleos et ballon d’eau chaude Atlantic",
    title: "Installation d’une pompe à chaleur française monobloc de la marque Thaleos Mont-Blanc",
    caption: "Installation d’une pompe à chaleur monobloc Thaleos au R290 ainsi que d’un ballon d’eau chaude Atlantic.",
  },
  {
    src: "/realisations/chantiers/pac-air-air-daikin.jpg",
    alt: "Unité intérieure murale Daikin Siesta et sa télécommande réglée à 23 °C",
    title: "Mise en place d’une pompe à chaleur Air/Air Daikin",
    caption: "",
  },
  {
    src: "/realisations/chantiers/thermostat-ambiance.jpg",
    alt: "Thermostat Honeywell Home devant un appareil de chauffage Chappée",
    title: "Thermostat programmable",
    caption: "Installation et réglage d’un thermostat programmable pour piloter le chauffage selon des plages horaires.",
  },
  {
    src: "/realisations/chantiers/chauffage-plafond-bas.jpg",
    alt: "Module de chauffage hydraulique, ballon et vase d’expansion",
    title: "Module de chauffage hydraulique",
    caption: "Installation d’un module de chauffage hydraulique et d’un ballon dédié à l’eau chaude sanitaire.",
  },

  {
    src: "/realisations/chantiers/pac-facade-brique.jpg",
    alt: "Groupe extérieur de pompe à chaleur Air/Eau installé contre une façade en brique",
    title: "Installation d’un groupe extérieur de pompe à chaleur Air/Eau",
    caption: "",
  },
  {
    src: "/realisations/chantiers/pac-exterieure-sur-plots.jpg",
    alt: "Unité extérieure de la pompe à chaleur Thomson Energy",
    title: "Pompe à chaleur air-eau Thomson",
    caption: "Installation d’une pompe à chaleur air-eau Thomson pour alimenter un circuit de chauffage hydraulique.",
  },
  {
    src: "/realisations/chantiers/pac-et-panneaux-solaires.jpg",
    alt: "Groupe extérieur anthracite de pompe à chaleur Air/Eau",
    title: "Pompe à chaleur Air/Eau groupe extérieur",
    caption: "",
  },
  {
    src: "/realisations/chantiers/ballon-espace-etroit.jpg",
    alt: "Pompe à chaleur monobloc Thaleos Mont-Blanc en remplacement d’une chaudière fioul",
    title: "Installation d’une pompe à chaleur monobloc Thaleos Mont-Blanc",
    caption: "Installation d’une pompe à chaleur monobloc au R290 en remplacement d’une chaudière fioul.",
  },
  {
    src: "/realisations/chantiers/circuit-hydraulique.jpg",
    alt: "Modules Watts, manomètres et tuyauteries isolées bleues",
    title: "Installation d’une pompe à chaleur Air/Eau avec kit bi-zone Universal Watts",
    caption: "",
  },
  {
    src: "/realisations/chantiers/eau-chaude-buanderie.jpg",
    alt: "Ballon d’eau chaude Atlantic et module intérieur de pompe à chaleur Chappée",
    title: "Pompe à chaleur air-eau et eau chaude sanitaire",
    caption: "Installation d’une pompe à chaleur air-eau Chappée et d’un ballon d’eau chaude sanitaire Atlantic.",
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
              {CHANTIER.title}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:gap-5">
              {CHANTIER.photos.map((photo) => (
                <figure
                  key={photo.src}
                  className="relative min-w-0 overflow-hidden rounded-lg border border-border bg-surface shadow-sm"
                >
                  <div className="relative aspect-[4/5] bg-primary-100">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 959px) 50vw, 440px"
                      className="object-cover"
                    />
                  </div>
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
                    {photo.caption ? (
                      <p className="mt-2 text-body-sm text-text-muted">{photo.caption}</p>
                    ) : null}
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
