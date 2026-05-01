"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { TricolorBar } from "@/components/brand/TricolorBar";
import { SimulatorWizard } from "./SimulatorWizard";
import { SimulatorStepDTO } from "@/types/simulator";

/**
 * Shell qui choisit la présentation du simulateur :
 * - desktop (≥ 1024 px) : modale centrée 720 px + overlay
 * - mobile  (< 1024 px) : plein écran avec header collant + footer collant
 *
 * Décide via matchMedia côté client. Lock le scroll dans les deux cas.
 */
export function SimulatorShell({
  steps,
  open,
  onClose,
}: {
  steps: SimulatorStepDTO[];
  open: boolean;
  onClose: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-bg" role="dialog" aria-modal="true" aria-label="Simulateur">
        <header
          className="bg-primary-700 text-text-inverse"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <Logo variant="white" size={28} withWordmark={false} />
            <p className="font-display text-body font-semibold">Simulateur</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer le simulateur"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-primary-800"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </header>

        <div
          className="flex-1 overflow-y-auto px-4 py-6"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
        >
          <SimulatorWizard steps={steps} onSubmitted={onClose} />
        </div>

        <TricolorBar />
      </div>
    );
  }

  // Desktop modal
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10, 42, 26, 0.6)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Simulateur"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-bg p-8 shadow-lg">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-md text-text-muted hover:bg-surface-2"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        <SimulatorWizard steps={steps} onSubmitted={onClose} />
      </div>
    </div>
  );
}
