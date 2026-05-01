/** Chauffage par pompe à chaleur — variante simplifiée pour "déjà équipé". */
export function IllusHeatingPump({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Chauffage pompe à chaleur" className={className}>
      <ellipse cx="60" cy="106" rx="40" ry="5" fill="var(--color-primary-100)" />
      {/* Bloc PAC */}
      <rect x="32" y="50" width="56" height="44" rx="3" fill="#F1F3F5" stroke="#7C8489" strokeWidth="1.4" />
      {/* Grille */}
      <g stroke="#5C636A" strokeWidth="0.6" opacity="0.55">
        <line x1="40" y1="60" x2="80" y2="60" />
        <line x1="40" y1="64" x2="80" y2="64" />
        <line x1="40" y1="80" x2="80" y2="80" />
        <line x1="40" y1="84" x2="80" y2="84" />
      </g>
      {/* Ventilateur central */}
      <circle cx="60" cy="72" r="9" fill="#374151" />
      <circle cx="60" cy="72" r="2" fill="#9CA3AF" />
      <g stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round">
        <path d="M60 72 L54 66" />
        <path d="M60 72 L66 66" />
        <path d="M60 72 L66 78" />
        <path d="M60 72 L54 78" />
      </g>
      {/* Pieds */}
      <rect x="34" y="94" width="6" height="6" fill="#7C8489" />
      <rect x="80" y="94" width="6" height="6" fill="#7C8489" />
      {/* Flèches air entrant + chaud sortant */}
      <g stroke="#3B82C4" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="M14 60 L30 60" />
        <path d="M26 56 L30 60 L26 64" />
      </g>
      <g stroke="#F59E0B" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="M90 60 L106 60" />
        <path d="M102 56 L106 60 L102 64" />
      </g>
    </svg>
  );
}
