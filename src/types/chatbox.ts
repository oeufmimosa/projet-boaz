export type ChatStepKey = "step1" | "step2" | "step3" | "step4";

export interface ChatOption {
  value: string;
  label: string;
}

export interface ChatConfig {
  advisorName: string;
  advisorInitials: string;
  preview: string;
  autoOpenEnabled: boolean;
  autoOpenDelaySeconds: number;
  steps: Record<ChatStepKey, { message: string; followup?: string; options?: ChatOption[] }>;
  handoff: { message: string; cta: string; later: string };
  resume: string;
}

export interface ChatAnswers {
  step1?: string;        // projet
  step2?: string;        // logement
  step3?: string;        // statut
  step4?: string;        // code postal (5 chiffres)
}

/**
 * Pré-remplissage stocké en sessionStorage avant la transition vers le
 * simulateur. Lu par <SimulatorWizard /> au montage.
 */
export interface ChatPrefill {
  leadId?: string;
  travaux: string[];     // slugs simulator (peut être [])
  logement_type?: "maison" | "appartement";
  statut?: "proprietaire-occupant" | "bailleur" | "locataire";
  postalCode?: string;
  city?: string;
}
