/** Grande illustration de succès — hexagone vert avec coche, 4 petits hexagones autour. */
export function IllusSuccess({ className, size = 200 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label="Demande envoyée avec succès" className={className}>
      {/* Petits hexagones décoratifs autour */}
      <g opacity="0.85">
        <path d="M30 50 L42 57 L42 71 L30 78 L18 71 L18 57 Z" fill="var(--color-primary-200)" />
        <path d="M170 60 L180 66 L180 78 L170 84 L160 78 L160 66 Z" fill="var(--color-accent-500)" />
        <path d="M40 140 L52 147 L52 161 L40 168 L28 161 L28 147 Z" fill="var(--color-primary-300)" />
        <path d="M168 138 L180 145 L180 159 L168 166 L156 159 L156 145 Z" fill="var(--color-fr-blue)" />
        <path d="M100 24 L110 30 L110 42 L100 48 L90 42 L90 30 Z" fill="var(--color-fr-red)" />
      </g>
      {/* Grand hexagone vert au centre */}
      <path d="M100 50 L150 78 L150 132 L100 160 L50 132 L50 78 Z" fill="var(--color-primary-700)" />
      {/* Bordure dorée fine */}
      <path d="M100 50 L150 78 L150 132 L100 160 L50 132 L50 78 Z" fill="none" stroke="var(--color-accent-500)" strokeWidth="2" />
      {/* Coche blanche */}
      <path d="M76 105 L94 122 L128 88" fill="none" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
