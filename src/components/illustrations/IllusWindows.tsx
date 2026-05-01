/** Fenêtres double-vitrage — fenêtre vue de face + détail vitrage. */
export function IllusWindows({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Fenêtres" className={className}>
      <ellipse cx="60" cy="108" rx="42" ry="5" fill="var(--color-primary-100)" />
      {/* Mur */}
      <rect x="14" y="14" width="92" height="86" fill="#FAFAF7" />
      <rect x="14" y="98" width="92" height="4" fill="#B07D4F" />
      {/* Cadre fenêtre extérieur (bois marron) */}
      <rect x="28" y="22" width="64" height="74" fill="#7A4A26" />
      {/* Cadre intérieur (vitre) */}
      <rect x="33" y="27" width="54" height="64" fill="#9BC8E0" />
      {/* Croisillon central + horizontal */}
      <line x1="60" y1="27" x2="60" y2="91" stroke="#7A4A26" strokeWidth="3" />
      <line x1="33" y1="59" x2="87" y2="59" stroke="#7A4A26" strokeWidth="3" />
      {/* Reflets vitre */}
      <line x1="40" y1="32" x2="40" y2="86" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
      <line x1="68" y1="32" x2="68" y2="86" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.5" />
      {/* Poignée */}
      <rect x="56" y="68" width="3" height="8" fill="var(--color-accent-500)" rx="1" />
      {/* Détail double-vitrage : zoom sur tranche */}
      <g transform="translate(96, 36)">
        <rect x="0" y="0" width="14" height="40" fill="#7A4A26" />
        <rect x="2" y="2" width="3" height="36" fill="#9BC8E0" />
        <rect x="9" y="2" width="3" height="36" fill="#9BC8E0" />
        <text x="2" y="-2" fontSize="5" fontFamily="system-ui" fontWeight="700" fill="var(--color-primary-700)">2x</text>
      </g>
    </svg>
  );
}
