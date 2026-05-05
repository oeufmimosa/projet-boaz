/**
 * Script one-shot — remplace le MediaAsset `parrainage.hero` par l'image
 * locale `images/image parrainage.jpeg`.
 *
 * Usage : pnpm tsx scripts/set-parrainage-hero.ts
 */
import "node:fs";
import fs from "node:fs";
import path from "node:path";

// Charge .env (DATABASE_URL nécessaire)
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

const prisma = new PrismaClient();
const KEY = "parrainage.hero";
const SRC = path.resolve("images/image parrainage.jpeg");

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`Source introuvable : ${SRC}`);
    process.exit(1);
  }

  const buffer = fs.readFileSync(SRC);
  console.log(`→ Traitement de ${SRC} (${(buffer.length / 1024).toFixed(0)} Ko)`);

  // Recadrage cover sur les dimensions de la spec parrainage.hero (1500×1000)
  const processed = await processImage({
    buffer,
    mimeType: "image/jpeg",
    originalName: "image-parrainage.jpeg",
    targetWidth: 1500,
    targetHeight: 1000,
  });

  console.log(`✓ Processed : ${processed.url} (${processed.width}×${processed.height}, ${(processed.size / 1024).toFixed(0)} Ko)`);

  const variantsJson = JSON.stringify(processed.variants);
  const existing = await prisma.mediaAsset.findUnique({ where: { key: KEY } });

  if (existing) {
    await prisma.mediaAsset.update({
      where: { id: existing.id },
      data: {
        filename: processed.filename,
        originalName: "image-parrainage.jpeg",
        mimeType: processed.mimeType,
        size: processed.size,
        url: processed.url,
        width: processed.width,
        height: processed.height,
        blurDataURL: processed.blurDataURL,
        variants: variantsJson,
        // Image fournie par le client → on supprime l'attribution stock
        attribution: null,
        attributionUrl: null,
        licenseType: null,
      } as never,
    });
    console.log(`✓ MediaAsset ${KEY} mis à jour`);
  } else {
    const created = await prisma.mediaAsset.create({
      data: {
        key: KEY,
        filename: processed.filename,
        originalName: "image-parrainage.jpeg",
        mimeType: processed.mimeType,
        size: processed.size,
        url: processed.url,
        width: processed.width,
        height: processed.height,
        blurDataURL: processed.blurDataURL,
        variants: variantsJson,
      } as never,
    });
    console.log(`✓ MediaAsset ${KEY} créé (id=${created.id})`);
  }

  // AuditLog
  await prisma.auditLog.create({
    data: {
      adminEmail: "system@set-parrainage-hero",
      action: "upload",
      key: KEY,
      after: `local:images/image parrainage.jpeg → ${processed.url}`,
    },
  }).catch(() => {});

  await prisma.$disconnect();
  console.log("");
  console.log("URL publique :", processed.url);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
