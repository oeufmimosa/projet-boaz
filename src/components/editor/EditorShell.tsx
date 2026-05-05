"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { TricolorBar } from "@/components/brand/TricolorBar";
import { adminFetch } from "@/lib/client-csrf";
import { cn } from "@/components/ui/cn";
import {
  EDITOR_MSG_NAMESPACE,
  isEditorMessage,
  postEditorMessage,
} from "./editor-messages";

type Viewport = "desktop" | "tablet" | "mobile";
const VIEWPORT_WIDTH: Record<Viewport, number | "100%"> = {
  desktop: 1280,
  tablet: 768,
  mobile: 390,
};

/**
 * Shell parent de l'éditeur visuel : barre d'outils + iframe d'aperçu.
 * - L'iframe charge la version "preview" de la page (auth admin partagée
 *   par cookie même origine).
 * - Le viewport switch redimensionne l'iframe : les media queries du
 *   contenu se réévaluent comme sur un vrai device.
 * - Les drafts sont synchronisés via postMessage : iframe → parent envoie
 *   un snapshot à chaque édition, parent → iframe propage publish/discard.
 */
export function EditorShell({
  page,
  previewPath,
  initialDraftKeys,
}: {
  page: string;
  previewPath: string;
  initialDraftKeys: string[];
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [previewMode, setPreviewMode] = useState(false);
  const [draftKeys, setDraftKeys] = useState<string[]>(initialDraftKeys);
  const [publishing, setPublishing] = useState(false);
  const [confirmPublish, setConfirmPublish] = useState(false);

  // Reçoit les snapshots de drafts depuis l'iframe
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (!isEditorMessage(e.data)) return;
      if (e.data.type === "drafts-snapshot") {
        setDraftKeys(e.data.keys);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Raccourcis clavier (Cmd/Ctrl+S, H, D/T/M)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        setConfirmPublish(true);
        return;
      }
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (isMod) return;
      if (e.key.toLowerCase() === "h") togglePreview();
      else if (e.key.toLowerCase() === "d") setViewport("desktop");
      else if (e.key.toLowerCase() === "t") setViewport("tablet");
      else if (e.key.toLowerCase() === "m") setViewport("mobile");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendToIframe = (msg: Parameters<typeof postEditorMessage>[1]) => {
    const win = iframeRef.current?.contentWindow;
    if (win) postEditorMessage(win, msg);
  };

  const togglePreview = () => {
    setPreviewMode((v) => {
      const next = !v;
      sendToIframe({ ns: EDITOR_MSG_NAMESPACE, type: "preview-mode", value: next });
      return next;
    });
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await adminFetch("/api/admin/publish", {
        method: "POST",
        body: JSON.stringify({}),
      });
      if (res.ok) {
        sendToIframe({ ns: EDITOR_MSG_NAMESPACE, type: "publish-done" });
        // L'iframe va se reload elle-même au reçu du message ; on vide aussi côté parent
        setDraftKeys([]);
      }
    } finally {
      setPublishing(false);
      setConfirmPublish(false);
    }
  };

  const discardAll = async () => {
    if (!confirm("Annuler toutes les modifications non publiées ?")) return;
    await adminFetch("/api/admin/draft", { method: "DELETE" });
    sendToIframe({ ns: EDITOR_MSG_NAMESPACE, type: "discard" });
    setDraftKeys([]);
  };

  const widthValue = VIEWPORT_WIDTH[viewport];
  const widthLabel =
    viewport === "desktop" ? "1280 px (desktop)" :
    viewport === "tablet"  ? "768 px (tablette)" :
    "390 px (mobile)";

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <TricolorBar />

      {/* Toolbar */}
      <header
        className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-primary-800 bg-primary-800 px-4 text-text-inverse"
        role="toolbar"
        aria-label="Éditeur"
      >
        <Link href="/admin" className="inline-flex items-center gap-2 hover:opacity-80" aria-label="Retour admin">
          <Logo variant="white" layout="mark" size="sm" />
          <span className="font-display text-body-sm font-semibold hidden sm:inline">Éditeur visuel</span>
        </Link>

        <select
          value={page}
          onChange={() => { /* phase 1: home seulement */ }}
          className="rounded-md bg-primary-900 border border-primary-700 px-3 py-1.5 text-body-sm font-medium text-text-inverse"
          aria-label="Page éditée"
        >
          <option value="home">Accueil</option>
        </select>

        <div role="group" aria-label="Largeur d'aperçu" className="flex items-center gap-1">
          <ViewportButton current={viewport} value="desktop" hotkey="D" onClick={() => setViewport("desktop")} />
          <ViewportButton current={viewport} value="tablet"  hotkey="T" onClick={() => setViewport("tablet")} />
          <ViewportButton current={viewport} value="mobile"  hotkey="M" onClick={() => setViewport("mobile")} />
        </div>

        <button
          type="button"
          onClick={togglePreview}
          className={cn(
            "rounded-md px-3 py-1.5 text-body-sm font-medium",
            previewMode ? "bg-accent-500 text-primary-800" : "bg-primary-900 hover:bg-primary-700",
          )}
          title="Aperçu sans cadres d'édition (H)"
        >
          {previewMode ? "Aperçu actif" : "Aperçu"}
        </button>

        <div className="ml-auto flex items-center gap-3">
          {draftKeys.length > 0 && (
            <>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-500/20 border border-accent-500/40 px-3 py-1 text-body-sm font-semibold text-accent-500">
                <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-accent-500" />
                {draftKeys.length} non publiée{draftKeys.length > 1 ? "s" : ""}
              </span>
              <button type="button" onClick={discardAll} className="rounded-md px-3 py-1.5 text-body-sm font-medium text-primary-200 hover:text-text-inverse">
                Annuler tout
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setConfirmPublish(true)}
            disabled={draftKeys.length === 0 || publishing}
            className="rounded-md bg-accent-500 px-4 py-1.5 font-display font-semibold text-primary-800 transition hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Publier (Cmd/Ctrl + S)"
          >
            {publishing ? "Publication…" : "Publier"}
          </button>
        </div>
      </header>

      {/* Indicateur viewport */}
      <div className="bg-bg border-b border-border px-4 py-2 text-center text-body-sm text-text-muted">
        {widthLabel}
      </div>

      {/* Frame d'aperçu (iframe) */}
      <div className="flex-1 overflow-auto bg-surface-2 p-4 flex justify-center items-start">
        <iframe
          ref={iframeRef}
          src={previewPath}
          title={`Aperçu — ${page}`}
          className="bg-bg shadow-md transition-[width] duration-200 ease-out"
          style={{
            width: widthValue === "100%" ? "100%" : `${widthValue}px`,
            maxWidth: "100%",
            height: "calc(100vh - 14rem)",
            border: 0,
          }}
        />
      </div>

      {/* Modale de confirmation de publication */}
      {confirmPublish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-900/70 p-4" onClick={() => setConfirmPublish(false)}>
          <div className="max-w-md rounded-xl bg-surface text-text p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-display-sm">Publier les modifications ?</h2>
            <p className="mt-2 text-body text-text-muted">
              {draftKeys.length} modification{draftKeys.length > 1 ? "s" : ""} en attente seront appliquées sur le site public.
            </p>
            <ul className="mt-3 max-h-40 overflow-y-auto text-body-sm text-text-muted space-y-1">
              {draftKeys.map((k) => <li key={k}><code>{k}</code></li>)}
            </ul>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmPublish(false)} className="rounded-md px-3 py-1.5 text-body-sm">Annuler</button>
              <button type="button" onClick={handlePublish} disabled={publishing} className="rounded-md bg-primary-700 text-text-inverse px-4 py-1.5 font-display font-semibold hover:bg-primary-800 disabled:opacity-50">
                {publishing ? "Publication…" : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ViewportButton({
  current, value, hotkey, onClick,
}: {
  current: Viewport; value: Viewport; hotkey: string; onClick: () => void;
}) {
  const active = current === value;
  const label = value === "desktop" ? "Desktop" : value === "tablet" ? "Tablette" : "Mobile";
  return (
    <button
      type="button"
      onClick={onClick}
      title={`${label} (${hotkey})`}
      className={cn(
        "rounded-md px-2.5 py-1.5 text-body-sm font-medium",
        active ? "bg-accent-500 text-primary-800" : "bg-primary-900 hover:bg-primary-700",
      )}
    >
      {hotkey}
    </button>
  );
}
