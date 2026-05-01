/**
 * Pompe à chaleur air/eau façon "emoji" : unité extérieure blanche/grise,
 * ventilateur sombre, flocon bleu côté entrée d'air, flamme orange côté
 * chaleur produite. Lecture immédiate.
 */
export function IllusHeatPumpAirWater({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label="Pompe à chaleur air/eau"
      className={className}
    >
      <ellipse cx="60" cy="106" rx="40" ry="5" fill="var(--color-primary-100)" />

      {/* Bloc PAC — face avant (clair) */}
      <path d="M28 60 L60 76 L60 100 L28 84 Z" fill="#F1F3F5" />
      {/* Face droite (ombrée) */}
      <path d="M60 76 L92 60 L92 84 L60 100 Z" fill="#C8CDD3" />
      {/* Dessus */}
      <path d="M28 60 L60 44 L92 60 L60 76 Z" fill="#FAFBFC" />
      {/* Bordures */}
      <g stroke="#7C8489" strokeWidth="0.7" fill="none">
        <path d="M28 60 L60 76 L60 100 L28 84 Z" />
        <path d="M60 76 L92 60 L92 84 L60 100 Z" />
        <path d="M28 60 L60 44 L92 60 L60 76 Z" />
      </g>
      {/* Pieds */}
      <path d="M30 84 L30 92 L34 94 L34 86 Z" fill="#7C8489" />
      <path d="M58 100 L58 108 L62 110 L62 102 Z" fill="#7C8489" />

      {/* Ventilateur (face avant) */}
      <ellipse cx="44" cy="80" rx="9" ry="6.5" fill="#1F2937" />
      <ellipse cx="44" cy="80" rx="7.5" ry="5.4" fill="#374151" />
      <ellipse cx="44" cy="80" rx="2.2" ry="1.6" fill="#9CA3AF" />
      <g stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" fill="none">
        <path d="M44 80 L40 75" />
        <path d="M44 80 L48 75" />
        <path d="M44 80 L48 85" />
        <path d="M44 80 L40 85" />
      </g>

      {/* Grille face droite */}
      <g stroke="#5C636A" strokeWidth="0.7" opacity="0.6">
        <path d="M68 76 L86 67" />
        <path d="M70 80 L88 71" />
        <path d="M72 84 L86 76" />
        <path d="M74 88 L86 82" />
      </g>

      {/* Flocon bleu (air froid) à gauche */}
      <g stroke="#3B82C4" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M14 72 L22 72" />
        <path d="M18 68 L18 76" />
        <path d="M15 69 L21 75" />
        <path d="M15 75 L21 69" />
      </g>

      {/* Flamme orange (chaleur produite) en haut à droite */}
      <path d="M86 36 Q82 30 86 24 Q90 28 90 34 Q90 40 86 36 Z" fill="#F59E0B" />
      <path d="M86 34 Q84 30 86 28 Q88 30 88 33 Z" fill="#FBBF24" />
      <path d="M86 32 Q85 30 86 29 Q87 30 87 32 Z" fill="#FFFFFF" opacity="0.7" />

      {/* Tuyau d'eau chaude */}
      <path d="M86 40 Q90 50 96 56" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
    </svg>
  );
}
