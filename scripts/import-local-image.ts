/**
 * Script générique — importe une image LOCALE comme MediaAsset pour
 * une `imageKey` donnée, recadrée selon la spec correspondante.
 *
 * Usage : pnpm tsx scripts/import-local-image.ts <key> <chemin/vers/source>
 *
 * Exemples :
 *   pnpm tsx scripts/import-local-image.ts realisations.hero "images/image réalisation.jpeg"
 *   pnpm tsx scripts/import-local-image.ts services.pompe-a-chaleur.hero "images/image pompe à chaleur.jpeg"
 *
 * Le script :
 *   1. Lit la source locale
 *   2. Résout la spec (avec template `{slug}` si nécessaire)
 *   3. Recadre cover sur les dimensions cibles via processImage (sharp)
 *   4. Upsert le MediaAsset (efface l'attribution stock le cas échéant)
 *   5. AuditLog
 */
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
import { imageSpecs, resolveSpec, type ImageSpec } from "@/lib/imageSpecs";

const prisma = new PrismaClient();

function resolveSpecLoose(key: string): ImageSpec | null {
  const direct = resolveSpec(key);
  if (direct) return direct;
  // Match contre les templates `{slug}`, `{index}`, etc.
  for (const tplKey of Object.keys(imageSpecs)) {
    if (!tplKey.includes("{")) continue;
    const pattern = "^" + tplKey.replace(/\./g, "\\.").replace(/\{[^}]+\}/g, "[^.]+") + "$";
    if (new RegExp(pattern).test(key)) {
      return { ...imageSpecs[tplKey], key };
    }
  }
  return null;
}

function mimeFromExt(ext: string): string {
  switch (ext.toLowerCase()) {
    case ".png": return "image/png";
    case ".webp": return "image/webp";
    case ".avif": return "image/avif";
    case ".svg": return "image/svg+xml";
    case ".jpg":
    case ".jpeg":
    default: return "image/jpeg";
  }
}

async function main() {
  const [, , imageKey, srcPathArg] = process.argv;
  if (!imageKey || !srcPathArg) {
    console.error("Usage : pnpm tsx scripts/import-local-image.ts <key> <chemin/source>");
    process.exit(1);
  }

  const srcPath = path.resolve(srcPathArg);
  if (!fs.existsSync(srcPath)) {
    console.error(`Source introuvable : ${srcPath}`);
    process.exit(1);
  }

  const spec = resolveSpecLoose(imageKey);
  if (!spec) {
    console.error(`Pas de spec pour la clé "${imageKey}". Définis-la dans src/lib/imageSpecs.ts.`);
    process.exit(1);
  }

  const buffer = fs.readFileSync(srcPath);
  const ext = path.extname(srcPath);
  const mimeType = mimeFromExt(ext);
  const safeName = path.basename(srcPath).replace(/\s+/g, "-").toLowerCase();

  console.log(`→ ${imageKey} ← ${srcPath}`);
  console.log(`  Source : ${(buffer.length / 1024).toFixed(0)} Ko, ${mimeType}`);
  console.log(`  Recadrage cible : ${spec.width}×${spec.height}`);

  const processed = await processImage({
    buffer,
    mimeType,
    originalName: safeName,
    targetWidth: spec.width,
    targetHeight: spec.height,
  });

  console.log(`  ✓ Sortie : ${processed.url} (${processed.width}×${processed.height}, ${(processed.size / 1024).toFixed(0)} Ko)`);

  const variantsJson = JSON.stringify(processed.variants);
  const existing = await prisma.mediaAsset.findUnique({ where: { key: imageKey } });

  if (existing) {
    await prisma.mediaAsset.update({
      where: { id: existing.id },
      data: {
        filename: processed.filename,
        originalName: safeName,
        mimeType: processed.mimeType,
        size: processed.size,
        url: processed.url,
        width: processed.width,
        height: processed.height,
        blurDataURL: processed.blurDataURL,
        variants: variantsJson,
        // Image fournie par le client → pas d'attribution stock
        attribution: null,
        attributionUrl: null,
        licenseType: null,
      } as never,
    });
    console.log(`  ✓ MediaAsset mis à jour`);
  } else {
    await prisma.mediaAsset.create({
      data: {
        key: imageKey,
        filename: processed.filename,
        originalName: safeName,
        mimeType: processed.mimeType,
        size: processed.size,
        url: processed.url,
        width: processed.width,
        height: processed.height,
        blurDataURL: processed.blurDataURL,
        variants: variantsJson,
      } as never,
    });
    console.log(`  ✓ MediaAsset créé`);
  }

  await prisma.auditLog.create({
    data: {
      adminEmail: "system@import-local-image",
      action: "upload",
      key: imageKey,
      after: `local:${srcPath} → ${processed.url}`,
    },
  }).catch(() => {});

  await prisma.$disconnect();
  console.log("");
  console.log(`URL publique : ${processed.url}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
