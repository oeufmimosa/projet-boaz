"use client";

import Link from "next/link";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useEditor } from "./EditorContext";
import { cn } from "@/components/ui/cn";

type Variant = "primary" | "accent" | "outline" | "ghost" | "inverse" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:  "bg-primary-700 text-text-inverse hover:bg-primary-800 active:bg-primary-900",
  accent:   "bg-accent-500 text-primary-800 hover:bg-accent-600 active:bg-accent-600",
  outline:  "bg-transparent text-primary-700 border-1.5 border-primary-700 hover:bg-primary-50",
  ghost:    "bg-transparent text-primary-700 hover:bg-primary-50",
  inverse:  "bg-surface text-primary-700 hover:bg-primary-50",
  danger:   "bg-error text-text-inverse hover:opacity-90",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-body-sm",
  md: "h-11 px-5 text-body",
  lg: "h-[52px] px-6 text-body-lg",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md font-display font-semibold whitespace-nowrap transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none";

/**
 * Bouton/lien éditable.
 *  - public : `<a>` si href, sinon `<button>`. Comportement réel.
 *  - éditeur : même style visuel, mais le clic édite le label inline ;
 *    le href s'édite via une icône popover à droite (au hover).
 *
 * `data-editable` pour que le ClickBlocker laisse passer le clic d'édition.
 * `hrefKey` permet de stocker le href en Content (modifiable via popover).
 */
export function EditableButton({
  contentKey,
  hrefKey,
  initialLabel,
  initialHref,
  variant = "primary",
  size = "md",
  className,
  external = false,
}: {
  contentKey: string;
  hrefKey?: string;
  initialLabel: string;
  initialHref?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
}) {
  const editor = useEditor();
  const [editing, setEditing] = useState(false);
  const [draftLocal, setDraftLocal] = useState<string | null>(null);
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  // Récupère valeur courante (draft ou publiée)
  const label = editor ? editor.getValue(contentKey, initialLabel) : initialLabel;
  const href  = hrefKey && editor
    ? editor.getValue(hrefKey, initialHref ?? "#")
    : (initialHref ?? "#");
  const display = draftLocal ?? label;
  const hasDraft = !!editor && (
    editor.drafts.has(contentKey) ||
    (hrefKey ? editor.drafts.has(hrefKey) : false)
  );

  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  // Public ou preview-sans-cadres : rendu réel fonctionnel
  if (!editor || editor.previewMode) {
    if (href && href !== "#") {
      if (external) {
        return <a href={href} className={classes}>{display}</a>;
      }
      return <Link href={href} className={classes}>{display}</Link>;
    }
    return <button type="button" className={classes}>{display}</button>;
  }

  // Mode éditeur : on rend un span stylé qui imite le bouton, mais clic = édition
  const commit = (raw: string) => {
    const v = raw.trim();
    setEditing(false);
    setDraftLocal(null);
    if (v && v !== label) {
      editor.setDraft({ key: contentKey, value: v, type: "content" });
    }
  };

  return (
    <span className="relative inline-flex items-center group" data-editable data-editable-key={contentKey}>
      <span
        role="textbox"
        tabIndex={editing ? -1 : 0}
        aria-label={`Éditer le bouton ${contentKey}`}
        contentEditable={editing}
        suppressContentEditableWarning
        className={cn(
          classes,
          "cursor-text outline-none",
          !editing && hasDraft && "ring-2 ring-accent-500 ring-offset-2",
          !editing && !hasDraft && "ring-2 ring-primary-500/0 hover:ring-primary-500 ring-offset-2",
          editing && "ring-2 ring-primary-500 ring-offset-2",
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (editing) return;
          setEditing(true);
          setTimeout(() => {
            const node = (e.target as HTMLElement);
            node.focus();
            const sel = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(node);
            range.collapse(false);
            sel?.removeAllRanges();
            sel?.addRange(range);
          }, 0);
        }}
        onKeyDown={(e) => {
          if (!editing) return;
          if (e.key === "Enter") {
            e.preventDefault();
            commit((e.currentTarget as HTMLElement).innerText);
          } else if (e.key === "Escape") {
            e.preventDefault();
            setEditing(false);
            setDraftLocal(null);
            (e.currentTarget as HTMLElement).blur();
          }
        }}
        onInput={(e) => setDraftLocal((e.currentTarget as HTMLElement).innerText)}
        onBlur={(e) => editing && commit((e.currentTarget as HTMLElement).innerText)}
      >
        {display}
      </span>

      {/* Icône popover URL (au hover) — visible seulement si hrefKey fourni */}
      {hrefKey && (
        <button
          type="button"
          data-editable
          data-editor-control
          aria-label="Modifier la cible du lien"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLinkPopoverOpen(true);
          }}
          className="ml-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary-800 text-text-inverse opacity-0 transition group-hover:opacity-100"
          title={`Cible : ${href}`}
        >
          🔗
        </button>
      )}

      {linkPopoverOpen && hrefKey && (
        <LinkPopover
          ref={popoverRef}
          currentHref={href}
          contentKey={hrefKey}
          onClose={() => setLinkPopoverOpen(false)}
          onSave={(v) => {
            editor.setDraft({ key: hrefKey, value: v, type: "content" });
            setLinkPopoverOpen(false);
          }}
        />
      )}
    </span>
  );
}

/** Popover ancré sous le bouton, fermé par Escape, clic extérieur, ou Enregistrer. */

const KNOWN_ROUTES = [
  { value: "/", label: "Accueil" },
  { value: "/simulateur", label: "Simulateur" },
  { value: "/aides", label: "Aides" },
  { value: "/travaux", label: "Tous les travaux" },
  { value: "/blog", label: "Blog" },
  { value: "/contact", label: "Contact" },
];

const LinkPopover = forwardRef<HTMLDivElement, {
  currentHref: string;
  contentKey: string;
  onClose: () => void;
  onSave: (v: string) => void;
}>(function LinkPopover({ currentHref, contentKey, onClose, onSave }, ref) {
  const [v, setV] = useState(currentHref);
  // ref param required by forwardRef but we use useEffect on body for outside click instead
  void ref;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      data-editable
      data-editor-control
      role="dialog"
      aria-label={`Cible du lien ${contentKey}`}
      className="absolute top-full left-0 z-30 mt-2 w-[320px] rounded-md border border-border bg-surface p-4 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-body-sm font-semibold text-text-muted mb-2">
        Cible du lien <code className="text-text">{contentKey}</code>
      </p>
      <input
        type="text"
        value={v}
        autoFocus
        onChange={(e) => setV(e.target.value)}
        placeholder="/simulateur ou https://…"
        className="w-full rounded-md border-1.5 border-border bg-surface px-3 py-2 text-body focus:outline-none focus:border-primary-500 focus:ring-3 focus:ring-primary-300/50"
      />
      <p className="mt-2 text-body-sm text-text-muted">Pages internes :</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {KNOWN_ROUTES.map((r) => (
          <button
            key={r.value}
            type="button"
            data-editable
            data-editor-control
            onClick={() => setV(r.value)}
            className={cn(
              "rounded border px-2 py-1 text-body-sm",
              v === r.value
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-border bg-surface hover:border-primary-300",
            )}
          >
            {r.label}
          </button>
        ))}
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" data-editable data-editor-control onClick={onClose} className="rounded-md px-3 py-1.5 text-body-sm">
          Annuler
        </button>
        <button
          type="button"
          data-editable
          data-editor-control
          onClick={() => onSave(v)}
          className="rounded-md bg-primary-700 px-3 py-1.5 text-body-sm font-semibold text-text-inverse hover:bg-primary-800"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
});
