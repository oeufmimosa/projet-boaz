import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { TricolorBar } from "@/components/brand/TricolorBar";
import { getAssetByKey } from "@/lib/media";

/**
 * Section "Parrainage" sur la home — full-bg image
 * (`home.parrainage.image` = visuel cadeau) + overlay vertical pour la
 * lisibilité du texte. Pas de panneau image latéral.
 */
export async function ParrainageSection() {
  const img = await getAssetByKey("home.parrainage.image");
  return (
    <section className="relative isolate overflow-hidden bg-primary-900 py-16 text-text-inverse sm:py-20">
      {img && (
        <Image
          src={img.url}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="absolute inset-0 -z-10 object-cover"
          {...(img.blurDataURL
            ? { placeholder: "blur" as const, blurDataURL: img.blurDataURL }
            : {})}
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: img
            ? "linear-gradient(180deg, rgba(6,26,16,0.78) 0%, rgba(6,26,16,0.55) 50%, rgba(6,26,16,0.92) 100%)"
            : "var(--color-primary-700)",
        }}
      />

      <Container className="relative">
        <p className="font-body text-body-sm uppercase tracking-[0.18em] text-accent-500">
          Programme parrainage
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold sm:text-4xl md:text-5xl">
          Recommandez-nous et gagnez{" "}
          <span className="text-accent-500">jusqu'à 1 000 €</span>
        </h2>
        <p className="mt-4 max-w-xl text-body-lg text-white/90">
          Vos proches profitent de nos installateurs agréés, vous touchez une prime.
          Sans limite de filleuls.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <LinkButton href="/parrainage" variant="accent" size="lg">
            Découvrir le parrainage
          </LinkButton>
          <Link
            href="/parrainage#comment-ca-marche"
            className="inline-flex items-center text-body-sm font-semibold text-white/85 underline-offset-4 hover:underline"
          >
            Comment ça marche ?
          </Link>
        </div>
        <div className="mt-6">
          <TricolorBar />
        </div>
      </Container>
    </section>
  );
}
