"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const HEATING_OPTIONS = [
  { value: "chaudiere-gaz-fioul", label: "Chaudière Gaz/Fioul" },
  { value: "electricite", label: "Électricité" },
  { value: "pac", label: "Pompe à chaleur" },
  { value: "bois", label: "Bois" },
  { value: "autre", label: "Autre" },
];

const inputCls =
  "block w-full rounded-md border border-border bg-white px-3 py-2 text-body text-text shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";

/**
 * Bouton "Être rappelé" + panneau slide-in à droite avec formulaire.
 * - Animation framer-motion sur le panel + backdrop.
 * - Email seul champ optionnel ; les autres sont required.
 * - POST /api/callback à la soumission.
 * - Fermeture : Escape, clic sur backdrop, ou bouton X.
 */
export function CallbackButton() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    phone: "",
    lastName: "",
    firstName: "",
    heating: "",
    heatingOther: "",
    email: "",
  });

  // Portal target n'existe qu'après hydratation côté client
  useEffect(() => setMounted(true), []);

  const reset = () => {
    setForm({ phone: "", lastName: "", firstName: "", heating: "", heatingOther: "", email: "" });
    setDone(false);
    setError(null);
  };

  const close = () => {
    setOpen(false);
    // léger delay pour ne pas flash le contenu pendant l'animation de sortie
    window.setTimeout(reset, 320);
  };

  // Fermeture clavier (Escape) + lock du scroll body quand le panel est ouvert
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    // Si l'utilisateur a choisi "autre", on envoie son texte libre comme heating
    const heatingValue =
      form.heating === "autre" ? form.heatingOther.trim() : form.heating;
    if (form.heating === "autre" && !heatingValue) {
      setSubmitting(false);
      setError("Veuillez indiquer votre mode de chauffage.");
      return;
    }
    try {
      const res = await fetch("/api/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: form.phone,
          lastName: form.lastName,
          firstName: form.firstName,
          heating: heatingValue,
          email: form.email,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error ?? "Une erreur est survenue, réessayez.");
        return;
      }
      setDone(true);
    } catch {
      setError("Erreur réseau, réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-callback-button
        className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-md border border-primary-700 bg-white px-5 text-body font-semibold text-primary-700 transition hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
        </svg>
        Être rappelé
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop sombre */}
              <motion.div
                key="callback-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={close}
                className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
                aria-hidden
              />

              {/* Panel slide-in à droite */}
              <motion.aside
                key="callback-panel"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                role="dialog"
                aria-modal="true"
                aria-label="Être rappelé par un expert"
                className="fixed inset-y-0 right-0 z-[100] flex w-full max-w-md flex-col bg-white shadow-2xl sm:max-w-[460px]"
              >
              {/* En-tête du panel */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <span className="font-body text-body-sm font-semibold uppercase tracking-[0.18em] text-accent-600">
                  Demande de rappel
                </span>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Fermer"
                  className="rounded-full p-1.5 text-text-muted transition hover:bg-bg hover:text-text"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              {/* Corps scrollable — min-h-0 indispensable pour que flex-1
                  contracte correctement le contenu et autorise overflow-y-auto */}
              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
                {done ? (
                  <div className="rounded-lg border border-accent-500/40 bg-accent-500/10 p-6 text-center">
                    <div
                      aria-hidden
                      className="mx-auto mb-3 flex h-12 w-12 items-center justify-center bg-accent-500 text-2xl text-primary-900"
                      style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                    >
                      ✓
                    </div>
                    <p className="font-display text-xl font-bold text-primary-800">Merci !</p>
                    <p className="mt-2 text-body-sm text-text-muted">
                      Votre demande est bien enregistrée. Un expert vous rappelle sous 2 h ouvrées.
                    </p>
                    <button
                      type="button"
                      onClick={close}
                      className="mt-6 inline-flex rounded-md border border-primary-700 bg-white px-5 py-2 text-body-sm font-semibold text-primary-700 hover:bg-primary-50"
                    >
                      Fermer
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-display text-2xl font-bold leading-tight text-primary-800">
                      Être rappelé par un expert en rénovation énergétique.
                    </h2>
                    <p className="mt-2 text-body-sm text-text-muted">
                      Remplissez ce formulaire en moins d&apos;une minute, on s&apos;occupe du reste.
                    </p>

                    <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
                      <Field label="Téléphone" required>
                        <input
                          type="tel"
                          inputMode="tel"
                          required
                          autoComplete="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="06 12 34 56 78"
                          className={inputCls}
                        />
                      </Field>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Nom" required>
                          <input
                            type="text"
                            required
                            autoComplete="family-name"
                            value={form.lastName}
                            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                            className={inputCls}
                          />
                        </Field>
                        <Field label="Prénom" required>
                          <input
                            type="text"
                            required
                            autoComplete="given-name"
                            value={form.firstName}
                            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                            className={inputCls}
                          />
                        </Field>
                      </div>

                      <Field label="Mode de chauffage" required>
                        <select
                          required
                          value={form.heating}
                          onChange={(e) => setForm({ ...form, heating: e.target.value, heatingOther: e.target.value === "autre" ? form.heatingOther : "" })}
                          className={inputCls}
                        >
                          <option value="">Sélectionnez —</option>
                          {HEATING_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </Field>

                      {form.heating === "autre" && (
                        <Field label="Précisez votre mode de chauffage" required>
                          <input
                            type="text"
                            required
                            value={form.heatingOther}
                            onChange={(e) => setForm({ ...form, heatingOther: e.target.value })}
                            placeholder="Veuillez indiquer votre mode de chauffage"
                            className={inputCls}
                            autoFocus
                          />
                        </Field>
                      )}

                      <Field label="Email" optional>
                        <input
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="exemple@mail.fr"
                          className={inputCls}
                        />
                      </Field>

                      {error && (
                        <p role="alert" className="rounded-md border border-error/40 bg-error/10 px-3 py-2 text-body-sm text-error">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="mt-2 w-full rounded-md bg-accent-500 px-5 py-3 text-body font-bold text-primary-900 shadow-sm transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? "Envoi…" : "Être rappelé"}
                      </button>
                    </form>
                  </>
                )}
              </div>

              {/* Engagement bas de panel */}
              <div className="border-t border-border bg-primary-50 px-6 py-4">
                <p className="flex items-start gap-2 text-body-sm leading-relaxed text-primary-800">
                  <span
                    aria-hidden
                    className="mt-1 inline-block h-2 w-2 shrink-0 bg-accent-500"
                    style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                  />
                  <span>
                    <strong>Nos experts s&apos;engagent</strong> à vous rappeler dans les deux
                    heures, durant les horaires de travail en jours ouvrés.
                  </span>
                </p>
              </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

function Field({
  label,
  required,
  optional,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-1.5 text-body-sm font-semibold text-text">
        {label}
        {required && <span className="text-error">*</span>}
        {optional && <span className="text-body-sm font-normal text-text-muted">(optionnel)</span>}
      </span>
      {children}
    </label>
  );
}
