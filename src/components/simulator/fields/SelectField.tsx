"use client";

import { Select } from "@/components/ui/Input";
import { SimulatorOption } from "@/types/simulator";

export function SelectField({
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
    <Select
      name={name}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" disabled>— Choisir —</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </Select>
  );
}
