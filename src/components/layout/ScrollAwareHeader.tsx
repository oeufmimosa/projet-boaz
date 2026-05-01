"use client";

import { useEffect, useState } from "react";
import { cn } from "@/components/ui/cn";

/**
 * Wrapper sticky du header. Au scroll, change de fond (blanc → vert foncé)
 * et de couleur de texte. Threshold ~ 32 px : on bascule dès qu'on quitte le top.
 */
export function ScrollAwareHeader({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled || undefined}
      className={cn(
        "sticky top-0 z-30 w-full transition-colors duration-200",
        scrolled
          ? "bg-primary-700 text-text-inverse shadow-md"
          : "bg-bg text-text backdrop-blur",
      )}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <style>{`
        header[data-scrolled] [data-nav] { color: var(--color-text-inverse); }
        header[data-scrolled] [data-nav]:hover { color: var(--color-accent-500); }
      `}</style>
      {children}
    </header>
  );
}
