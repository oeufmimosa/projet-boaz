import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { TricolorAccent } from "@/components/brand/TricolorBar";

/**
 * Section "Certifications & partenaires" sur la home.
 * Liste fixe des 5 logos déposés dans public/partners/. Si tu veux ajouter
 * ou retirer un logo, modifie simplement le tableau ci-dessous.
 *
 * Le prop `items` est conservé pour compat de typage avec HomeDesktop mais
 * n'est plus utilisé — la liste est désormais en dur.
 */
/** Le champ `scale` permet d'agrandir un logo qui paraît plus petit que les
 *  autres (logos avec beaucoup de blanc autour comme MaPrimeRénov et CEE). */
const PARTNER_LOGOS: Array<{ src: string; alt: string; scale?: number }> = [
  { src: "/partners/certif-1.png",  alt: "Certification partenaire 1" },
  { src: "/partners/certif-2.png",  alt: "Certification partenaire 2" },
  { src: "/partners/certif-3.png",  alt: "Certification partenaire 3" },
  { src: "/partners/certif-4.png",  alt: "MaPrimeRénov'", scale: 1.45 },
  { src: "/partners/certif-5.webp", alt: "Certificats d'Économie d'Énergie (CEE)", scale: 1.45 },
];

export function Partners({ title }: { title: string; items?: { name: string }[] }) {
  return (
    <Section>
      <Container>
        <div className="mb-8 max-w-2xl">
          <h2 className="text-display-md font-display">{title}</h2>
          <TricolorAccent className="mt-3" />
          <p className="mt-3 text-body text-text-muted">
            Certaines aides et dispositifs dépendent des critères d&apos;éligibilité et des qualifications
            applicables aux travaux réalisés.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-6">
          {PARTNER_LOGOS.map((p) => (
            <li
              key={p.src}
              className="flex h-24 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface p-4 transition hover:border-primary-300 hover:shadow-sm sm:h-28"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.alt}
                className="max-h-full max-w-full object-contain"
                style={p.scale ? { transform: `scale(${p.scale})` } : undefined}
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
