"use client";

import { SimulatorOption } from "@/types/simulator";

export function RadioField({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: SimulatorOption[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div role="radiogroup" className="grid gap-2 sm:grid-cols-2">
      {options.map((o) => {
        const checked = value === o.value;
        return (
          <label
            key={o.value}
            className={`flex cursor-pointer items-center gap-3 rounded border p-3 ${
              checked ? "border-primary bg-primary/5" : "border-border bg-white hover:border-primary/50"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={checked}
              onChange={() => onChange(o.value)}
              className="h-4 w-4"
            />
            <span>{o.label}</span>
          </label>
        );
      })}
    </div>
  );
}
