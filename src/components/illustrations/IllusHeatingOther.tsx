/** Autre chauffage — hexagone vert avec point d'interrogation. */
export function IllusHeatingOther({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Autre chauffage" className={className}>
      <ellipse cx="60" cy="108" rx="42" ry="5" fill="var(--color-primary-100)" />
      {/* Hexagone vert clair */}
      <path d="M60 18 L98 38 L98 82 L60 102 L22 82 L22 38 Z" fill="var(--color-primary-100)" stroke="var(--color-primary-500)" strokeWidth="2" />
      {/* Point d'interrogation */}
      <text x="60" y="78" fontFamily="system-ui" fontSize="58" fontWeight="800" fill="var(--color-primary-700)" textAnchor="middle">?</text>
    </svg>
  );
}
