/** Panneaux photovoltaïques sur toit — bleu foncé + soleil jaune. */
export function IllusSolar({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Panneaux photovoltaïques" className={className}>
      <ellipse cx="60" cy="108" rx="42" ry="5" fill="var(--color-primary-100)" />
      {/* Soleil */}
      <circle cx="20" cy="22" r="8" fill="#F59E0B" />
      <g stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
        <line x1="20" y1="6" x2="20" y2="10" />
        <line x1="34" y1="22" x2="38" y2="22" />
        <line x1="8" y1="10" x2="11" y2="13" />
        <line x1="8" y1="34" x2="11" y2="31" />
        <line x1="32" y1="10" x2="29" y2="13" />
      </g>
      {/* Maison + toit incliné */}
      <rect x="32" y="68" width="56" height="34" fill="#EFD9B0" />
      <polygon points="28,68 60,38 92,68" fill="#D9663B" />
      <rect x="28" y="68" width="64" height="3" fill="#9C3F23" />
      {/* Panneaux solaires sur le toit (3×2 grille bleu nuit) */}
      <g>
        <rect x="40" y="48" width="38" height="18" fill="#1E3A8A" stroke="#0F1E4D" strokeWidth="1" transform="rotate(-20 60 56)" />
        <g stroke="#3B82C4" strokeWidth="0.6" transform="rotate(-20 60 56)">
          <line x1="52" y1="48" x2="52" y2="66" />
          <line x1="64" y1="48" x2="64" y2="66" />
          <line x1="40" y1="57" x2="78" y2="57" />
        </g>
      </g>
      {/* Porte */}
      <rect x="54" y="80" width="12" height="22" fill="#7A4A26" />
      {/* Petite étincelle énergie */}
      <g stroke="var(--color-accent-500)" strokeWidth="2" fill="var(--color-accent-500)">
        <polygon points="92,82 95,76 98,82 95,88" />
      </g>
    </svg>
  );
}
