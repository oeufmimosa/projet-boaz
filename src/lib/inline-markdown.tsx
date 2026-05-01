import { Fragment, ReactNode } from "react";

/**
 * Mini-parser : transforme `**texte**` en élément <strong> stylisé.
 * Sécurisé (pas de dangerouslySetInnerHTML), réutilisé dans :
 *  - les bulles bot de la chatbox
 *  - les titres de StepHeading (fragment surligné en couleur d'accent)
 *
 * @param wrapper - Optionnel : remplace le <strong> par un autre composant
 *                  (par exemple un <mark> coloré).
 */
export function renderInlineMarkdown(
  text: string,
  wrapper?: (children: ReactNode, key: number) => ReactNode,
): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) {
      return wrapper ? wrapper(m[1], i) : <strong key={i} className="font-semibold">{m[1]}</strong>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
