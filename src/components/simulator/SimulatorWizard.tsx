"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "./ProgressBar";
import { StepRenderer } from "./StepRenderer";
import { ContactStep, ContactInfo } from "./ContactStep";
import { SimulatorStepDTO, AnswerValue, AnswersMap } from "@/types/simulator";
import { quoteSubmissionSchema } from "@/lib/validators/simulator";

const STORAGE_KEY = "bz_simulator_state_v1";

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

  // Hydrate from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedState;
        setAnswers(parsed.answers ?? {});
        setContact({ ...emptyContact, ...(parsed.contact ?? {}) });
        setPostalCode(parsed.postalCode ?? "");
        setCity(parsed.city ?? "");
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    const state: PersistedState = { answers, contact, postalCode, city };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [answers, contact, postalCode, city, hydrated]);

  const isRecap = stepIdx === steps.length;
  const currentStep = !isRecap ? steps[stepIdx] : null;

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
        setStepError("Format attendu : 75001 Paris");
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
      onSubmitted?.();
      router.push("/simulateur/merci");
    } catch (e) {
      setServerError("Une erreur réseau est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  const recapEntries = useMemo(() => {
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
        return { key: s.key, label: s.label, display };
      });
  }, [steps, answers]);

  if (!hydrated) return null;

  return (
    <div className="space-y-6">
      <ProgressBar current={Math.min(stepIdx + 1, total)} total={total} />

      {currentStep && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">{currentStep.label}</h2>
            {currentStep.helpText && (
              <p className="mt-1 text-sm text-muted-fg">{currentStep.helpText}</p>
            )}
          </div>

          {isCompoundContactStep(currentStep) ? (
            <ContactStep value={contact} onChange={setContact} errors={contactErrors} />
          ) : (
            <StepRenderer
              step={currentStep}
              value={answers[currentStep.key] ?? null}
              onChange={(v) => setAnswer(currentStep.key, v)}
            />
          )}

          {stepError && <p role="alert" className="text-sm text-red-600">{stepError}</p>}
        </div>
      )}

      {isRecap && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold sm:text-2xl">Récapitulatif</h2>
          <p className="text-sm text-muted-fg">Vérifiez vos réponses avant d'envoyer.</p>
          <dl className="divide-y divide-border rounded border border-border bg-white">
            {recapEntries.map((r) => (
              <div key={r.key} className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3">
                <dt className="text-sm font-medium text-muted-fg">{r.label}</dt>
                <dd className="sm:col-span-2 text-sm">{r.display}</dd>
              </div>
            ))}
            <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3">
              <dt className="text-sm font-medium text-muted-fg">Coordonnées</dt>
              <dd className="sm:col-span-2 text-sm">
                {contact.firstName} {contact.lastName} — {contact.email} — {contact.phone}<br />
                {postalCode} {city}
              </dd>
            </div>
          </dl>
          {serverError && <p role="alert" className="text-sm text-red-600">{serverError}</p>}
        </div>
      )}

      <div className="flex justify-between gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={goPrev} disabled={stepIdx === 0 || submitting}>
          ← Précédent
        </Button>
        {!isRecap ? (
          <Button type="button" onClick={goNext}>
            Suivant →
          </Button>
        ) : (
          <Button type="button" onClick={submit} disabled={submitting}>
            {submitting ? "Envoi…" : "Envoyer ma demande"}
          </Button>
        )}
      </div>
    </div>
  );
}
