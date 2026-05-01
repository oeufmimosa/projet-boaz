import { cn } from "@/components/ui/cn";

/**
 * Avatar conseiller — hexagone vert clair avec initiales.
 * Variants : light (sur fond foncé) / dark (sur fond clair).
 */
export function ChatAvatar({
  initials,
  size = 36,
  variant = "dark",
  className,
}: {
  initials: string;
  size?: number;
  variant?: "light" | "dark";
  className?: string;
}) {
  const colors = variant === "light"
    ? { fill: "var(--color-primary-100)", text: "var(--color-primary-700)" }
    : { fill: "var(--color-primary-700)", text: "var(--color-text-inverse)" };

  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: (size * 64) / 56 }}
    >
      <svg viewBox="0 0 56 64" className="absolute inset-0 h-full w-full">
        <path d="M28 2 52 16v32L28 62 4 48V16Z" fill={colors.fill} />
      </svg>
      <span
        className="relative font-display font-bold"
        style={{ color: colors.text, fontSize: size * 0.42 }}
      >
        {initials.slice(0, 2).toUpperCase()}
      </span>
    </span>
  );
}
