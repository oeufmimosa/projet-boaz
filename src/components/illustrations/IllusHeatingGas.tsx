/** Radiateur + petit pictogramme gaz (flamme bleue). */
export function IllusHeatingGas({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Chauffage gaz" className={className}>
      <ellipse cx="60" cy="108" rx="42" ry="5" fill="var(--color-primary-100)" />
      <rect x="14" y="14" width="92" height="86" fill="#FAFAF7" />
      <rect x="14" y="98" width="92" height="4" fill="#B07D4F" />
      {/* Radiateur (panneaux verticaux blancs) */}
      <rect x="32" y="36" width="56" height="50" rx="4" fill="#F1F3F5" stroke="#7C8489" strokeWidth="1.2" />
      <g stroke="#7C8489" strokeWidth="1" opacity="0.7">
        <line x1="40" y1="40" x2="40" y2="82" />
        <line x1="48" y1="40" x2="48" y2="82" />
        <line x1="56" y1="40" x2="56" y2="82" />
        <line x1="64" y1="40" x2="64" y2="82" />
        <line x1="72" y1="40" x2="72" y2="82" />
        <line x1="80" y1="40" x2="80" y2="82" />
      </g>
      {/* Robinet thermostatique */}
      <circle cx="92" cy="44" r="3" fill="var(--color-accent-500)" />
      {/* Tuyau */}
      <rect x="92" y="48" width="3" height="38" fill="#7C8489" />
      {/* Flamme bleue gaz */}
      <g transform="translate(96, 22)">
        <path d="M6 16 Q2 10 6 4 Q10 8 10 14 Q10 20 6 16 Z" fill="#3B82C4" />
        <path d="M6 14 Q4 10 6 8 Q8 10 8 13 Z" fill="#60A5FA" />
        <text x="-12" y="14" fontSize="6" fontFamily="system-ui" fontWeight="700" fill="#3B82C4">GAZ</text>
      </g>
    </svg>
  );
}
