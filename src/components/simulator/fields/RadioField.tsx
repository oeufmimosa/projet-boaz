"use client";

import { SimulatorOption } from "@/types/simulator";
import { cn } from "@/components/ui/cn";

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
  const cols = options.length <= 6 ? "lg:grid-cols-2" : "lg:grid-cols-3";
  return (
    <div role="radiogroup" className={cn("grid gap-3 grid-cols-1", cols)}>
      {options.map((o) => {
        const checked = value === o.value;
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
              type="radio"
              name={name}
              value={o.value}
              checked={checked}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            <span
              aria-hidden
              className={cn(
                "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                checked ? "border-primary-500" : "border-border",
              )}
            >
              {checked && <span className="h-2.5 w-2.5 rounded-full bg-primary-500" />}
            </span>
            <span className="font-medium">{o.label}</span>
            {checked && <SelectedHexCheck />}
          </label>
        );
      })}
    </div>
  );
}

function SelectedHexCheck() {
  return (
    <span aria-hidden className="absolute right-3 top-3 inline-flex h-5 w-5">
      <svg viewBox="0 0 56 64" className="h-full w-full">
        <path d="M28 2 52 16v32L28 62 4 48V16Z" fill="var(--color-primary-500)" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="absolute inset-0 m-auto h-3 w-3 text-text-inverse"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m5 13 4 4L19 7" />
      </svg>
    </span>
  );
}
