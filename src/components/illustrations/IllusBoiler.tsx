/** Chaudière (gaz / biomasse) — boîtier mural blanc + flamme dorée. */
export function IllusBoiler({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Chaudière" className={className}>
      <ellipse cx="60" cy="108" rx="42" ry="5" fill="var(--color-primary-100)" />
      {/* Mur */}
      <rect x="14" y="14" width="92" height="86" fill="#FAFAF7" />
      <rect x="14" y="98" width="92" height="4" fill="#B07D4F" />
      {/* Boîtier chaudière */}
      <rect x="38" y="28" width="44" height="58" rx="4" fill="#F1F3F5" stroke="#7C8489" strokeWidth="1.5" />
      {/* Hublot/écran */}
      <rect x="44" y="36" width="32" height="14" rx="2" fill="#1F2937" />
      <text x="46" y="46" fontFamily="ui-monospace, monospace" fontSize="6" fill="#22C55E">62°C</text>
      {/* Flamme dorée à l'intérieur (visible) */}
      <g>
        <path d="M60 64 Q56 56 60 50 Q64 56 64 62 Q64 70 60 64 Z" fill="#F59E0B" />
        <path d="M60 62 Q58 56 60 54 Q62 56 62 60 Z" fill="#FBBF24" />
      </g>
      {/* Boutons */}
      <circle cx="48" cy="76" r="2.5" fill="#3B82C4" />
      <circle cx="58" cy="76" r="2.5" fill="#7C8489" />
      <circle cx="68" cy="76" r="2.5" fill="#7C8489" />
      <circle cx="76" cy="76" r="2.5" fill="#22C55E" />
      {/* Tuyaux dessus/dessous */}
      <rect x="46" y="22" width="4" height="6" fill="#7C8489" />
      <rect x="56" y="22" width="4" height="6" fill="#3B82C4" />
      <rect x="66" y="22" width="4" height="6" fill="#EF4444" />
      <rect x="76" y="22" width="4" height="6" fill="#7C8489" />
      <rect x="56" y="86" width="4" height="6" fill="#3B82C4" />
      <rect x="66" y="86" width="4" height="6" fill="#EF4444" />
    </svg>
  );
}
