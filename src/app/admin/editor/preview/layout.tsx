import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { loadAllDrafts } from "@/lib/editor-drafts";
import { EditorProvider } from "@/components/editor/EditorContext";
import { ClickBlocker } from "@/components/editor/ClickBlocker";

export const dynamic = "force-dynamic";

/**
 * Layout du contenu chargé dans l'iframe d'aperçu. Vérifie l'auth (cookie
 * partagé même origine), monte l'EditorProvider et active le click-blocker
 * global qui empêche les actions interactives (navigation, soumission…)
 * en mode éditeur, sauf sur les éléments wrapped Editable*.
 */
export default async function EditorPreviewLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const initialDrafts = await loadAllDrafts();

  return (
    <EditorProvider initialDrafts={initialDrafts}>
      <ClickBlocker />
      {children}
    </EditorProvider>
  );
}
