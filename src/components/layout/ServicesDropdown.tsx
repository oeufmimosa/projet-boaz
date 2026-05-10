"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { SERVICES } from "@/lib/nav";

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0 transition-transform duration-150"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Dropdown desktop pour l'entrée "Services". Visible au hover (souris) et au
 * focus/click (clavier). Se referme à Escape, blur hors zone ou navigation.
 */
export function ServicesDropdown() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }
  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <Link
        href="/services"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onFocus={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 text-body font-medium text-text transition-colors duration-150 hover:text-primary-700"
        data-nav
      >
        <span>Services</span>
        <ChevronDown open={open} />
      </Link>

      {open && (
        <div
          id={id}
          role="menu"
          className="absolute left-1/2 top-full z-50 mt-2 w-[28rem] -translate-x-1/2 rounded-lg border border-border bg-surface p-3 shadow-lg"
        >
          <ul className="grid grid-cols-1 gap-1">
            {SERVICES.map((s) => (
              <li key={s.href} role="none">
                <Link
                  role="menuitem"
                  href={s.href}
                  onClick={() => setOpen(false)}
                  className="flex flex-col rounded-md px-3 py-2 hover:bg-primary-50"
                >
                  <span className="font-display font-semibold text-primary-800">{s.label}</span>
                  {s.description && (
                    <span className="text-xs text-text-muted">{s.description}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 border-t border-border pt-2">
            <Link
              href="/services"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-body-sm font-semibold text-primary-700 hover:bg-primary-50"
            >
              Voir tous les services →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
