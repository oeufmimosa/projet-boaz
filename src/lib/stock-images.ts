/**
 * Couche d'intégration avec les API d'images stock.
 *
 * Sources légales supportées :
 *  - Unsplash (https://unsplash.com) — licence Unsplash, attribution recommandée
 *  - Pexels   (https://pexels.com)   — licence Pexels, attribution recommandée
 *
 * ⚠️ Aucune image ne doit être recherchée ou téléchargée depuis Google Images,
 * Bing, des sites concurrents ou des forums. Ces sources sont protégées par le
 * droit d'auteur. Cf. docs/seo.md « Stratégie images sans plagiat ».
 *
 * Comportement gracieux : si la clé d'API correspondante n'est pas définie
 * dans l'env, la fonction de recherche renvoie un résultat vide + un flag
 * `apiKeyMissing: true` pour permettre à la modale d'afficher un message
 * explicite plutôt que de planter.
 */

export type StockImageSource = "unsplash" | "pexels";

export type StockImageResult = {
  id: string;
  source: StockImageSource;
  /** URL haute résolution (à télécharger pour persistance MediaAsset). */
  url: string;
  /** URL vignette pour l'aperçu dans la modale admin. */
  thumbUrl: string;
  width: number;
  height: number;
  authorName: string;
  /** Profil de l'auteur sur la plateforme source. */
  authorUrl: string;
  /** Page de l'image sur Unsplash/Pexels (à utiliser pour `attributionUrl`). */
  sourceUrl: string;
  /** Description fournie par la source, peut servir d'`alt` par défaut. */
  altSuggestion?: string;
};

export type StockSearchResponse = {
  results: StockImageResult[];
  /** True si la clé d'API correspondante n'est pas configurée — permet à
   *  la modale d'afficher un message explicite côté UI. */
  apiKeyMissing?: boolean;
  /** True si la requête a échoué (réseau, quota, etc.). Détail dans `error`. */
  error?: string;
};

export type StockSearchOptions = {
  source?: StockImageSource;
  perPage?: number;
  page?: number;
  orientation?: "landscape" | "portrait" | "squarish";
};

const UNSPLASH_API = "https://api.unsplash.com";
const PEXELS_API = "https://api.pexels.com/v1";

// ─────────────────────────────────────────────────────────────────────────────
// Unsplash
// ─────────────────────────────────────────────────────────────────────────────

async function searchUnsplash(
  query: string,
  options: StockSearchOptions = {},
): Promise<StockSearchResponse> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return { results: [], apiKeyMissing: true };

  const params = new URLSearchParams({
    query,
    per_page: String(options.perPage ?? 12),
    page: String(options.page ?? 1),
    ...(options.orientation ? { orientation: options.orientation } : {}),
  });

  try {
    const res = await fetch(`${UNSPLASH_API}/search/photos?${params}`, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
      // Pas de cache : recherche en temps réel, résultats varient.
      cache: "no-store",
    });
    if (!res.ok) {
      return { results: [], error: `Unsplash HTTP ${res.status}` };
    }
    const json = await res.json();
    const results: StockImageResult[] = (json.results ?? []).map((p: UnsplashPhoto) => ({
      id: p.id,
      source: "unsplash" as const,
      url: p.urls.regular,
      thumbUrl: p.urls.small,
      width: p.width,
      height: p.height,
      authorName: p.user?.name ?? "Auteur inconnu",
      authorUrl: p.user?.links?.html ?? "https://unsplash.com",
      sourceUrl: p.links?.html ?? `https://unsplash.com/photos/${p.id}`,
      altSuggestion: p.alt_description ?? p.description ?? undefined,
    }));
    return { results };
  } catch (err) {
    return { results: [], error: err instanceof Error ? err.message : "Unsplash fetch failed" };
  }
}

/**
 * Ping le download endpoint d'Unsplash quand une photo est *effectivement
 * utilisée* — règle imposée par leur licence pour le tracking. À appeler
 * après le téléchargement pour persistance.
 *
 * Ne bloque pas : on tolère l'échec (best-effort).
 */
