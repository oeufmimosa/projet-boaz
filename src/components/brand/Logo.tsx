import { cn } from "@/components/ui/cn";

type Variant = "default" | "white" | "dark";

/**
 * Logo Groupe Climat Hexagon — symbole hexagonal rempli du drapeau français
 * + wordmark à côté.
 *
 * - default : hexagone drapeau, bordure vert foncé, wordmark teinte texte
 * - white   : hexagone drapeau (couleurs conservées), bordure blanche, wordmark blanc
 *             (réservé aux fonds verts foncés)
 * - dark    : hexagone vert foncé monochrome (sans drapeau), wordmark vert foncé
 */
export function Logo({
  variant = "default",
  className,
  withWordmark = true,
  size = 36,
}: {
  variant?: Variant;
  className?: string;
  withWordmark?: boolean;
  size?: number;
}) {
  const colors = getColors(variant);
  const idSuffix = `${variant}-${size}`;

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Symbol colors={colors} size={size} idSuffix={idSuffix} />
      {withWordmark && (
        <span className="leading-none flex flex-col">
          <span
            className="text-[0.6875rem] uppercase tracking-[0.18em] font-body font-semibold"
            style={{ color: colors.subtle }}
          >
            Groupe Climat
          </span>
          <span
            className="font-display font-extrabold tracking-tight text-[1.125rem] sm:text-[1.25rem]"
            style={{ color: colors.text }}
          >
            HEXAGON
          </span>
        </span>
      )}
    </span>
  );
}

function Symbol({
  colors,
  size,
  idSuffix,
}: {
  colors: ReturnType<typeof getColors>;
  size: number;
  idSuffix: string;
}) {
  const clipId = `bz-logo-clip-${idSuffix}`;
  return (
    <svg
      width={size}
      height={(size * 64) / 56}
      viewBox="0 0 56 64"
      role="img"
      aria-label="Groupe Climat Hexagon"
      className="shrink-0"
    >
      <defs>
        <clipPath id={clipId}>
          <path d="M28 2 52 16v32L28 62 4 48V16Z" />
        </clipPath>
      </defs>

      {colors.flagInside ? (
        <>
          {/* Drapeau français découpé en hexagone */}
          <g clipPath={`url(#${clipId})`}>
            <rect x="0" y="0" width="18.667" height="64" fill="var(--color-fr-blue)" />
            <rect x="18.667" y="0" width="18.667" height="64" fill="var(--color-fr-white)" />
            <rect x="37.333" y="0" width="18.667" height="64" fill="var(--color-fr-red)" />
          </g>
          {/* Bordure de l'hexagone par-dessus pour bien découper la silhouette */}
          <path
            d="M28 2 52 16v32L28 62 4 48V16Z"
            fill="none"
            stroke={colors.symbolStroke}
            strokeWidth="2"
          />
        </>
      ) : (
        <path
          d="M28 2 52 16v32L28 62 4 48V16Z"
          fill={colors.symbolFill}
          stroke={colors.symbolStroke}
          strokeWidth="1.5"
        />
      )}
    </svg>
  );
}

function getColors(variant: Variant) {
  switch (variant) {
    case "white":
      return {
        flagInside: true,
        symbolFill: "transparent",
        symbolStroke: "var(--color-text-inverse)",
        text: "var(--color-text-inverse)",
        subtle: "rgba(255,255,255,0.7)",
      };
    case "dark":
      return {
        flagInside: false,
        symbolFill: "var(--color-primary-700)",
        symbolStroke: "var(--color-primary-900)",
        text: "var(--color-primary-700)",
        subtle: "var(--color-primary-500)",
      };
    case "default":
    default:
      return {
        flagInside: true,
        symbolFill: "transparent",
        symbolStroke: "var(--color-primary-800)",
        text: "var(--color-text)",
        subtle: "var(--color-primary-600)",
      };
  }
}
