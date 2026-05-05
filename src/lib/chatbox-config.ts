import { getContent, getJsonContent } from "./content";
import type { ChatConfig, ChatOption } from "@/types/chatbox";

const FALLBACK_OPTIONS: ChatOption[] = [];

/**
 * Lit la configuration de la chatbox depuis la table Content (clés
 * `chatbox.*`). Lue côté serveur, passée au composant client via prop.
 */
export async function loadChatConfig(): Promise<ChatConfig> {
  const [
    name, initials, preview, autoEnabled, autoDelay,
    s1msg, s1followup, s1opts,
    s2msg, s2opts, s3msg, s3opts, s4msg,
    handoffMessage, handoffCta, handoffLater, resume,
  ] = await Promise.all([
    getContent("chatbox.advisor.name", "Camille — Climat Hexagone"),
    getContent("chatbox.advisor.initials", "CH"),
    getContent("chatbox.preview", "👋 Bonjour ! Quel est votre projet ?"),
    getContent("chatbox.autoopen.enabled", "true"),
    getContent("chatbox.autoopen.delay_seconds", "25"),
    getContent("chatbox.step1.message", ""),
    getContent("chatbox.step1.followup", ""),
    getJsonContent<ChatOption[]>("chatbox.step1.options", FALLBACK_OPTIONS),
    getContent("chatbox.step2.message", ""),
    getJsonContent<ChatOption[]>("chatbox.step2.options", FALLBACK_OPTIONS),
    getContent("chatbox.step3.message", ""),
    getJsonContent<ChatOption[]>("chatbox.step3.options", FALLBACK_OPTIONS),
    getContent("chatbox.step4.message", ""),
    getContent("chatbox.handoff.message", ""),
    getContent("chatbox.handoff.cta", "Voir mes aides"),
    getContent("chatbox.handoff.later", "Plus tard"),
    getContent("chatbox.resume", "Bon retour ! On continue ?"),
  ]);

  return {
    advisorName: name,
    advisorInitials: initials,
    preview,
    autoOpenEnabled: autoEnabled === "true",
    autoOpenDelaySeconds: Number(autoDelay) || 25,
    steps: {
      step1: { message: s1msg, followup: s1followup || undefined, options: s1opts },
      step2: { message: s2msg, options: s2opts },
      step3: { message: s3msg, options: s3opts },
      step4: { message: s4msg },
    },
    handoff: { message: handoffMessage, cta: handoffCta, later: handoffLater },
    resume,
  };
}
