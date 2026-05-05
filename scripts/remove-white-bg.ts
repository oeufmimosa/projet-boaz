/**
 * Script one-shot — supprime le fond blanc d'un PNG.
 *
 * Usage : pnpm tsx scripts/remove-white-bg.ts
 *
 * Lit `public/placeholders/image.png`, met les pixels quasi-blancs
 * (R/G/B ≥ 235) en alpha=0, et écrit `public/placeholders/image.png`
 * (écrasement). Conserve les anti-aliasing pour des bords doux.
 */
import path from "node:path";
import sharp from "sharp";

const INPUT = path.resolve("public/placeholders/image.original.png");
const OUTPUT = path.resolve("public/placeholders/image.png");

// Pixels avec min(R,G,B) ≥ FULLY_WHITE → 100 % transparent.
// Pixels entre SOFT_START et FULLY_WHITE → alpha proportionnelle (anti-aliasing).
// Pixels < SOFT_START → opaques, intacts (sauf masque circulaire ci-dessous).
const FULLY_WHITE = 248;
const SOFT_START  = 220;

// Masque circulaire : tout ce qui est en dehors du cercle inscrit dans
// l'image est rendu transparent. Indispensable pour cette image dont les
// 4 coins sont noirs (et qui ne seraient pas pris par le seuil "blanc").
// Le rayon est légèrement plus petit que min(w,h)/2 pour ne pas couper
// les éléments qui pourraient légèrement déborder du disque visuel.
const CIRCLE_RADIUS_RATIO   = 0.495; // 49.5 % du min(w,h) → rayon
const CIRCLE_SOFT_PIXELS    = 4;     // anti-aliasing au bord du cercle

async function main() {
  const { data, info } = await sharp(INPUT)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  if (info.channels !== 4) {
    throw new Error(`Attendu 4 canaux RGBA, reçu ${info.channels}`);
  }

  const { width, height } = info;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * CIRCLE_RADIUS_RATIO;

  let cleared = 0;
  let softened = 0;
  let outsideCircle = 0;

  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const x = p % width;
    const y = Math.floor(p / width);
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // 1. Masque circulaire : tout ce qui est dehors → transparent
    if (dist >= radius) {
      data[i + 3] = 0;
      outsideCircle++;
      continue;
    }
    // 2. Anti-aliasing sur le bord du cercle (sur CIRCLE_SOFT_PIXELS pixels)
    if (dist >= radius - CIRCLE_SOFT_PIXELS) {
      const t = (dist - (radius - CIRCLE_SOFT_PIXELS)) / CIRCLE_SOFT_PIXELS;
      // Cap à l'alpha existant (qui peut déjà être atténué par la règle "blanc")
      const circleAlpha = Math.round((1 - t) * 255);
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;
      const minRGB = Math.min(r, g, b);
      let whiteAlpha = 255;
      if (minRGB >= FULLY_WHITE) whiteAlpha = 0;
      else if (minRGB >= SOFT_START) {
        const tw = (minRGB - SOFT_START) / (FULLY_WHITE - SOFT_START);
        whiteAlpha = Math.round((1 - tw) * 255);
      }
      data[i + 3] = Math.min(circleAlpha, whiteAlpha);
      continue;
    }
    // 3. Pixels intérieurs : règle blanche habituelle
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

  console.log(`✓ Fond blanc + coins hors-disque supprimés`);
  console.log(`  Hors disque (clip circulaire)        : ${outsideCircle.toLocaleString("fr-FR")}`);
  console.log(`  Pixels blancs intérieurs effacés     : ${cleared.toLocaleString("fr-FR")}`);
  console.log(`  Pixels en transition (anti-aliasing) : ${softened.toLocaleString("fr-FR")}`);
  console.log(`  Total transparent : ${((cleared + softened + outsideCircle) / (info.width * info.height) * 100).toFixed(1)} % de l'image`);
  console.log(`  Sortie : ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
