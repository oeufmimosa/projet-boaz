import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export const dynamic = "force-dynamic";

/**
 * Layout du panneau admin (toutes les pages avec la sidebar : dashboard,
 * contenus, images, simulateur, articles, témoignages, chatbox, soumissions).
 * - Auth requise.
 * - L'éditeur visuel (/admin/editor/*) n'utilise PAS ce layout — sa toolbar
 *   joue le rôle de la sidebar.
 */
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="flex flex-col md:flex-row">
      <AdminSidebar email={user.email} />
      <div className="flex-1 p-4 sm:p-8 max-w-full overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
