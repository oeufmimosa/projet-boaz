/** Isolation des sols — plancher en coupe avec isolant sous parquet. */
export function IllusInsulationFloor({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Isolation des sols" className={className}>
      <ellipse cx="60" cy="108" rx="42" ry="5" fill="var(--color-primary-100)" />
      {/* Mur de fond */}
      <rect x="20" y="22" width="80" height="36" fill="#FAFAF7" />
      {/* Tableau / fenêtre simple */}
      <rect x="64" y="30" width="22" height="18" fill="#9BC8E0" stroke="#7B3F18" strokeWidth="1.2" />
      {/* Personnage assis (silhouette pieds nus) — chaleur du sol */}
      <circle cx="36" cy="42" r="6" fill="#F4C9A4" />
      <path d="M28 58 Q28 48 36 48 Q44 48 44 58 Z" fill="#1F6A40" />
      <ellipse cx="36" cy="60" rx="8" ry="2" fill="#F4C9A4" />
      {/* Parquet / sol fini */}
      <rect x="14" y="64" width="92" height="6" fill="#B07D4F" />
      <g stroke="#7A4A26" strokeWidth="0.6">
        <line x1="34" y1="64" x2="34" y2="70" />
        <line x1="58" y1="64" x2="58" y2="70" />
        <line x1="82" y1="64" x2="82" y2="70" />
      </g>
      {/* Couche isolante (rose / jaune) sous le parquet */}
      <rect x="14" y="70" width="92" height="14" fill="#F4D9A8" />
      <g stroke="#C9A878" strokeWidth="1" fill="none" strokeLinecap="round">
        <path d="M22 73 Q26 79 22 83" />
        <path d="M40 73 Q44 79 40 83" />
        <path d="M58 73 Q62 79 58 83" />
        <path d="M76 73 Q80 79 76 83" />
        <path d="M94 73 Q98 79 94 83" />
      </g>
      {/* Sol porteur (béton) en bas */}
      <rect x="14" y="84" width="92" height="14" fill="#9CA3AF" />
      <g stroke="#5C636A" strokeWidth="0.6" opacity="0.6">
        <line x1="14" y1="91" x2="106" y2="91" />
      </g>
    </svg>
  );
}
