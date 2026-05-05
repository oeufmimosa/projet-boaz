import { handle, ok, fail } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import {
  searchStockImages,
  type StockImageSource,
} from "@/lib/stock-images";

export const runtime = "nodejs";

/**
 * GET /api/admin/stock-images/search?q=...&source=unsplash&perPage=12&orientation=landscape
 *
 * Interroge Unsplash ou Pexels selon `source`. Si la clé d'API n'est pas
 * configurée dans l'env, renvoie `apiKeyMissing: true` (la modale affichera
 * un message explicite plutôt que de planter).
 */
export async function GET(req: Request) {
  return handle(async () => {
    await requireAdmin();

    const url = new URL(req.url);
    const query = (url.searchParams.get("q") ?? "").trim();
    if (!query) return fail(400, "Paramètre `q` requis");

    const source = (url.searchParams.get("source") ?? "unsplash") as StockImageSource;
    if (source !== "unsplash" && source !== "pexels") {
      return fail(400, "`source` doit être `unsplash` ou `pexels`");
    }

    const perPageRaw = parseInt(url.searchParams.get("perPage") ?? "12", 10);
    const perPage = Math.max(1, Math.min(24, Number.isFinite(perPageRaw) ? perPageRaw : 12));
    const orientation = (url.searchParams.get("orientation") ?? undefined) as
      | "landscape"
      | "portrait"
      | "squarish"
      | undefined;

    const response = await searchStockImages(query, { source, perPage, orientation });
    return ok(response);
  });
}
