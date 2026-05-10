/**
 * Convertit `public/logo.jpg` en `public/logo.png` avec fond blanc
 * transparent. Pixels quasi-blancs (R/G/B ≥ 235) → alpha=0.
 * Anti-aliasing entre 200 et 235 pour des bords doux.
 *
 * Usage : pnpm tsx scripts/transparent-logo.ts
 */
import path from "node:path";
import sharp from "sharp";

const INPUT = path.resolve("public/logo.jpg");
const OUTPUT = path.resolve("public/logo.png");

const FULLY_WHITE = 235;
const SOFT_START = 200;

async function main() {
  const { data, info } = await sharp(INPUT)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  if (info.channels !== 4) {
    throw new Error(`Attendu 4 canaux RGBA, reçu ${info.channels}`);
  }

  let cleared = 0;
  let softened = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]!;
    const g = data[i + 1]!;
    const b = data[i + 2]!;
    const minRGB = Math.min(r, g, b);
    if (minRGB >= FULLY_WHITE) {
      data[i + 3] = 0;
      cleared++;
    } else if (minRGB >= SOFT_START) {
      const t = (minRGB - SOFT_START) / (FULLY_WHITE - SOFT_START);
      data[i + 3] = Math.round((1 - t) * 255);
      softened++;
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(OUTPUT);

  const total = info.width * info.height;
  console.log(`✓ Fond blanc retiré`);
  console.log(`  Pixels totalement transparents : ${cleared.toLocaleString("fr-FR")}`);
  console.log(`  Pixels en transition (anti-aliasing) : ${softened.toLocaleString("fr-FR")}`);
  console.log(`  Total transparent : ${(((cleared + softened) / total) * 100).toFixed(1)} % de l'image`);
  console.log(`  Sortie : ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
