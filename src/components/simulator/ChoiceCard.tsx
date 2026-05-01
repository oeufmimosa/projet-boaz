"use client";

import { cn } from "@/components/ui/cn";
import { SelectMark } from "./SelectMark";
import { Illustration } from "@/components/illustrations/Illustration";

/**
 * Card de sélection visuelle pour le simulateur (radio ou checkbox).
 * - illustration centrale + label sous l'illustration + helper optionnel
 * - SelectMark hexagonal coin haut-droit
 * - États : default / hover / focus-visible / selected (bordure 2px + bg-primary-50 + glow)
 *           / disabled
 * - Animations : tap-scale 0.98 sur :active, mini-bounce de l'illustration à la sélection,
 *                désactivés sous prefers-reduced-motion
 *
 * Usage en groupe radio : `role="radio"` est porté par la card (input natif sr-only),
 * et la card focusable au clavier via tabIndex. Pour la grille, le caller choisit
 * `role="radiogroup"` ou un fieldset checkbox.
 */
export function ChoiceCard({
  label,
  helper,
  illustrationKey,
  selected,
  disabled,
  multiple,
  onSelect,
  name,
  value,
}: {
  label: string;
  helper?: string;
  illustrationKey?: string;
  selected: boolean;
  disabled?: boolean;
  multiple?: boolean;
  onSelect: () => void;
  name?: string;
  value: string;
}) {
  const role = multiple ? "checkbox" : "radio";
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={() => !disabled && onSelect()}
      data-name={name}
      data-value={value}
      className={cn(
        "choice-card group relative flex flex-col items-center gap-3",
        "rounded-lg border-1.5 bg-surface p-5 sm:p-6",
        "text-center transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        selected
          ? "border-primary-700 bg-primary-50 shadow-[0_0_0_4px_var(--color-primary-100)]"
          : "border-border hover:border-primary-300 hover:-translate-y-0.5 hover:shadow-md",
      )}
    >
      <span className="absolute right-3 top-3">
        <SelectMark checked={selected} size={22} />
      </span>

      {illustrationKey && (
        <span
          className={cn(
            "flex h-24 w-24 shrink-0 items-center justify-center",
            "choice-card-illus",
            selected && "is-selected",
          )}
        >
          <Illustration name={illustrationKey} size={96} />
        </span>
      )}

      <span className="flex flex-col items-center gap-0.5">
        <span className="font-display text-body font-semibold text-text">{label}</span>
        {helper && <span className="text-body-sm text-text-muted">{helper}</span>}
      </span>

      <style>{`
        .choice-card:active:not(:disabled) { transform: scale(0.98); }
        @media (hover: none) {
          /* Sur tactile, on évite le hover collé */
          .choice-card:hover { transform: none; box-shadow: none; }
        }
        @keyframes illusBounce {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .choice-card-illus.is-selected { animation: illusBounce 350ms ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .choice-card { transition: none !important; }
          .choice-card:active:not(:disabled) { transform: none; }
          .choice-card-illus.is-selected { animation: none; }
        }
      `}</style>
    </button>
  );
}
