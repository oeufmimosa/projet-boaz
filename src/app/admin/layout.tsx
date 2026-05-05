import type { Metadata } from "next";
import { TricolorBar } from "@/components/brand/TricolorBar";

export const dynamic = "force-dynamic";

// Defense-in-depth : empêche tout indexage des routes /admin/**
// (les middlewares redirigent déjà les non-authentifiés, mais
// si une route fuite via un lien externe on évite l'indexation).
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Layout racine admin. Volontairement minimal : juste le filet tricolore.
 * - Les routes "panel" (dashboard, contenus, images…) sont sous le route
 *   group `(panel)` qui ajoute la sidebar AdminSidebar.
 * - Les routes "editor" (mode éditeur visuel + iframe d'aperçu) sont sous
 *   `editor/` qui ne porte PAS la sidebar (la toolbar de l'éditeur la
 *   remplace).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <TricolorBar />
      {children}
    </div>
  );
}
