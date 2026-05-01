import { renderInlineMarkdown } from "@/lib/inline-markdown";
import { TricolorAccent } from "@/components/brand/TricolorBar";

/**
 * Titre principal d'une étape du simulateur. Le `label` peut contenir
 * un fragment markdown `**texte**` qui sera surligné en `--color-primary-500`
 * weight 800 (sans soulignement, sans fond — juste couleur + poids).
 */
export function StepHeading({ label, centered = false }: { label: string; centered?: boolean }) {
  const node = renderInlineMarkdown(label, (children, key) => (
    <mark key={key} className="bg-transparent font-extrabold text-primary-500">
      {children}
    </mark>
  ));
  return (
    <div className={centered ? "text-center" : undefined}>
      <h2 className="font-display text-display-lg leading-tight">{node}</h2>
      <TricolorAccent className={centered ? "mx-auto mt-3" : "mt-3"} />
    </div>
  );
}
