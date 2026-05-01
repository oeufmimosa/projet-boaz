/** Chaudière fioul + cuve cylindrique. */
export function IllusHeatingFuel({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Chauffage fioul" className={className}>
      <ellipse cx="60" cy="108" rx="42" ry="5" fill="var(--color-primary-100)" />
      <rect x="14" y="98" width="92" height="4" fill="#9C7C56" />
      {/* Chaudière (boîtier bleu foncé) */}
      <rect x="22" y="42" width="36" height="56" rx="3" fill="#1E40AF" />
      <rect x="26" y="48" width="28" height="14" rx="2" fill="#1F2937" />
      <text x="28" y="58" fontFamily="ui-monospace, monospace" fontSize="6" fill="#F59E0B">FIOUL</text>
      {/* Boutons */}
      <circle cx="32" cy="76" r="2.2" fill="#22C55E" />
      <circle cx="40" cy="76" r="2.2" fill="#7C8489" />
      <circle cx="48" cy="76" r="2.2" fill="#EF4444" />
      {/* Cuve cylindrique à droite */}
      <ellipse cx="80" cy="48" rx="18" ry="6" fill="#7C8489" />
      <rect x="62" y="48" width="36" height="44" fill="#A8B0B6" />
      <ellipse cx="80" cy="92" rx="18" ry="6" fill="#5C636A" />
      <ellipse cx="80" cy="48" rx="18" ry="6" fill="#929A9F" />
      {/* Bouchon cuve */}
      <rect x="76" y="38" width="8" height="6" fill="var(--color-accent-500)" />
      {/* Tuyau cuve → chaudière */}
      <path d="M62 70 L58 70" stroke="#7C8489" strokeWidth="3" />
      {/* Flamme dans la chaudière */}
      <g transform="translate(36, 82)">
        <path d="M4 10 Q0 4 4 -2 Q8 2 8 8 Q8 14 4 10 Z" fill="#F59E0B" />
      </g>
    </svg>
  );
}
