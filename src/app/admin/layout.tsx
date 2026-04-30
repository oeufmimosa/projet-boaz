import { getSessionUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export const dynamic = "force-dynamic";

/**
 * Minimal admin layout. Middleware already redirects unauthenticated visits
 * to /admin/login and issues the CSRF cookie. Here we just render the sidebar
 * when a session exists. The login page renders without sidebar (no user yet).
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  if (!user) {
    return <div className="min-h-screen bg-bg">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row">
      <AdminSidebar email={user.email} />
      <div className="flex-1 p-4 sm:p-8">{children}</div>
    </div>
  );
}
