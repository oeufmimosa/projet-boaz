"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * FAB desktop : visible sur travaux/aides/blog, en bas-droite.
 * Pas affiché sur /, /simulateur, /admin.
 */
export function FloatingSimCTA() {
  const pathname = usePathname();
  const allowed =
    pathname?.startsWith("/travaux") ||
    pathname?.startsWith("/aides") ||
    pathname?.startsWith("/blog");
  if (!allowed) return null;

  return (
    <Link
      href="/simulateur"
      className="group fixed bottom-6 right-6 z-30 hidden lg:inline-flex h-14 items-center gap-2 rounded-full bg-primary-700 pr-5 pl-3 text-text-inverse shadow-lg hover:bg-primary-800"
      aria-label="Simuler mes travaux"
    >
      <span className="relative inline-flex h-10 w-9 items-center justify-center">
        <svg viewBox="0 0 56 64" className="absolute inset-0 h-full w-full" aria-hidden>
          <path d="M28 2 52 16v32L28 62 4 48V16Z" fill="var(--color-accent-500)" />
        </svg>
        <svg viewBox="0 0 24 24" className="relative h-5 w-5 text-primary-800" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
          <path d="m9 18 6-6-6-6" />
        </svg>
      </span>
      <span className="font-display font-semibold">Simuler mes travaux</span>
    </Link>
  );
}
