"use client";

import { SimulatorOption } from "@/types/simulator";

export function CheckboxField({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: SimulatorOption[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (val: string) => {
    if (value.includes(val)) onChange(value.filter((v) => v !== val));
    else onChange([...value, val]);
  };
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((o) => {
        const checked = value.includes(o.value);
        return (
          <label
            key={o.value}
            className={`flex cursor-pointer items-center gap-3 rounded border p-3 ${
              checked ? "border-primary bg-primary/5" : "border-border bg-white hover:border-primary/50"
            }`}
          >
            <input
              type="checkbox"
              name={name}
              value={o.value}
              checked={checked}
              onChange={() => toggle(o.value)}
              className="h-4 w-4"
            />
            <span>{o.label}</span>
          </label>
        );
      })}
    </div>
  );
}
