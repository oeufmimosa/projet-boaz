/**
 * Catalogue des réalisations (cas clients).
 *
 * ⚠️ ZONE DE RISQUE — Les 6 entrées ci-dessous sont des CAS FICTIFS RÉALISTES,
 * tous marqués `placeholder: true`. Avant toute mise en production publique,
 * le client doit IMPÉRATIVEMENT :
 *   1. Recueillir le consentement écrit RGPD des vrais clients (article 6
 *      RGPD + droit à l'image si photos associées).
 *   2. Remplacer chaque entrée par un cas vérifiable (avec une trace interne
 *      de l'identifiant client + date du consentement).
 *   3. Retirer le flag `placeholder: true` une fois remplacée.
 *   4. Ne PAS publier des réalisations fictives durablement (risque de
 *      pratique commerciale trompeuse — article L121-2 Code de la
 *      consommation, sanctions jusqu'à 300 000 € ou 10 % du CA).
 *
 * Les chiffres d'aides cités correspondent à des ordres de grandeur 2025
 * cohérents avec les barèmes officiels (cf. /aides), mais ne sont pas issus
 * de dossiers réels. Photos avant/après en placeholder dégradé.
 *
 * Le composant rend `data-content="placeholder"` sur chaque card tant que
 * `placeholder: true`.
 *
 * Sources publiques pour les ordres de grandeur cités :
 *  - https://www.maprimerenov.gouv.fr/
 *  - https://france-renov.gouv.fr/
 *  - https://www.ademe.fr/
 */

export type Realisation = {
  slug: string;
  title: string;
  location: string;
  region: string;
  // Logement
  housingType: "Maison" | "Appartement";
  surface: number; // m²
  yearBuilt: number;
  // Travaux
  works: string[]; // liste des gestes
  // Chiffres
  totalCostEuros: number;       // coût TTC chantier
  aidesObtainedEuros: number;   // total aides cumulées
  yearlySavingsEuros: number;   // économie annuelle estimée sur la facture
  durationDays: number;         // durée du chantier en jours ouvrés
  // Profil & aides
  profileMpr: "Bleu" | "Jaune" | "Violet" | "Rose";
  aidesDetail: { name: string; amount: string }[]; // détail des aides obtenues
  // Citation
  quote: string;
  customerName: string;
  // Couvertures
  coverImage: string; // image principale
  /** Images supplémentaires (avant/après, détails). Affichées côte-à-côte
   *  avec coverImage si présent. */
  additionalImages?: string[];
  // ⚠️ Cas fictif tant que placeholder=true
  placeholder: boolean;
};

export const REALISATIONS: Realisation[] = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "maison-1985-toulouse-pac-air-eau-isolation-combles",
    title: "Maison de 1985, Toulouse — Pompe à chaleur air-eau + isolation combles",
    location: "Toulouse (31)",
    region: "Occitanie",
    housingType: "Maison",
    surface: 110,
    yearBuilt: 1985,
    works: [
      "Installation d'une pompe à chaleur air-eau 11 kW",
      "Isolation des combles perdus (laine de roche, R = 7,5 m².K/W)",
      "Dépose de l'ancienne chaudière fioul",
    ],
    totalCostEuros: 16500,
    aidesObtainedEuros: 6800,
    yearlySavingsEuros: 1200,
    durationDays: 5,
    profileMpr: "Jaune",
    aidesDetail: [
      { name: "MaPrimeRénov'",                amount: "≈ 4 000 €" },
      { name: "Prime CEE Coup de pouce Chauffage", amount: "≈ 2 500 €" },
      { name: "TVA réduite à 5,5 % (déduite au devis)", amount: "≈ 300 € d'économie" },
    ],
    quote:
      "On était à plus de 2 200 € de fioul par an. Un an après le chantier, on a divisé notre facture par deux et on chauffe mieux. L'équipe a tout pris en main, du dossier MaPrimeRénov' jusqu'à l'installation.",
    customerName: "Famille L.",
    coverImage: "/realisations/toulouse-1.jpg",
    additionalImages: ["/realisations/toulouse-2.jpg"],
    placeholder: true,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "maison-1972-lille-ite-complete",
    title: "Maison de 1972, Lille — Isolation thermique extérieure complète",
    location: "Lille (59)",
    region: "Hauts-de-France",
    housingType: "Maison",
    surface: 140,
    yearBuilt: 1972,
    works: [
      "Isolation thermique extérieure de 130 m² de façade (laine de roche, 16 cm)",
      "Pose d'enduit minéral teinté",
      "Reprise des points singuliers (linteaux, contours fenêtres)",
    ],
    totalCostEuros: 24800,
    aidesObtainedEuros: 14500,
    yearlySavingsEuros: 1800,
    durationDays: 18,
    profileMpr: "Bleu",
    aidesDetail: [
      { name: "MaPrimeRénov' ITE (75 €/m² × 130 m²)", amount: "≈ 9 750 €" },
      { name: "Prime CEE", amount: "≈ 3 800 €" },
      { name: "TVA réduite à 5,5 %", amount: "≈ 950 € d'économie" },
    ],
    quote:
      "On hésitait entre changer les fenêtres et l'isolation des murs. Le conseiller a chiffré les deux et nous a expliqué que l'ITE était dix fois plus rentable dans notre cas. On confirme : la maison ne refroidit plus la nuit.",
    customerName: "M. et Mme B.",
    coverImage: "https://placehold.co/1200x800/EAEAEA/0F3D26?text=Avant+/+Après",
    placeholder: true,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "maison-1995-bordeaux-photovoltaique-6kwc",
    title: "Maison de 1995, Bordeaux — Installation photovoltaïque 6 kWc",
    location: "Bordeaux (33)",
    region: "Nouvelle-Aquitaine",
    housingType: "Maison",
    surface: 125,
    yearBuilt: 1995,
    works: [
      "Pose de 16 panneaux photovoltaïques (6 kWc)",
      "Onduleur central + monitoring",
      "Raccordement au réseau Enedis et contrat EDF OA pour la revente du surplus",
    ],
    totalCostEuros: 14200,
    aidesObtainedEuros: 3200,
    yearlySavingsEuros: 1100,
    durationDays: 3,
    profileMpr: "Violet",
    aidesDetail: [
      { name: "Prime à l'autoconsommation",     amount: "≈ 1 800 €" },
      { name: "TVA réduite à 10 %",              amount: "≈ 1 400 € d'économie" },
      { name: "Revente surplus à EDF OA (sur 20 ans)", amount: "≈ 350 €/an" },
    ],
    quote:
      "Autoconsommation à 65 % la première année. On lance lave-linge et lave-vaisselle en journée, et on revend le surplus. Le retour sur investissement est tenable, surtout avec l'augmentation des tarifs EDF.",
    customerName: "Famille G.",
    coverImage: "https://placehold.co/1200x800/EAEAEA/0F3D26?text=Avant+/+Après",
    placeholder: true,
  },

];

export const REALISATION_SLUGS = REALISATIONS.map((r) => r.slug);

export function isValidRealisationSlug(slug: string): boolean {
  return REALISATION_SLUGS.includes(slug);
}

export function getRealisation(slug: string): Realisation | undefined {
  return REALISATIONS.find((r) => r.slug === slug);
}

/** Formate un nombre en euros français : "12 500 €" */
export function formatEuros(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}
