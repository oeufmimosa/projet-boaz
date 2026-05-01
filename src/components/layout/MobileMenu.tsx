"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { TricolorBar } from "@/components/brand/TricolorBar";
import { FrenchBadge } from "@/components/brand/FrenchBadge";
import { LinkButton } from "@/components/ui/Button";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu({
  links,
  ctaLabel,
}: {
  links: { href: string; label: string }[];
  ctaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Scroll lock + focus management
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = drawerRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && drawerRef.current) {
        const items = drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        aria-controls="mobile-drawer"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-primary-50/40"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50"
          aria-hidden={false}
          role="dialog"
          aria-modal="true"
          aria-label="Menu mobile"
        >
          {/* Overlay sombre cliquable */}
          <div
            className="absolute inset-0 bg-primary-900/60"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          {/* Drawer plein écran depuis la droite */}
          <div
            ref={drawerRef}
            id="mobile-drawer"
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-primary-800 text-text-inverse shadow-lg drawer-slide"
            style={{
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <Logo variant="white" size={32} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer le menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-primary-700"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>

            <nav
              aria-label="Navigation mobile"
              className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-1"
            >
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-4 py-4 text-display-sm font-display font-bold hover:bg-primary-700"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-6">
                <FrenchBadge variant="dark" />
              </div>
            </nav>

            <div className="px-5 pb-2">
              <LinkButton
                href="/simulateur"
                variant="accent"
                size="lg"
                className="w-full"
              >
                {ctaLabel}
              </LinkButton>
            </div>
            <TricolorBar className="mt-3" />
          </div>

          <style>{`
            @keyframes drawerSlide {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
            .drawer-slide { animation: drawerSlide 250ms ease-out; }
            @media (prefers-reduced-motion: reduce) { .drawer-slide { animation: none; } }
          `}</style>
        </div>
      )}
    </>
  );
}
