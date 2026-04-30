# Projet Boaz — Clone fonctionnel d'Effy.fr (phase 1)

Base technique d'un site de rénovation énergétique : pages marketing, simulateur multi-étapes, back-office admin minimaliste, envoi d'email, base SQLite via Prisma. **Phase 1 : structure et fonctionnalités, pas de design final.**

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (variables CSS pour rethème facile)
- Prisma + SQLite
- Nodemailer (Ethereal en dev si SMTP absent)
- bcryptjs + cookie httpOnly (auth maison)
- react-hook-form + zod (partagé client/serveur)
- pino (logs JSON)
- Vitest (unit) + Playwright (smoke e2e)

## Prérequis

- Node.js >= 20
- pnpm >= 9 (`npm i -g pnpm@9`)

## Installation rapide

```bash
# Une seule commande :
bash scripts/setup.sh
# ou
make setup
# ou manuellement :
pnpm install
cp .env.example .env
pnpm prisma migrate dev --name init
pnpm seed
pnpm dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Toutes documentées dans [`.env.example`](.env.example). Les principales :

| Variable | Rôle |
|---|---|
| `DATABASE_URL` | URL Prisma (SQLite par défaut) |
| `AUTH_SECRET` | Secret HMAC pour le hash des tokens de session (32+ chars) |
| `SESSION_TTL_DAYS` | Durée de vie d'une session admin (défaut : 7) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Compte admin créé par le seed |
| `LOGIN_RATE_LIMIT_MAX` / `LOGIN_RATE_LIMIT_WINDOW_MS` | Rate-limit du login |
| `UPLOAD_MAX_BYTES` | Taille max d'un upload image (défaut : 5 Mo) |
| `SMTP_*`, `MAIL_FROM`, `ADMIN_NOTIFICATION_EMAIL` | Mailer SMTP |

## Identifiants admin par défaut

Crées par le seed à partir de `.env` :

- Email : `admin@example.com`
- Mot de passe : `ChangeMe!2026`

**Change-les avant tout déploiement.**

## Commandes utiles

| Commande | Effet |
|---|---|
| `pnpm dev` | Démarre Next.js en dev |
| `pnpm build` | Build production (lance `prisma generate`) |
| `pnpm start` | Lance le build de prod |
| `pnpm seed` | (Re)crée admin + contenus + simulateur + articles |
| `pnpm prisma migrate dev` | Crée/applique une migration |
| `pnpm prisma studio` | Inspecteur DB graphique |
| `pnpm test` | Tests unitaires (Vitest) |
| `pnpm test:e2e` | Smoke e2e (Playwright) |
| `pnpm test:e2e:install` | Installe Chromium pour Playwright |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |

## Comment ajouter une nouvelle clé de contenu

1. **En base via l'admin** : `/admin/contenus` → bouton "Ajouter une clé". Saisis une clé hiérarchique (`home.hero.title`), choisis un type (`TEXT`, `RICHTEXT`, `JSON`, `IMAGE_REF`) et la valeur.
2. **Côté serveur**, dans une page ou un composant :
   ```ts
   import { getContent } from "@/lib/content";
   const title = await getContent("home.hero.title", "Titre par défaut");
   ```
3. **Convention de nommage** : `<page>.<section>.<élément>` en kebab/snake si besoin (`home.services.card-isolation.title`). Tout est libre tant que c'est unique.

Le seed définit l'ensemble des clés utilisées par les pages livrées : si tu en ajoutes côté composant, ajoute-la aussi au seed pour les futurs environnements vierges.

## Structure du projet

```
src/
  app/                 # App Router (pages publiques + /admin + /api)
  components/          # UI, layout, home sections, simulateur, admin
  lib/                 # prisma, auth, mailer, storage, content, csv, logger, csrf, rate-limit
  hooks/               # hooks React partagés
prisma/
  schema.prisma        # modèles
  seed.ts              # bootstrap data
public/
  uploads/             # images uploadées via l'admin
tests/
  unit/                # Vitest
  e2e/                 # Playwright (smoke simulateur)
```

## Auth admin — détails sécurité

- Mot de passe hashé avec bcrypt (12 rounds).
- Token de session aléatoire 32 octets ; **stocké en DB sous forme HMAC-SHA256(token, AUTH_SECRET)** — le cookie contient le token clair, jamais la DB.
- Cookie `Host-bz_session` : `httpOnly`, `SameSite=Lax`, `Secure` en prod.
- **Rotation à chaque login** (les sessions précédentes du même user sont révoquées).
- Expiration configurable (`SESSION_TTL_DAYS`).
- **Rate-limit** in-memory sur `/api/auth/login` (sliding window) — bascule possible vers Redis/DB.
- **CSRF double-submit cookie** sur toutes les routes admin mutantes (POST/PUT/PATCH/DELETE).

## Mailer dev

Si `SMTP_HOST` est vide en dev, le module `lib/mailer.ts` :
1. Crée un compte Ethereal automatiquement et logue l'URL d'aperçu pour chaque email.
2. Écrit aussi le rendu HTML dans `tmp/mails/<timestamp>.html`.

En prod, configure un vrai SMTP. Si l'envoi échoue, la soumission n'est jamais bloquée — un flag `emailSent=false` + `emailError` est stocké.

## Roadmap phase 2 (hors scope ici)

- Design system finalisé (couleurs, typo, illustrations).
- Contenu rédactionnel réel.
- Éditeur WYSIWYG (Tiptap) pour les articles.
- Stockage S3/Cloudinary via l'interface `Storage` déjà en place.
- Internationalisation (FR/EN) — migration Prisma triviale.
