"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChatPanel } from "./ChatPanel";
import { ChatPreviewToast } from "./ChatPreviewToast";
import type { ChatConfig } from "@/types/chatbox";

const SESSION_DISMISS_KEY = "chatbox.dismissed";

/**
 * Lanceur global de la chatbox.
 * - FAB hexagonal vert foncé en bas-droite
 * - Pulse léger toutes les 6 s (désactivé sous prefers-reduced-motion)
 * - Pastille "1" tant que jamais ouverte dans la session
 * - Auto-toast desktop sur la home après N secondes (config.autoOpenDelaySeconds)
 * - Masqué sur /admin et /simulateur/merci
 */
export function ChatLauncher({ config }: { config: ChatConfig }) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setDismissed(sessionStorage.getItem(SESSION_DISMISS_KEY) === "true");
    // Pont avec d'autres composants (ChatHomeInvite, etc.) : ils émettent
    // un CustomEvent('chatbox:open'). On ouvre la chatbox SANS marquer la
    // pop-up comme dismissed (le user n'a pas explicitement refusé).
    const onOpenEvent = () => {
      setShowToast(false);
      setOpen(true);
    };
    window.addEventListener("chatbox:open", onOpenEvent);
    return () => window.removeEventListener("chatbox:open", onOpenEvent);
  }, []);

  // Pop-up de relance "Discutez avec nous de votre projet" :
  // affichée immédiatement (delay configurable, 0 par défaut), sur toutes
  // les pages où la chatbox est active, desktop ET mobile.
  useEffect(() => {
    if (!config.autoOpenEnabled) return;
    if (dismissed) return;
    const t = window.setTimeout(
      () => setShowToast(true),
      Math.max(0, config.autoOpenDelaySeconds) * 1000,
    );
    return () => window.clearTimeout(t);
  }, [config.autoOpenEnabled, config.autoOpenDelaySeconds, dismissed]);

  // Hidden routes
  if (pathname.startsWith("/admin") || pathname === "/simulateur/merci") {
    return null;
  }

  // Ouvrir la chatbox via le FAB : on cache la pop-up locale mais on ne
  // pose PAS le flag `dismissed`. La pop-up pourra réapparaître sur les
  // pages suivantes tant que l'utilisateur n'a pas cliqué × dessus.
  const openPanel = () => {
    setShowToast(false);
    setOpen(true);
  };

  // Dismiss explicite via le × de la pop-up : flag persistant pour la session.
  const dismissToast = () => {
    setShowToast(false);
    sessionStorage.setItem(SESSION_DISMISS_KEY, "true");
    setDismissed(true);
  };

  return (
    <>
      {/* FAB + label "La technologie IA à votre service" */}
      <div
        className="fixed z-40 flex flex-col items-center gap-2 lg:bottom-6 lg:right-6"
        style={{
          // mobile : bottom 88 (au-dessus de la sticky CTA), right 16
          bottom: "calc(88px + env(safe-area-inset-bottom))",
          right: "16px",
        }}
      >
        <button
          type="button"
          aria-label="Ouvrir la chatbox"
          onClick={openPanel}
          className="relative inline-flex h-24 w-[84px] shrink-0 items-center justify-center text-text-inverse hex-launcher hex-pulse"
        >
          <svg
            viewBox="0 0 56 64"
            className="absolute inset-0 h-full w-full"
            aria-hidden
            style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.28))" }}
          >
            <path d="M28 2 52 16v32L28 62 4 48V16Z" fill="var(--color-primary-700)" />
          </svg>
          <svg viewBox="0 0 24 24" className="relative h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {!dismissed && (
            <span
              aria-hidden
              className="absolute -top-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-fr-red text-text-inverse text-[11px] font-bold border-2 border-bg"
            >
              1
            </span>
          )}
        </button>

        {/* Pill texte affichée en permanence sous le FAB */}
        <span
          aria-hidden
          className="max-w-[140px] rounded-full bg-white px-3 py-1.5 text-center text-[11px] font-semibold leading-tight text-primary-800 shadow-md sm:max-w-none sm:whitespace-nowrap sm:text-body-sm"
          style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.15))" }}
        >
          La technologie IA à votre service
        </span>
      </div>

      <style>{`
        @keyframes hexPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .hex-launcher { transition: transform 150ms ease; }
        .hex-launcher:hover { transform: scale(1.04); }
        .hex-pulse { animation: hexPulse 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hex-pulse, .hex-launcher { animation: none; transition: none; }
        }
      `}</style>

      {showToast && !open && (
        <ChatPreviewToast
          message={config.preview}
          initials={config.advisorInitials}
          onOpen={openPanel}
          onDismiss={dismissToast}
        />
      )}

      {open && <ChatPanel open={open} onClose={() => setOpen(false)} config={config} />}
    </>
  );
}
