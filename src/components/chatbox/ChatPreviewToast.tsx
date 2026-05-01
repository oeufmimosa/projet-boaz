"use client";

import { ChatAvatar } from "./ChatAvatar";

/**
 * Bannière horizontale "Discutez avec nous de votre projet →" qui pointe
 * vers le FAB chatbox avec un petit triangle sur le côté droit.
 * - Toute la bannière est cliquable (ouvre la chatbox)
 * - Petite croix en haut-droite pour dismiss (stopPropagation)
 * - Positionnée à GAUCHE du FAB sur desktop et mobile, alignée à son bas
 */
export function ChatPreviewToast({
  message,
  initials,
  onOpen,
  onDismiss,
}: {
  message: string;
  initials: string;
  onOpen: () => void;
  onDismiss: () => void;
}) {
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss();
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed z-40 banner-anim lg:bottom-6 lg:right-[88px]"
      style={{
        // Mobile : FAB à right:16 + w-14 (56) + 8 de gap = right:80
        bottom: "calc(88px + env(safe-area-inset-bottom))",
        right: "80px",
        maxWidth: "min(280px, calc(100vw - 96px))",
      }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="group relative flex w-full items-center gap-3 rounded-lg bg-surface border border-border shadow-lg pl-3 pr-9 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        <ChatAvatar initials={initials} size={32} variant="light" />
        <span className="flex-1 text-body font-semibold leading-snug text-text">
          {message}
          <span
            aria-hidden
            className="ml-1 inline-block text-primary-700 transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>

        {/* Triangle pointant vers le FAB (à droite) */}
        <span
          aria-hidden="true"
          className="absolute top-1/2 -right-2 -translate-y-1/2"
        >
          <svg width="10" height="14" viewBox="0 0 10 14" className="block">
            <path d="M0 0 L10 7 L0 14 Z" fill="var(--color-surface)" />
            <path d="M0 0 L10 7 L0 14" fill="none" stroke="var(--color-border)" strokeWidth="1" />
          </svg>
        </span>
      </button>

      {/* Croix de dismiss */}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Ignorer"
        className="absolute top-1.5 right-1.5 inline-flex h-6 w-6 items-center justify-center rounded-md text-text-muted hover:bg-surface-2"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      <style>{`
        @keyframes bannerIn {
          from { opacity: 0; transform: translateX(8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .banner-anim { animation: bannerIn 220ms ease-out; }
        @media (prefers-reduced-motion: reduce) { .banner-anim { animation: none; } }
      `}</style>
    </div>
  );
}
