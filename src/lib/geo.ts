/**
 * Résolution code postal → ville via l'API publique de l'État
 * (https://geo.api.gouv.fr — gratuite, sans clé). En cas d'échec, on
 * renvoie null et le code appelant retombe sur un format dégradé "{cp} ".
 */

const ENDPOINT = "https://geo.api.gouv.fr/communes";

export interface CityLookup {
  postalCode: string;
  city: string | null;
}

export async function lookupCity(postalCode: string, signal?: AbortSignal): Promise<CityLookup> {
  const cp = postalCode.trim();
  if (!/^\d{5}$/.test(cp)) return { postalCode: cp, city: null };

  try {
    const res = await fetch(
      `${ENDPOINT}?codePostal=${cp}&fields=nom&format=json&limit=1`,
      { signal, next: { revalidate: 60 * 60 * 24 } as RequestInit["next"] },
    );
    if (!res.ok) return { postalCode: cp, city: null };
    const data: Array<{ nom?: string }> = await res.json();
    const city = data[0]?.nom ?? null;
    return { postalCode: cp, city };
  } catch {
    return { postalCode: cp, city: null };
  }
}
