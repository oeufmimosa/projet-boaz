import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Connexion admin" };
export const dynamic = "force-dynamic";

/**
 * Anti-open-redirect : autorise uniquement les chemins INTERNES qui
 * commencent par `/` mais PAS par `//` (qui serait protocol-relative,
 * permettant `//evil.com`). Refuse aussi `/\\evil.com` (backslash trick).
 * Tout le reste retombe sur `/admin`.
 */
function safeNextPath(next: string | undefined): string {
  if (!next) return "/admin";
  if (!next.startsWith("/")) return "/admin";
  if (next.startsWith("//") || next.startsWith("/\\")) return "/admin";
  return next;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const user = await getSessionUser();
  if (user) redirect(safeNextPath(searchParams.next));

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-md border border-border bg-surface p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">Connexion admin</h1>
        <LoginForm next={safeNextPath(searchParams.next)} />
      </div>
    </div>
  );
}
