$ErrorActionPreference = "Stop"

Write-Host "==> 1/4 Checking pnpm..."
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "pnpm not found. Install via: npm i -g pnpm@9"
    exit 1
}

Write-Host "==> 2/4 Installing dependencies..."
pnpm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "==> 3/4 Copying .env if missing..."
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "    .env created from .env.example - review values before using in production."
}

Write-Host "==> 4/4 Running Prisma migrate + seed..."
pnpm prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
pnpm seed
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Done. Start the dev server with: pnpm dev"
Write-Host "Admin login: see ADMIN_EMAIL / ADMIN_PASSWORD in .env"
