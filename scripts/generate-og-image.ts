import path from "node:path";
import sharp from "sharp";

/**
 * Genere l'image OpenGraph (1200x630) utilisee dans les previews riches
 * d'iMessage / WhatsApp / Signal / Slack / Facebook / LinkedIn / Twitter.
 *
 * Fond vert de marque (themeColor #0F3D26), logo centre avec padding.
 * Sortie : public/og-image.png — referencee depuis src/app/layout.tsx.
 */

const LOGO_INPUT = path.resolve("public/logo.png");
const OUTPUT = path.resolve("public/og-image.png");

const WIDTH = 1200;
const HEIGHT = 630;
const BG = { r: 15, g: 61, b: 38, alpha: 1 }; // #0F3D26 (themeColor du site)

// Hauteur cible du logo : ~50% du canvas pour qu'il soit lisible meme en
// vignette reduite (iMessage compresse a ~300px de large dans les bulles).
const LOGO_MAX_HEIGHT = 320;
const LOGO_MAX_WIDTH = 900;

async function main() {
  // Trim d'abord les bords transparents pour eviter un decentrage visuel
  // du au padding asymetrique du PNG source, puis redimensionne.
  const logo = await sharp(LOGO_INPUT)
    .trim()
    .resize({
      width: LOGO_MAX_WIDTH,
      height: LOGO_MAX_HEIGHT,
      fit: "inside",
      withoutEnlargement: false,
    })
    .toBuffer();
  const logoMeta = await sharp(logo).metadata();

  const left = Math.round((WIDTH - (logoMeta.width ?? 0)) / 2);
  const top = Math.round((HEIGHT - (logoMeta.height ?? 0)) / 2);

  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: BG,
    },
  })
    .composite([{ input: logo, left, top }])
    .png({ compressionLevel: 9 })
    .toFile(OUTPUT);

  console.log(`-> ${OUTPUT} (${WIDTH}x${HEIGHT})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
