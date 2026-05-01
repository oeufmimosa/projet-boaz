/** Audit énergétique — loupe sur maison + jauge énergie ABCDE. */
export function IllusAudit({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Audit énergétique" className={className}>
      <ellipse cx="60" cy="108" rx="42" ry="5" fill="var(--color-primary-100)" />
      {/* Maison simplifiée */}
      <polygon points="20,52 50,28 80,52" fill="#D9663B" />
      <rect x="24" y="52" width="52" height="44" fill="#EFD9B0" />
      <rect x="44" y="68" width="12" height="28" fill="#7A4A26" />
      <rect x="60" y="64" width="10" height="10" fill="#9BC8E0" />
      <rect x="32" y="64" width="10" height="10" fill="#9BC8E0" />
      {/* Loupe — anneau marron + verre bleu translucide */}
      <circle cx="78" cy="60" r="20" fill="rgba(155,200,224,0.35)" stroke="#1F6A40" strokeWidth="3" />
      <line x1="92" y1="74" x2="106" y2="88" stroke="#1F6A40" strokeWidth="6" strokeLinecap="round" />
      <line x1="92" y1="74" x2="106" y2="88" stroke="#3F8B5E" strokeWidth="3" strokeLinecap="round" />
      {/* Jauge DPE simplifiée à droite */}
      <g transform="translate(92, 24)">
        <rect x="0" y="0" width="22" height="6" fill="#22C55E" />
        <rect x="0" y="6" width="22" height="6" fill="#84CC16" />
        <rect x="0" y="12" width="22" height="6" fill="#FACC15" />
        <rect x="0" y="18" width="22" height="6" fill="#F97316" />
        <rect x="0" y="24" width="22" height="6" fill="#EF4444" />
        <text x="3" y="5" fontSize="5" fontFamily="system-ui" fontWeight="800" fill="#FFFFFF">A</text>
        <text x="3" y="11" fontSize="5" fontFamily="system-ui" fontWeight="800" fill="#FFFFFF">B</text>
        <text x="3" y="17" fontSize="5" fontFamily="system-ui" fontWeight="800" fill="#FFFFFF">C</text>
        <text x="3" y="23" fontSize="5" fontFamily="system-ui" fontWeight="800" fill="#FFFFFF">D</text>
        <text x="3" y="29" fontSize="5" fontFamily="system-ui" fontWeight="800" fill="#FFFFFF">E</text>
      </g>
    </svg>
  );
}
