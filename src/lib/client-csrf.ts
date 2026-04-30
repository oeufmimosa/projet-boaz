/**
 * Client helper: read the CSRF cookie set by the middleware/server,
 * and inject it into mutating fetch requests under /api/.
 */
export function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)bz_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export async function adminFetch(input: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const csrf = getCsrfToken();
  if (csrf) headers.set("x-csrf-token", csrf);
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  return fetch(input, { ...init, headers, credentials: "same-origin" });
}
