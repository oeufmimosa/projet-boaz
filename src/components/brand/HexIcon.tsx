import { cn } from "@/components/ui/cn";

type Tone = "soft" | "solid" | "outline";
type Size = "sm" | "md" | "lg";

const sizeMap: Record<Size, { box: string; iconSize: number }> = {
  sm: { box: "w-10 h-[44px]", iconSize: 18 },
  md: { box: "w-14 h-[60px]", iconSize: 22 },
  lg: { box: "w-20 h-[88px]", iconSize: 30 },
};

/**
 * Icône inscrite dans un hexagone — clin d'œil au nom Hexagon + L'Hexagone.
 * - soft    : fond primary-100, contenu primary-700 (cards services)
 * - solid   : fond primary-700, contenu blanc (étapes "Comment ça marche")
 * - outline : fond transparent, bordure primary-300, contenu primary-700
 */
export function HexIcon({
  children,
  tone = "soft",
  size = "md",
  className,
  label,
}: {
  children?: React.ReactNode;
  tone?: Tone;
  size?: Size;
  className?: string;
  label?: string;
}) {
  const { box, iconSize } = sizeMap[size];
  const colors = colorsFor(tone);

  return (
    <span
      className={cn("relative inline-flex items-center justify-center", box, className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
    >
      <svg
        viewBox="0 0 56 64"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <path
          d="M28 2 52 16v32L28 62 4 48V16Z"
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={tone === "outline" ? 1.5 : 0}
        />
      </svg>
      <span
        className="relative inline-flex items-center justify-center"
        style={{ color: colors.content, width: iconSize, height: iconSize }}
      >
        {children}
      </span>
    </span>
  );
}

function colorsFor(tone: Tone) {
  switch (tone) {
    case "solid":
      return {
        fill: "var(--color-primary-700)",
        stroke: "transparent",
        content: "var(--color-text-inverse)",
      };
    case "outline":
      return {
        fill: "transparent",
        stroke: "var(--color-primary-300)",
        content: "var(--color-primary-700)",
      };
    case "soft":
    default:
      return {
        fill: "var(--color-primary-100)",
        stroke: "transparent",
        content: "var(--color-primary-700)",
      };
  }
}

/** Petit hexagone seul, utilisable comme puce devant une liste. */
export function HexBullet({ className }: { className?: string }) {
  return (
    <svg
      width="10"
      height="11"
      viewBox="0 0 56 64"
      aria-hidden="true"
      className={cn("inline-block shrink-0", className)}
    >
      <path d="M28 2 52 16v32L28 62 4 48V16Z" fill="var(--color-primary-500)" />
    </svg>
  );
}
