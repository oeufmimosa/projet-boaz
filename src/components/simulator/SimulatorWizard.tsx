"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { HexProgressBar } from "./HexProgressBar";
import { StepBadge } from "./StepBadge";
import { StepHeading } from "./StepHeading";
import { StepSubheading } from "./StepSubheading";
import { EncouragementBadge } from "./EncouragementBadge";
import { StepRenderer } from "./StepRenderer";
import { ContactStep, ContactInfo } from "./ContactStep";
import { SimulatorStepDTO, AnswerValue, AnswersMap } from "@/types/simulator";
import { quoteSubmissionSchema } from "@/lib/validators/simulator";
import type { ChatPrefill } from "@/types/chatbox";
import {
  isIDFPostalCode,
  getRevenusThresholds,
  parseFoyerPersonnes,
  formatEuros,
} from "@/lib/anah-thresholds";

const STORAGE_KEY = "bz_simulator_state_v1";
const CHATBOX_PREFILL_KEY = "chatbox.prefill";
const AUTO_ADVANCE_DELAY = 400;

interface PersistedState {
  answers: AnswersMap;
  contact: ContactInfo;
  postalCode: string;
  city: string;
}

const emptyContact: ContactInfo = {
  civility: "mr",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  consent: false,
};

function isCompoundContactStep(step: SimulatorStepDTO): boolean {
  return step.key === "coordonnees" || (step.config as { compound?: boolean })?.compound === true;
}

function isPostalCodeStep(step: SimulatorStepDTO): boolean {
  return step.key === "code_postal";
}

function isAnswered(step: SimulatorStepDTO, value: AnswerValue): boolean {
  if (!step.required) return true;
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  return true;
}

