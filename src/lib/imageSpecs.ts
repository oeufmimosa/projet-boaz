/**
 * Référentiel central des spécifications d'images du site.
 * Chaque <EditableImage imageKey="..."> lit ses contraintes depuis ce fichier.
 *
 * Les clés peuvent contenir des placeholders {slug} ou {id} ; utiliser
 * `resolveSpec(key, params)` pour récupérer la spec finale.
 *
 * Phase 1 : initial subset (brand + home.hero). Sera étendu au fil des pages.
 */

export type ImageFormat = "jpg" | "png" | "webp" | "svg";
export type RenderShape = "rect" | "rounded" | "hexagon" | "circle";

export interface ImageSpec {
  key: string;
  label: string;
  description: string;
  width: number;
  height: number;
  /** Tolérance ratio en proportion (0.2 = ±20% sur chaque dimension). Défaut 0.2. */
  ratioTolerance?: number;
  acceptedFormats: ImageFormat[];
  /** Poids max en kilooctets. */
  maxSizeKb: number;
  /** Forme de rendu pour l'aperçu réaliste dans la modale. */
  renderShape?: RenderShape;
  /** Page ou section où l'image apparaît (purement informatif). */
  context: string;
}

const DEFAULT_TOLERANCE = 0.2;

export const imageSpecs: Record<string, ImageSpec> = {
  // ── Identité de marque ───────────────────────────────────────────────────
  "brand.logo.color": {
    key: "brand.logo.color",
    label: "Logo couleur (carré 1:1)",
    description: "Logo officiel — disque bleu marine + maison + feuille verte + accent tricolore. Format carré.",
    width: 1200, height: 1200,
    acceptedFormats: ["svg", "png"],
    maxSizeKb: 200,
    renderShape: "circle",
    context: "header public + admin (fond clair)",
  },
  "brand.logo.white": {
    key: "brand.logo.white",
    label: "Logo blanc (carré 1:1)",
    description: "Variante monochrome blanche pour fonds verts foncés.",
    width: 1200, height: 1200,
    acceptedFormats: ["svg", "png"],
    maxSizeKb: 200,
    renderShape: "circle",
    context: "footer + drawer mobile + sidebar admin",
  },
  "brand.logo.dark": {
    key: "brand.logo.dark",
    label: "Logo monochrome marine (carré 1:1)",
    description: "Variante monochrome bleu marine pour fonds clairs ou impressions.",
    width: 1200, height: 1200,
    acceptedFormats: ["svg", "png"],
    maxSizeKb: 200,
    renderShape: "circle",
    context: "fonds clairs / impressions",
  },
  "brand.logo.mark": {
    key: "brand.logo.mark",
    label: "Symbole seul (carré 1:1)",
    description: "Le disque + maison sans wordmark, pour FAB chatbox, favicon, OG image.",
    width: 512, height: 512,
    acceptedFormats: ["svg", "png"],
    maxSizeKb: 100,
    renderShape: "circle",
    context: "favicon / FAB chatbox / partage",
  },
  "brand.favicon": {
    key: "brand.favicon",
    label: "Favicon",
    description: "Icône onglet navigateur, format carré.",
    width: 512, height: 512,
    acceptedFormats: ["png", "svg"],
    maxSizeKb: 200,
    renderShape: "rounded",
    context: "onglet navigateur / app icon",
  },
  "brand.og": {
    key: "brand.og",
    label: "Image de partage social (OG)",
    description: "Image affichée lors du partage sur les réseaux sociaux et applications.",
    width: 1200, height: 630,
    acceptedFormats: ["jpg", "png", "webp"],
    maxSizeKb: 500,
    renderShape: "rect",
    context: "partage Facebook / LinkedIn / Twitter",
  },

  // ── Home — Hero ──────────────────────────────────────────────────────────
  "home.hero.image": {
    key: "home.hero.image",
    label: "Visuel principal du hero",
    description: "Image décorative à droite du hero desktop. Affichée en placeholder hexagonal si absente.",
    width: 1200, height: 900,
    acceptedFormats: ["jpg", "png", "webp", "svg"],
    maxSizeKb: 2000,
    renderShape: "rect",
    context: "page d'accueil (desktop)",
  },

  // ── Home — Section parrainage ─────────────────────────────────────────────
  "home.parrainage.image": {
    key: "home.parrainage.image",
    label: "Visuel section parrainage (home)",
    description: "Image illustrative du bandeau parrainage sur la home (poignée de main / proche).",
    width: 1200, height: 800,
    acceptedFormats: ["jpg", "webp"],
    maxSizeKb: 1500,
    renderShape: "rect",
    context: "section parrainage de la home",
  },

  // ── Page Parrainage ──────────────────────────────────────────────────────
  "parrainage.hero": {
    key: "parrainage.hero",
    label: "Hero page parrainage",
    description: "Image de fond du hero de /parrainage (handshake devant pompe à chaleur).",
    width: 1500, height: 1000,
    acceptedFormats: ["jpg", "webp"],
    maxSizeKb: 2000,
    renderShape: "rect",
    context: "hero /parrainage",
  },
  "parrainage.form.image": {
    key: "parrainage.form.image",
    label: "Visuel formulaire parrainage",
    description: "Image affichée à droite du formulaire de parrainage (même carte). Format paysage 3:2.",
    width: 1500, height: 1000,
    acceptedFormats: ["jpg", "webp"],
    maxSizeKb: 1500,
    renderShape: "rect",
    context: "/parrainage — section formulaire",
  },

  // ── Home — Cards services interactives (6) ────────────────────────────────
  "home.services.cards.pompe-a-chaleur.image": {
    key: "home.services.cards.pompe-a-chaleur.image",
    label: "Photo card service home — PAC",
    description: "Photo de la card Pompe à chaleur sur la home (grille 6 services).",
    width: 1200, height: 900,
    acceptedFormats: ["jpg", "webp"],
    maxSizeKb: 250,
    renderShape: "rect",
    context: "home / cards services / PAC",
  },
  "home.services.cards.panneau-photovoltaique.image": {
    key: "home.services.cards.panneau-photovoltaique.image",
    label: "Photo card service home — Photovoltaïque",
    description: "Photo de la card Panneau photovoltaïque sur la home.",
    width: 1200, height: 900,
    acceptedFormats: ["jpg", "webp"],
    maxSizeKb: 250,
    renderShape: "rect",
    context: "home / cards services / PV",
  },
  "home.services.cards.isolation-thermique-exterieure.image": {
    key: "home.services.cards.isolation-thermique-exterieure.image",
    label: "Photo card service home — ITE",
    description: "Photo de la card Isolation thermique extérieure sur la home.",
    width: 1200, height: 900,
    acceptedFormats: ["jpg", "webp"],
    maxSizeKb: 250,
    renderShape: "rect",
    context: "home / cards services / ITE",
  },
  "home.services.cards.chauffe-eau-solaire-individuel.image": {
    key: "home.services.cards.chauffe-eau-solaire-individuel.image",
    label: "Photo card service home — CESI",
    description: "Photo de la card Chauffe-eau solaire individuel sur la home.",
    width: 1200, height: 900,
    acceptedFormats: ["jpg", "webp"],
    maxSizeKb: 250,
    renderShape: "rect",
    context: "home / cards services / CESI",
  },
  "home.services.cards.ballon-thermodynamique.image": {
    key: "home.services.cards.ballon-thermodynamique.image",
    label: "Photo card service home — Ballon thermodynamique",
    description: "Photo de la card Ballon thermodynamique sur la home.",
    width: 1200, height: 900,
    acceptedFormats: ["jpg", "webp"],
    maxSizeKb: 250,
    renderShape: "rect",
    context: "home / cards services / ballon thermo",
  },
  "home.services.cards.systeme-solaire-combine.image": {
    key: "home.services.cards.systeme-solaire-combine.image",
    label: "Photo card service home — SSC",
    description: "Photo de la card Système solaire combiné sur la home.",
    width: 1200, height: 900,
    acceptedFormats: ["jpg", "webp"],
    maxSizeKb: 250,
    renderShape: "rect",
    context: "home / cards services / SSC",
  },

  // ── Page Réalisations ────────────────────────────────────────────────────
  "realisations.hero": {
    key: "realisations.hero",
    label: "Hero page Réalisations",
    description: "Image de fond du hero de /realisations (chantier en cours, équipe RGE).",
    width: 1500, height: 900,
    acceptedFormats: ["jpg", "webp"],
    maxSizeKb: 2000,
    renderShape: "rect",
    context: "hero /realisations",
  },

  // ── Page Qui sommes-nous / Expertise ─────────────────────────────────────
  "expertise.hero": {
    key: "expertise.hero",
    label: "Hero page Qui sommes-nous",
    description: "Image de fond du hero de /qui-sommes-nous (artisan en veste brandée).",
    width: 1500, height: 1000,
    acceptedFormats: ["jpg", "webp"],
    maxSizeKb: 2000,
    renderShape: "rect",
    context: "hero /qui-sommes-nous",
  },
  "expertise.team.photo": {
    key: "expertise.team.photo",
    label: "Photo équipe",
    description: "Photo d'illustration du bloc 'Notre histoire' sur /qui-sommes-nous.",
    width: 1200, height: 800,
    acceptedFormats: ["jpg", "webp"],
    maxSizeKb: 1500,
    renderShape: "rect",
    context: "/qui-sommes-nous — section histoire",
  },
  "expertise.pillar1.icon": {
    key: "expertise.pillar1.icon",
    label: "Pictogramme pilier 1",
    description: "Icône hexagonale du premier pilier d'expertise.",
    width: 96, height: 96,
    acceptedFormats: ["svg", "png"],
    maxSizeKb: 50,
    renderShape: "hexagon",
    context: "/qui-sommes-nous — pilier 1",
  },
  "expertise.pillar2.icon": {
    key: "expertise.pillar2.icon",
    label: "Pictogramme pilier 2",
    description: "Icône hexagonale du second pilier d'expertise.",
    width: 96, height: 96,
    acceptedFormats: ["svg", "png"],
    maxSizeKb: 50,
    renderShape: "hexagon",
    context: "/qui-sommes-nous — pilier 2",
  },
  "expertise.pillar3.icon": {
    key: "expertise.pillar3.icon",
    label: "Pictogramme pilier 3",
    description: "Icône hexagonale du troisième pilier d'expertise.",
    width: 96, height: 96,
    acceptedFormats: ["svg", "png"],
    maxSizeKb: 50,
    renderShape: "hexagon",
    context: "/qui-sommes-nous — pilier 3",
  },
  "expertise.pillar4.icon": {
    key: "expertise.pillar4.icon",
    label: "Pictogramme pilier 4",
    description: "Icône hexagonale du quatrième pilier d'expertise.",
    width: 96, height: 96,
    acceptedFormats: ["svg", "png"],
    maxSizeKb: 50,
    renderShape: "hexagon",
    context: "/qui-sommes-nous — pilier 4",
  },

  // ── Services — héros par slug (template) ──────────────────────────────────
  "services.{slug}.hero": {
    key: "services.{slug}.hero",
    label: "Hero page service",
    description: "Visuel du hero d'une page /services/[slug].",
    width: 1500, height: 900,
    acceptedFormats: ["jpg", "webp"],
    maxSizeKb: 1800,
    renderShape: "rect",
    context: "hero /services/[slug]",
  },

  // ── Home — Image de fond hero (avec overlay dégradé vert foncé) ───────────
  "home.hero.background": {
    key: "home.hero.background",
    label: "Image de fond hero (desktop)",
    description: "Image de fond du hero de la home (desktop / tablette). Overlay dégradé vert foncé appliqué pour conserver la lisibilité du texte blanc.",
    width: 2880, height: 1620,
    acceptedFormats: ["jpg", "webp"],
    maxSizeKb: 400,
    renderShape: "rect",
    context: "fond hero home desktop",
  },
  "home.hero.background.mobile": {
    key: "home.hero.background.mobile",
    label: "Image de fond hero (mobile, portrait)",
    description: "Variante portrait pour le hero mobile. Optionnelle : si non fournie, fond uni vert foncé + motif hexagonal.",
    width: 1080, height: 1920,
    acceptedFormats: ["jpg", "webp"],
    maxSizeKb: 250,
    renderShape: "rect",
    context: "fond hero home mobile (portrait)",
  },
  // Poster vidéo = dernière frame de hero-background.mp4. Affiché tant que
  // la vidéo n'a pas chargé, et dans tous les cas où on ne joue pas la
  // vidéo (reduced-motion, saveData, déjà jouée dans la session). Généré
  // via `bash scripts/generate-poster.sh` après chaque ré-encodage vidéo.
  "home.hero.background.video.poster": {
    key: "home.hero.background.video.poster",
    label: "Poster vidéo hero (= dernière frame)",
    description: "Image fixe affichée à la place de la vidéo (chargement, reduced-motion, déjà-jouée). Doit être identique à la dernière frame pour une transition invisible.",
    width: 1920, height: 1080,
    acceptedFormats: ["jpg", "webp"],
    maxSizeKb: 250,
    renderShape: "rect",
    context: "poster vidéo hero home desktop",
  },
  "home.hero.background.video.poster.mobile": {
    key: "home.hero.background.video.poster.mobile",
    label: "Poster vidéo hero (mobile, portrait)",
    description: "Variante portrait du poster vidéo pour mobile.",
    width: 1080, height: 1920,
    acceptedFormats: ["jpg", "webp"],
    maxSizeKb: 200,
    renderShape: "rect",
    context: "poster vidéo hero home mobile (portrait)",
  },

  // ── Articles de blog — covers et images inline (templates) ────────────────
  "article.cover.{slug}": {
    key: "article.cover.{slug}",
    label: "Cover article (1600×900)",
    description: "Cover image affichée en haut d'un article de blog et en partage social (OG).",
    width: 1600, height: 900,
    acceptedFormats: ["jpg", "webp"],
    maxSizeKb: 250,
    renderShape: "rect",
    context: "cover /blog/[slug]",
  },
  "article.inline.{slug}.{index}": {
    key: "article.inline.{slug}.{index}",
    label: "Image inline article (1200×800)",
    description: "Image insérée entre les sections H2 d'un article via un token `{{img:N}}` dans le markdown.",
    width: 1200, height: 800,
    acceptedFormats: ["jpg", "webp"],
    maxSizeKb: 200,
    renderShape: "rect",
    context: "image inline dans un article",
  },
};

