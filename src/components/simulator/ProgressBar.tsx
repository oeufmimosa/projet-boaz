export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-body-sm font-medium">
        <span>Étape {current} / {total}</span>
        <span className="text-text-muted">{pct} %</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-sm bg-primary-100"
      >
        <div
          className="h-full bg-primary-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
