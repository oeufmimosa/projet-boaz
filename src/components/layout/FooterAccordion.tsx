"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/components/ui/cn";

interface Column {
  title: string;
  links: { href: string; label: string }[];
}

/**
 * Footer mobile : accordéons par défaut TOUS REPLIÉS.
 * Tap = toggle. Animation de hauteur via max-height.
 */
export function FooterAccordion({ columns }: { columns: Column[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <ul className="divide-y divide-primary-800 border-y border-primary-800">
      {columns.map((c) => {
        const expanded = open === c.title;
        return (
          <li key={c.title}>
            <button
              type="button"
              onClick={() => setOpen(expanded ? null : c.title)}
              aria-expanded={expanded}
              aria-controls={`footer-col-${c.title}`}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="font-display text-body font-bold uppercase tracking-wide text-primary-200">
                {c.title}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center text-accent-500 transition-transform duration-200",
                  expanded && "rotate-45",
                )}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <div
              id={`footer-col-${c.title}`}
              className={cn(
                "grid overflow-hidden transition-[grid-template-rows] duration-200",
                expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0">
                <ul className="pb-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link
                        href={l.href}
                        className="block py-1 text-body text-primary-100 hover:text-accent-500"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
