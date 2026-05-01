/** Propriétaire occupant — silhouette + clé dorée. */
export function IllusOwnerLiving({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Propriétaire occupant" className={className}>
      <ellipse cx="60" cy="108" rx="42" ry="5" fill="var(--color-primary-100)" />
      {/* Maison en arrière-plan, simplifiée */}
      <polygon points="78,52 96,40 114,52 96,52" fill="#D9663B" opacity="0.85" />
      <rect x="84" y="52" width="24" height="28" fill="#EFD9B0" opacity="0.85" />
      <rect x="93" y="62" width="6" height="18" fill="#7A4A26" opacity="0.85" />
      {/* Personnage */}
      <circle cx="48" cy="46" r="10" fill="#F4C9A4" />
      <path d="M44 42 Q48 36 52 42 Q56 38 56 44 L52 44 Q50 41 48 44 L44 44 Z" fill="#3E2A1F" />
      {/* Buste */}
      <path d="M30 102 Q30 70 48 70 Q66 70 66 102 Z" fill="#1F6A40" />
      {/* Bras tenant la clé */}
      <path d="M60 78 L74 88" stroke="#F4C9A4" strokeWidth="6" strokeLinecap="round" />
      {/* Clé dorée */}
      <circle cx="80" cy="92" r="5" fill="none" stroke="var(--color-accent-500)" strokeWidth="2.5" />
      <path d="M84 94 L92 100 L92 96 L94 96 L94 102 L88 100 L88 102 L86 102 L86 100" fill="var(--color-accent-500)" />
    </svg>
  );
}
