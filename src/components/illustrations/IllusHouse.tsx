/**
 * Maison style emoji 🏠 — vue de face avec léger 3/4 (pignon visible à droite).
 * Murs crème, toit triangulaire tuile rouge, porte bois, fenêtres bleues à
 * croisillon, cheminée, petit arbre. Lecture immédiate, pas d'isométrique
 * ambigu.
 */
export function IllusHouse({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label="Maison individuelle"
      className={className}
    >
      {/* Pelouse */}
      <ellipse cx="60" cy="108" rx="46" ry="5" fill="var(--color-primary-100)" />
      <ellipse cx="60" cy="109" rx="36" ry="3" fill="#C8DDB6" />

      {/* Pignon droit (perspective subtile) */}
      <polygon points="86,58 96,52 96,102 86,108" fill="#D8B98E" />
      <polygon points="86,58 96,52 96,55 86,61" fill="#A88A56" />

      {/* Mur principal */}
      <rect x="32" y="58" width="54" height="50" fill="#EFD9B0" />

      {/* Toit principal (triangle) */}
      <polygon points="28,60 60,28 88,60" fill="#D9663B" />
      {/* Toit du pignon (volée droite, en perspective) */}
      <polygon points="88,60 60,28 70,22 96,52" fill="#B5502E" />
      {/* Crête (ligne sombre arrière) */}
      <line x1="60" y1="28" x2="70" y2="22" stroke="#7E351D" strokeWidth="0.8" />

      {/* Avant-toit / débord */}
      <rect x="26" y="58" width="64" height="2.5" fill="#9C3F23" />

      {/* Texture tuiles (légère) */}
      <g stroke="#9C3F23" strokeWidth="0.5" opacity="0.55">
        <line x1="34" y1="50" x2="40" y2="50" />
        <line x1="46" y1="44" x2="52" y2="44" />
        <line x1="58" y1="38" x2="64" y2="38" />
        <line x1="68" y1="44" x2="74" y2="44" />
        <line x1="78" y1="50" x2="84" y2="50" />
      </g>

      {/* Cheminée */}
      <rect x="72" y="22" width="6" height="16" fill="#9C3F23" />
      <rect x="72" y="22" width="6" height="2" fill="#7E351D" />

      {/* Porte bois */}
      <rect x="51" y="78" width="14" height="30" fill="#7A4A26" />
      <rect x="53" y="80" width="10" height="20" fill="#5A3618" opacity="0.5" />
      {/* Poignée dorée */}
      <circle cx="62" cy="93" r="1" fill="var(--color-accent-500)" />

      {/* Fenêtre gauche */}
      <rect x="36" y="68" width="11" height="11" fill="#9BC8E0" stroke="#7B3F18" strokeWidth="1.5" />
      <line x1="41.5" y1="68" x2="41.5" y2="79" stroke="#7B3F18" strokeWidth="1" />
      <line x1="36" y1="73.5" x2="47" y2="73.5" stroke="#7B3F18" strokeWidth="1" />

      {/* Fenêtre droite */}
      <rect x="71" y="68" width="11" height="11" fill="#9BC8E0" stroke="#7B3F18" strokeWidth="1.5" />
      <line x1="76.5" y1="68" x2="76.5" y2="79" stroke="#7B3F18" strokeWidth="1" />
      <line x1="71" y1="73.5" x2="82" y2="73.5" stroke="#7B3F18" strokeWidth="1" />

      {/* Petit arbre */}
      <rect x="14" y="98" width="2" height="8" fill="#7A4A26" />
      <circle cx="15" cy="94" r="7" fill="#5BA86E" />
      <circle cx="13" cy="92" r="4" fill="#76C088" />
    </svg>
  );
}
