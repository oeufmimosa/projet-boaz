/** Isolation des murs — mur en coupe vertical avec couches d'isolation. */
export function IllusInsulationWalls({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Isolation des murs" className={className}>
      <ellipse cx="60" cy="108" rx="42" ry="5" fill="var(--color-primary-100)" />
      {/* Sol */}
      <rect x="14" y="98" width="92" height="4" fill="#9C7C56" />
      {/* Mur extérieur (briques) */}
      <rect x="14" y="20" width="20" height="78" fill="#A85B3A" />
      <g stroke="#7E351D" strokeWidth="0.6">
        <line x1="14" y1="34" x2="34" y2="34" />
        <line x1="14" y1="48" x2="34" y2="48" />
        <line x1="14" y1="62" x2="34" y2="62" />
        <line x1="14" y1="76" x2="34" y2="76" />
        <line x1="14" y1="90" x2="34" y2="90" />
        <line x1="22" y1="20" x2="22" y2="34" />
        <line x1="26" y1="34" x2="26" y2="48" />
        <line x1="22" y1="48" x2="22" y2="62" />
        <line x1="26" y1="62" x2="26" y2="76" />
        <line x1="22" y1="76" x2="22" y2="90" />
      </g>
      {/* Couche isolante (laine) */}
      <rect x="34" y="20" width="16" height="78" fill="#F4D9A8" />
      <g stroke="#C9A878" strokeWidth="1" fill="none" strokeLinecap="round">
        <path d="M38 26 Q42 32 38 38" />
        <path d="M38 44 Q42 50 38 56" />
        <path d="M38 62 Q42 68 38 74" />
        <path d="M38 80 Q42 86 38 92" />
      </g>
      {/* Plaque de plâtre intérieure */}
      <rect x="50" y="20" width="10" height="78" fill="#E8E8E8" />
      {/* Mur intérieur peint */}
      <rect x="60" y="20" width="46" height="78" fill="#FAFAF7" />
      {/* Étiquettes flèches (chaleur dehors → garder dedans) */}
      <g stroke="#3B82C4" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M82 50 L70 50" />
        <path d="M75 45 L70 50 L75 55" />
      </g>
      {/* Petite flamme/soleil chaud à droite */}
      <circle cx="92" cy="50" r="5" fill="#F59E0B" />
      <g stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round">
        <line x1="92" y1="40" x2="92" y2="36" />
        <line x1="100" y1="50" x2="104" y2="50" />
        <line x1="92" y1="60" x2="92" y2="64" />
        <line x1="84" y1="42" x2="86" y2="44" />
        <line x1="98" y1="44" x2="100" y2="42" />
      </g>
    </svg>
  );
}
