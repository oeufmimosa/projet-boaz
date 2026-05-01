"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * Barre fixe en bas d'écran sur mobile (< 1024 px).
 * - Apparaît après ~200 px de scroll
 * - Masquée sur /simulateur, /admin, et /simulateur/merci
 * - Respecte safe-area iOS
 */
export function StickyMobileCTA() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hidden =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/simulateur");

  if (hidden || !show) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="border-t border-border bg-surface shadow-lg">
        <div className="px-4 py-3">
          <Link
            href="/simulateur"
            className="flex h-12 w-full items-center justify-center rounded-md bg-accent-500 px-4 font-display font-semibold text-primary-800 transition hover:bg-accent-600"
          >
            Estimer mes aides
          </Link>
        </div>
      </div>
    </div>
  );
}
