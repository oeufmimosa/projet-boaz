export function IllusHousehold1({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Foyer 1 personne" className={className}>
      <ellipse cx="60" cy="108" rx="42" ry="5" fill="var(--color-primary-100)" />
      <Person cx={60} bodyColor="#1F6A40" />
    </svg>
  );
}
function Person({ cx, bodyColor, scale = 1 }: { cx: number; bodyColor: string; scale?: number }) {
  return (
    <g transform={`translate(${cx} 0) scale(${scale})`}>
      <circle cx="0" cy="42" r="11" fill="#F4C9A4" />
      <path d="M-5 38 Q0 30 5 38 Q10 34 10 42 L5 42 Q3 39 0 42 L-5 42 Z" fill="#3E2A1F" />
      <path d="M-18 102 Q-18 64 0 64 Q18 64 18 102 Z" fill={bodyColor} />
    </g>
  );
}
