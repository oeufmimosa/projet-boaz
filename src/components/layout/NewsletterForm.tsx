"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p role="status" className="text-body-sm text-accent-500">
        Merci, vous êtes inscrit·e.
      </p>
    );
  }

  return (
    <form
      className="flex w-full flex-col gap-2 sm:flex-row sm:items-stretch"
      onSubmit={(e) => {
        e.preventDefault();
        if (email) setDone(true);
      }}
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
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-accent-500 px-4 font-display font-semibold text-primary-800 transition hover:bg-accent-600"
      >
        S'inscrire
      </button>
    </form>
  );
}
