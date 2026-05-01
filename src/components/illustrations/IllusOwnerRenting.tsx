/** Propriétaire bailleur — silhouette + maison + flèche euros. */
export function IllusOwnerRenting({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Propriétaire bailleur" className={className}>
      <ellipse cx="60" cy="108" rx="42" ry="5" fill="var(--color-primary-100)" />
      {/* Personnage à gauche */}
      <circle cx="32" cy="46" r="10" fill="#F4C9A4" />
      <path d="M28 42 Q32 36 36 42 Q40 38 40 44 L36 44 Q34 41 32 44 L28 44 Z" fill="#3E2A1F" />
      <path d="M14 102 Q14 70 32 70 Q50 70 50 102 Z" fill="#1F6A40" />
      {/* Maison à droite */}
      <polygon points="74,58 92,42 110,58 92,58" fill="#D9663B" />
      <rect x="78" y="58" width="28" height="32" fill="#EFD9B0" />
      <rect x="88" y="70" width="8" height="20" fill="#7A4A26" />
      <rect x="100" y="68" width="6" height="6" fill="#9BC8E0" />
      {/* Flèche euro entre les deux */}
      <path d="M52 76 L70 76" stroke="var(--color-accent-500)" strokeWidth="3" strokeLinecap="round" />
      <path d="M65 71 L70 76 L65 81" fill="none" stroke="var(--color-accent-500)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <text x="58" y="71" fontFamily="system-ui" fontSize="14" fontWeight="800" fill="var(--color-accent-500)">€</text>
    </svg>
  );
}
