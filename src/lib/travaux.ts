/**
 * Liste canonique des catégories de travaux. Sert d'arborescence d'URL
 * stable et de source de vérité pour les pages /travaux/[slug].
 * Le titre/short/description vivent en base via Content (clés `travaux.<slug>.*`).
 */
export const TRAVAUX_LIST = [
  { slug: "isolation-combles", title: "Isolation des combles" },
  { slug: "isolation-murs", title: "Isolation des murs" },
  { slug: "isolation-sols", title: "Isolation des sols" },
  { slug: "pompe-a-chaleur-air-eau", title: "Pompe à chaleur air/eau" },
  { slug: "pompe-a-chaleur-air-air", title: "Pompe à chaleur air/air" },
  { slug: "chaudiere", title: "Chaudière (gaz / biomasse)" },
  { slug: "photovoltaique", title: "Panneaux photovoltaïques" },
  { slug: "fenetres", title: "Fenêtres" },
  { slug: "vmc-double-flux", title: "VMC double flux" },
  { slug: "audit-energetique", title: "Audit énergétique" },
] as const;

export type TravauxSlug = (typeof TRAVAUX_LIST)[number]["slug"];

export const TRAVAUX_SLUGS = TRAVAUX_LIST.map((t) => t.slug);

export function isValidTravauxSlug(slug: string): slug is TravauxSlug {
  return (TRAVAUX_SLUGS as readonly string[]).includes(slug);
}

export const AIDES_LIST = [
  { key: "maprimerenov", title: "MaPrimeRénov'" },
  { key: "cee", title: "Certificats d'Économie d'Énergie (CEE)" },
  { key: "eco-ptz", title: "Éco-prêt à taux zéro" },
  { key: "tva-reduite", title: "TVA à 5,5 %" },
  { key: "aides-locales", title: "Aides locales" },
] as const;
