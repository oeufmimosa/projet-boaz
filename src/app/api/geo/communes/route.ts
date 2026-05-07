import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GEO_API = "https://geo.api.gouv.fr/communes";

/**
 * Proxy léger vers geo.api.gouv.fr/communes pour éviter tout souci CORS /
 * réseau côté navigateur (proxy entreprise, extensions, CSP, etc.).
 *
 * Paramètres acceptés :
 *   - codePostal : 5 chiffres (recherche exacte)
 *     ex. /api/geo/communes?codePostal=75001
 *   - codeDepartement : 2 chars (métropole + 2A/2B Corse) ou 3 chars (DOM-TOM)
 *     ex. /api/geo/communes?codeDepartement=92
 *
 * Retourne un tableau Commune avec `nom` + `codesPostaux`.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const codePostal = searchParams.get("codePostal");
  const codeDepartement = searchParams.get("codeDepartement");

  let upstream: string | null = null;
  if (codePostal && /^\d{5}$/.test(codePostal)) {
    upstream = `${GEO_API}?codePostal=${codePostal}&fields=nom,codesPostaux&format=json`;
  } else if (codeDepartement && /^(\d{2,3}|2A|2B)$/.test(codeDepartement)) {
    upstream = `${GEO_API}?codeDepartement=${codeDepartement}&fields=nom,codesPostaux&format=json&limit=500`;
  }

  if (!upstream) {
    return NextResponse.json({ error: "param invalide" }, { status: 400 });
  }

  try {
    const r = await fetch(upstream, { signal: AbortSignal.timeout(5000) });
    if (!r.ok) {
      return NextResponse.json({ error: "upstream error" }, { status: 502 });
    }
    const data = await r.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "network error" }, { status: 502 });
  }
}
