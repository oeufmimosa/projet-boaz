import path from "node:path";
import sharp from "sharp";

const INPUT = path.resolve("public/logo.png");

async function makeSquare(size: number, output: string) {
  await sharp(INPUT)
    .resize({
      width: size,
      height: size,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(output);
  console.log(`-> ${output} (${size}x${size})`);
}

async function main() {
  await makeSquare(32,  path.resolve("public/favicon-32.png"));
  await makeSquare(48,  path.resolve("public/favicon-48.png"));
  await makeSquare(192, path.resolve("public/favicon-192.png"));
  await makeSquare(180, path.resolve("public/apple-touch-icon.png"));
}

main();
