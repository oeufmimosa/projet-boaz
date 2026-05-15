import path from "node:path";
import sharp from "sharp";

/**
 * Genere l'image OpenGraph (1200x630) utilisee dans les previews riches
 * d'iMessage / WhatsApp / Signal / Slack / Facebook / LinkedIn / Twitter.
 *
 * Source : Photos/photo envoi.jpg (visuel de marque complet logo + nom +
 * baseline "Renovation energetique"). Resize en `cover` car le ratio source
 * (2.0) est tres proche du ratio OG (1.905) — seulement ~5 % rogne sur les
 * cotes, l'identite visuelle reste centree.
 *
 * Sortie : public/og-image.png — referencee depuis src/app/layout.tsx.
 */

const SOURCE = path.resolve("Photos/photo envoi.jpg");
const OUTPUT = path.resolve("public/og-image.png");

const WIDTH = 1200;
const HEIGHT = 630;

async function main() {
  await sharp(SOURCE)
    .resize({
      width: WIDTH,
      height: HEIGHT,
      fit: "cover",
      position: "center",
    })
    .png({ compressionLevel: 9 })
    .toFile(OUTPUT);

  console.log(`-> ${OUTPUT} (${WIDTH}x${HEIGHT})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
