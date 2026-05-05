import Link from "next/link";

/**
 * Image inline d'article — composant typé, jamais issu de markdown brut.
 * Rend une `<figure>` avec :
 *  - `<img>` (Next/Image hors champ ici car cover déjà priorisé ; les
 *    inlines sont sous la fold → loading lazy)
 *  - `<figcaption>` portant la légende éditoriale ET l'attribution
 *    (auteur + lien source) si l'image vient d'une banque stock.
 *
 * L'attribution est OBLIGATOIRE quand `attribution` non null, même si
 * Unsplash/Pexels la rendent facultative — politique éditoriale.
 */
export type ArticleImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Légende éditoriale (différente de l'attribution stock). */
  caption?: string | null;
  /** Attribution stock (« Photo : John Doe — Unsplash »). */
  attribution?: string | null;
  /** Lien vers la page source de l'image (Unsplash/Pexels). */
  attributionUrl?: string | null;
};

export function ArticleImage({
  src,
  alt,
  width,
  height,
  caption,
  attribution,
  attributionUrl,
}: ArticleImageProps) {
  return (
    <figure className="my-8 overflow-hidden rounded-lg border border-border bg-surface">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="w-full"
      />
      {(caption || attribution) && (
        <figcaption className="border-t border-border bg-surface-2 px-4 py-2 text-body-sm text-text-muted">
          {caption && <span>{caption}</span>}
          {caption && attribution && <span className="px-2 opacity-60">·</span>}
          {attribution && (
            <span className="text-xs">
              {attributionUrl ? (
                <Link
                  href={attributionUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="hover:underline"
                >
                  {attribution}
                </Link>
              ) : (
                attribution
              )}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
