export function IllusHousehold4({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Foyer 4 personnes" className={className}>
      <ellipse cx="60" cy="108" rx="50" ry="5" fill="var(--color-primary-100)" />
      <Adult cx={26} bodyColor="#1F6A40" />
      <Adult cx={94} bodyColor="#A85B3A" />
      <Kid cx={48} bodyColor="#F59E0B" />
      <Kid cx={72} bodyColor="#3B82C4" />
    </svg>
  );
}
function Adult({ cx, bodyColor }: { cx: number; bodyColor: string }) {
  return (
    <g transform={`translate(${cx} 10)`}>
      <circle cx="0" cy="36" r="8" fill="#F4C9A4" />
      <path d="M-5 33 Q0 27 5 33 Q9 30 9 36 L5 36 Q3 34 0 36 L-5 36 Z" fill="#3E2A1F" />
      <path d="M-13 92 Q-13 54 0 54 Q13 54 13 92 Z" fill={bodyColor} />
    </g>
  );
}
function Kid({ cx, bodyColor }: { cx: number; bodyColor: string }) {
  return (
    <g transform={`translate(${cx} 32)`}>
      <circle cx="0" cy="36" r="6" fill="#F4C9A4" />
      <path d="M-4 33 Q0 28 4 33 Q7 31 7 36 L4 36 Q2 34 0 36 L-4 36 Z" fill="#3E2A1F" />
      <path d="M-10 70 Q-10 48 0 48 Q10 48 10 70 Z" fill={bodyColor} />
    </g>
  );
}
