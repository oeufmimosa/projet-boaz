import { getSessionUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { TricolorBar } from "@/components/brand/TricolorBar";

export const dynamic = "force-dynamic";

/**
 * Admin layout. Middleware redirige les visites non authentifiées vers
 * /admin/login. Ici on affiche la sidebar quand une session existe.
 * Filet tricolore tout en haut pour cohérence avec le reste du site.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-bg">
        <TricolorBar />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <TricolorBar />
      <div className="flex flex-col md:flex-row">
        <AdminSidebar email={user.email} />
        <div className="flex-1 p-4 sm:p-8 max-w-full overflow-x-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
