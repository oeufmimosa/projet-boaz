"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { adminFetch } from "@/lib/client-csrf";
import {
  EDITOR_MSG_NAMESPACE,
  isEditorMessage,
  postEditorMessage,
} from "./editor-messages";

export interface EditorDraft {
  key: string;
  value?: string;
  url?: string;
  type: "content" | "image";
}

export interface EditorContextValue {
  isEditor: true;
  drafts: Map<string, EditorDraft>;
  getValue: (key: string, fallback: string) => string;
  setDraft: (draft: EditorDraft) => void;
  discardDraft: (key?: string) => Promise<void>;
  hasPending: boolean;
  pendingCount: number;
  /** Toggle "preview sans cadres" piloté par le parent via postMessage. */
  previewMode: boolean;
}

const Context = createContext<EditorContextValue | null>(null);

/**
 * Hook utilisé par les composants Editable*. Renvoie null hors mode éditeur.
 */
export function useEditor(): EditorContextValue | null {
  return useContext(Context);
}

/**
 * Provider monté DANS l'iframe d'aperçu. Il gère les drafts locaux, les
 * persiste en API, et notifie le parent via postMessage à chaque changement.
 * Écoute aussi les messages du parent (preview-mode / publish-done / discard).
 */
export function EditorProvider({
  children,
  initialDrafts,
}: {
  children: React.ReactNode;
  initialDrafts: EditorDraft[];
}) {
  const [drafts, setDrafts] = useState<Map<string, EditorDraft>>(() => {
    const m = new Map<string, EditorDraft>();
    for (const d of initialDrafts) m.set(d.key, d);
    return m;
  });
  const [previewMode, setPreviewMode] = useState(false);
  const timersRef = useRef(new Map<string, number>());

  // Au montage : signale au parent qu'on est prête + envoie le snapshot initial.
  useEffect(() => {
    if (window.parent === window) return; // pas dans un iframe
    postEditorMessage(window.parent, { ns: EDITOR_MSG_NAMESPACE, type: "iframe-ready" });
    postEditorMessage(window.parent, {
      ns: EDITOR_MSG_NAMESPACE,
      type: "drafts-snapshot",
      keys: Array.from(drafts.keys()),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Écoute les messages du parent.
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (!isEditorMessage(e.data)) return;
      switch (e.data.type) {
        case "preview-mode":
          setPreviewMode(e.data.value);
          break;
        case "publish-done":
          // Le serveur a copié les drafts en valeur publiée — reload pour
          // refetch et afficher la nouvelle valeur.
          window.location.reload();
          break;
        case "discard":
          if (e.data.key) {
            setDrafts((prev) => {
              const next = new Map(prev);
              next.delete(e.data.key as string);
              return next;
            });
          } else {
            setDrafts(new Map());
          }
          break;
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // À chaque changement de drafts, envoie un snapshot au parent.
  useEffect(() => {
    if (window.parent === window) return;
    postEditorMessage(window.parent, {
      ns: EDITOR_MSG_NAMESPACE,
      type: "drafts-snapshot",
      keys: Array.from(drafts.keys()),
    });
  }, [drafts]);

  const getValue = useCallback(
    (key: string, fallback: string) => {
      const d = drafts.get(key);
      if (d && d.value !== undefined) return d.value;
      return fallback;
    },
    [drafts],
  );

  const setDraft = useCallback((draft: EditorDraft) => {
    setDrafts((prev) => {
      const next = new Map(prev);
      next.set(draft.key, draft);
      return next;
    });
    const existing = timersRef.current.get(draft.key);
    if (existing) window.clearTimeout(existing);
    const t = window.setTimeout(async () => {
      try {
        await adminFetch("/api/admin/draft", {
          method: "PUT",
          body: JSON.stringify({
            key: draft.key,
            value: draft.value,
            url: draft.url,
            type: draft.type,
          }),
        });
      } catch { /* silent */ }
      timersRef.current.delete(draft.key);
    }, 500);
    timersRef.current.set(draft.key, t);
  }, []);

  const discardDraft = useCallback(async (key?: string) => {
    setDrafts((prev) => {
      const next = new Map(prev);
      if (key) next.delete(key);
      else next.clear();
      return next;
    });
    const url = key ? `/api/admin/draft?key=${encodeURIComponent(key)}` : "/api/admin/draft";
    await adminFetch(url, { method: "DELETE" }).catch(() => null);
  }, []);

  const value: EditorContextValue = useMemo(() => ({
    isEditor: true,
    drafts,
    getValue,
    setDraft,
    discardDraft,
    hasPending: drafts.size > 0,
    pendingCount: drafts.size,
    previewMode,
  }), [drafts, getValue, setDraft, discardDraft, previewMode]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
