/**
 * Estimation indicative des aides — table de mapping placeholder, à raffiner
 * plus tard (API gouvernementale, devis reels). Le calcul est volontairement
 * conservateur pour rester crédible : valeurs basées sur les barèmes 2025/26
 * de MaPrimeRénov' (revenus modestes/intermédiaires) + CEE moyens.
 *
 * Inputs typiques :
 *  - travaux : slugs cochés à l'étape `travaux`
 *  - revenus : "tres-modeste" | "modeste" | "intermediaire" | "superieur"
 *  - logement : "maison" | "appartement"
 *
 * Outputs :
 *  - amount : estimation en euros
 *  - dispositifs : noms des dispositifs mobilisables
 */

type Revenus = "tres-modeste" | "modeste" | "intermediaire" | "superieur";

const TRAVAUX_AIDES: Record<string, Record<Revenus, number>> = {
  "isolation-combles": {
    "tres-modeste": 1500,
    "modeste":      1100,
    "intermediaire": 800,
    "superieur":     400,
  },
  "isolation-murs": {
    "tres-modeste": 4500,
    "modeste":      3800,
    "intermediaire": 2400,
    "superieur":     1500,
  },
  "isolation-sols": {
    "tres-modeste": 1200,
    "modeste":       900,
    "intermediaire": 600,
    "superieur":     300,
  },
  "pompe-a-chaleur-air-eau": {
    "tres-modeste": 5000,
    "modeste":      4000,
    "intermediaire": 3000,
    "superieur":     2000,
  },
  "pompe-a-chaleur-air-air": {
    "tres-modeste": 1500,
    "modeste":      1200,
    "intermediaire":  800,
    "superieur":      0,
  },
  chaudiere: {
    "tres-modeste": 2500,
    "modeste":      2000,
    "intermediaire": 1500,
    "superieur":     800,
  },
  photovoltaique: {
    "tres-modeste": 2400,
    "modeste":      2400,
    "intermediaire": 2400,
    "superieur":     2400,
  },
  fenetres: {
    "tres-modeste": 1000,
    "modeste":       800,
    "intermediaire": 500,
    "superieur":     200,
  },
  "vmc-double-flux": {
    "tres-modeste": 2500,
    "modeste":      2000,
    "intermediaire": 1500,
    "superieur":     800,
  },
  "audit-energetique": {
    "tres-modeste": 500,
    "modeste":      400,
    "intermediaire": 300,
    "superieur":     0,
  },
};

export interface AidesEstimate {
  amount: number;
  dispositifs: string[];
}

export function estimateAides(args: {
  travaux: string[];
  revenus?: Revenus;
  logement?: string;
}): AidesEstimate {
  const revenus: Revenus = args.revenus ?? "intermediaire";
  let amount = 0;
  const dispositifs = new Set<string>();

  for (const t of args.travaux) {
    const map = TRAVAUX_AIDES[t];
    if (!map) continue;
    const value = map[revenus];
    if (value > 0) {
      amount += value;
      dispositifs.add("MaPrimeRénov'");
      dispositifs.add("CEE");
      if (t === "isolation-murs" || t === "pompe-a-chaleur-air-eau" || t === "fenetres") {
        dispositifs.add("Éco-PTZ");
      }
    }
  }

  // Bonus pour rénovation globale (≥ 3 travaux différents)
  if (args.travaux.length >= 3) {
    amount = Math.round(amount * 1.15);
    dispositifs.add("Bonus rénovation globale");
  }

  return { amount, dispositifs: Array.from(dispositifs) };
}
