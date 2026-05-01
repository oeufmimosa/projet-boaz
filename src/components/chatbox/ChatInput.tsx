"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Saisie libre — utilisée seulement pour le code postal (étape 4).
 * Hint visuel "5 chiffres" mais on accepte ce que l'utilisateur tape :
 * la résolution de la ville côté serveur via geo.api.gouv.fr saura échouer
 * proprement si le format n'est pas valide.
 */
export function ChatInput({
  placeholder = "Code postal",
  onSubmit,
  inputMode = "numeric",
  pattern,
  maxLength = 5,
}: {
  placeholder?: string;
  onSubmit: (value: string) => void;
  inputMode?: "text" | "numeric" | "tel" | "email";
  pattern?: string;
  maxLength?: number;
}) {
  const [v, setV] = useState("");

  const handle = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = v.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setV("");
  };

  return (
    <form onSubmit={handle} className="flex gap-2">
      <input
        type="text"
        inputMode={inputMode}
        pattern={pattern}
        maxLength={maxLength}
        autoComplete="postal-code"
        value={v}
        onChange={(e) => setV(e.target.value.replace(/[^\d]/g, ""))}
        placeholder={placeholder}
        className="h-11 min-w-0 flex-1 rounded-md border-1.5 border-border bg-surface px-3 text-body focus:outline-none focus:border-primary-500 focus:ring-3 focus:ring-primary-300/50"
        aria-label={placeholder}
      />
      <Button type="submit" variant="primary" size="md" disabled={!v.trim()}>
        Valider
      </Button>
    </form>
  );
}
