import Image from "next/image";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { Container } from "@/components/ui/Container";
import { FrenchBadge } from "@/components/brand/FrenchBadge";
import { HeroVideoBackground } from "@/components/home/HeroVideoBackground";
import { prisma } from "@/lib/prisma";

const HERO_VIDEO_MP4 = "/placeholders/hero-background.mp4";
const HERO_VIDEO_WEBM = "/placeholders/hero-background.webm";
const HERO_VIDEO_POSTER = "/placeholders/hero-background-poster.jpg";

function videoFileExists(publicPath: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", publicPath.replace(/^\//, "")));
  } catch {
    return false;
  }
}

/**
 * Hero mobile — image de fond portrait dédiée (`home.hero.background.mobile`)
 * + overlay dégradé en 3 stops calé pour le format vertical :
 *   - 92 % en haut (zone titre/sous-titre)
 *   - 60 % au milieu (zone neutre, laisse respirer l'image)
 *   - 90 % en bas (zone CTA + barre collante)
 *
 * Fallback gracieux : si l'image mobile n'a pas été uploadée, on garde le
 * fond uni `--color-primary-800` + motif hexagonal — pas de tentative de
 * recadrer la version desktop (mauvais résultat en portrait).
 *
 * Performance : `<Image fill priority sizes="100vw">` pour le LCP, AVIF/WebP
 * automatique via Next.js, `placeholder="blur"` si blurDataURL est dispo.
 *
 * Cible Lighthouse Performance mobile ≥ 80 (un cran sous desktop, accepté).
 */
async function loadHeroMobileBg(): Promise<{ url: string | null; blurDataURL: string | null }> {
  try {
    const asset = await prisma.mediaAsset.findUnique({
      where: { key: "home.hero.background.mobile" },
    });
    return { url: asset?.url ?? null, blurDataURL: asset?.blurDataURL ?? null };
  } catch {
    return { url: null, blurDataURL: null };
  }
}

export async function HeroMobile({ title, subtitle }: { title: string; subtitle: string }) {
  const bg = await loadHeroMobileBg();
  const hasBg = Boolean(bg.url);
  const hasVideo = videoFileExists(HERO_VIDEO_MP4);
  const hasWebm = videoFileExists(HERO_VIDEO_WEBM);
  const hasOptimizedPoster = videoFileExists(HERO_VIDEO_POSTER);
  // Poster prioritaire : poster vidéo dédié > image mobile MediaAsset > rien
  const posterUrl = hasOptimizedPoster ? HERO_VIDEO_POSTER : bg.url ?? "";
  const hasMedia = hasVideo || hasBg;

  return (
    <section className="relative isolate overflow-hidden bg-primary-900 text-text-inverse">
      {/* Couche -10 : vidéo (si dispo) ou image portrait mobile en fallback */}
      {hasVideo ? (
        <HeroVideoBackground
          sources={{
            mp4: HERO_VIDEO_MP4,
            ...(hasWebm ? { webm: HERO_VIDEO_WEBM } : {}),
          }}
          poster={posterUrl}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      ) : (
        hasBg && (
          <Image
            src={bg.url!}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-10 object-cover"
            {...(bg.blurDataURL
              ? { placeholder: "blur" as const, blurDataURL: bg.blurDataURL }
              : {})}
          />
        )
      )}

      {/* Overlay 3 stops (vertical) — primary-900 92 % → 60 % → 90 % */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: hasMedia
            ? "linear-gradient(180deg, rgba(6,26,16,0.92) 0%, rgba(6,26,16,0.60) 50%, rgba(6,26,16,0.90) 100%)"
            : "var(--color-primary-800)",
        }}
      />

      {/* Motif hexagonal — discret par-dessus image/vidéo, plus présent en fallback */}
      <div
        aria-hidden
        className={`absolute inset-0 -z-10 hex-pattern ${hasMedia ? "opacity-[0.05]" : "opacity-50"} pointer-events-none`}
      />

      <Container className="relative flex flex-col items-center py-10 text-center">
        <FrenchBadge variant="dark" />
        <h1 className="mt-5 text-display-lg font-display text-balance">{title}</h1>
        <div className="mt-3 space-y-2 text-body-sm text-primary-100">
          <p>
            Pompe à chaleur, climatisation, isolation et équipements énergétiques performants.
          </p>
          <p>
            Groupe Climat Hexagone accompagne les particuliers dans leurs projets de rénovation
            énergétique avec des solutions adaptées, des équipements certifiés et un accompagnement complet.
          </p>
          <p>
            Selon les critères d&apos;éligibilité et les aides mobilisables, certains projets peuvent
            bénéficier d&apos;{" "}
            <span className="font-bold text-accent-500">
              un reste à charge fortement réduit, voire quasi nul
            </span>{" "}
            dans certaines situations.
          </p>
        </div>

        <Link
          href="/simulateur"
          className="mt-6 flex h-14 w-full items-center justify-between gap-2 rounded-md bg-accent-500 px-5 text-primary-800 font-display font-semibold shadow-lg hover:bg-accent-600"
        >
          <span>Estimer mes aides en 2 min</span>
          <span aria-hidden className="relative inline-flex h-9 w-8 items-center justify-center">
            <svg viewBox="0 0 56 64" className="absolute inset-0 h-full w-full">
              <path d="M28 2 52 16v32L28 62 4 48V16Z" fill="var(--color-primary-700)" />
            </svg>
            <svg viewBox="0 0 24 24" className="relative h-4 w-4 text-text-inverse" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </span>
        </Link>

        <ul className="mt-4 flex w-full items-center justify-between gap-2 text-body-sm text-primary-100">
          <ReassuranceItem color="var(--color-fr-blue)" label="Gratuit" />
          <Sep />
          <ReassuranceItem color="var(--color-fr-white)" label="Sans engagement" />
          <Sep />
          <ReassuranceItem color="var(--color-fr-red)" label="100 % en ligne" />
        </ul>

        {/* Bandeau réassurance — 3 chiffres-clés (identique au desktop, compact pour mobile) */}
        <div className="mt-8 grid w-full grid-cols-1 gap-px overflow-hidden rounded-lg border border-primary-700 bg-primary-700 sm:grid-cols-3">
          {REASSURANCE_BLOCKS.map((r, i) => (
            <div key={i} className="relative bg-primary-800 p-4 text-center">
              <p className="font-display text-lg font-bold leading-tight text-accent-500 sm:text-xl">
                {r.value}
              </p>
              <p className="mt-1.5 text-body-sm text-primary-200">{r.label}</p>
              {i < REASSURANCE_BLOCKS.length - 1 && (
                <div
                  aria-hidden
                  className="absolute right-0 top-1/2 hidden h-10 w-0.5 -translate-y-1/2 sm:flex flex-col overflow-hidden"
                >
                  <div className="flex-1" style={{ background: "var(--color-fr-blue)" }} />
                  <div className="flex-1" style={{ background: "var(--color-fr-white)" }} />
                  <div className="flex-1" style={{ background: "var(--color-fr-red)" }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

const REASSURANCE_BLOCKS = [
  { value: "37 ans",                  label: "Structure fondée en 1989" },
  { value: "Équipements certifiés",   label: "Marques reconnues du marché" },
  { value: "Accompagnement complet",  label: "De l'étude à l'installation" },
];

function ReassuranceItem({ color, label }: { color: string; label: string }) {
  return (
    <li className="flex flex-1 items-center justify-center gap-1.5">
      <span aria-hidden style={{ color }}>✓</span>
      <span>{label}</span>
    </li>
  );
}

function Sep() {
  return <span aria-hidden className="h-3 w-px bg-primary-700" />;
}