export async function trackUnsplashDownload(photoId: string): Promise<void> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return;
  try {
    await fetch(`${UNSPLASH_API}/photos/${photoId}/download`, {
      headers: { Authorization: `Client-ID ${accessKey}` },
      cache: "no-store",
    });
  } catch {
    // Non bloquant.
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Pexels
// ─────────────────────────────────────────────────────────────────────────────

async function searchPexels(
  query: string,
  options: StockSearchOptions = {},
): Promise<StockSearchResponse> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return { results: [], apiKeyMissing: true };

  const params = new URLSearchParams({
    query,
    per_page: String(options.perPage ?? 12),
    page: String(options.page ?? 1),
    ...(options.orientation ? { orientation: options.orientation } : {}),
  });

  try {
    const res = await fetch(`${PEXELS_API}/search?${params}`, {
      headers: { Authorization: apiKey },
      cache: "no-store",
    });
    if (!res.ok) {
      return { results: [], error: `Pexels HTTP ${res.status}` };
    }
    const json = await res.json();
    const results: StockImageResult[] = (json.photos ?? []).map((p: PexelsPhoto) => ({
      id: String(p.id),
      source: "pexels" as const,
      url: p.src.large2x ?? p.src.large ?? p.src.original,
      thumbUrl: p.src.medium ?? p.src.small ?? p.src.tiny,
      width: p.width,
      height: p.height,
      authorName: p.photographer ?? "Auteur inconnu",
      authorUrl: p.photographer_url ?? "https://www.pexels.com",
      sourceUrl: p.url ?? `https://www.pexels.com/photo/${p.id}/`,
      altSuggestion: p.alt ?? undefined,
    }));
    return { results };
  } catch (err) {
    return { results: [], error: err instanceof Error ? err.message : "Pexels fetch failed" };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Wrapper unifié
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Recherche sur la source spécifiée (par défaut Unsplash).
 * Ne lève jamais d'exception : encapsule les erreurs dans la réponse.
 */
export async function searchStockImages(
  query: string,
  options: StockSearchOptions = {},
): Promise<StockSearchResponse> {
  const source = options.source ?? "unsplash";
  if (source === "pexels") return searchPexels(query, options);
  return searchUnsplash(query, options);
}

/**
 * Construit la chaîne d'attribution standard à stocker dans
 * `MediaAsset.attribution`. Format : « Photo : Prénom Nom — Source ».
 */
export function buildAttribution(result: StockImageResult): {
  attribution: string;
  attributionUrl: string;
  licenseType: string;
} {
  const sourceLabel = result.source === "unsplash" ? "Unsplash" : "Pexels";
  return {
    attribution: `Photo : ${result.authorName} — ${sourceLabel}`,
    attributionUrl: result.sourceUrl,
    licenseType: result.source === "unsplash" ? "Unsplash License" : "Pexels License",
  };
}

/**
 * Retourne true si au moins une source est configurée (utile pour
 * l'UI : décider d'afficher l'onglet « Photos libres »).
 */
export function hasStockApiKey(): { unsplash: boolean; pexels: boolean; any: boolean } {
  const unsplash = Boolean(process.env.UNSPLASH_ACCESS_KEY);
  const pexels = Boolean(process.env.PEXELS_API_KEY);
  return { unsplash, pexels, any: unsplash || pexels };
}

// ─────────────────────────────────────────────────────────────────────────────
// Mapping mots-clés contextuels par imageKey
// (suggestion de query par défaut affichée dans la modale)
// ─────────────────────────────────────────────────────────────────────────────

export function suggestQueryForImageKey(imageKey: string): string {
  const k = imageKey.toLowerCase();
  // Home — cards services interactives (matché AVANT les fallbacks génériques)
  if (k.startsWith("home.services.cards.pompe-a-chaleur"))               return "heat pump outdoor unit modern home";
  if (k.startsWith("home.services.cards.panneau-photovoltaique"))         return "solar panels rooftop residential";
  if (k.startsWith("home.services.cards.isolation-thermique-exterieure")) return "exterior wall insulation house facade";
  if (k.startsWith("home.services.cards.chauffe-eau-solaire-individuel")) return "solar water heater roof installation";
  if (k.startsWith("home.services.cards.ballon-thermodynamique"))         return "modern water heater bathroom";
  if (k.startsWith("home.services.cards.systeme-solaire-combine"))        return "solar heating system installation";
  if (k.startsWith("home.hero.background")) return "modern french house heat pump";
  if (k.startsWith("home.hero")) return "modern french house exterior";
  if (k.startsWith("home.parrainage")) return "handshake outdoor friendly";
  if (k.startsWith("parrainage.hero")) return "handshake outdoor friendly home";
  if (k.startsWith("expertise.hero")) return "craftsman blueprint home renovation";
  if (k.startsWith("expertise.team")) return "construction team meeting";
  if (k.includes("pompe-a-chaleur") || k.includes("pac")) return "heat pump outdoor unit installed";
  if (k.includes("panneau-photovoltaique") || k.includes("photovoltaique")) return "solar panels rooftop home";
  if (k.includes("isolation-thermique-exterieure") || k.includes("ite")) return "exterior wall insulation house";
  if (k.includes("chauffe-eau-solaire") || k.includes("cesi")) return "solar water heater roof";
  if (k.includes("ballon-thermodynamique")) return "water heater installation home";
  if (k.includes("systeme-solaire-combine") || k.includes("ssc")) return "solar combined system installation";
  if (k.includes("realisations") || k.includes("realisation")) return "renovated french house exterior";
  if (k.includes("article.cover")) {
    if (k.includes("maprimerenov")) return "house renovation work documents";
    if (k.includes("isolation")) return "home insulation walls construction";
    if (k.includes("photovoltaique")) return "solar panels installation roof";
    if (k.includes("pompe-a-chaleur")) return "heat pump installation modern home";
    if (k.includes("ballon")) return "water heater installation";
    if (k.includes("artisan-rge")) return "craftsman with tools renovation";
    if (k.includes("ssc")) return "solar combined heating system";
    if (k.includes("erreurs")) return "contract review home renovation";
    return "home renovation energy efficient";
  }
  if (k.startsWith("article.inline")) return "home renovation construction work";
  return "home renovation energy efficient";
}

// ─────────────────────────────────────────────────────────────────────────────
// Types des réponses API (limités aux champs que l'on consomme)
// ─────────────────────────────────────────────────────────────────────────────

interface UnsplashPhoto {
  id: string;
  width: number;
  height: number;
  alt_description?: string | null;
  description?: string | null;
  urls: { regular: string; small: string; thumb?: string };
  user?: { name?: string; links?: { html?: string } };
  links?: { html?: string };
}

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url?: string;
  alt?: string | null;
  photographer?: string;
  photographer_url?: string;
  src: {
    original: string;
    large2x?: string;
    large?: string;
    medium?: string;
    small?: string;
    tiny?: string;
  };
}
