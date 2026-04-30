"use client";

import { Input, Textarea } from "@/components/ui/Input";

export function TextField({
  name,
  value,
  onChange,
  type = "text",
  config,
  multiline,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  config?: { placeholder?: string };
  multiline?: boolean;
}) {
  if (multiline) {
    return (
      <Textarea
        name={name}
        value={value}
        placeholder={config?.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <Input
      type={type}
      name={name}
      value={value}
      placeholder={config?.placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
