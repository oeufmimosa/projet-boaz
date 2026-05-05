/**
 * Script — `pnpm tsx scripts/populate-stock-images.ts`
 *
 * Peuple TOUTES les imageKeys du site avec des photos Unsplash curatées
 * (queries pointues choisies pour la cohérence éditoriale style Effy/Adper).
 *
 * Pour chaque clé sans MediaAsset existant :
 *   1. Recherche Unsplash avec la query curée (orientation auto selon spec)
 *   2. Prend le PREMIER résultat (heuristique : Unsplash trie par pertinence)
 *   3. Télécharge l'image haute résolution
 *   4. Passe par processImage (sharp + variantes WebP + blurDataURL +
 *      recadrage cover sur les dimensions cibles)
 *   5. Persiste un MediaAsset avec attribution complète
 *   6. Ping le tracking download Unsplash
 *
 * Throttling : 600 ms entre clés pour respecter le quota Unsplash demo
 * (50 req/h en mode demo). 30 clés = ~3 min.
 *
 * Usage :
 *   pnpm tsx scripts/populate-stock-images.ts          # tout
 *   pnpm tsx scripts/populate-stock-images.ts --force  # même les clés déjà peuplées
 */
// Charge .env manuellement (dotenv n'est pas dans les deps directes).
import fs from "node:fs";
import path from "node:path";
function loadEnv() {
  const envFile = path.resolve(".env");
  if (!fs.existsSync(envFile)) return;
  const content = fs.readFileSync(envFile, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}
loadEnv();

import { PrismaClient } from "@prisma/client";
import { processImage } from "@/lib/image-processor";
import {
  searchStockImages,
  trackUnsplashDownload,
  buildAttribution,
  type StockImageResult,
} from "@/lib/stock-images";
import { imageSpecs, resolveSpec, type ImageSpec } from "@/lib/imageSpecs";

/**
 * Résolution étendue : si la clé concrète n'est pas dans imageSpecs, on
 * cherche un template `{slug}` ou `{index}` qui matche.
 *
 * Ex. `services.pompe-a-chaleur.hero` → match avec `services.{slug}.hero`.
 */
function resolveSpecWithTemplate(concreteKey: string): ImageSpec | null {
  const direct = resolveSpec(concreteKey);
  if (direct) return direct;
  for (const tplKey of Object.keys(imageSpecs)) {
    if (!tplKey.includes("{")) continue;
    // Convertit `services.{slug}.hero` en regex /^services\.([^.]+)\.hero$/
    const pattern = "^" + tplKey.replace(/\./g, "\\.").replace(/\{[^}]+\}/g, "[^.]+") + "$";
    if (new RegExp(pattern).test(concreteKey)) {
      return { ...imageSpecs[tplKey], key: concreteKey };
    }
  }
  return null;
}
import { SERVICES_LIST } from "@/lib/services";

const prisma = new PrismaClient();
const force = process.argv.includes("--force");

/**
 * Queries curées — plus pointues que `suggestQueryForImageKey()`.
 * Chaque query est calibrée pour donner un premier résultat éditorialement
 * cohérent avec le contexte (rénovation énergétique, France, professionnels).
 */
