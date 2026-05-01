import { cn } from "./cn";

/**
 * Placeholder visuel — bloc dégradé vert clair → vert moyen, avec hexagone
 * en filigrane. Utilisé là où une image manque encore.
 */
export function Placeholder({
  label,
  className,
  ratio = "16/9",
  tone = "soft",
}: {
  label?: string;
  className?: string;
  ratio?: string;
  tone?: "soft" | "dark";
}) {
  const bg =
    tone === "dark"
      ? "bg-primary-800 text-text-inverse"
      : "bg-primary-100 text-primary-700";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg flex items-center justify-center",
        bg,
        className,
      )}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={label ?? "Placeholder"}
    >
      <svg
        viewBox="0 0 56 64"
        aria-hidden="true"
        className="absolute -right-6 -bottom-6 w-2/3 h-2/3 opacity-30"
      >
        <path d="M28 2 52 16v32L28 62 4 48V16Z" fill="currentColor" />
      </svg>
      <span className="relative px-4 text-center text-body-sm font-semibold">
        {label ?? "[placeholder]"}
      </span>
    </div>
  );
}
