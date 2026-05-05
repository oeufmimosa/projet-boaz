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

## Configurer les API d'images stock (optionnel)

L'admin permet de chercher des photos libres de droits via Unsplash et Pexels
directement depuis la modale d'upload (onglet « Photos libres »). Aucune image
n'est téléchargée depuis Google Images ou des sites tiers — sources légales
uniquement.

Pour activer cette fonctionnalité, créez deux comptes développeurs gratuits :

1. **Unsplash** — https://unsplash.com/developers
   - Créer une "New Application", choisir "Demo" (limite 50 requêtes/heure suffit)
   - Récupérer l'**Access Key** dans la fiche de l'application
   - Ajouter dans `.env` : `UNSPLASH_ACCESS_KEY="…"`

2. **Pexels** — https://www.pexels.com/api/
   - "Get Started" → générer une clé d'API
   - Ajouter dans `.env` : `PEXELS_API_KEY="…"`

Si l'une ou les deux clés sont absentes, l'onglet « Photos libres » est
désactivé gracieusement côté UI (message explicite, pas d'erreur). Vous
pouvez toujours uploader des images locales via les onglets standards.

> ⚠️ Les images téléchargées via les API stock sont automatiquement persistées
> avec une attribution complète (auteur + lien source + type de licence) dans
> les champs `attribution`, `attributionUrl`, `licenseType` de `MediaAsset`.
> L'attribution est rendue visible côté public sur la page `/credits` (à
> venir, sous-bloc 4.2).

## Vidéo de fond du hero (home)

Le hero desktop joue une vidéo courte (≤ 6 s) qui se fige sur la dernière
frame, ne se rejoue pas dans la même session, et respecte les préférences
utilisateur (reduced-motion, saveData, 2G/slow-2G).

**Fichiers attendus** dans `public/placeholders/` :

| Fichier | Description | Statut |
|---|---|---|
| `hero-background.mp4` | source MP4 H.264, ≤ 3 Mo, sans audio | ✅ déjà en place |
| `hero-background.webm` | VP9, meilleure compression Chrome/Firefox | ⏳ à générer |
| `hero-background-poster.jpg` | image = **dernière frame** de la vidéo | ⏳ à générer |

Tant que `.webm` ou `-poster.jpg` ne sont pas générés, le composant
`<HeroVideoBackground>` fonctionne quand même : il sert le MP4 seul et
utilise l'image de fond `home.hero.background` (MediaAsset) comme poster
fallback.

### Générer les versions optimisées

Pré-requis : ffmpeg installé localement (`brew install ffmpeg`,
`apt install ffmpeg`, `choco install ffmpeg`, ou téléchargé depuis
https://ffmpeg.org/).

```bash
# 1. Ré-encode MP4 H.264 (faststart) + WebM VP9 — sans audio
bash scripts/optimize-hero-video.sh "video/video accueil.mp4"

# 2. Génère le poster (= dernière frame de la vidéo)
bash scripts/generate-poster.sh
```

Le composant détecte automatiquement la présence des fichiers au render
serveur et bascule en mode optimisé : WebM servi en priorité aux
navigateurs compatibles, poster JPG identique à la dernière frame pour une
transition invisible video→poster.

### Comportements gérés par `<HeroVideoBackground>`

- ✅ Lecture une seule fois par session (mémorisée dans `sessionStorage`)
- ✅ Pause sur la dernière frame à la fin (pas de boucle)
- ✅ `prefers-reduced-motion: reduce` → poster seul, pas de lecture
- ✅ `navigator.connection.saveData` ou effective type `2g`/`slow-2g` → poster seul
- ✅ Échec autoplay (politique navigateur) → poster reste visible, log dev
- ✅ `muted` + `playsInline` + `preload="metadata"` pour iOS Safari + LCP

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
