/**
 * Pastille horizontale "Étape X/Y · ~N min" affichée en haut de chaque étape.
 * Calcule le temps restant estimé (~10 s par étape).
 */
export function StepBadge({ current, total }: { current: number; total: number }) {
  const remaining = Math.max(1, total - current + 1);
  const minutes = Math.max(1, Math.ceil(remaining * 0.15)); // ~9 s par étape
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3.5 py-1 text-body-sm font-semibold text-primary-700">
      Étape {current} / {total}
      <span aria-hidden className="text-primary-400">•</span>
      <span>~{minutes} min restante{minutes > 1 ? "s" : ""}</span>
    </span>
  );
}
