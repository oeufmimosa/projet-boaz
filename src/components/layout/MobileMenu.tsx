"use client";

import { useState } from "react";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";

export function MobileMenu({
  links,
  ctaLabel,
}: {
  links: { href: string; label: string }[];
  ctaLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded p-2 hover:bg-muted"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
          ) : (
            <>
              <path d="M3 6h18" stroke="currentColor" strokeWidth="2" />
              <path d="M3 12h18" stroke="currentColor" strokeWidth="2" />
              <path d="M3 18h18" stroke="currentColor" strokeWidth="2" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div
          className="absolute inset-x-0 top-16 border-b border-border bg-bg shadow-md"
          role="dialog"
          aria-label="Menu mobile"
        >
          <nav className="flex flex-col gap-2 p-4" aria-label="Navigation mobile">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded px-3 py-3 text-base font-medium hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-2">
              <LinkButton href="/simulateur" className="w-full" size="md">
                {ctaLabel}
              </LinkButton>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
