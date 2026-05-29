import fs from "node:fs";
import path from "node:path";

function loadEnv() {
  const f = path.resolve(".env");
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const e = t.indexOf("=");
    if (e === -1) continue;
    let v = t.slice(e + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[t.slice(0, e).trim()]) process.env[t.slice(0, e).trim()] = v;
  }
}
loadEnv();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Strategie : on parcourt toutes les entrees Content qui contiennent "2025"
  // et on les remplace par "2026". Le filtre est strict (chaine exacte "2025")
  // pour eviter de toucher 12025, 20250, etc.
  const rows = await prisma.content.findMany({
    where: { value: { contains: "2025" } },
    select: { key: true, value: true },
  });

  let count = 0;
  for (const r of rows) {
    const newValue = r.value.replace(/2025/g, "2026");
    await prisma.content.update({ where: { key: r.key }, data: { value: newValue } });
    console.log(`✓ ${r.key}`);
    count++;
  }

  console.log(`\n${count} entree(s) Content mise(s) a jour.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
