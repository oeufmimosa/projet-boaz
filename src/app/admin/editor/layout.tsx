import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Layout parent du mode éditeur. Vérifie l'auth seulement. Les pages filles
 * (ex: /admin/editor/home) rendent l'EditorShell client qui contient la
 * toolbar et l'iframe pointant sur /admin/editor/preview/<page>.
 *
 * Cette séparation est nécessaire pour que les media queries réagissent
 * au redimensionnement de l'iframe (vraie isolation de viewport). Le
 * EditorProvider et le click-blocker vivent dans /admin/editor/preview/.
 */
export default async function EditorLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return <>{children}</>;
}
