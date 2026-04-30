import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Connexion admin" };
export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const user = await getSessionUser();
  if (user) redirect(searchParams.next ?? "/admin");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded border border-border bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">Connexion admin</h1>
        <LoginForm next={searchParams.next} />
      </div>
    </div>
  );
}
