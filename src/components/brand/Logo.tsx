import { cn } from "@/components/ui/cn";

type Variant = "default" | "white" | "dark";
type Layout = "mark" | "wordmark" | "compact";
type Size = "sm" | "md" | "lg";

const SIZE_PX: Record<Size, number> = { sm: 32, md: 40, lg: 56 };

/**
 * Logo Groupe Climat Hexagone — symbole = PNG officiel transparent
 * (`/placeholders/image.png`, fond blanc retiré via remove-white-bg.ts).
 *
 * Le symbole est colorimétriquement fixe (navy + green + tricolore). Les
 * variants n'affectent QUE la couleur du wordmark texte :
 *   - default : texte foncé (sur fonds clairs)
 *   - white   : texte blanc (sur fonds verts foncés / image)
 *   - dark    : texte navy (sur fonds clairs, version monochrome assumée)
 *
 * Layouts :
 *   - mark            : symbole seul (favicon, FAB chatbox, espaces réduits)
 *   - wordmark        : symbole + « Groupe Climat » / « HEXAGONE » sur 2 lignes
 *   - compact         : symbole + « Groupe Climat Hexagone » sur 1 ligne
 *
 * Sizes : sm (32 px), md (40 px), lg (56 px) — appliqué au symbole.
 */
export function Logo({
  variant = "default",
  layout = "wordmark",
  size = "md",
  className,
}: {
  variant?: Variant;
  layout?: Layout;
  size?: Size;
  className?: string;
}) {
  const colors = getColors(variant);
  const px = SIZE_PX[size];

  if (layout === "mark") {
    return (
      <span className={cn("inline-block", className)}>
        <Symbol size={px} />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center",
        layout === "compact" ? "gap-2" : "gap-3",
        className,
      )}
    >
      <Symbol size={px} />
      {layout === "compact" ? (
        <span
          className="font-display whitespace-nowrap overflow-hidden text-ellipsis"
          style={{
            color: colors.text,
            fontSize: size === "sm" ? "0.7rem" : size === "lg" ? "1rem" : "0.875rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            lineHeight: 1.1,
            textTransform: "uppercase",
          }}
        >
          Groupe Climat Hexagone
        </span>
      ) : (
        <span className="leading-none flex flex-col">
          <span
            className="uppercase font-body font-semibold whitespace-nowrap"
            style={{
              color: colors.subtle,
              fontSize: px <= 32 ? "0.625rem" : "0.6875rem",
              letterSpacing: "0.18em",
            }}
          >
            Groupe Climat
          </span>
          <span
            className="font-display font-extrabold tracking-tight whitespace-nowrap"
            style={{
              color: colors.text,
              fontSize: px <= 32 ? "1rem" : px >= 56 ? "1.5rem" : "1.25rem",
              marginTop: "2px",
            }}
          >
            HEXAGONE
          </span>
        </span>
      )}
    </span>
  );
}

/**
 * Symbole seul, exposé pour le favicon, l'OG image, le FAB chatbox.
 */
export function LogoMark({
  size = "md",
  className,
}: {
  /** Variant non utilisé : le PNG officiel est colorimétriquement fixe.
   *  On garde la signature pour compat — le param est ignoré. */
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  const px = SIZE_PX[size];
  return (
    <span className={cn("inline-block", className)}>
      <Symbol size={px} />
    </span>
  );
}

function Symbol({ size }: { size: number }) {
  // PNG officiel transparent (généré via scripts/remove-white-bg.ts).
  // Pas de next/image ici car le composant est utilisé dans des contextes
  // mixés server/client et à des tailles fixes très petites — un <img>
  // simple est suffisant et évite les contraintes Image SSR.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/placeholders/image.png"
      alt=""
      aria-hidden
      width={size}
      height={size}
      className="shrink-0"
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}

type LogoColors = {
  text: string;
  subtle: string;
};

function getColors(variant: Variant): LogoColors {
  switch (variant) {
    case "white":
      return {
        text: "var(--color-text-inverse)",
        subtle: "rgba(255,255,255,0.72)",
      };
    case "dark":
      return {
        text: "var(--color-brand-navy)",
        subtle: "rgba(26,44,91,0.7)",
      };
    case "default":
    default:
      return {
        text: "var(--color-text)",
        subtle: "var(--color-brand-navy)",
      };
  }
}
