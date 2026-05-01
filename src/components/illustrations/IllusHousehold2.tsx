export function IllusHousehold2({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Foyer 2 personnes" className={className}>
      <ellipse cx="60" cy="108" rx="46" ry="5" fill="var(--color-primary-100)" />
      <Person cx={42} bodyColor="#1F6A40" />
      <Person cx={78} bodyColor="#A85B3A" />
    </svg>
  );
}
function Person({ cx, bodyColor }: { cx: number; bodyColor: string }) {
  return (
    <g transform={`translate(${cx} 12)`}>
      <circle cx="0" cy="38" r="9" fill="#F4C9A4" />
      <path d="M-5 35 Q0 28 5 35 Q9 31 9 38 L5 38 Q3 35 0 38 L-5 38 Z" fill="#3E2A1F" />
      <path d="M-15 90 Q-15 56 0 56 Q15 56 15 90 Z" fill={bodyColor} />
    </g>
  );
}
