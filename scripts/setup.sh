#!/usr/bin/env bash
set -euo pipefail

echo "==> 1/4 Checking pnpm..."
if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm not found. Install via: npm i -g pnpm@9"
  exit 1
fi

echo "==> 2/4 Installing dependencies..."
pnpm install

echo "==> 3/4 Copying .env if missing..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "    .env created from .env.example — review values before using in production."
fi

echo "==> 4/4 Running Prisma migrate + seed..."
pnpm prisma migrate dev --name init
pnpm seed

echo
echo "Done. Start the dev server with: pnpm dev"
echo "Admin login: see ADMIN_EMAIL / ADMIN_PASSWORD in .env"
