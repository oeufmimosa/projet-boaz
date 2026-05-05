"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { ImageSpec } from "@/lib/imageSpecs";
import type { StockImageResult, StockImageSource } from "@/lib/stock-images";

/**
 * Panneau « Photos libres » de la modale d'upload.
 *
 * Sources : Unsplash + Pexels uniquement (sources LÉGALES, pas de Google
 * Images, pas de scraping). Si la clé d'API n'est pas configurée dans .env,
 * l'onglet est rendu **visible mais grisé** avec un panneau d'aide qui
 * explique comment configurer (3 étapes + liens vers les portails dev) +
 * une note rappelant que l'onglet « Téléverser » reste disponible sans clé.
 */
export function StockImagesPanel({
  initialQuery,
  spec,
  imageKey,
  onSelected,
  onCancel,
}: {
  initialQuery: string;
  spec: ImageSpec;
  imageKey: string;
  onSelected: (newUrl: string) => void;
  onCancel: () => void;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [source, setSource] = useState<StockImageSource>("unsplash");
  const [results, setResults] = useState<StockImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<StockImageResult | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Recherche initiale dès l'ouverture du panneau
  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery, source);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doSearch(q: string, src: StockImageSource) {
    setLoading(true);
    setError(null);
    setApiKeyMissing(false);
    setResults([]);
    try {
      const orientation = pickOrientation(spec);
      const orientationParam = orientation ? `&orientation=${orientation}` : "";
      const res = await fetch(
        `/api/admin/stock-images/search?q=${encodeURIComponent(q)}&source=${src}&perPage=12${orientationParam}`,
        { credentials: "same-origin" },
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.ok) {
        setError(body?.error ?? `Recherche échouée (HTTP ${res.status})`);
        return;
      }
      if (body.data?.apiKeyMissing) {
        setApiKeyMissing(true);
        return;
      }
      if (body.data?.error) {
        setError(body.data.error);
        return;
      }
      setResults(body.data?.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  function onSubmitSearch(e: React.FormEvent) {
    e.preventDefault();
    doSearch(query, source);
  }

  async function confirmUse() {
    if (!selected) return;
    setConfirming(true);
    setError(null);
    try {
      const csrf =
        typeof document !== "undefined"
          ? document.cookie.match(/bz_csrf=([^;]+)/)?.[1] ?? ""
          : "";
      const res = await fetch("/api/admin/stock-images/use", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrf,
        },
        body: JSON.stringify({
          imageKey,
          query,
          stockId: selected.id,
          source: selected.source,
          draft: true,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.ok) {
        setError(body?.error ?? `Utilisation échouée (HTTP ${res.status})`);
        return;
      }
      onSelected(body.data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setConfirming(false);
    }
  }

  // ─── État : clé d'API manquante ────────────────────────────────────────
  if (apiKeyMissing) {
    return (
      <div className="space-y-4">
        <div
          role="alert"
          className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-4"
        >
          <span aria-hidden className="mt-0.5 text-2xl">🔒</span>
          <div className="flex-1">
            <p className="font-display font-semibold text-amber-900">
              Recherche stock désactivée
            </p>
            <p className="mt-1 text-body-sm text-amber-900">
              La clé d'API <code className="font-mono">
                {source === "unsplash" ? "UNSPLASH_ACCESS_KEY" : "PEXELS_API_KEY"}
              </code>{" "}
              n'est pas configurée dans <code className="font-mono">.env</code>.
            </p>
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="mt-3 text-body-sm font-semibold text-primary-700 hover:underline"
            >
              {showHelp ? "Masquer" : "Comment configurer ?"}
            </button>
          </div>
        </div>

        {showHelp && (
          <div className="rounded-md border border-border bg-surface-2 p-4 text-body-sm">
            <ol className="space-y-3">
              <li>
                <strong>1. Créer un compte développeur</strong>
                <br />
                <a
                  href="https://unsplash.com/developers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-700 hover:underline"
                >
                  Unsplash → /developers
                </a>{" "}
                (« Demo », gratuit, 50 req/h suffit) ou{" "}
                <a
                  href="https://www.pexels.com/api/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-700 hover:underline"
                >
                  Pexels → /api
                </a>
              </li>
              <li>
                <strong>2. Copier la clé</strong>
                <br />
                Sur Unsplash : « Access Key » dans la fiche application. Sur Pexels :
                la clé apparaît directement après inscription.
              </li>
              <li>
                <strong>3. Coller dans <code className="font-mono">.env</code></strong>
                <br />
                <code className="block rounded bg-bg p-2 font-mono text-xs">
                  UNSPLASH_ACCESS_KEY="…"
                  <br />
                  PEXELS_API_KEY="…"
                </code>
                Puis <strong>redémarrer</strong> le serveur (<code>pnpm dev</code>).
              </li>
            </ol>
          </div>
        )}

        <p className="text-body-sm text-text-muted">
          💡 Vous pouvez aussi téléverser vos propres images via l'onglet
          « <strong>Téléverser</strong> » sans configurer ces API.
        </p>

        <div className="flex justify-end">
          <Button variant="ghost" onClick={onCancel}>Fermer</Button>
        </div>
      </div>
    );
  }

  // ─── État : aperçu détaillé d'une image sélectionnée ───────────────────
  if (selected) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="text-body-sm font-semibold text-primary-700 hover:underline"
        >
          ← Retour aux résultats
        </button>

        <div className="overflow-hidden rounded-md border border-border bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selected.url}
            alt={selected.altSuggestion ?? "Aperçu image stock"}
            className="w-full max-h-96 object-contain bg-bg"
          />
          <div className="border-t border-border bg-surface-2 px-4 py-3 text-body-sm">
            <p>
              <strong>Auteur :</strong>{" "}
              <a
                href={selected.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-700 hover:underline"
              >
                {selected.authorName}
              </a>{" "}
              — {selected.source === "unsplash" ? "Unsplash" : "Pexels"}
            </p>
            <p className="mt-1 text-text-muted">
              Dimensions originales : {selected.width} × {selected.height} px.
              Sera redimensionnée en cover {spec.width} × {spec.height} px.
            </p>
            {selected.altSuggestion && (
              <p className="mt-1 text-text-muted">
                Description source : <em>« {selected.altSuggestion} »</em>
              </p>
            )}
          </div>
        </div>

        {error && (
          <div role="alert" className="rounded-md border border-error/40 bg-error/10 px-4 py-3 text-body-sm text-error">
            {error}
          </div>
        )}

        <p className="text-body-sm text-text-muted">
          L'attribution sera automatiquement enregistrée et affichée sur la page <code>/credits</code>.
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setSelected(null)}>Annuler</Button>
          <Button variant="primary" onClick={confirmUse} disabled={confirming}>
            {confirming ? "Enregistrement…" : "Utiliser cette image"}
          </Button>
        </div>
      </div>
    );
  }

  // ─── État : recherche + grille de résultats ────────────────────────────
  return (
    <div className="space-y-4">
      <form onSubmit={onSubmitSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="block text-body-sm font-semibold text-text">Recherche</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ex. heat pump house"
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-body"
          />
        </label>
        <fieldset className="flex items-center gap-3" role="radiogroup" aria-label="Source">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="source"
              value="unsplash"
              checked={source === "unsplash"}
              onChange={() => setSource("unsplash")}
            />
            <span className="text-body-sm">Unsplash</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="source"
              value="pexels"
              checked={source === "pexels"}
              onChange={() => setSource("pexels")}
            />
            <span className="text-body-sm">Pexels</span>
          </label>
        </fieldset>
        <Button type="submit" variant="primary" disabled={loading || !query.trim()}>
          {loading ? "Recherche…" : "Rechercher"}
        </Button>
      </form>

      {error && (
        <div role="alert" className="rounded-md border border-error/40 bg-error/10 px-4 py-3 text-body-sm text-error">
          {error}
        </div>
      )}

      {loading && (
        <p className="text-body-sm text-text-muted">Chargement des résultats…</p>
      )}

      {!loading && results.length === 0 && !error && (
        <p className="text-body-sm text-text-muted">
          Aucun résultat. Essayez une autre requête (en anglais, les bibliothèques sont mieux indexées en EN).
        </p>
      )}

      {results.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {results.map((r) => (
            <li key={`${r.source}-${r.id}`}>
              <button
                type="button"
                onClick={() => setSelected(r)}
                className="group relative block w-full overflow-hidden rounded-md border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.thumbUrl}
                  alt={r.altSuggestion ?? `Photo de ${r.authorName}`}
                  className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-left text-xs text-white opacity-0 transition group-hover:opacity-100">
                  {r.authorName}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function pickOrientation(spec: ImageSpec): "landscape" | "portrait" | "squarish" | undefined {
  const ratio = spec.width / spec.height;
  if (ratio >= 1.4) return "landscape";
  if (ratio <= 0.75) return "portrait";
  if (ratio >= 0.85 && ratio <= 1.15) return "squarish";
  return undefined;
}
