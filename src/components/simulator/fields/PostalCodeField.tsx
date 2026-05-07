"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/Input";

type Commune = { nom: string; codesPostaux: string[] };
type Suggestion = { postal: string; nom: string };

const MAX_RESULTS = 50;

/**
 * Combobox code postal → commune avec recherche progressive.
 *
 * UX :
 *   - L'utilisateur tape les chiffres dans un seul champ.
 *   - Dès le 2e chiffre, on récupère toutes les communes du département
 *     correspondant (via /api/geo/communes proxy → geo.api.gouv.fr).
 *   - Les suggestions filtrent en live au fur et à mesure que l'utilisateur
 *     ajoute des chiffres. Aucune nouvelle requête tant qu'on reste dans le
 *     même département.
 *   - Click sur une suggestion → champ devient "75001 Paris".
 *
 * Le composant écrit `<postal> <commune>` dans le parent → reste compatible
 * avec la regex de validation du wizard `^(\d{5})\s+(.+)$`.
 */
export function PostalCodeField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [text, setText] = useState(value);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isLocked = /^\d{5}\s+\S/.test(text.trim());
  const digits = text.trim().match(/^\d+/)?.[0] ?? "";

  // Détermine ce qu'on requête côté serveur en fonction des chiffres tapés.
  // Retourne soit { type: "dept", value: "92" } soit { type: "postal", value: "75001" } soit null.
  type Query = { type: "dept"; value: string } | { type: "postal"; value: string } | null;
  const query: Query = useMemo(() => {
    if (digits.length < 2) return null;
    const p2 = digits.slice(0, 2);
    // Corse — pas de mapping direct 20→2A/2B, on attend les 5 chiffres.
    if (p2 === "20") {
      return digits.length >= 5 ? { type: "postal", value: digits.slice(0, 5) } : null;
    }
    // DOM-TOM — codes 97x / 98x sont des départements à 3 chiffres.
    if (p2 === "97" || p2 === "98") {
      if (digits.length >= 3) return { type: "dept", value: digits.slice(0, 3) };
      return null;
    }
    return { type: "dept", value: p2 };
  }, [digits]);

  // Fetch côté serveur quand la query change (et seulement quand elle change).
  const lastQueryKeyRef = useRef<string>("");
  const ctrlRef = useRef<AbortController | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLocked) {
      setOpen(false);
      return;
    }
    if (!query) {
      setCommunes([]);
      setError(null);
      return;
    }
    const key = `${query.type}:${query.value}`;
    if (lastQueryKeyRef.current === key) {
      // Même query — pas de re-fetch, juste rouvrir le dropdown.
      if (communes.length > 0) setOpen(true);
      return;
    }

    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (ctrlRef.current) ctrlRef.current.abort();

    timerRef.current = window.setTimeout(async () => {
      const ctrl = new AbortController();
      ctrlRef.current = ctrl;
      lastQueryKeyRef.current = key;
      setLoading(true);
      setError(null);
      try {
        const url =
          query.type === "dept"
            ? `/api/geo/communes?codeDepartement=${query.value}`
            : `/api/geo/communes?codePostal=${query.value}`;
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Commune[];
        setCommunes(data);
        setOpen(true);
        if (data.length === 0) {
          setError(
            query.type === "postal"
              ? "Aucune commune trouvée pour ce code postal."
              : "Aucune commune trouvée pour ce département.",
          );
        }
      } catch (e: unknown) {
        if ((e as { name?: string })?.name === "AbortError") return;
        setError("Recherche indisponible — saisissez « 75001 Paris » manuellement.");
        setCommunes([]);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query?.type, query?.value, isLocked]);

  // Filtre client : suggestions = (postal, nom) où postal commence par les chiffres tapés.
  const suggestions = useMemo<Suggestion[]>(() => {
    if (isLocked || !digits) return [];
    const flat: Suggestion[] = [];
    for (const c of communes) {
      for (const cp of c.codesPostaux) {
        if (cp.startsWith(digits.slice(0, 5))) {
          flat.push({ postal: cp, nom: c.nom });
        }
      }
    }
    flat.sort((a, b) => {
      if (a.postal !== b.postal) return a.postal.localeCompare(b.postal);
      return a.nom.localeCompare(b.nom);
    });
    return flat.slice(0, MAX_RESULTS);
  }, [communes, digits, isLocked]);

  // Ferme le dropdown quand on clique en dehors.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleChange = (next: string) => {
    setText(next);
    onChange(next);
  };

  const pick = (s: Suggestion) => {
    const composed = `${s.postal} ${s.nom}`;
    setText(composed);
    onChange(composed);
    setOpen(false);
  };

  const clear = () => {
    setText("");
    onChange("");
    setCommunes([]);
    setError(null);
    setOpen(false);
    lastQueryKeyRef.current = "";
  };

  const showStatus = loading || error || isLocked;

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Input
          inputMode="numeric"
          autoComplete="postal-code"
          value={text}
          placeholder="Tapez votre code postal (ex. 75001)"
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && !isLocked && setOpen(true)}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="pc-listbox"
          className="pr-10"
        />
        {text.length > 0 && (
          <button
            type="button"
            onClick={clear}
            aria-label="Effacer"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-text-muted hover:bg-bg hover:text-text focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}

        {/* Dropdown collé en dessous du champ */}
        {open && !isLocked && suggestions.length > 0 && (
          <ul
            id="pc-listbox"
            role="listbox"
            className="absolute left-0 right-0 top-full z-20 max-h-72 overflow-y-auto rounded-b-md border border-t-0 border-border bg-surface shadow-lg"
          >
            {suggestions.map((s, idx) => (
              <li key={`${s.postal}-${s.nom}-${idx}`}>
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => pick(s)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left text-body transition hover:bg-primary-50 focus:bg-primary-50 focus:outline-none"
                >
                  <span className="font-mono text-body-sm font-semibold text-primary-700">
                    {s.postal}
                  </span>
                  <span className="text-text">{s.nom}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Status uniquement quand pertinent — pas d'espace réservé inutile */}
      {showStatus && (
        <p
          className={`mt-1 text-body-sm ${
            error ? "text-error" : isLocked ? "text-primary-700" : "text-text-muted"
          }`}
          aria-live="polite"
          {...(error ? { role: "alert" as const } : {})}
        >
          {loading
            ? "Recherche…"
            : error
            ? error
            : isLocked
            ? "✓ Commune sélectionnée"
            : ""}
        </p>
      )}
    </div>
  );
}
