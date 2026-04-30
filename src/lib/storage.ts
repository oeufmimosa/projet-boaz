import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { env } from "./env";

export interface StoredFile {
  filename: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface Storage {
  save(file: { buffer: Buffer; originalName: string; mimeType: string }): Promise<StoredFile>;
  delete(filename: string): Promise<void>;
}

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export class UploadError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/**
 * Sniff a few bytes to guess a real image type. Cheap defence vs. clients
 * that lie about mime/extension. Not a full magic-byte library — covers the
 * common cases we accept.
 */
function sniffImageMime(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  // PNG
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "image/png";
  // JPEG
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  // GIF
  if (buf.toString("ascii", 0, 3) === "GIF") return "image/gif";
  // WEBP: "RIFF....WEBP"
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    return "image/webp";
  }
  // SVG (loose check)
  const head = buf.slice(0, 256).toString("utf8").trim().toLowerCase();
  if (head.startsWith("<?xml") || head.startsWith("<svg")) return "image/svg+xml";
  return null;
}

class LocalStorage implements Storage {
  async save(file: { buffer: Buffer; originalName: string; mimeType: string }) {
    if (file.buffer.length > env.upload.maxBytes) {
      throw new UploadError(413, `Fichier trop lourd (max ${env.upload.maxBytes} octets)`);
    }
    const sniffed = sniffImageMime(file.buffer);
    if (!sniffed || !ALLOWED_MIME.has(sniffed)) {
      throw new UploadError(415, "Type de fichier non autorisé");
    }
    if (file.mimeType && file.mimeType !== sniffed) {
      // Fall through: trust sniffed type, don't trust client.
    }

    const ext = extensionFor(sniffed);
    const base = slugify(path.parse(file.originalName).name) || "image";
    const hash = crypto.randomBytes(4).toString("hex");
    const filename = `${base}-${hash}${ext}`;

    const dir = path.resolve(env.upload.dir);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), file.buffer);

    return {
      filename,
      url: `${env.upload.publicPrefix}/${filename}`,
      size: file.buffer.length,
      mimeType: sniffed,
    };
  }

  async delete(filename: string) {
    const safe = path.basename(filename);
    const full = path.join(path.resolve(env.upload.dir), safe);
    await fs.unlink(full).catch(() => {});
  }
}

function extensionFor(mime: string): string {
  switch (mime) {
    case "image/png": return ".png";
    case "image/jpeg": return ".jpg";
    case "image/gif": return ".gif";
    case "image/webp": return ".webp";
    case "image/svg+xml": return ".svg";
    default: return "";
  }
}

export const storage: Storage = new LocalStorage();
