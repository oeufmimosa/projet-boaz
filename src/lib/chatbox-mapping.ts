import { ChatAnswers, ChatPrefill } from "@/types/chatbox";

/**
 * Mapping chatbox.step1 (projet) → slugs simulator de l'étape `travaux`.
 * Validé par le user :
 *  - Isolation → 3 isolations
 *  - PAC → 2 types de pompes
 *  - Solaires → photovoltaïque
 *  - Fenêtres → fenêtres
 *  - Plusieurs / Indécis → aucun pré-cochage (l'utilisateur sélectionnera)
 */
const STEP1_TO_TRAVAUX: Record<string, string[]> = {
  isolation: ["isolation-combles", "isolation-murs", "isolation-sols"],
  pac:       ["pompe-a-chaleur-air-eau", "pompe-a-chaleur-air-air"],
  solaire:   ["photovoltaique"],
  fenetres:  ["fenetres"],
  plusieurs: [],
  indecis:   [],
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
