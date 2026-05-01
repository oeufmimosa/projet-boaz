import { cn } from "@/components/ui/cn";

/**
 * Badge "Entreprise française" — mini-drapeau SVG + texte.
 * Texte explicite (jamais juste un drapeau), pour rester accessible et lisible.
 */
export function FrenchBadge({
  label = "Entreprise française",
  className,
  variant = "light",
}: {
  label?: string;
  className?: string;
  variant?: "light" | "dark";
}) {
  const text = variant === "light" ? "text-text" : "text-text-inverse";
  const bg   = variant === "light"
    ? "bg-surface border border-border"
    : "bg-primary-800 border border-primary-700";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-body-sm font-semibold",
        bg,
        text,
        className,
      )}
    >
      <Flag />
      <span>{label}</span>
    </span>
  );
}

function Flag() {
  return (
    <svg
      width="18"
      height="12"
      viewBox="0 0 18 12"
      aria-hidden="true"
      className="shrink-0 rounded-[2px] overflow-hidden"
    >
      <rect x="0" y="0" width="6" height="12" fill="var(--color-fr-blue)" />
      <rect x="6" y="0" width="6" height="12" fill="var(--color-fr-white)" />
      <rect x="12" y="0" width="6" height="12" fill="var(--color-fr-red)" />
      <rect x="0" y="0" width="18" height="12" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
    </svg>
  );
}
