"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatHeader } from "./ChatHeader";
import { ChatBubble } from "./ChatBubble";
import { ChatTypingIndicator } from "./ChatTypingIndicator";
import { ChatOptions } from "./ChatOptions";
import { ChatInput } from "./ChatInput";
import { Button } from "@/components/ui/Button";
import { useChatbox } from "@/hooks/useChatbox";
import type { ChatConfig, ChatStepKey } from "@/types/chatbox";
import { buildPrefill } from "@/lib/chatbox-mapping";
import { lookupCity } from "@/lib/geo";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ChatPanel({
  open,
  onClose,
  config,
}: {
  open: boolean;
  onClose: () => void;
  config: ChatConfig;
}) {
  const router = useRouter();
  const { state, typing, answer, isHandoff } = useChatbox(config);
  const [isMobile, setIsMobile] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const titleId = "chatbox-title";

  // mobile detection
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [state.messages.length, typing]);

  // Focus trap + scroll lock + escape
  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    if (isMobile) document.body.style.overflow = "hidden";

    const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const items = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [open, onClose, isMobile]);

  if (!open) return null;

  const stepKeys: ChatStepKey[] = ["step1", "step2", "step3", "step4"];
  const currentStep = state.step < stepKeys.length ? stepKeys[state.step] : null;
  const showOptions = currentStep && currentStep !== "step4" && config.steps[currentStep].options;
  const showInput = currentStep === "step4";

  const handleHandoff = async () => {
    setSubmitting(true);
    // City lookup (geo.api.gouv.fr)
    const cp = state.answers.step4 ?? "";
    const { city } = cp ? await lookupCity(cp) : { city: null };

    // Persist lead
    let leadId: string | undefined;
    try {
      const r = await fetch("/api/chatbox/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: state.answers,
          postalCode: cp || undefined,
          city: city ?? undefined,
          completed: true,
        }),
      });
      if (r.ok) {
        const body = await r.json();
        leadId = body?.data?.id;
      }
    } catch { /* non-blocking */ }

    const prefill = buildPrefill(state.answers, city, leadId);
    sessionStorage.setItem("chatbox.prefill", JSON.stringify(prefill));
    router.push("/simulateur?from=chatbox");
  };

  // Layout container : modal desktop, fullscreen mobile.
  // Desktop : 460×min(720,90vh) — assez grand pour 2 bulles d'intro + 6 options
  // sans que les messages soient masqués par le footer interactif.
  const container = isMobile
    ? "fixed inset-0 z-50 flex flex-col bg-surface"
    : "fixed bottom-6 right-6 z-50 flex w-[460px] h-[min(720px,90vh)] flex-col rounded-xl bg-surface shadow-lg overflow-hidden border border-border";

  return (
    <>
      {/* Overlay (mobile only) */}
      {isMobile && (
        <div
          aria-hidden
          className="fixed inset-0 z-40 bg-primary-900/60"
          onClick={onClose}
        />
      )}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={container + " chat-panel-anim"}
        style={isMobile ? { paddingTop: "env(safe-area-inset-top)" } : undefined}
      >
        <ChatHeader
          name={config.advisorName}
          initials={config.advisorInitials}
          onClose={onClose}
          titleId={titleId}
        />

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {state.messages.map((m, i) => (
            <ChatBubble
              key={i}
              role={m.role}
              text={m.text}
              ts={m.ts}
              initials={config.advisorInitials}
              liveAnnounce
            />
          ))}
          {typing && <ChatTypingIndicator initials={config.advisorInitials} />}
          <div ref={messagesEndRef} />
        </div>

        <div
          className="border-t border-border bg-surface p-4 space-y-3"
          style={isMobile ? { paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" } : undefined}
        >
          {!isHandoff && showOptions && currentStep && !typing && (
            <ChatOptions
              options={config.steps[currentStep].options ?? []}
              onPick={(o) => answer(o.label, o.value)}
            />
          )}
          {!isHandoff && showInput && !typing && (
            <ChatInput
              placeholder="Code postal (5 chiffres)"
              onSubmit={(v) => answer(v, v)}
            />
          )}
          {isHandoff && !typing && (
            <div className="space-y-2">
              <Button
                variant="accent"
                size="lg"
                onClick={handleHandoff}
                disabled={submitting}
                className="w-full"
              >
                {submitting ? "Préparation…" : config.handoff.cta}
              </Button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-center text-body-sm text-text-muted hover:text-primary-700"
              >
                {config.handoff.later}
              </button>
            </div>
          )}
          {/* Bouton "Plus tard" toujours présent en footer pendant le flux */}
          {!isHandoff && (
            <button
              type="button"
              onClick={onClose}
              className="block w-full py-1 text-center text-body-sm text-text-muted hover:text-primary-700"
            >
              {config.handoff.later}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes chatPanelDesktop {
          from { opacity: 0; transform: translateY(12px) scale(.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatPanelMobile {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        .chat-panel-anim { animation: ${isMobile ? "chatPanelMobile" : "chatPanelDesktop"} 220ms ease-out; }
        @media (prefers-reduced-motion: reduce) { .chat-panel-anim { animation: none; } }
      `}</style>
    </>
  );
}
