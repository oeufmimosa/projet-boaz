"use client";

import {
  createElement,
  useRef,
  useState,
  type ElementType,
  type KeyboardEvent,
  type FocusEvent,
  type SyntheticEvent,
  type MouseEvent,
} from "react";
import { useEditor } from "./EditorContext";
import { cn } from "@/components/ui/cn";

/**
 * Texte éditable inline.
 * Public mode (no EditorContext) : rend `<as>{value}</as>`.
 * Editor mode :
 *  - hover : outline pointillé vert + clé
 *  - clic : passe en contentEditable in-place
 *  - Entrée / blur : commit le draft (debounce serveur)
 *  - Échap : annule
 *  - Si draft existant : outline doré permanent
 */
export function EditableText({
  contentKey,
  initialValue,
  as = "span",
  className,
  multiline = false,
  maxLength,
}: {
  contentKey: string;
  initialValue: string;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
  maxLength?: number;
}) {
  const editor = useEditor();
  const ref = useRef<HTMLElement | null>(null);
  const [editing, setEditing] = useState(false);
  const [draftLocal, setDraftLocal] = useState<string | null>(null);

  const value = editor ? editor.getValue(contentKey, initialValue) : initialValue;
  const display = draftLocal ?? value;
  const hasDraft = editor?.drafts.has(contentKey) ?? false;

  if (!editor || editor.previewMode) {
    return createElement(as, { className }, display);
  }

  const commit = (raw: string) => {
    const v = raw.trim().slice(0, maxLength);
    setEditing(false);
    setDraftLocal(null);
    if (v !== value) {
      editor.setDraft({ key: contentKey, value: v, type: "content" });
    }
  };

  const cancel = () => {
    setEditing(false);
    setDraftLocal(null);
  };

  const onClick = (e: MouseEvent<HTMLElement>) => {
    if (editing) return;
    e.stopPropagation();
    setEditing(true);
    setTimeout(() => {
      const node = ref.current;
      if (!node) return;
      node.focus();
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(node);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }, 0);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (!editing) {
      if (e.key === "Enter") {
        e.preventDefault();
        (e.currentTarget as HTMLElement).click();
      }
      return;
    }
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      commit((e.currentTarget as HTMLElement).innerText);
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
      (e.currentTarget as HTMLElement).blur();
    }
  };

  const onInput = (e: SyntheticEvent<HTMLElement>) => {
    setDraftLocal((e.currentTarget as HTMLElement).innerText);
  };

  const onBlur = (e: FocusEvent<HTMLElement>) => {
    if (!editing) return;
    commit((e.currentTarget as HTMLElement).innerText);
  };

  return createElement(
    as,
    {
      ref,
      role: "textbox",
      tabIndex: editing ? -1 : 0,
      "aria-label": `Éditer ${contentKey}`,
      "data-editable-key": contentKey,
      contentEditable: editing,
      suppressContentEditableWarning: true,
      onClick,
      onKeyDown,
      onInput,
      onBlur,
      className: cn(
        "outline-none transition",
        !editing && "cursor-pointer rounded-sm",
        !editing && hasDraft && "ring-2 ring-accent-500 ring-offset-2",
        !editing && !hasDraft && "hover:ring-2 hover:ring-primary-500 hover:ring-offset-2",
        editing && "ring-2 ring-primary-500 ring-offset-2 bg-primary-50/40",
        className,
      ),
    },
    display,
  );
}