/**
 * Résout une clé (avec ou sans placeholders) en ImageSpec concret.
 * Ex: resolveSpec("travaux.{slug}.hero", { slug: "isolation-combles" })
 */
export function resolveSpec(
  rawKey: string,
  params?: Record<string, string>,
): ImageSpec | null {
  let key = rawKey;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      key = key.replaceAll(`{${k}}`, v);
    }
  }
  // Recherche directe
  if (imageSpecs[key]) return imageSpecs[key];
  // Recherche par template (rawKey contient {})
  if (rawKey.includes("{")) {
    const tplMatch = imageSpecs[rawKey];
    if (tplMatch) return { ...tplMatch, key };
  }
  return null;
}

export function getRatioTolerance(spec: ImageSpec): number {
  return spec.ratioTolerance ?? DEFAULT_TOLERANCE;
}

/**
 * Vérifie si les dimensions données respectent la spec (tolérance incluse).
 * Renvoie un objet diagnostic.
 */
export function checkDimensions(
  spec: ImageSpec,
  width: number,
  height: number,
): { ok: boolean; ratioOk: boolean; sizeOk: boolean; message?: string } {
  const tolerance = getRatioTolerance(spec);
  const targetRatio = spec.width / spec.height;
  const actualRatio = width / height;
  const ratioDiff = Math.abs(actualRatio - targetRatio) / targetRatio;
  const ratioOk = ratioDiff <= tolerance;

  const widthDiff = Math.abs(width - spec.width) / spec.width;
  const heightDiff = Math.abs(height - spec.height) / spec.height;
  const sizeOk = widthDiff <= tolerance && heightDiff <= tolerance;

  if (!ratioOk) {
    return { ok: false, ratioOk, sizeOk, message: `Ratio attendu ${spec.width}:${spec.height} (±${Math.round(tolerance * 100)}%) — ratio fourni : ${actualRatio.toFixed(2)}` };
  }
  if (!sizeOk) {
    return { ok: false, ratioOk, sizeOk, message: `Dimensions hors tolérance : ${width}×${height}px (attendu ${spec.width}×${spec.height}px ±${Math.round(tolerance * 100)}%)` };
  }
  return { ok: true, ratioOk, sizeOk };
}
