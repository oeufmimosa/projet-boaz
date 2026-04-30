"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return <p className="text-sm text-accent">Merci, vous êtes inscrit·e.</p>;
  }

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        // Phase 1: stub. À brancher à un endpoint dédié plus tard.
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
        className="w-full rounded border border-border bg-white px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="rounded bg-primary px-3 py-2 text-sm font-medium text-primary-fg"
      >
        OK
      </button>
    </form>
  );
}
