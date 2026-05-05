import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FrenchBadge } from "@/components/brand/FrenchBadge";
import { prisma } from "@/lib/prisma";

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

  return (
    <section className="relative isolate overflow-hidden bg-primary-900 text-text-inverse">
      {/* Image de fond portrait (mobile) */}
      {hasBg && (
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
      )}

      {/* Overlay 3 stops (vertical) — primary-900 92 % → 60 % → 90 % */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: hasBg
            ? "linear-gradient(180deg, rgba(6,26,16,0.92) 0%, rgba(6,26,16,0.60) 50%, rgba(6,26,16,0.90) 100%)"
            : "var(--color-primary-800)",
        }}
      />

      {/* Motif hexagonal — discret par-dessus image, plus présent en fallback */}
      <div
        aria-hidden
        className={`absolute inset-0 -z-10 hex-pattern ${hasBg ? "opacity-[0.05]" : "opacity-50"} pointer-events-none`}
      />

      <Container className="relative flex flex-col items-center py-10 text-center">
        <FrenchBadge variant="dark" />
        <h1 className="mt-5 text-display-lg font-display text-balance">{title}</h1>
        <p className="mt-3 text-body-lg text-primary-100">{subtitle}</p>

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
      </Container>
    </section>
  );
}

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