export function SimulatorWizard({
  steps,
  onSubmitted,
}: {
  steps: SimulatorStepDTO[];
  onSubmitted?: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const total = steps.length + 1; // +1 = recap
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [contact, setContact] = useState<ContactInfo>(emptyContact);
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [stepError, setStepError] = useState<string | null>(null);
  const [contactErrors, setContactErrors] = useState<Partial<Record<keyof ContactInfo, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [chatLeadId, setChatLeadId] = useState<string | undefined>(undefined);
  const [chatBanner, setChatBanner] = useState(false);

  // Hydrate from sessionStorage. Si l'utilisateur arrive via la chatbox
  // (?from=chatbox), on lit `chatbox.prefill` et on saute aux étapes
  // non encore renseignées.
  useEffect(() => {
    let initialAnswers: AnswersMap = {};
    let initialContact = emptyContact;
    let initialPostal = "";
    let initialCity = "";

    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedState;
        initialAnswers = parsed.answers ?? {};
        initialContact = { ...emptyContact, ...(parsed.contact ?? {}) };
        initialPostal = parsed.postalCode ?? "";
        initialCity = parsed.city ?? "";
      }
    } catch { /* ignore */ }

    const fromChatbox = searchParams.get("from") === "chatbox";
    if (fromChatbox) {
      try {
        const raw = sessionStorage.getItem(CHATBOX_PREFILL_KEY);
        if (raw) {
          const pre = JSON.parse(raw) as ChatPrefill;
          if (pre.travaux && pre.travaux.length > 0) initialAnswers.travaux = pre.travaux;
          if (pre.logement_type) initialAnswers.logement_type = pre.logement_type;
          if (pre.statut) initialAnswers.statut = pre.statut;
          if (pre.postalCode) {
            initialPostal = pre.postalCode;
            const composed = pre.city ? `${pre.postalCode} ${pre.city}` : `${pre.postalCode} `;
            initialAnswers.code_postal = composed;
            if (pre.city) initialCity = pre.city;
          }
          if (pre.leadId) setChatLeadId(pre.leadId);
          setChatBanner(true);
          // NB: on ne supprime PAS la clé ici. En dev StrictMode, useEffect
          // s'exécute deux fois sur le 1er montage : si on retire le prefill
          // au 1er run, le 2e run réinitialise les réponses et stepIdx=0.
          // Le prefill est nettoyé à la soumission finale du Quote (submit()).
        }
      } catch { /* ignore */ }
    }

    // Place le wizard à la première étape encore non renseignée
    const firstUnansweredIdx = (() => {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (step.key === "coordonnees") return i; // toujours s'arrêter aux coordonnées
        if (!isAnswered(step, initialAnswers[step.key] ?? null)) return i;
      }
      return 0;
    })();

    setAnswers(initialAnswers);
    setContact(initialContact);
    setPostalCode(initialPostal);
    setCity(initialCity);
    setStepIdx(firstUnansweredIdx);
    setHydrated(true);
  }, [searchParams, steps]);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    const state: PersistedState = { answers, contact, postalCode, city };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [answers, contact, postalCode, city, hydrated]);

  const isRecap = stepIdx === steps.length;
  const rawCurrentStep = !isRecap ? steps[stepIdx] : null;

  // Etape "revenus" : on remplace les labels statiques ("Tres modestes", ...)
  // par les vrais seuils en euros calcules depuis les reponses precedentes
  // (foyer_personnes + code_postal => IDF / Hors-IDF).
  const currentStep = useMemo<SimulatorStepDTO | null>(() => {
    if (!rawCurrentStep) return null;
    if (rawCurrentStep.key !== "revenus") return rawCurrentStep;

    const nbPersonnes = parseFoyerPersonnes(
      typeof answers.foyer_personnes === "string" ? answers.foyer_personnes : null,
    );
    const cp = typeof answers.code_postal === "string" ? answers.code_postal : "";
    const idf = isIDFPostalCode(cp);
    const t = getRevenusThresholds(nbPersonnes, idf);

    const newOptions = rawCurrentStep.options?.map((o) => {
      switch (o.value) {
        case "tres-modeste":
          return { ...o, label: `≤ ${formatEuros(t["tres-modeste"])}` };
        case "modeste":
          return { ...o, label: `≤ ${formatEuros(t.modeste)}` };
        case "intermediaire":
          return { ...o, label: `≤ ${formatEuros(t.intermediaire)}` };
        case "superieur":
          return { ...o, label: `> ${formatEuros(t.intermediaire)}` };
        default:
          return o;
      }
    });

    return { ...rawCurrentStep, options: newOptions };
  }, [rawCurrentStep, answers.foyer_personnes, answers.code_postal]);

  const setAnswer = (key: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStepError(null);
  };

  const goPrev = () => {
    setStepError(null);
    setStepIdx((i) => Math.max(0, i - 1));
  };

  const validateCurrent = (): boolean => {
    if (!currentStep) return true;
    if (isCompoundContactStep(currentStep)) {
      const errs: Partial<Record<keyof ContactInfo, string>> = {};
      if (!contact.firstName.trim()) errs.firstName = "Requis";
      if (!contact.lastName.trim()) errs.lastName = "Requis";
      if (!/^\S+@\S+\.\S+$/.test(contact.email)) errs.email = "Email invalide";
      if (!/^[\d\s+().-]{6,}$/.test(contact.phone)) errs.phone = "Téléphone invalide";
      if (!contact.consent) errs.consent = "Consentement requis";
      setContactErrors(errs);
      return Object.keys(errs).length === 0;
    }
    if (isPostalCodeStep(currentStep)) {
      // Parse "75001 Paris" into postal + city
      const v = (answers[currentStep.key] as string) ?? "";
      const m = v.trim().match(/^(\d{5})\s+(.+)$/);
      if (!m) {
        setStepError("Sélectionnez votre commune dans la liste.");
        return false;
      }
      setPostalCode(m[1]);
      setCity(m[2]);
      return true;
    }
    if (!isAnswered(currentStep, answers[currentStep.key] ?? null)) {
      setStepError("Cette question est obligatoire.");
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (!validateCurrent()) return;
    setStepError(null);
    setStepIdx((i) => Math.min(steps.length, i + 1));
  };

  // Auto-advance après 400 ms sur sélection unique (RADIO). Désactivé sous
  // `prefers-reduced-motion` — c'est une transition animée.
  //
  // On garde en mémoire (stepIdx, lastAnswer) pour distinguer :
  //   - atterrissage sur une étape (ex. retour arrière) : on enregistre l'état
  //     courant SANS déclencher l'auto-advance,
  //   - nouveau choix utilisateur sur la même étape : on auto-advance.
  // Sans ça, revenir en arrière sur une étape déjà répondue redéclenche
  // l'auto-advance et renvoie immédiatement à l'étape suivante.
  const lastAdvanceRef = useRef<{ stepIdx: number; answer: string | null } | null>(null);
  useEffect(() => {
    if (!currentStep || isRecap) return;
    if (currentStep.fieldType !== "RADIO") return;
    if (isCompoundContactStep(currentStep) || isPostalCodeStep(currentStep)) return;
    if (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const raw = answers[currentStep.key];
    const answer = typeof raw === "string" && raw ? raw : null;
    const last = lastAdvanceRef.current;

    // Cas 1 — on vient d'arriver sur cette étape : mémoriser et ne pas avancer.
    if (!last || last.stepIdx !== stepIdx) {
      lastAdvanceRef.current = { stepIdx, answer };
      return;
    }
    // Cas 2 — même étape, pas (encore) de réponse.
    if (answer == null) return;
    // Cas 3 — même étape, même réponse (StrictMode double-run, etc.).
    if (last.answer === answer) return;

    // Cas 4 — même étape, nouvelle réponse : on auto-advance.
    lastAdvanceRef.current = { stepIdx, answer };
    const t = window.setTimeout(() => {
      setStepIdx((i) => Math.min(steps.length, i + 1));
    }, AUTO_ADVANCE_DELAY);
    return () => window.clearTimeout(t);
  }, [answers, currentStep, isRecap, steps.length, stepIdx]);

  const submit = async () => {
    setServerError(null);
    const payload = {
      answers,
      civility: contact.civility,
      firstName: contact.firstName.trim(),
      lastName: contact.lastName.trim(),
      email: contact.email.trim(),
      phone: contact.phone.trim(),
      postalCode,
      city,
      consent: contact.consent,
      ...(chatLeadId ? { chatLeadId } : {}),
    };
    const parsed = quoteSubmissionSchema.safeParse(payload);
    if (!parsed.success) {
      setServerError("Certains champs sont invalides — vérifiez vos coordonnées.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/simulator/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body?.error ?? "Une erreur est survenue.");
        return;
      }
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(CHATBOX_PREFILL_KEY);
      onSubmitted?.();
      router.push("/simulateur/merci");
    } catch (e) {
      setServerError("Une erreur réseau est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  const recapEntries = useMemo(() => {
    const stripMd = (s: string) => s.replace(/\*\*/g, "");
    return steps
      .filter((s) => !isCompoundContactStep(s))
      .map((s) => {
        const raw = answers[s.key];
        let display: string;
        if (Array.isArray(raw)) {
          display = raw
            .map((v) => s.options?.find((o) => o.value === v)?.label ?? v)
            .join(", ");
        } else if (typeof raw === "string" && s.options) {
          display = s.options.find((o) => o.value === raw)?.label ?? raw;
        } else {
          display = raw == null ? "—" : String(raw);
        }
        return { key: s.key, label: stripMd(s.label), display: stripMd(display) };
      });
  }, [steps, answers]);

  if (!hydrated) return null;

  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const transition = reduce
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

  return (
    <div className="flex h-full flex-col gap-6">
      {chatBanner && (
        <div
          role="status"
          className="rounded-md border border-primary-300 bg-primary-50 px-4 py-3 text-body-sm text-primary-700"
        >
          👋 Reprenons où nous en étions. Quelques questions de plus pour finaliser votre estimation.
        </div>
      )}

      <HexProgressBar current={Math.min(stepIdx + 1, total)} total={total} />

      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isRecap ? "recap" : currentStep?.key ?? stepIdx}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={transition}
            className="space-y-5"
          >
            {currentStep && (
              <>
                <StepBadge current={Math.min(stepIdx + 1, total)} total={total} />
                <StepHeading label={currentStep.label} />
                {currentStep.helpText && (
                  <StepSubheading text={currentStep.helpText} helpTooltip={currentStep.helpTooltip ?? undefined} />
                )}
                {currentStep.encouragement && <EncouragementBadge message={currentStep.encouragement} />}

                {isCompoundContactStep(currentStep) ? (
                  <ContactStep value={contact} onChange={setContact} errors={contactErrors} />
                ) : (
                  <StepRenderer
                    step={currentStep}
                    value={answers[currentStep.key] ?? null}
                    onChange={(v) => setAnswer(currentStep.key, v)}
                  />
                )}

                {stepError && <p role="alert" className="text-body-sm text-error">{stepError}</p>}
              </>
            )}

            {isRecap && (
              <div className="space-y-4">
                <StepBadge current={total} total={total} />
                <StepHeading label="Récapitulatif **avant envoi**" />
                <p className="text-body text-text-muted">Vérifiez vos réponses avant d'envoyer.</p>
                <dl className="divide-y divide-border rounded-lg border border-border bg-surface">
                  {recapEntries.map((r) => (
                    <div key={r.key} className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-3">
                      <dt className="text-body-sm font-semibold text-text-muted">{r.label}</dt>
                      <dd className="sm:col-span-2 text-body">{r.display}</dd>
                    </div>
                  ))}
                  <div className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-3">
                    <dt className="text-body-sm font-semibold text-text-muted">Coordonnées</dt>
                    <dd className="sm:col-span-2 text-body">
                      {contact.firstName} {contact.lastName} — {contact.email} — {contact.phone}<br />
                      {postalCode} {city}
                    </dd>
                  </div>
                </dl>
                {serverError && <p role="alert" className="text-body-sm text-error">{serverError}</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={goPrev}
          disabled={stepIdx === 0 || submitting}
          className="sm:order-1"
        >
          ← Précédent
        </Button>
        {!isRecap ? (
          <Button type="button" variant="primary" onClick={goNext} className="sm:order-2">
            Suivant →
          </Button>
        ) : (
          <Button type="button" variant="accent" onClick={submit} disabled={submitting} className="sm:order-2">
            {submitting ? "Envoi…" : "Envoyer ma demande"}
          </Button>
        )}
      </div>
    </div>
  );
}
