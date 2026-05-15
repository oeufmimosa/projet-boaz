"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (done) {
    return (
      <p role="status" className="text-body-sm text-accent-500">
        Merci, vous êtes inscrit·e.
      </p>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error ?? "Une erreur est survenue, réessayez.");
        return;
      }
      setDone(true);
    } catch {
      setError("Réseau indisponible, réessayez plus tard.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <form
        className="flex w-full flex-col gap-2 sm:flex-row sm:items-stretch"
        onSubmit={onSubmit}
        aria-label="Inscription newsletter"
      >
        <input
          type="email"
          required
          aria-label="Email"
          placeholder="votre@email.fr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          // min-w-0 indispensable : sans ça, flex-1 ne shrink pas en-dessous
          // de la largeur intrinsèque du placeholder et le bouton déborde.
          className="w-full min-w-0 flex-1 rounded-md border-1.5 border-primary-700 bg-primary-900 px-3 py-2.5 text-body text-text-inverse placeholder:text-primary-300 focus:outline-none focus:border-accent-500"
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-accent-500 px-4 font-display font-semibold text-primary-800 transition hover:bg-accent-600 disabled:opacity-60"
        >
          {submitting ? "Envoi…" : "S'inscrire"}
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-2 text-xs text-error">
          {error}
        </p>
      )}
      <p className="mt-2 text-xs italic text-primary-200">
        En soumettant ce formulaire, vous acceptez que les informations transmises soient utilisées
        afin d&apos;étudier votre demande, permettre une prise de contact et accompagner votre projet
        conformément à notre <a href="/confidentialite" className="underline">politique de confidentialité</a>.
      </p>
    </div>
  );
}
