"use client";

import { useState } from "react";
import { useEditor } from "./EditorContext";
import { ImageUploadModal } from "./ImageUploadModal";
import { resolveSpec } from "@/lib/imageSpecs";
import { cn } from "@/components/ui/cn";

/**
 * Image éditable. En mode public : <img> simple (ou children fallback).
 * En mode editor : overlay au hover avec bouton "Remplacer" qui ouvre la modale.
 *
 * - Si la spec n'existe pas pour `imageKey`, lève une erreur en dev (console).
 * - Si l'image n'a pas encore d'URL publiée, affiche `fallback`.
 */
export function EditableImage({
  imageKey,
  initialUrl,
  alt,
  className,
  imgClassName,
  fallback,
}: {
  imageKey: string;
  initialUrl?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallback?: React.ReactNode;
}) {
  const editor = useEditor();
  const spec = resolveSpec(imageKey);
  const [modalOpen, setModalOpen] = useState(false);

  // Erreur dev si pas de spec
  if (!spec) {
    if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
      console.error(`[EditableImage] Spec manquante pour la clé "${imageKey}". Ajouter une entrée dans src/lib/imageSpecs.ts`);
    }
  }

  // URL effective : draft local en éditeur, sinon URL initiale
  let url = initialUrl ?? null;
  if (editor) {
    const draft = editor.drafts.get(imageKey);
    if (draft?.url) url = draft.url;
  }

  const renderImg = url
    ? <img src={url} alt={alt} className={cn("block max-w-full", imgClassName)} loading="lazy" />
    : fallback ?? null;

  if (!editor || editor.previewMode) {
    return <span className={className}>{renderImg}</span>;
  }

  const hasDraft = editor.drafts.has(imageKey);

  return (
    <>
      <span
        className={cn(
          "relative inline-block group",
          "ring-offset-2 transition rounded-sm",
          hasDraft && "ring-2 ring-accent-500",
          !hasDraft && "hover:ring-2 hover:ring-primary-500 hover:ring-dashed",
          className,
        )}
      >
        {renderImg}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="absolute inset-0 flex items-center justify-center bg-primary-900/0 group-hover:bg-primary-900/40 transition opacity-0 group-hover:opacity-100"
          aria-label={`Remplacer l'image ${imageKey}`}
        >
          <span className="rounded-md bg-primary-700 px-4 py-2 text-text-inverse font-display font-semibold shadow-lg">
            Remplacer
          </span>
        </button>
        {hasDraft && (
          <span className="absolute -top-2 -right-2 inline-flex items-center gap-1 rounded-md bg-accent-500 px-2 py-0.5 text-[10px] font-bold text-primary-800 shadow-sm">
            non publié
          </span>
        )}
      </span>

      {spec && (
        <ImageUploadModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          spec={spec}
          imageKey={imageKey}
          currentUrl={url}
          onUploaded={(newUrl) => {
            editor.setDraft({ key: imageKey, url: newUrl, type: "image" });
          }}
        />
      )}
    </>
  );
}
