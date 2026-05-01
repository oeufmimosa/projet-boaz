export function IllusHousehold3({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Foyer 3 personnes" className={className}>
      <ellipse cx="60" cy="108" rx="48" ry="5" fill="var(--color-primary-100)" />
      <Adult cx={32} bodyColor="#1F6A40" />
      <Adult cx={84} bodyColor="#A85B3A" />
      <Kid cx={60} bodyColor="#F59E0B" />
    </svg>
  );
}
function Adult({ cx, bodyColor }: { cx: number; bodyColor: string }) {
  return (
    <g transform={`translate(${cx} 8)`}>
      <circle cx="0" cy="38" r="9" fill="#F4C9A4" />
      <path d="M-5 35 Q0 28 5 35 Q9 31 9 38 L5 38 Q3 35 0 38 L-5 38 Z" fill="#3E2A1F" />
      <path d="M-15 95 Q-15 56 0 56 Q15 56 15 95 Z" fill={bodyColor} />
    </g>
  );
}
function Kid({ cx, bodyColor }: { cx: number; bodyColor: string }) {
  return (
    <g transform={`translate(${cx} 30)`}>
      <circle cx="0" cy="38" r="7" fill="#F4C9A4" />
      <path d="M-4 35 Q0 30 4 35 Q7 32 7 38 L4 38 Q2 36 0 38 L-4 38 Z" fill="#3E2A1F" />
      <path d="M-11 73 Q-11 50 0 50 Q11 50 11 73 Z" fill={bodyColor} />
    </g>
  );
}
