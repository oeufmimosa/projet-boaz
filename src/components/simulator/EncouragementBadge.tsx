import { renderInlineMarkdown } from "@/lib/inline-markdown";

/**
 * Badge d'encouragement contextuel (ex. "🎉 Parfait, 1 minute restante !").
 * Léger fond doré, parsing markdown si l'admin met du **gras**.
 */
export function EncouragementBadge({ message }: { message: string }) {
  return (
    <p
      role="status"
      className="inline-flex items-center gap-2 rounded-md border border-accent-500/40 bg-accent-500/15 px-3 py-1.5 text-body-sm font-semibold text-primary-800"
      style={{ background: "rgba(232, 176, 67, 0.15)", borderColor: "rgba(232, 176, 67, 0.4)" }}
    >
      {renderInlineMarkdown(message)}
    </p>
  );
}
