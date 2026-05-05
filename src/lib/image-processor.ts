import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { env } from "./env";

export interface ProcessedImage {
  filename: string;            // fichier original (recadré/redim si demandé)
  url: string;
  width: number;
  height: number;
  blurDataURL: string;
  variants: { webp1x: string; webp2x: string; webp05x: string };
  size: number;
  mimeType: string;
}

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function extFor(mime: string): string {
  switch (mime) {
    case "image/png": return ".png";
    case "image/jpeg": return ".jpg";
    case "image/webp": return ".webp";
    case "image/gif": return ".gif";
    case "image/svg+xml": return ".svg";
    default: return "";
  }
}

/**
 * Pipeline d'upload : sharp pour métadonnées + variantes responsive (1x, 2x,
 * 0.5x en WebP) + blurDataURL (10px webp en base64).
 *
 * Pour les SVG : pas de traitement sharp (vectoriel), on stocke tel quel et
 * on génère un blurDataURL minimal (couleur uniforme).
 */
export async function processImage(args: {
  buffer: Buffer;
  mimeType: string;
  originalName: string;
  /** Si target défini, recadre/redimensionne en cover sur ces dimensions. */
  targetWidth?: number;
  targetHeight?: number;
}): Promise<ProcessedImage> {
  if (!ALLOWED.has(args.mimeType)) {
    throw new Error(`Type de fichier non autorisé : ${args.mimeType}`);
  }

  const dir = path.resolve(env.upload.dir);
  await fs.mkdir(dir, { recursive: true });

  const base = slugify(path.parse(args.originalName).name) || "image";
  const hash = crypto.randomBytes(4).toString("hex");
  const isSvg = args.mimeType === "image/svg+xml";

  // SVG : passthrough simple
  if (isSvg) {
    const filename = `${base}-${hash}.svg`;
    await fs.writeFile(path.join(dir, filename), args.buffer);
    return {
      filename,
      url: `${env.upload.publicPrefix}/${filename}`,
      width: 0, height: 0,
      blurDataURL: "data:image/svg+xml;base64," + Buffer.from(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'><rect width='1' height='1' fill='%23E2E5DE'/></svg>`,
      ).toString("base64"),
      variants: {
        webp1x: `${env.upload.publicPrefix}/${filename}`,
        webp2x: `${env.upload.publicPrefix}/${filename}`,
        webp05x: `${env.upload.publicPrefix}/${filename}`,
      },
      size: args.buffer.length,
      mimeType: args.mimeType,
    };
  }

  let pipeline = sharp(args.buffer, { failOn: "error" });
  const meta = await pipeline.metadata();
  if (!meta.width || !meta.height) throw new Error("Image illisible");

  // Recadre/redim si target demandé
  if (args.targetWidth && args.targetHeight) {
    pipeline = pipeline.resize(args.targetWidth, args.targetHeight, { fit: "cover", position: "centre" });
  }

  // Original (recadré si demandé) — garde le format d'entrée
  const originalBuffer = await pipeline.toBuffer();
  const finalMeta = await sharp(originalBuffer).metadata();
  const ext = extFor(args.mimeType);
  const filename = `${base}-${hash}${ext}`;
  await fs.writeFile(path.join(dir, filename), originalBuffer);

  // Variantes WebP : 1x, 2x, 0.5x
  const w = finalMeta.width!;
  const h = finalMeta.height!;
  const make = async (scale: number, suffix: string) => {
    const targetW = Math.max(1, Math.round(w * scale));
    const buf = await sharp(originalBuffer).resize(targetW).webp({ quality: 82 }).toBuffer();
    const fname = `${base}-${hash}-${suffix}.webp`;
    await fs.writeFile(path.join(dir, fname), buf);
    return `${env.upload.publicPrefix}/${fname}`;
  };
  const [webp1x, webp2x, webp05x] = await Promise.all([
    make(1, "1x"),
    make(2, "2x"),
    make(0.5, "05x"),
  ]);

  // Blur 10×… (préserve ratio)
  const blurBuf = await sharp(originalBuffer).resize(10).webp({ quality: 50 }).toBuffer();
  const blurDataURL = `data:image/webp;base64,${blurBuf.toString("base64")}`;

  return {
    filename,
    url: `${env.upload.publicPrefix}/${filename}`,
    width: w, height: h,
    blurDataURL,
    variants: { webp1x, webp2x, webp05x },
    size: originalBuffer.length,
    mimeType: args.mimeType,
  };
}
