"use client";

import { useState } from "react";

/**
 * Bandeau "Nos marques partenaires" avec défilement horizontal infini.
 *
 * Pour afficher le vrai logo officiel d'une marque :
 *   1. Récupère le SVG (ou PNG) depuis le press kit officiel de la marque.
 *   2. Dépose-le dans `public/brands/<slug>.svg` (préfère SVG : netteté à
 *      toute taille, poids minimal).
 *
 * Le composant tente l'image en premier ; si elle 404 (fichier absent),
 * il bascule automatiquement sur le wordmark stylisé en fallback. Tu peux
 * donc migrer marque par marque sans rien casser.
 *
 * Animation : translateX(-50%) sur la liste dupliquée → boucle parfaite.
 * Désactivée sous prefers-reduced-motion. Pause au survol/focus.
 */
type Brand = {
  display: string;
  slug: string;
  color: string;
  tracking?: string;
  weight?: number;
  /** Multiplicateur sur la taille du wordmark fallback (texte). */
  scale?: number;
  /** Multiplicateur sur la max-height du logo image (par défaut 40 px).
   *  Utile quand un logo a beaucoup de blanc autour et paraît plus petit. */
  imgScale?: number;
  /** Extension du fichier dans `public/brands/<slug>.<ext>`. Indique
   *  exactement quel fichier servir : évite la chaîne onError svg→png→webp
   *  qui peut rater. Si absent, on tente svg puis png puis webp. */
  ext?: "svg" | "png" | "webp" | "jpg";
};

const BRANDS: Brand[] = [
  { slug: "thaleos",     display: "Thaleos",     color: "#1a3c70", weight: 900, tracking: "-0.01em", imgScale: 1.7,     ext: "png" },
  { slug: "daikin",      display: "DAIKIN",      color: "#003D89", tracking: "0.06em",                                  ext: "png" },
  { slug: "mitsubishi",  display: "MITSUBISHI",  color: "#E60012", tracking: "0.04em", scale: 0.92,                     ext: "png" },
  { slug: "viessmann",   display: "VIESSMANN",   color: "#D31027", tracking: "0.04em", scale: 0.92,                     ext: "png" },
  { slug: "de-dietrich", display: "De Dietrich", color: "#1a1a1a", weight: 700, tracking: "-0.01em",                    ext: "png" },
  { slug: "atlantic",    display: "Atlantic",    color: "#0050A0", weight: 900, tracking: "-0.01em", imgScale: 1.55,    ext: "png" },
  { slug: "frisquet",    display: "FRISQUET",    color: "#003E80", tracking: "0.05em",               imgScale: 1.55,    ext: "png" },
  { slug: "ariston",     display: "ARISTON",     color: "#005CAB", tracking: "0.04em",               imgScale: 2.4,     ext: "webp" },
];

function BrandWordmark({ brand }: { brand: Brand }) {
  const fontSize = `${1.5 * (brand.scale ?? 1)}rem`;
  return (
    <span
      className="whitespace-nowrap font-display"
      style={{
        color: brand.color,
        fontWeight: brand.weight ?? 800,
        letterSpacing: brand.tracking,
        fontSize,
        lineHeight: 1,
      }}
    >
      {brand.display}
    </span>
  );
}

// Ordre de fallback si pas d'`ext` explicite sur la marque.
const FALLBACK_EXTENSIONS = ["png", "webp", "svg"] as const;

function BrandItem({ brand }: { brand: Brand }) {
  // Si l'extension est explicitement renseignée, on l'utilise direct.
  // Sinon on essaye png → webp → svg dans l'ordre via onError.
  const [fallbackIdx, setFallbackIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed) return <BrandWordmark brand={brand} />;

  const ext = brand.ext ?? FALLBACK_EXTENSIONS[fallbackIdx];
  const baseHeight = 40; // = max-h-10
  const maxHeight = baseHeight * (brand.imgScale ?? 1);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={ext}
      src={`/brands/${brand.slug}.${ext}`}
      alt={brand.display}
      className="w-auto object-contain"
      style={{ maxHeight: `${maxHeight}px` }}
      loading="lazy"
      onError={() => {
        // Si on a une `ext` explicite et qu'elle 404, c'est une vraie absence
        // de fichier → bascule directement en wordmark.
        if (brand.ext) {
          setFailed(true);
          return;
        }
        if (fallbackIdx + 1 < FALLBACK_EXTENSIONS.length) {
          setFallbackIdx(fallbackIdx + 1);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}

export function BrandsMarquee({ showHeading = true }: { showHeading?: boolean } = {}) {
  // Dupliquer la liste pour une boucle sans saut visible.
  const loop = [...BRANDS, ...BRANDS];

  return (
    <section className={showHeading ? "bg-bg py-12 sm:py-16" : "-mt-12 bg-bg pb-8 pt-0 sm:-mt-16 sm:pb-10"}>
      {showHeading && (
        <div className="mx-auto mb-8 max-w-3xl px-4 text-center sm:mb-10">
          <h2 className="font-display text-2xl font-bold text-primary-800 sm:text-3xl">
            Nos marques proposées
          </h2>
          <p className="mt-2 text-text-muted">
            Nous installons exclusivement des équipements de marques reconnues,
            garanties et certifiées par leurs constructeurs.
          </p>
        </div>
      )}

      <div className="brands-marquee group">
        <ul className="brands-marquee-track" aria-label="Marques partenaires">
          {loop.map((b, i) => (
            <li
              key={`${b.slug}-${i}`}
              className="brands-marquee-item"
              aria-hidden={i >= BRANDS.length}
            >
              <BrandItem brand={b} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
