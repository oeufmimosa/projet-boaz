"use client";

import { SimulatorOption } from "@/types/simulator";
import { cn } from "@/components/ui/cn";

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
  const cols = options.length <= 6 ? "lg:grid-cols-2" : "lg:grid-cols-3";
  const toggle = (val: string) => {
    if (value.includes(val)) onChange(value.filter((v) => v !== val));
    else onChange([...value, val]);
  };
  return (
    <div className={cn("grid gap-3 grid-cols-1", cols)}>
      {options.map((o) => {
        const checked = value.includes(o.value);
        return (
          <label
            key={o.value}
            className={cn(
              "relative flex min-h-14 cursor-pointer items-center gap-3 rounded-md border-1.5 p-4 transition-colors duration-150",
              checked
                ? "border-primary-500 bg-primary-50"
                : "border-border bg-surface hover:border-primary-300",
            )}
          >
            <input
              type="checkbox"
              name={name}
              value={o.value}
              checked={checked}
              onChange={() => toggle(o.value)}
              className="sr-only"
            />
            <span
              aria-hidden
              className={cn(
                "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2",
                checked ? "border-primary-500 bg-primary-500" : "border-border bg-surface",
              )}
            >
              {checked && (
                <svg viewBox="0 0 24 24" className="h-3 w-3 text-text-inverse" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 13 4 4L19 7" />
                </svg>
              )}
            </span>
            <span className="font-medium">{o.label}</span>
          </label>
        );
      })}
    </div>
  );
}
