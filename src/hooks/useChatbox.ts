"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatAnswers, ChatConfig, ChatStepKey } from "@/types/chatbox";

const STORAGE = {
  dismissed: "chatbox.dismissed",
  progress:  "chatbox.progress",
  prefill:   "chatbox.prefill",
} as const;

const STEPS: ChatStepKey[] = ["step1", "step2", "step3", "step4"];

interface BubbleMessage {
  role: "bot" | "user";
  text: string;
  ts: number;
}

interface ProgressState {
  step: number; // index dans STEPS, 4 = handoff (toutes les questions répondues)
  answers: ChatAnswers;
  messages: BubbleMessage[];
}

const initial: ProgressState = { step: 0, answers: {}, messages: [] };

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try { window.sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
}

/**
 * Hook orchestrateur de la chatbox.
 * - persiste la progression dans sessionStorage (clé `chatbox.progress`)
 * - simule un délai de 800 ms avant chaque réponse bot (typing indicator)
 *
 * Le hook est mounté par <ChatPanel /> qui n'est rendu que quand le launcher
 * a passé open=true ; on déclenche donc l'intro à la première mount, à condition
 * que la conversation soit vide (sinon on reprend où on en était).
 */
export function useChatbox(config: ChatConfig | null) {
  const [state, setState] = useState<ProgressState>(initial);
  const [typing, setTyping] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const reducedMotion = useRef(false);
  const introPushedRef = useRef(false);

  // Pousse une suite de bulles bot, avec typing indicator entre chaque
  // (1200 ms par bulle, lecture confortable). Après la dernière bulle, on
  // ajoute une période de grâce de 800 ms avant de relâcher `typing` :
  // les options/inputs n'apparaissent qu'après ce délai pour laisser lire.
  // Sous prefers-reduced-motion : tout instantané.
  const pushBotChain = useCallback((texts: string[]) => {
    if (texts.length === 0) return;
    const delay = reducedMotion.current ? 0 : 1200;
    // Grace = laisse le temps de lire avant d'afficher options/inputs.
    // Appliquée seulement aux chaînes multi-bulles (intro welcome+followup).
    // Pour un message unique (réponse step-suivante, handoff), pas de grace :
    // l'utilisateur attendrait inutilement avec rien à l'écran.
    const grace = reducedMotion.current ? 0 : (texts.length > 1 ? 800 : 0);
    const pushAt = (idx: number) => {
      setTyping(true);
      window.setTimeout(() => {
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, { role: "bot", text: texts[idx], ts: Date.now() }],
        }));
        const nextIdx = idx + 1;
        if (nextIdx < texts.length) {
          pushAt(nextIdx);
        } else if (grace > 0) {
          window.setTimeout(() => setTyping(false), grace);
        } else {
          setTyping(false);
        }
      }, delay);
    };
    pushAt(0);
  }, []);

  const pushBot = useCallback((text: string) => {
    pushBotChain([text]);
  }, [pushBotChain]);

  const pushUser = useCallback((text: string) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, { role: "user", text, ts: Date.now() }],
    }));
  }, []);

  // Hydrate (sync read inside effect for proper closure timing) puis,
  // si la conversation est vide ET le config dispo, pousse l'intro.
  useEffect(() => {
    const persisted = readJSON<ProgressState>(STORAGE.progress, initial);
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setState(persisted);
    setHydrated(true);

    if (!introPushedRef.current && config && persisted.messages.length === 0) {
      introPushedRef.current = true;
      const step1 = config.steps.step1;
      const queue = [step1.message, step1.followup].filter(Boolean) as string[];
      pushBotChain(queue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  // Persist (skip pre-hydration writes pour ne pas écraser la session)
  useEffect(() => {
    if (!hydrated) return;
    writeJSON(STORAGE.progress, state);
  }, [state, hydrated]);

  const answer = useCallback(
    (label: string, value: string) => {
      if (!config) return;
      pushUser(label);
      const stepKey = STEPS[state.step];

      // Court-circuit : à l'étape 1, l'option "parrainer" redirige immédiatement
      // vers la page parrainage au lieu de continuer le flow simulateur.
      if (stepKey === "step1" && value === "parrainer") {
        if (typeof window !== "undefined") {
          window.location.href = "/parrainage";
        }
        return;
      }

      const newAnswers: ChatAnswers = { ...state.answers, [stepKey]: value };
      const nextStep = state.step + 1;

      setState((prev) => ({ ...prev, answers: newAnswers, step: nextStep }));

      if (nextStep < STEPS.length) {
        const nextKey = STEPS[nextStep];
        pushBot(config.steps[nextKey].message);
      } else {
        pushBot(config.handoff.message);
      }
    },
    [config, pushBot, pushUser, state.answers, state.step],
  );

  const reset = useCallback(() => {
    setState(initial);
    writeJSON(STORAGE.progress, initial);
    introPushedRef.current = false;
  }, []);

  return {
    state,
    typing,
    answer,
    reset,
    isHandoff: state.step >= STEPS.length,
  };
}

export const CHATBOX_STORAGE_KEYS = STORAGE;
