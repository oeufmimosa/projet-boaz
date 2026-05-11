/**
 * Bareme MaPrimeRenov 2026 (source : avis fiscal RFR). Quatre profils :
 *  - tres-modeste (bleu), modeste (jaune), intermediaire (violet), superieur (rose)
 *
 * Les seuils dependent du nombre de personnes dans le foyer et de la zone
 * geographique (Ile-de-France / Hors Ile-de-France). Au-dela de 5 personnes,
 * on ajoute un montant fixe par personne supplementaire.
 */

const IDF_PREFIXES = ["75", "77", "78", "91", "92", "93", "94", "95"];

export function isIDFPostalCode(postal: string | null | undefined): boolean {
  if (!postal) return false;
  const prefix = postal.trim().slice(0, 2);
  return IDF_PREFIXES.includes(prefix);
}

type Profile = "tres-modeste" | "modeste" | "intermediaire";

const IDF_TABLE: Record<number, Record<Profile, number>> = {
  1: { "tres-modeste": 24031, modeste: 29253, intermediaire: 40851 },
  2: { "tres-modeste": 35270, modeste: 42933, intermediaire: 60051 },
  3: { "tres-modeste": 42357, modeste: 51564, intermediaire: 71846 },
  4: { "tres-modeste": 49455, modeste: 60208, intermediaire: 84562 },
  5: { "tres-modeste": 56580, modeste: 68877, intermediaire: 96817 },
};
const IDF_EXTRA: Record<Profile, number> = {
  "tres-modeste": 7116,
  modeste: 8663,
  intermediaire: 12257,
};

const HORS_IDF_TABLE: Record<number, Record<Profile, number>> = {
  1: { "tres-modeste": 17363, modeste: 22259, intermediaire: 31185 },
  2: { "tres-modeste": 25393, modeste: 32553, intermediaire: 45842 },
  3: { "tres-modeste": 30540, modeste: 39148, intermediaire: 55196 },
  4: { "tres-modeste": 35676, modeste: 45735, intermediaire: 64550 },
  5: { "tres-modeste": 40835, modeste: 52348, intermediaire: 73907 },
};
const HORS_IDF_EXTRA: Record<Profile, number> = {
  "tres-modeste": 5151,
  modeste: 6598,
  intermediaire: 9357,
};

export type RevenusThresholds = Record<Profile, number>;

export function getRevenusThresholds(nbPersonnes: number, idf: boolean): RevenusThresholds {
  const n = Math.max(1, Math.floor(nbPersonnes));
  const table = idf ? IDF_TABLE : HORS_IDF_TABLE;
  const extra = idf ? IDF_EXTRA : HORS_IDF_EXTRA;
  if (n <= 5) return table[n];
  const base = table[5];
  const add = n - 5;
  return {
    "tres-modeste": base["tres-modeste"] + add * extra["tres-modeste"],
    modeste: base.modeste + add * extra.modeste,
    intermediaire: base.intermediaire + add * extra.intermediaire,
  };
}

/** Convertit la valeur de l'etape "foyer_personnes" ("1"|"2"|"3"|"4"|"5plus") en nombre. */
export function parseFoyerPersonnes(value: string | null | undefined): number {
  if (!value) return 1;
  if (value === "5plus") return 5;
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

/** Formatte un montant en euros au format francais (espace fine + €). */
export function formatEuros(n: number): string {
  return `${n.toLocaleString("fr-FR")} €`;
}
