/** Pompe à chaleur air/air — split mural intérieur + air soufflé. */
export function IllusHeatPumpAirAir({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Pompe à chaleur air/air" className={className}>
      <ellipse cx="60" cy="108" rx="42" ry="5" fill="var(--color-primary-100)" />
      {/* Mur intérieur */}
      <rect x="14" y="20" width="92" height="80" fill="#FAFAF7" />
      <line x1="14" y1="20" x2="106" y2="20" stroke="#E2E5DE" strokeWidth="1" />
      {/* Split mural (climatiseur) */}
      <rect x="32" y="34" width="56" height="18" rx="3" fill="#FAFBFC" stroke="#7C8489" strokeWidth="1.2" />
      <rect x="34" y="46" width="52" height="3" fill="#5C636A" />
      {/* Vents */}
      <g stroke="#5C636A" strokeWidth="0.5" fill="none" opacity="0.6">
        <line x1="36" y1="40" x2="84" y2="40" />
        <line x1="36" y1="43" x2="84" y2="43" />
      </g>
      {/* Témoin LED */}
      <circle cx="83" cy="38" r="1.4" fill="#22C55E" />
      {/* Air soufflé chaud (vagues orangées) */}
      <g stroke="#F59E0B" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.85">
        <path d="M44 60 Q48 68 44 76" />
        <path d="M56 60 Q60 70 56 80" />
        <path d="M68 60 Q72 70 68 80" />
        <path d="M80 60 Q84 68 80 76" />
      </g>
      {/* Tuyau frigo qui sort à droite vers extérieur */}
      <path d="M88 38 L100 38 L100 18" stroke="#7C8489" strokeWidth="2" fill="none" />
      {/* Sol */}
      <rect x="14" y="98" width="92" height="4" fill="#B07D4F" />
    </svg>
  );
}
