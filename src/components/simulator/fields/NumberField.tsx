"use client";

import { Input } from "@/components/ui/Input";

export function NumberField({
  name,
  value,
  onChange,
  config,
}: {
  name: string;
  value: number | null;
  onChange: (v: number | null) => void;
  config?: { min?: number; max?: number; placeholder?: string };
}) {
  return (
    <Input
      type="number"
      inputMode="numeric"
      name={name}
      value={value ?? ""}
      min={config?.min}
      max={config?.max}
      placeholder={config?.placeholder}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === "" ? null : Number(v));
      }}
    />
  );
}
