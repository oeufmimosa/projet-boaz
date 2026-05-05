import { loadAllDrafts } from "@/lib/editor-drafts";
import { EditorShell } from "@/components/editor/EditorShell";

export const metadata = { title: "Éditeur — Accueil" };
export const dynamic = "force-dynamic";

/**
 * Page parent de l'éditeur pour la home. Récupère les drafts côté serveur
 * et instancie l'EditorShell client (toolbar + iframe pointant sur
 * /admin/editor/preview/home).
 */
export default async function EditorHomeParentPage() {
  const drafts = await loadAllDrafts();
  return (
    <EditorShell
      page="home"
      previewPath="/admin/editor/preview/home"
      initialDraftKeys={drafts.map((d) => d.key)}
    />
  );
}
