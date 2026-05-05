/**
 * Script utilitaire — `pnpm tsx scripts/propose-stock-images.ts`
 *
 * Pour chaque imageKey du site qui n'a PAS encore de MediaAsset, interroge
 * Unsplash (avec la query suggérée par `suggestQueryForImageKey()`) et écrit
 * un récapitulatif markdown dans `tmp/stock-image-proposals.md`.
 *
 * Usage prévu : faire gagner du temps à l'admin lors de la sélection initiale
 * des photos pour ~30 clés (hero, services, articles covers, etc.). Plutôt
 * que de cliquer 30 fois dans la modale, on relit le markdown généré et on
 * confirme en bloc via le lien `/admin/editor/<page>?prefillStock=<id>`.
 *
 * Pré-requis :
 *  - `UNSPLASH_ACCESS_KEY` défini dans `.env`
 *  - DB accessible (Prisma)
 *
 * Note : pour les imageKeys avec template `{slug}` (ex. `services.{slug}.hero`,
 * `article.cover.{slug}`), on génère une proposition par slug réel — pour
 * les services c'est la liste de SERVICES_LIST, pour les articles c'est la
 * liste des slugs présents dans la table Article.
 */
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { imageSpecs } from "@/lib/imageSpecs";
import {
  searchStockImages,
  suggestQueryForImageKey,
  type StockImageResult,
} from "@/lib/stock-images";
import { SERVICES_LIST } from "@/lib/services";

const prisma = new PrismaClient();
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type Resolved = { key: string; specKey: string; specLabel: string; ratioHint?: string };

async function resolveAllKeys(): Promise<Resolved[]> {
  const out: Resolved[] = [];
  for (const [specKey, spec] of Object.entries(imageSpecs)) {
    if (!specKey.includes("{")) {
      out.push({ key: specKey, specKey, specLabel: spec.label });
      continue;
    }
    if (specKey.includes("{slug}") && specKey.startsWith("services.")) {
      for (const s of SERVICES_LIST) {
        out.push({
          key: specKey.replaceAll("{slug}", s.slug),
          specKey,
          specLabel: `${spec.label} — ${s.label}`,
        });
      }
      continue;
    }
    if (specKey.includes("{slug}") && specKey.startsWith("article.cover.")) {
      const articles = await prisma.article.findMany({ select: { slug: true } });
      for (const a of articles) {
        out.push({
          key: specKey.replaceAll("{slug}", a.slug),
          specKey,
          specLabel: `${spec.label} — ${a.slug}`,
        });
      }
      continue;
    }
    // Templates {index} ignorés ici — trop nombreux, à traiter à la demande.
  }
  return out;
}

async function listKeysWithoutAsset(keys: Resolved[]): Promise<Resolved[]> {
  const allAssets = await prisma.mediaAsset.findMany({
    select: { key: true },
    where: { key: { not: null } },
  });
  const seen = new Set(allAssets.map((a) => a.key));
  return keys.filter((k) => !seen.has(k.key));
}

function fmtCandidate(c: StockImageResult): string {
  return [
    `   - **[${c.authorName}](${c.sourceUrl})** — ${c.width}×${c.height} px`,
    `     Preview : ${c.thumbUrl}`,
    `     ${c.altSuggestion ? `_${c.altSuggestion.replace(/\n/g, " ")}_` : ""}`,
    `     [Confirmer ce choix](${SITE_URL}/admin/editor?prefillStock=${c.id}&imageKey=${encodeURIComponent("KEY")}&source=unsplash)`.replace(
      "KEY",
      "{key}",
    ),
  ].filter(Boolean).join("\n");
}

async function main() {
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    console.error("UNSPLASH_ACCESS_KEY non défini dans .env — abandon.");
    console.error("Cf. README section « Configurer les API d'images stock ».");
    process.exit(1);
  }

  console.log("Résolution des imageKeys…");
  const resolved = await resolveAllKeys();
  const missing = await listKeysWithoutAsset(resolved);

  console.log(`${resolved.length} clés totales, ${missing.length} sans MediaAsset.`);

  const lines: string[] = [];
  lines.push("# Propositions de photos stock — pré-sélection automatique");
  lines.push("");
  lines.push(`Généré le ${new Date().toLocaleString("fr-FR")}.`);
  lines.push("");
  lines.push(
    `Pour chaque imageKey sans MediaAsset, 3 candidats Unsplash. Le lien « Confirmer ce choix » mène vers la modale admin pré-remplie. Tu peux aussi rechercher manuellement dans la modale si aucun candidat ne convient.`,
  );
  lines.push("");
  lines.push(`---`);
  lines.push("");

  for (const k of missing) {
    const query = suggestQueryForImageKey(k.key);
    lines.push(`## \`${k.key}\``);
    lines.push("");
    lines.push(`**Spec** : ${k.specLabel} (${k.specKey})`);
    lines.push(`**Query** : \`${query}\``);
    lines.push("");

    const res = await searchStockImages(query, { source: "unsplash", perPage: 3 });
    if (res.apiKeyMissing) {
      lines.push(`⚠️ Clé Unsplash manquante.`);
      lines.push("");
      continue;
    }
    if (res.error) {
      lines.push(`⚠️ Erreur : ${res.error}`);
      lines.push("");
      continue;
    }
    if (res.results.length === 0) {
      lines.push(`Aucun résultat pour « ${query} ». À reformuler côté modale admin.`);
      lines.push("");
      continue;
    }
    for (const c of res.results.slice(0, 3)) {
      lines.push(fmtCandidate(c).replaceAll("{key}", k.key));
      lines.push("");
    }

    // Espacement entre clés pour ne pas saturer Unsplash (50 req/h en demo)
    await new Promise((r) => setTimeout(r, 250));
  }

  const outDir = path.resolve("tmp");
  await fs.mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, "stock-image-proposals.md");
  await fs.writeFile(outFile, lines.join("\n"), "utf8");
  console.log(`✓ ${outFile} écrit (${missing.length} clés traitées).`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
