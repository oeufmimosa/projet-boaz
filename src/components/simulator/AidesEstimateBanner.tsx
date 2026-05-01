"use client";

import { useEffect, useState } from "react";
import { cn } from "@/components/ui/cn";
import { estimateAides } from "@/lib/aides";

/**
 * Bandeau d'aides indicatives. Compteur animé qui s'incrémente jusqu'au
 * montant final (~600 ms ease-out). Replié par défaut, l'utilisateur peut
 * déplier pour voir le détail des dispositifs.
 */
export function AidesEstimateBanner({
  travaux,
  revenus,
  className,
}: {
  travaux: string[];
  revenus?: "tres-modeste" | "modeste" | "intermediaire" | "superieur";
  className?: string;
}) {
  const { amount, dispositifs } = estimateAides({ travaux, revenus });
  const [displayed, setDisplayed] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (amount <= 0) { setDisplayed(0); return; }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setDisplayed(amount); return; }
    const start = performance.now();
    const duration = 600;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplayed(Math.round(amount * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [amount]);

  if (amount <= 0) return null;

  return (
    <div
      className={cn(
        "rounded-md border border-accent-500/40 bg-primary-50",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span aria-hidden className="relative inline-flex h-9 w-8 items-center justify-center">
          <svg viewBox="0 0 56 64" className="absolute inset-0 h-full w-full">
            <path d="M28 2 52 16v32L28 62 4 48V16Z" fill="var(--color-accent-500)" />
          </svg>
          <span className="relative font-display text-body font-bold text-primary-800">€</span>
        </span>
        <span className="flex-1 text-body">
          Vous pourriez bénéficier jusqu'à{" "}
          <span className="font-display font-bold text-primary-700">
            ~{displayed.toLocaleString("fr-FR")} €
          </span>{" "}
          d'aides
        </span>
        <span aria-hidden className={cn("text-primary-700 transition-transform", open && "rotate-180")}>
          ▾
        </span>
      </button>
      {open && (
        <div className="border-t border-accent-500/30 px-4 py-3 text-body-sm text-text-muted">
          Dispositifs mobilisables : {dispositifs.join(" • ")}
        </div>
      )}
    </div>
  );
}
