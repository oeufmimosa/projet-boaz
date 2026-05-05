import { cn } from "@/components/ui/cn";

/**
 * Détecte un placeholder bloquant `[X]` dans une valeur de KeyFigure et le
 * met en évidence visuellement pour qu'il saute aux yeux côté admin/dev.
 *
 * Stratégie : si la chaîne contient `[X]`, on enrobe la card d'un ring doré
 * + on rend le texte du placeholder dans un span clignotant léger. En mode
 * production strict, le client doit avoir remplacé ces valeurs avant la mise
 * en ligne (cf. docs/seo.md, checklist pré-publication).
 *
 * On ne masque PAS le placeholder en production — au contraire, il reste
 * visible comme signal qu'un chiffre n'a pas été renseigné. Mais en admin
 * il clignote et passe en doré pour que ça ne soit pas oublié.
 */
export function isPlaceholderValue(value: string): boolean {
  return /\[X\]/i.test(value);
}

export function PlaceholderValue({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const isPh = isPlaceholderValue(value);
  if (!isPh) {
    return <span className={className}>{value}</span>;
  }
  return (
    <span
      data-content="placeholder"
      title="Placeholder à remplacer par le client avant mise en production publique."
      className={cn(
        "rounded px-1 text-accent-500 ring-1 ring-accent-500/60 bg-accent-500/10 placeholder-pulse",
        className,
      )}
    >
      {value}
      <style>{`
        @keyframes placeholder-pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.55; }
        }
        .placeholder-pulse {
          animation: placeholder-pulse 1.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .placeholder-pulse { animation: none; }
        }
      `}</style>
    </span>
  );
}
