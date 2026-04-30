.PHONY: setup dev build seed migrate test e2e

setup:
	pnpm install
	cp -n .env.example .env || true
	pnpm prisma migrate dev --name init
	pnpm seed

dev:
	pnpm dev

build:
	pnpm build

seed:
	pnpm seed

migrate:
	pnpm prisma migrate dev

test:
	pnpm test

e2e:
	pnpm test:e2e
