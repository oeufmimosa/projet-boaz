/** Isolation des combles — toiture en coupe avec laine isolante visible. */
export function IllusInsulationAttic({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Isolation des combles" className={className}>
      <ellipse cx="60" cy="108" rx="42" ry="5" fill="var(--color-primary-100)" />
      {/* Charpente extérieure (toit en triangle) */}
      <polygon points="60,18 18,68 102,68" fill="#D9663B" />
      <polygon points="60,18 60,68 102,68" fill="#B5502E" opacity="0.85" />
      {/* Plafond intérieur */}
      <rect x="18" y="86" width="84" height="6" fill="#7A4A26" />
      {/* Laine isolante (rouleau rose pâle / jaune) entre charpente et plafond */}
      <path d="M22 68 Q30 80 22 86 L102 86 Q110 80 102 68 Z" fill="#F4D9A8" />
      {/* Texture laine — petites courbes */}
      <g stroke="#C9A878" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <path d="M30 72 Q34 78 30 84" />
        <path d="M44 72 Q48 78 44 84" />
        <path d="M58 72 Q62 78 58 84" />
        <path d="M72 72 Q76 78 72 84" />
        <path d="M86 72 Q90 78 86 84" />
      </g>
      {/* Petite flèche bleue thermique vers le bas (chaleur retenue) */}
      <g stroke="#3B82C4" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M60 38 L60 56" />
        <path d="M55 51 L60 56 L65 51" />
      </g>
    </svg>
  );
}
