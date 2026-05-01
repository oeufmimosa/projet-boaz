import { cn } from "@/components/ui/cn";

/**
 * Marqueur de sélection hexagonal animé — coin haut-droit des ChoiceCard.
 * - checked   : hexagone plein primary-700 + ✓ blanc, scale 0→1 cubic-bezier rebond
 * - unchecked : hexagone vide bordure primary-200
 * Toujours hexagonal (signature visuelle) ; aria-hidden, c'est la card
 * porteuse qui gère la sémantique radio/checkbox.
 */
export function SelectMark({
  checked,
  size = 24,
  className,
}: {
  checked: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: (size * 64) / 56 }}
    >
      {/* Hexagone fond — toujours rendu (vide en non-coché) */}
      <svg viewBox="0 0 56 64" className="absolute inset-0 h-full w-full">
        <path
          d="M28 2 52 16v32L28 62 4 48V16Z"
          fill={checked ? "var(--color-primary-700)" : "var(--color-surface)"}
          stroke={checked ? "var(--color-primary-700)" : "var(--color-border)"}
          strokeWidth={1.5}
        />
      </svg>
      {/* Coche — apparition rebond à la sélection */}
      {checked && (
        <svg
          viewBox="0 0 24 24"
          className="relative h-3.5 w-3.5 text-text-inverse select-mark-check"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 13 4 4L19 7" />
        </svg>
      )}
      <style>{`
        @keyframes selectMarkBounce {
          0%   { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .select-mark-check {
          animation: selectMarkBounce 200ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .select-mark-check { animation: none; }
        }
      `}</style>
    </span>
  );
}
