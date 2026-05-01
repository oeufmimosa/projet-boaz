"use client";

import { ChoiceCard } from "./ChoiceCard";
import type { SimulatorOption } from "@/types/simulator";
import { cn } from "@/components/ui/cn";

/**
 * Grille de ChoiceCard, mode radio (single) ou checkbox (multiple).
 * Adapte le nombre de colonnes selon le nombre d'options et le breakpoint.
 */
export function ChoiceCardGroup({
  name,
  options,
  multiple,
  value,
  onChange,
}: {
  name: string;
  options: SimulatorOption[];
  multiple?: boolean;
  value: string | string[] | null;
  onChange: (v: string | string[]) => void;
}) {
  const selected = (val: string) =>
    multiple
      ? Array.isArray(value) && value.includes(val)
      : value === val;

  const handle = (val: string) => {
    if (multiple) {
      const arr = Array.isArray(value) ? value : [];
      onChange(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
    } else {
      onChange(val);
    }
  };

  // Grille : 2 cols mobile pour les multi-checkbox quand >4 options, sinon 1 col
  const cols =
    options.length <= 2
      ? "grid-cols-1 sm:grid-cols-2"
      : options.length <= 4
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-2 lg:grid-cols-3";

  const role = multiple ? undefined : "radiogroup";

  return (
    <div role={role} aria-label={name} className={cn("grid gap-3 sm:gap-4", cols)}>
      {options.map((o) => (
        <ChoiceCard
          key={o.value}
          name={name}
          value={o.value}
          label={o.label}
          helper={o.helper}
          illustrationKey={o.illustrationKey}
          multiple={multiple}
          selected={selected(o.value)}
          onSelect={() => handle(o.value)}
        />
      ))}
    </div>
  );
}
