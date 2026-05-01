/** Locataire — silhouette devant porte d'entrée. */
export function IllusTenant({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Locataire" className={className}>
      <ellipse cx="60" cy="108" rx="42" ry="5" fill="var(--color-primary-100)" />
      {/* Mur arrière-plan */}
      <rect x="20" y="34" width="80" height="68" fill="#EFD9B0" />
      {/* Toit */}
      <polygon points="14,40 60,16 106,40" fill="#D9663B" />
      {/* Porte */}
      <rect x="48" y="58" width="24" height="44" fill="#7A4A26" />
      <rect x="51" y="62" width="18" height="36" fill="#5A3618" opacity="0.5" />
      <circle cx="65" cy="80" r="1.4" fill="var(--color-accent-500)" />
      {/* Personnage devant la porte */}
      <circle cx="60" cy="68" r="9" fill="#F4C9A4" />
      <path d="M56 64 Q60 58 64 64 Q68 60 68 66 L64 66 Q62 63 60 66 L56 66 Z" fill="#3E2A1F" />
      <path d="M44 102 Q44 76 60 76 Q76 76 76 102 Z" fill="#1F6A40" />
      {/* Boîte/sac à la main pour suggérer "j'arrive" */}
      <rect x="78" y="86" width="10" height="10" fill="var(--color-accent-500)" />
      <path d="M78 86 L88 86" stroke="#7A4A26" strokeWidth="1.5" />
    </svg>
  );
}
