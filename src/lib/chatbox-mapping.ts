import { ChatAnswers, ChatPrefill } from "@/types/chatbox";

/**
 * Mapping chatbox.step1 (projet) → slugs simulator de l'étape `travaux`.
 * Aligné sur les services réels du catalogue (cf. SERVICES_LIST).
 * "plusieurs" / "indecis" → aucun pré-cochage. "parrainer" est traité
 * en amont par le hook chatbox (redirect vers /parrainage), ne mappe
 * donc rien ici.
 */
const STEP1_TO_TRAVAUX: Record<string, string[]> = {
  "pac-air-eau":     ["pompe-a-chaleur-air-eau"],
  "pac-air-air":     ["pompe-a-chaleur-air-air"],
  ite:               ["isolation-thermique-exterieure"],
  ballon:            ["ballon-thermodynamique"],
  ssc:               ["systeme-solaire-combine"],
  plusieurs:         [],
  indecis:           [],
  parrainer:         [],
};

export function buildPrefill(
  answers: ChatAnswers,
  city: string | null,
  leadId?: string,
): ChatPrefill {
  return {
    leadId,
    travaux: answers.step1 ? STEP1_TO_TRAVAUX[answers.step1] ?? [] : [],
    logement_type: answers.step2 === "maison" || answers.step2 === "appartement"
      ? answers.step2
      : undefined,
    statut: ["proprietaire-occupant", "bailleur", "locataire"].includes(answers.step3 ?? "")
      ? (answers.step3 as ChatPrefill["statut"])
      : undefined,
    postalCode: answers.step4 || undefined,
    city: city ?? undefined,
  };
}
