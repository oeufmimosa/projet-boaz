import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { FrenchBadge } from "@/components/brand/FrenchBadge";
import { EditableText } from "@/components/editor/EditableText";
import { EditableButton } from "@/components/editor/EditableButton";
import { HeroVideoBackground } from "@/components/home/HeroVideoBackground";
import { getContent } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import fs from "node:fs";
import path from "node:path";

// Détection au build/runtime de la présence des fichiers vidéo dans /public.
// Si la vidéo a été déposée, on l'utilise ; sinon, fallback image classique.
const HERO_VIDEO_MP4  = "/placeholders/hero-background.mp4";
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
 * Hero serveur. Récupère :
 *   - `home.hero.image` : visuel hexagonal côté droit (existant)
 *   - `home.hero.background` : image de fond du hero (nouveau)
 *
 * Si `home.hero.background` n'a pas encore d'asset, fallback gracieux sur
 * fond uni `--color-primary-800` + motif hexagonal.
 *
 * Image de fond : `<Image fill priority sizes="100vw">` pour optimiser le
 * LCP. Overlay dégradé `--color-primary-900` 92 % à gauche → 55 % à droite
 * pour conserver la lisibilité du texte blanc.
 */
async function loadHeroBackground(): Promise<{ url: string | null; blurDataURL: string | null }> {
  try {
    const bg = await prisma.mediaAsset.findUnique({ where: { key: "home.hero.background" } });
    return { url: bg?.url ?? null, blurDataURL: bg?.blurDataURL ?? null };
  } catch {
    return { url: null, blurDataURL: null };
  }
}

const REASSURANCE = [
  { value: "37 ans",                  label: "Structure fondée en 1989" },
  { value: "Équipements certifiés",   label: "Marques reconnues du marché" },
  { value: "Accompagnement complet",  label: "De l'étude à l'installation" },
];

export async function Hero({
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}) {
  const background = await loadHeroBackground();
  const hasBg = Boolean(background.url);
  const hasVideo = videoFileExists(HERO_VIDEO_MP4);
  const hasWebm = videoFileExists(HERO_VIDEO_WEBM);
  const hasOptimizedPoster = videoFileExists(HERO_VIDEO_POSTER);
  // Poster prioritaire : poster vidéo dédié > image de fond MediaAsset > rien
  const posterUrl = hasOptimizedPoster
    ? HERO_VIDEO_POSTER
    : background.url ?? "";

  return (
    <section className="relative isolate overflow-hidden bg-primary-900 text-text-inverse">
      {/* Couche -10 : vidéo (si dispo) ou image fallback */}
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
            src={background.url!}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-10 object-cover"
            {...(background.blurDataURL
              ? { placeholder: "blur" as const, blurDataURL: background.blurDataURL }
              : {})}
          />
        )
      )}

      {/* Overlay dégradé pour la lisibilité du texte blanc.
          --color-primary-900 = #061A10 = rgb(6, 26, 16).
          Appliqué que la couche -10 soit une image OU une vidéo. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: hasVideo || hasBg
            ? "linear-gradient(90deg, rgba(6,26,16,0.92) 0%, rgba(6,26,16,0.78) 40%, rgba(6,26,16,0.55) 100%)"
            : "var(--color-primary-800)",
        }}
      />

      {/* Motif hexagonal très discret par-dessus l'image/vidéo, plus présent
          en fallback uni. */}
      <div
        aria-hidden
        className={`absolute inset-0 -z-10 hex-pattern ${hasVideo || hasBg ? "opacity-[0.05]" : "opacity-60"} pointer-events-none`}
      />

      <Container className="relative py-12 lg:py-20">
        {/* Une seule colonne — le panneau droit a été retiré, le fond image +
            overlay assure la présence visuelle. Texte cadré max-w-2xl pour
            la lisibilité. */}
        <div className="max-w-2xl">
          <FrenchBadge variant="dark" />
          <EditableText
            contentKey="home.hero.title"
            initialValue={title}
            as="h1"
            className="mt-5 text-display-xl font-display"
            maxLength={200}
          />
          <div className="mt-5 max-w-xl space-y-2 text-body text-primary-100">
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
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <EditableButton
              contentKey="home.hero.cta_primary"
              hrefKey="home.hero.cta_primary.href"
              initialLabel={ctaPrimary}
              initialHref={await getContent("home.hero.cta_primary.href", "/simulateur")}
              variant="accent"
              size="lg"
              className="w-full sm:w-auto"
            />
            <EditableButton
              contentKey="home.hero.cta_secondary"
              hrefKey="home.hero.cta_secondary.href"
              initialLabel={ctaSecondary}
              initialHref={await getContent("home.hero.cta_secondary.href", "/aides")}
              variant="inverse"
              size="lg"
              className="w-full sm:w-auto"
            />
          </div>
        </div>

        {/* Bandeau réassurance — séparateurs tricolores verticaux fins */}
        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-primary-700 bg-primary-700 sm:grid-cols-3">
          {REASSURANCE.map((r, i) => (
            <div key={i} className="relative bg-primary-800 p-5 text-center">
              <p className="font-display text-2xl font-bold leading-tight text-accent-500">{r.value}</p>
              <p className="mt-2 text-body-sm text-primary-200">{r.label}</p>
              {i < REASSURANCE.length - 1 && (
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
