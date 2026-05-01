export function IllusHousehold5plus({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Foyer 5 personnes ou plus" className={className}>
      <ellipse cx="60" cy="108" rx="52" ry="5" fill="var(--color-primary-100)" />
      <Adult cx={20} bodyColor="#1F6A40" />
      <Adult cx={100} bodyColor="#A85B3A" />
      <Kid cx={42} bodyColor="#F59E0B" />
      <Kid cx={60} bodyColor="#3B82C4" />
      <Kid cx={78} bodyColor="#9333EA" />
      {/* Indicateur "+" en coin pour signifier 5 ou plus */}
      <circle cx="106" cy="20" r="10" fill="var(--color-primary-700)" />
      <text x="106" y="25" fontFamily="system-ui" fontSize="13" fontWeight="800" fill="#FFFFFF" textAnchor="middle">+</text>
    </svg>
  );
}
function Adult({ cx, bodyColor }: { cx: number; bodyColor: string }) {
  return (
    <g transform={`translate(${cx} 12)`}>
      <circle cx="0" cy="36" r="7" fill="#F4C9A4" />
      <path d="M-4 33 Q0 28 4 33 Q8 30 8 36 L4 36 Q2 34 0 36 L-4 36 Z" fill="#3E2A1F" />
      <path d="M-12 88 Q-12 52 0 52 Q12 52 12 88 Z" fill={bodyColor} />
    </g>
  );
}
function Kid({ cx, bodyColor }: { cx: number; bodyColor: string }) {
  return (
    <g transform={`translate(${cx} 34)`}>
      <circle cx="0" cy="36" r="5" fill="#F4C9A4" />
      <path d="M-3 34 Q0 30 3 34 Q6 32 6 36 L3 36 Q1 34 0 36 L-3 36 Z" fill="#3E2A1F" />
      <path d="M-8 66 Q-8 46 0 46 Q8 46 8 66 Z" fill={bodyColor} />
    </g>
  );
}
