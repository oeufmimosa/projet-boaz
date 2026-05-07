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
};

const BRANDS: Brand[] = [
  { slug: "enphase",     display: "ENPHASE",     color: "#F36F21", tracking: "0.06em" },
  { slug: "recom",       display: "RECOM",       color: "#111111", tracking: "0.10em" },
  { slug: "siemens",     display: "SIEMENS",     color: "#009999", tracking: "0.04em", imgScale: 1.45 },
  { slug: "thaleos",     display: "Thaleos",     color: "#1a3c70", weight: 900, tracking: "-0.01em", imgScale: 1.45 },
  { slug: "daikin",      display: "DAIKIN",      color: "#003D89", tracking: "0.06em" },
  { slug: "mitsubishi",  display: "MITSUBISHI",  color: "#E60012", tracking: "0.04em", scale: 0.92 },
  { slug: "viessmann",   display: "VIESSMANN",   color: "#D31027", tracking: "0.04em", scale: 0.92 },
  { slug: "de-dietrich", display: "De Dietrich", color: "#1a1a1a", weight: 700, tracking: "-0.01em" },
  { slug: "sma",         display: "SMA",         color: "#003B71", tracking: "0.10em", weight: 900, scale: 1.1 },
  { slug: "solaredge",   display: "SolarEdge",   color: "#E52821", weight: 800 },
  { slug: "isover",      display: "ISOVER",      color: "#003E80", tracking: "0.05em" },
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

// Extensions testées dans cet ordre. Quand une 404, on passe à la suivante.
const EXTENSIONS = ["svg", "png", "webp"] as const;

function BrandItem({ brand }: { brand: Brand }) {
  const [extIdx, setExtIdx] = useState(0);
  const [allFailed, setAllFailed] = useState(false);

  if (allFailed) return <BrandWordmark brand={brand} />;

  const ext = EXTENSIONS[extIdx];
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
        if (extIdx + 1 < EXTENSIONS.length) {
          setExtIdx(extIdx + 1);
        } else {
          setAllFailed(true);
        }
      }}
    />
  );
}

export function BrandsMarquee() {
  // Dupliquer la liste pour une boucle sans saut visible.
  const loop = [...BRANDS, ...BRANDS];

  return (
    <section className="bg-bg py-12 sm:py-16">
      <div className="mx-auto mb-8 max-w-3xl px-4 text-center sm:mb-10">
        <h2 className="font-display text-2xl font-bold text-primary-800 sm:text-3xl">
          Nos marques partenaires
        </h2>
        <p className="mt-2 text-text-muted">
          Nous installons exclusivement des équipements de marques reconnues,
          garanties et certifiées par leurs constructeurs.
        </p>
      </div>

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
