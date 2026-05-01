import { cn } from "@/components/ui/cn";

/**
 * Filet tricolore horizontal — 3 bandes verticales bleu/blanc/rouge.
 * Usage : tout en haut de la page (style "république"), au-dessus du footer,
 * en bas du drawer mobile. Toujours `aria-hidden`, c'est purement décoratif.
 */
export function TricolorBar({
  className,
  height = 3,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex w-full", className)}
      style={{ height }}
    >
      <div className="flex-1" style={{ background: "var(--color-fr-blue)" }} />
      <div className="flex-1" style={{ background: "var(--color-fr-white)" }} />
      <div className="flex-1" style={{ background: "var(--color-fr-red)" }} />
    </div>
  );
}

/**
 * Petit accent tricolore court (par défaut 40 px de large), à placer sous
 * un titre h2 pour signaler une section clé.
 */
export function TricolorAccent({
  className,
  width = 40,
  height = 3,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex rounded-sm overflow-hidden", className)}
      style={{ width, height }}
    >
      <div className="flex-1" style={{ background: "var(--color-fr-blue)" }} />
      <div className="flex-1" style={{ background: "var(--color-fr-white)" }} />
      <div className="flex-1" style={{ background: "var(--color-fr-red)" }} />
    </div>
  );
}