const CURATED: Record<string, { query: string; orientation?: "landscape" | "portrait" | "squarish" }> = {
  // Hero home
  "home.hero.background":        { query: "modern eco house solar panel facade", orientation: "landscape" },
  "home.hero.background.mobile": { query: "modern house solar panel front view",  orientation: "portrait" },
  "home.hero.image":             { query: "energy efficient home renovation",      orientation: "landscape" },

  // Section parrainage home
  "home.parrainage.image":       { query: "happy family home keys handshake", orientation: "landscape" },

  // Page Parrainage
  "parrainage.hero":             { query: "handshake heat pump installer professional", orientation: "landscape" },

  // Page Qui sommes-nous
  "expertise.hero":              { query: "construction worker house renovation",       orientation: "landscape" },
  "expertise.team.photo":        { query: "construction team meeting renovation",       orientation: "landscape" },

  // Services — héros de chaque page service
  "services.panneau-photovoltaique.hero":         { query: "solar panels rooftop residential home",   orientation: "landscape" },
  "services.pompe-a-chaleur.hero":                { query: "heat pump outdoor unit installed garden", orientation: "landscape" },
  "services.isolation-thermique-exterieure.hero": { query: "exterior wall insulation house facade",   orientation: "landscape" },
  "services.chauffe-eau-solaire-individuel.hero": { query: "solar thermal panels roof residential",   orientation: "landscape" },
  "services.ballon-thermodynamique.hero":         { query: "water heater installation home utility",  orientation: "landscape" },
  "services.systeme-solaire-combine.hero":        { query: "solar thermal collectors house roof",     orientation: "landscape" },

  // Home — Cards services interactives (6) — photos cards 4:3 1200×900
  "home.services.cards.pompe-a-chaleur.image":               { query: "heat pump outdoor unit modern home",     orientation: "landscape" },
  "home.services.cards.panneau-photovoltaique.image":         { query: "solar panels rooftop residential",        orientation: "landscape" },
  "home.services.cards.isolation-thermique-exterieure.image": { query: "exterior wall insulation house facade",   orientation: "landscape" },
  "home.services.cards.chauffe-eau-solaire-individuel.image": { query: "solar water heater roof installation",    orientation: "landscape" },
  "home.services.cards.ballon-thermodynamique.image":         { query: "modern water heater bathroom",            orientation: "landscape" },
  "home.services.cards.systeme-solaire-combine.image":        { query: "solar thermal collectors house",          orientation: "landscape" },

  // Articles de blog — covers (1600×900)
  "article.cover.maprimerenov-2025-qui-peut-en-beneficier-et-combien":           { query: "house renovation paperwork euro coins",       orientation: "landscape" },
  "article.cover.pompe-a-chaleur-air-eau-ou-air-air-difference-choix":           { query: "heat pump installation modern home",          orientation: "landscape" },
  "article.cover.isolation-thermique-exterieure-guide-prix-aides-2025":          { query: "exterior wall insulation panels installation", orientation: "landscape" },
  "article.cover.photovoltaique-rentabilite-reelle-installation-2025":           { query: "solar panels installation home roof workers", orientation: "landscape" },
  "article.cover.ballon-thermodynamique-vs-chauffe-eau-solaire-le-match":        { query: "water heater eco bathroom modern",            orientation: "landscape" },
  "article.cover.comment-choisir-artisan-rge-renovation-energetique":            { query: "craftsman tools home renovation",             orientation: "landscape" },
  "article.cover.systeme-solaire-combine-ssc-principe-prix-retour-investissement": { query: "solar collectors roof house renovation",    orientation: "landscape" },
  "article.cover.5-erreurs-eviter-avant-signer-devis-renovation-energetique":    { query: "contract review signature home renovation",   orientation: "landscape" },
};

function extFromMime(m: string): string {
  switch (m) {
    case "image/jpeg":
    case "image/jpg":  return "jpg";
    case "image/png":  return "png";
    case "image/webp": return "webp";
    case "image/avif": return "avif";
    default:           return "jpg";
  }
}

