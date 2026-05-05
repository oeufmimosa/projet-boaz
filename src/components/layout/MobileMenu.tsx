"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { TricolorBar } from "@/components/brand/TricolorBar";
import { LinkButton } from "@/components/ui/Button";
import type { NavLink } from "@/lib/nav";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), summary, details';

/**
 * Drawer mobile plein écran rendu via `createPortal` directement sur
 * `document.body`. Le portal garantit que le `position: fixed` couvre bien
 * le viewport, indépendamment de tout ancêtre `transform` / `filter` /
 * `will-change` qui aurait pu créer un nouveau containing block (ex. un
 * `<header sticky>` avec animations, un wrapper d'éditeur, etc.).
 *
 * Largeur/hauteur explicites en `100vw` / `100dvh` pour fiabilité mobile
 * (les unités dynamiques `dvh` gèrent la barre d'adresse repliable).
 *
 * - Fond `bg-primary-800` 100 % opaque
 * - Filets tricolores en haut ET en bas
 * - 6 entrées rendues en `<ul>` (jamais conditionnel sur la liste elle-même)
 * - Accordéon `<details>` pour Services
 * - Pas de FrenchBadge (déplacé dans le footer)
 * - Scroll lock body, focus trap, fermeture Escape / croix / tap lien / CTA
 */
export function MobileMenu({
  links,
  ctaLabel,
}: {
  links: NavLink[];
  ctaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Garde SSR — `document` n'existe pas côté serveur, on monte le portail
  // uniquement après hydratation côté client.
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

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

  function close() {
    setOpen(false);
  }

  const drawer = open && (
    <aside
      ref={drawerRef}
      id="mobile-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Menu principal"
      className="fixed inset-0 z-[100] flex flex-col bg-primary-800 text-text-inverse drawer-slide"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100dvh",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Filet tricolore haut */}
      <TricolorBar />

      {/* Header drawer : logo + croix */}
      <div className="flex items-center justify-between px-5 py-4">
        <Logo variant="white" layout="compact" size="sm" />
        <button
          ref={closeBtnRef}
          type="button"
          onClick={close}
          aria-label="Fermer le menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-primary-700"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Liste des entrées */}
      <nav
        aria-label="Navigation mobile"
        className="flex-1 overflow-y-auto px-5 py-2"
      >
        <ul className="flex flex-col gap-1">
          {links.map((l) => {
            if (l.children?.length) {
              return (
                <li key={l.href}>
                  <details className="group rounded-md">
                    <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-4 py-4 text-display-sm font-display font-bold hover:bg-primary-700">
                      <span>{l.label}</span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                        className="transition-transform group-open:rotate-180"
                      >
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </summary>
                    <ul className="ml-2 mt-1 border-l border-primary-700 pl-3 py-1 space-y-0.5">
                      {l.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            onClick={close}
                            className="flex items-center gap-2 rounded-md px-3 py-2.5 text-body font-medium text-white/90 hover:bg-primary-700 hover:text-white"
                          >
                            {c.icon && <span aria-hidden>{c.icon}</span>}
                            <span>{c.label}</span>
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href={l.href}
                          onClick={close}
                          className="block rounded-md px-3 py-2.5 text-body font-semibold text-accent-500 hover:bg-primary-700"
                        >
                          Voir tous les services →
                        </Link>
                      </li>
                    </ul>
                  </details>
                </li>
              );
            }
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={close}
                  className="flex items-center gap-2 rounded-md px-4 py-4 text-display-sm font-display font-bold hover:bg-primary-700"
                >
                  <span>{l.label}</span>
                  {l.badge && (
                    <span className="inline-flex h-6 items-center whitespace-nowrap rounded-full bg-accent-500 px-2 text-body-sm font-bold text-primary-900">
                      +1&nbsp;000&nbsp;€
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* CTA bas du drawer */}
      <div className="border-t border-white/10 px-5 py-4">
        <LinkButton
          href="/simulateur"
          variant="accent"
          size="lg"
          className="w-full"
          onClick={close}
        >
          {ctaLabel}
        </LinkButton>
      </div>

      {/* Filet tricolore bas */}
      <TricolorBar />

      <style>{`
        @keyframes drawerSlide {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .drawer-slide { animation: drawerSlide 220ms ease-out; }
        @media (prefers-reduced-motion: reduce) { .drawer-slide { animation: none; } }
      `}</style>
    </aside>
  );

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

      {/* Portal vers document.body : sort le drawer de toute chaîne
          d'ancêtres (header sticky, transforms d'animations, etc.) qui
          pourraient piéger son `position: fixed`. */}
      {mounted && drawer && createPortal(drawer, document.body)}
    </>
  );
}
