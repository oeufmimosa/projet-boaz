/** Radiateur électrique + éclair doré. */
export function IllusHeatingElectric({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Chauffage électrique" className={className}>
      <ellipse cx="60" cy="108" rx="42" ry="5" fill="var(--color-primary-100)" />
      <rect x="14" y="14" width="92" height="86" fill="#FAFAF7" />
      <rect x="14" y="98" width="92" height="4" fill="#B07D4F" />
      {/* Radiateur électrique (boîtier blanc plat) */}
      <rect x="22" y="42" width="76" height="44" rx="4" fill="#F1F3F5" stroke="#7C8489" strokeWidth="1.2" />
      <rect x="26" y="46" width="68" height="32" rx="2" fill="#FAFBFC" />
      <g stroke="#9CA3AF" strokeWidth="0.6">
        <line x1="32" y1="50" x2="32" y2="74" />
        <line x1="40" y1="50" x2="40" y2="74" />
        <line x1="48" y1="50" x2="48" y2="74" />
        <line x1="56" y1="50" x2="56" y2="74" />
        <line x1="64" y1="50" x2="64" y2="74" />
        <line x1="72" y1="50" x2="72" y2="74" />
        <line x1="80" y1="50" x2="80" y2="74" />
        <line x1="88" y1="50" x2="88" y2="74" />
      </g>
      {/* Éclair doré */}
      <polygon points="56,52 50,68 58,68 52,82 66,64 58,64 64,52" fill="var(--color-accent-500)" stroke="#9C7A1A" strokeWidth="0.8" />
      {/* Prise / câble */}
      <rect x="86" y="86" width="3" height="8" fill="#7C8489" />
    </svg>
  );
}