async function persistOne(imageKey: string, query: string, orientation?: "landscape" | "portrait" | "squarish") {
  const spec = resolveSpecWithTemplate(imageKey);
  if (!spec) {
    console.log(`  ⚠️ Pas de spec pour ${imageKey} — skip`);
    return false;
  }

  const search = await searchStockImages(query, {
    source: "unsplash",
    perPage: 5,
    orientation,
  });
  if (search.apiKeyMissing) {
    console.error("UNSPLASH_ACCESS_KEY manquante. Abandon.");
    process.exit(1);
  }
  if (search.error) {
    console.log(`  ⚠️ Erreur Unsplash : ${search.error}`);
    return false;
  }
  if (search.results.length === 0) {
    console.log(`  ⚠️ Aucun résultat pour « ${query} »`);
    return false;
  }

  const photo: StockImageResult = search.results[0];
  console.log(`  → ${photo.authorName} — ${photo.width}×${photo.height} — ${photo.sourceUrl}`);

  // Téléchargement
  const dl = await fetch(photo.url, { cache: "no-store" });
  if (!dl.ok) {
    console.log(`  ⚠️ HTTP ${dl.status} sur ${photo.url}`);
    return false;
  }
  const buffer = Buffer.from(await dl.arrayBuffer());
  const mimeType = (dl.headers.get("content-type") ?? "image/jpeg").split(";")[0]!.trim();
  const safeId = photo.id.replace(/[^a-z0-9_-]/gi, "");
  const originalName = `unsplash-${safeId}.${extFromMime(mimeType)}`;

  // Pipeline sharp
  const processed = await processImage({
    buffer,
    mimeType,
    originalName,
    targetWidth: spec.width,
    targetHeight: spec.height,
  });

  const attr = buildAttribution(photo);
  const variantsJson = JSON.stringify(processed.variants);

  // Upsert MediaAsset par clé
  const existing = await prisma.mediaAsset.findUnique({ where: { key: imageKey } });
  if (existing) {
    await prisma.mediaAsset.update({
      where: { id: existing.id },
      data: {
        filename: processed.filename,
        originalName,
        mimeType: processed.mimeType,
        size: processed.size,
        url: processed.url,
        width: processed.width,
        height: processed.height,
        blurDataURL: processed.blurDataURL,
        variants: variantsJson,
        attribution: attr.attribution,
        attributionUrl: attr.attributionUrl,
        licenseType: attr.licenseType,
      } as never,
    });
  } else {
    await prisma.mediaAsset.create({
      data: {
        key: imageKey,
        filename: processed.filename,
        originalName,
        mimeType: processed.mimeType,
        size: processed.size,
        url: processed.url,
        width: processed.width,
        height: processed.height,
        blurDataURL: processed.blurDataURL,
        variants: variantsJson,
        attribution: attr.attribution,
        attributionUrl: attr.attributionUrl,
        licenseType: attr.licenseType,
      } as never,
    });
  }

  // AuditLog (best-effort)
  await prisma.auditLog.create({
    data: {
      adminEmail: "system@populate-script",
      action: "upload",
      key: imageKey,
      after: `unsplash:${photo.id} → ${processed.url}`,
    },
  }).catch(() => {});

  // Tracking Unsplash (best-effort)
  trackUnsplashDownload(photo.id).catch(() => {});

  return true;
}

async function main() {
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    console.error("UNSPLASH_ACCESS_KEY non défini dans .env — abandon.");
    process.exit(1);
  }

  const total = Object.keys(CURATED).length;
  console.log(`Population de ${total} imageKeys depuis Unsplash…`);
  console.log(`Mode : ${force ? "FORCE (réécrit même si existant)" : "skip si MediaAsset déjà créé"}`);
  console.log("");

  let done = 0;
  let skipped = 0;
  let errors = 0;

  for (const [key, cfg] of Object.entries(CURATED)) {
    process.stdout.write(`[${++done}/${total}] ${key}\n  query: « ${cfg.query} »\n`);

    if (!force) {
      const existing = await prisma.mediaAsset.findUnique({ where: { key } });
      if (existing && existing.url && !existing.url.includes("placehold.co")) {
        console.log("  ↪ déjà peuplé — skip\n");
        skipped++;
        continue;
      }
    }

    try {
      const ok = await persistOne(key, cfg.query, cfg.orientation);
      if (!ok) errors++;
      else console.log("  ✓ OK\n");
    } catch (err) {
      errors++;
      console.error(`  ✗ ${err instanceof Error ? err.message : String(err)}\n`);
    }

    // Throttling pour respecter le quota Unsplash demo (50 req/h = 1.2/min)
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log("");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`✓ ${done - errors - skipped} clé(s) peuplée(s)`);
  console.log(`↪ ${skipped} skip (déjà peuplé)`);
  console.log(`✗ ${errors} erreur(s)`);
  console.log("═══════════════════════════════════════════════════════");
  console.log("");
  console.log("Vérifier le résultat :");
  console.log("  - Page /credits (toutes les attributions doivent apparaître)");
  console.log("  - Pages /, /services/[slug], /blog/[slug] avec leurs covers");
  console.log("  - Toutes les photos sont sous licence Unsplash, attribution affichée");

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
