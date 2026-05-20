/**
 * One-shot : migre les MediaAsset depuis prisma/dev.db (SQLite local)
 * vers la base Postgres définie dans DATABASE_URL.
 *
 * Lance : pnpm tsx scripts/migrate-media-sqlite-to-postgres.ts
 */

import Database from "better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "node:path";
import fs from "node:fs";

const SQLITE_PATH = path.join(process.cwd(), "prisma", "dev.db");

if (!fs.existsSync(SQLITE_PATH)) {
  console.error(`✗ SQLite DB not found at ${SQLITE_PATH}`);
  process.exit(1);
}

// dotenv pour lire DATABASE_URL depuis .env (tsx ne le fait pas par défaut)
function loadEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}
loadEnv();

const sqlite = new Database(SQLITE_PATH, { readonly: true });
const prisma = new PrismaClient();

async function main() {
  const rows = sqlite.prepare("SELECT * FROM MediaAsset").all() as any[];
  console.log(`→ ${rows.length} MediaAsset rows in SQLite`);

  let inserted = 0;
  let skipped = 0;
  for (const r of rows) {
    const exists = await prisma.mediaAsset.findUnique({ where: { id: r.id } });
    if (exists) {
      skipped++;
      continue;
    }
    await prisma.mediaAsset.create({
      data: {
        id: r.id,
        key: r.key ?? null,
        filename: r.filename,
        originalName: r.originalName,
        mimeType: r.mimeType,
        size: r.size,
        url: r.url,
        width: r.width ?? null,
        height: r.height ?? null,
        blurDataURL: r.blurDataURL ?? null,
        variants: r.variants ?? null,
        draftFilename: r.draftFilename ?? null,
        draftUrl: r.draftUrl ?? null,
        draftWidth: r.draftWidth ?? null,
        draftHeight: r.draftHeight ?? null,
        draftBlurDataURL: r.draftBlurDataURL ?? null,
        draftVariants: r.draftVariants ?? null,
        draftUpdatedAt: r.draftUpdatedAt ? new Date(r.draftUpdatedAt) : null,
        draftUpdatedBy: r.draftUpdatedBy ?? null,
        attribution: r.attribution ?? null,
        attributionUrl: r.attributionUrl ?? null,
        licenseType: r.licenseType ?? null,
        createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
      },
    });
    inserted++;
  }

  console.log(`✓ Inserted ${inserted}, skipped (already present) ${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    sqlite.close();
  });
