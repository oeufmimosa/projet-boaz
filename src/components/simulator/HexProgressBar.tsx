/**
 * Barre de progression avec jalons hexagonaux.
 * - jalon doré : étape complétée
 * - jalon vide : étape à venir
 * - jalon pulsant : étape courante
 * - barre verte qui se remplit en arrière-plan
 */
export function HexProgressBar({
  current,
  total,
}: {
  current: number; // index 1-based de l'étape courante
  total: number;   // nombre total d'étapes (sans le récap)
}) {
  const pct = Math.min(100, Math.max(0, ((current - 1) / Math.max(1, total - 1)) * 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-body-sm font-medium">
        <span>Étape {current} / {total}</span>
        <span className="text-text-muted">{Math.round(pct)} %</span>
      </div>

      <div className="relative">
        {/* Track */}
        <div className="h-2 w-full overflow-hidden rounded-sm bg-primary-100">
          <div
            className="h-full bg-primary-500 transition-all duration-400 ease-out"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={Math.round(pct)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {/* Jalons hexagonaux superposés */}
        <ul className="absolute inset-0 flex items-center justify-between">
          {Array.from({ length: total }, (_, i) => {
            const idx = i + 1;
            const state: "done" | "current" | "todo" =
              idx < current ? "done" : idx === current ? "current" : "todo";
            return (
              <li key={i} className="-translate-x-1/2 first:translate-x-0 last:-translate-x-full">
                <Hex state={state} />
              </li>
            );
          })}
        </ul>
      </div>

      <style>{`
        @keyframes hexPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.18); }
        }
        .hex-current { animation: hexPulse 1.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .hex-current { animation: none; } }
      `}</style>
    </div>
  );
}

function Hex({ state }: { state: "done" | "current" | "todo" }) {
  const fill = state === "done"
    ? "var(--color-accent-500)"
    : state === "current"
    ? "var(--color-primary-700)"
    : "var(--color-surface)";
  const stroke = state === "todo"
    ? "var(--color-primary-200)"
    : state === "current"
    ? "var(--color-primary-700)"
    : "var(--color-accent-600)";
  return (
    <span className={state === "current" ? "hex-current inline-block" : "inline-block"}>
      <svg width="16" height="18" viewBox="0 0 56 64" aria-hidden>
        <path d="M28 2 52 16v32L28 62 4 48V16Z" fill={fill} stroke={stroke} strokeWidth="3" />
      </svg>
    </span>
  );
}
