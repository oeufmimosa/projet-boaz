"use client";

import { useEffect } from "react";
import { useEditor } from "./EditorContext";

/**
 * Filet de sécurité : empêche les actions interactives (navigation, ouverture
 * modale, soumission, ouverture chatbox…) lors d'un clic dans l'iframe en
 * mode éditeur. Les zones explicitement éditables (data-editable) ou les
 * éléments de l'éditeur lui-même (data-editor-control) restent fonctionnels.
 *
 * Utilise un listener en phase capture pour intercepter avant tout handler
 * applicatif. Bloque aussi `submit` sur les formulaires.
 */
export function ClickBlocker() {
  const editor = useEditor();
  const enabled = !!editor && !editor.previewMode;

  useEffect(() => {
    if (!enabled) return;

    const isEditableZone = (el: Element | null): boolean => {
      if (!el) return false;
      return Boolean(
        el.closest("[data-editable]") ||
        el.closest("[data-editor-control]"),
      );
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (isEditableZone(target)) return;
      // Tous les éléments interactifs natifs : on bloque l'action
      if (target.closest('a, button, [role="button"], input, select, textarea, summary, details, [data-clickable]')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    const onSubmit = (e: SubmitEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // Évite que Enter/Espace dans des zones non éditables n'active des boutons
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (isEditableZone(target)) return;
      if ((e.key === "Enter" || e.key === " ") &&
          target.closest('a, button, [role="button"], summary, [data-clickable]')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("submit", onSubmit, { capture: true });
    document.addEventListener("keydown", onKeyDown, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true } as never);
      document.removeEventListener("submit", onSubmit, { capture: true } as never);
      document.removeEventListener("keydown", onKeyDown, { capture: true } as never);
    };
  }, [enabled]);

  return null;
}
