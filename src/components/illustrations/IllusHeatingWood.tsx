/** Poêle à bois + flamme + bûches. */
export function IllusHeatingWood({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Chauffage bois" className={className}>
      <ellipse cx="60" cy="108" rx="42" ry="5" fill="var(--color-primary-100)" />
      <rect x="14" y="98" width="92" height="4" fill="#9C7C56" />
      {/* Conduit qui monte */}
      <rect x="56" y="14" width="8" height="32" fill="#374151" />
      {/* Poêle à bois (corps cylindrique noir) */}
      <ellipse cx="60" cy="46" rx="24" ry="5" fill="#1F2937" />
      <rect x="36" y="46" width="48" height="46" fill="#374151" />
      <ellipse cx="60" cy="92" rx="24" ry="5" fill="#1F2937" />
      {/* Vitre du foyer */}
      <rect x="42" y="58" width="36" height="22" rx="2" fill="#1A1A1A" />
      {/* Flammes */}
      <path d="M52 78 Q48 70 52 64 Q56 68 56 76 Q56 82 52 78 Z" fill="#F59E0B" />
      <path d="M60 78 Q56 68 60 60 Q64 66 64 74 Q64 82 60 78 Z" fill="#FBBF24" />
      <path d="M68 78 Q64 70 68 64 Q72 68 72 76 Q72 82 68 78 Z" fill="#F59E0B" />
      {/* Bûches au pied */}
      <ellipse cx="44" cy="98" rx="6" ry="2.5" fill="#7A4A26" />
      <ellipse cx="44" cy="96" rx="6" ry="2.5" fill="#A06D3E" />
      <circle cx="38" cy="96" r="1.4" fill="#5A3618" />
      <ellipse cx="76" cy="98" rx="6" ry="2.5" fill="#7A4A26" />
      <circle cx="82" cy="96" r="1.4" fill="#5A3618" />
      {/* Petite poignée laiton */}
      <rect x="56" y="84" width="8" height="3" rx="1" fill="var(--color-accent-500)" />
    </svg>
  );
}
