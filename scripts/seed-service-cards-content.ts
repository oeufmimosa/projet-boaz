import fs from "node:fs";
import path from "node:path";
function loadEnv() {
  const f = path.resolve(".env"); if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, "utf8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const e = t.indexOf("="); if (e === -1) continue;
    let v = t.slice(e + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[t.slice(0, e).trim()]) process.env[t.slice(0, e).trim()] = v;
  }
}
loadEnv();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const CARDS = [
  { slug: "pompe-a-chaleur", shortLabel: "Air-Eau / Air-Air",
    description: "Solution de chauffage performante qui exploite les calories de l'air ou de l'eau. Jusqu'à 3 fois plus efficace qu'un chauffage électrique classique.",
    benefits: ["Économies d'énergie jusqu'à 70 %", "Éligible à MaPrimeRénov' & CEE", "Confort thermique toute l'année"] },
  { slug: "panneau-photovoltaique", shortLabel: "Production d'électricité solaire",
    description: "Production d'électricité solaire pour autoconsommer ou revendre le surplus. Rentabilité moyenne en 8 à 12 ans selon votre exposition.",
    benefits: ["Autoconsommation jusqu'à 60 %", "Prime à l'autoconsommation incluse", "Garantie 25 ans sur les panneaux"] },
  { slug: "isolation-thermique-exterieure", shortLabel: "ITE — façades & murs",
    description: "Enveloppe isolante posée sur la façade extérieure de votre logement. Réduction des déperditions de chaleur jusqu'à 25 %.",
    benefits: ["Aucune perte de surface habitable", "Ravalement de façade inclus", "Aides cumulées jusqu'à plusieurs milliers d'euros"] },
  { slug: "chauffe-eau-solaire-individuel", shortLabel: "CESI individuel",
    description: "Production d'eau chaude par capteurs solaires. Couvre 50 à 70 % des besoins d'un foyer sur une année.",
    benefits: ["Économies durables sur l'eau chaude", "Énergie 100 % renouvelable", "Fonctionne toute l'année"] },
  { slug: "ballon-thermodynamique", shortLabel: "Eau chaude économique",
    description: "Chauffe-eau qui capte les calories de l'air ambiant. Trois à quatre fois plus économique qu'un cumulus électrique classique.",
    benefits: ["Installation rapide en 1 journée", "Compatible avec une cave ou un garage", "Aides MaPrimeRénov' applicables"] },
  { slug: "systeme-solaire-combine", shortLabel: "SSC chauffage + ECS",
    description: "Capteurs solaires qui assurent à la fois le chauffage du logement et la production d'eau chaude sanitaire. La solution la plus complète.",
    benefits: ["Couvre jusqu'à 50 % des besoins en chauffage", "ECS solaire incluse", "Aides élevées disponibles"] },
];

async function up(key: string, value: string, type: string = "TEXT") {
  await prisma.content.upsert({ where: { key }, update: { value, type }, create: { key, value, type } });
}

async function main() {
  await up("home.services.label", "Nos solutions");
  await up("home.services.title", "Des solutions pour chaque besoin énergétique");
  await up("home.services.subtitle", "Pompe à chaleur, photovoltaïque, isolation : nos six expertises pour réduire vos consommations et profiter des aides 2025.");
  for (const c of CARDS) {
    await up(`home.services.cards.${c.slug}.shortLabel`, c.shortLabel);
    await up(`home.services.cards.${c.slug}.description`, c.description);
    await up(`home.services.cards.${c.slug}.benefits`, JSON.stringify(c.benefits), "JSON");
  }
  console.log("✓ 21 entrées Content upsert");
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
