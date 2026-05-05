/**
 * Illustration hero — scène isométrique « maison rénovée énergétiquement ».
 *
 * Composition :
 *   - Cadre hexagonal en arrière-plan (motif marque, dégradé radial)
 *   - Maison isométrique 3/4 avec mur droit + façade + toit
 *   - Toit recouvert de panneaux photovoltaïques (rangées avec sheen brillant)
 *   - Cheminée + fenêtre éclairée
 *   - Pompe à chaleur (unité extérieure) côté gauche
 *   - Arbre feuillu (cluster d'ellipses) côté droit
 *   - Soleil radial doux upper-right
 *   - Pennant tricolore en bas-droite (signal FR discret)
 *
 * 100 % SVG vectoriel, fond transparent, blend dans le hero vert foncé.
 * Tous les chiffres sont calibrés pour un viewBox 480×480.
 */
export function HeroBrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 480"
      role="img"
      aria-label="Maison rénovée — panneaux solaires, pompe à chaleur, isolation"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Cadre hexagonal — dégradé radial vert subtil */}
        <radialGradient id="hex-bg" cx="50%" cy="40%" r="65%">
          <stop offset="0%"   stopColor="#3F8B5E" stopOpacity="0.20" />
          <stop offset="60%"  stopColor="#155232" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0F3D26" stopOpacity="0.0" />
        </radialGradient>

        {/* Soleil radial */}
        <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FBE39A" stopOpacity="0.55" />
          <stop offset="40%"  stopColor="#E8B043" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#E8B043" stopOpacity="0.0" />
        </radialGradient>

        {/* Façade maison (face avant) */}
        <linearGradient id="wall-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#FBFBF6" />
          <stop offset="100%" stopColor="#E8E9DF" />
        </linearGradient>
        {/* Mur latéral (côté droit, plus sombre) */}
        <linearGradient id="wall-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#D7D8CA" />
          <stop offset="100%" stopColor="#B6B7A7" />
        </linearGradient>

        {/* Toit principal — base bleu marine pour les panneaux solaires */}
        <linearGradient id="roof-base" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="#0F1F40" />
          <stop offset="100%" stopColor="#1A2C5B" />
        </linearGradient>
        {/* Sheen sur les panneaux solaires (brillance diagonale) */}
        <linearGradient id="solar-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#3B5BA8" stopOpacity="0.0" />
          <stop offset="35%"  stopColor="#7CA6E8" stopOpacity="0.55" />
          <stop offset="55%"  stopColor="#7CA6E8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#3B5BA8" stopOpacity="0.0" />
        </linearGradient>
        {/* Cellule de panneau solaire */}
        <linearGradient id="solar-cell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#1A2C5B" />
          <stop offset="100%" stopColor="#0A1530" />
        </linearGradient>
        {/* Toit côté (versant droit) */}
        <linearGradient id="roof-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#0A1530" />
          <stop offset="100%" stopColor="#1A2C5B" />
        </linearGradient>

        {/* Feuillage de l'arbre */}
        <radialGradient id="leaves" cx="40%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="#6FAE85" />
          <stop offset="60%"  stopColor="#3F8B5E" />
          <stop offset="100%" stopColor="#155232" />
        </radialGradient>

        {/* PAC unité extérieure */}
        <linearGradient id="pac-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#F4F5EE" />
          <stop offset="100%" stopColor="#C9CABB" />
        </linearGradient>

        {/* Sol / ombre douce */}
        <radialGradient id="ground-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#000000" stopOpacity="0.30" />
          <stop offset="80%"  stopColor="#000000" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
        </radialGradient>
      </defs>

      {/* ───── Cadre hexagonal ───── */}
      <path
        d="M 240 30 L 420 130 L 420 350 L 240 450 L 60 350 L 60 130 Z"
        fill="url(#hex-bg)"
      />
      <path
        d="M 240 30 L 420 130 L 420 350 L 240 450 L 60 350 L 60 130 Z"
        fill="none"
        stroke="rgba(165,207,180,0.18)"
        strokeWidth="1.5"
      />

      {/* ───── Soleil discret upper-right ───── */}
      <circle cx="380" cy="120" r="80" fill="url(#sun-glow)" />
      <circle cx="380" cy="120" r="14" fill="#FBE39A" opacity="0.85" />
      {/* Rayons fins */}
      <g stroke="#FBE39A" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
        <line x1="380" y1="92"  x2="380" y2="80" />
        <line x1="380" y1="148" x2="380" y2="160" />
        <line x1="352" y1="120" x2="340" y2="120" />
        <line x1="408" y1="120" x2="420" y2="120" />
        <line x1="362" y1="102" x2="354" y2="94" />
        <line x1="398" y1="138" x2="406" y2="146" />
        <line x1="362" y1="138" x2="354" y2="146" />
        <line x1="398" y1="102" x2="406" y2="94" />
      </g>

      {/* ───── Ombre projetée douce sous la maison ───── */}
      <ellipse cx="240" cy="395" rx="180" ry="22" fill="url(#ground-shadow)" />

      {/* ───── Maison isométrique ───── */}
      {/* Mur côté droit (plus sombre) */}
      <path
        d="M 320 220 L 388 200 L 388 360 L 320 380 Z"
        fill="url(#wall-side)"
      />
      {/* Façade avant (plus claire) */}
      <path
        d="M 130 220 L 320 220 L 320 380 L 130 380 Z"
        fill="url(#wall-front)"
      />

      {/* Bandeau bas façade (plinthe) */}
      <rect x="130" y="370" width="190" height="10" fill="#9D9D8A" opacity="0.45" />
      <path d="M 320 370 L 388 350 L 388 360 L 320 380 Z" fill="#7E7F70" opacity="0.35" />

      {/* Porte */}
      <rect x="180" y="295" width="40" height="85" rx="2" fill="#1A2C5B" />
      <circle cx="212" cy="338" r="2.2" fill="#E8B043" />
      {/* Marche */}
      <rect x="172" y="378" width="56" height="6" fill="#9D9D8A" opacity="0.5" />

      {/* Fenêtre éclairée — façade */}
      <rect x="240" y="270" width="60" height="60" fill="#FBE39A" />
      <rect x="240" y="270" width="60" height="60" fill="none" stroke="#1A2C5B" strokeWidth="3" />
      <line x1="270" y1="270" x2="270" y2="330" stroke="#1A2C5B" strokeWidth="2.5" />
      <line x1="240" y1="300" x2="300" y2="300" stroke="#1A2C5B" strokeWidth="2.5" />
      {/* Léger reflet sur la fenêtre */}
      <path d="M 240 270 L 280 270 L 240 310 Z" fill="#FFFFFF" opacity="0.35" />

      {/* Fenêtre côté */}
      <path
        d="M 335 250 L 375 240 L 375 290 L 335 300 Z"
        fill="#FBE39A"
        opacity="0.85"
      />
      <path
        d="M 335 250 L 375 240 L 375 290 L 335 300 Z"
        fill="none"
        stroke="#1A2C5B"
        strokeWidth="2.5"
      />

      {/* ───── Toit + panneaux solaires ───── */}
      {/* Versant principal (face avant : grande pente) — base navy */}
      <path
        d="M 130 220 L 240 130 L 320 220 Z"
        fill="url(#roof-base)"
      />
      {/* Versant côté droit */}
      <path
        d="M 320 220 L 240 130 L 388 110 L 388 200 Z"
        fill="url(#roof-side)"
      />
      {/* Cellules de panneaux solaires sur la grande pente — 3 rangées */}
      <g>
        {/* Rangée du bas */}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={`s1-${i}`}
            x={155 + i * 28}
            y={210}
            width={24}
            height={14}
            fill="url(#solar-cell)"
            stroke="#0A1530"
            strokeWidth="0.8"
          />
        ))}
        {/* Rangée du milieu */}
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={`s2-${i}`}
            x={170 + i * 28}
            y={188}
            width={24}
            height={14}
            fill="url(#solar-cell)"
            stroke="#0A1530"
            strokeWidth="0.8"
          />
        ))}
        {/* Rangée du haut */}
        {[0, 1, 2].map((i) => (
          <rect
            key={`s3-${i}`}
            x={188 + i * 28}
            y={166}
            width={24}
            height={14}
            fill="url(#solar-cell)"
            stroke="#0A1530"
            strokeWidth="0.8"
          />
        ))}
      </g>
      {/* Sheen brillant en diagonale par-dessus les panneaux */}
      <path
        d="M 130 220 L 240 130 L 320 220 Z"
        fill="url(#solar-sheen)"
        opacity="0.35"
      />
      {/* Faîtage du toit (ligne fine claire) */}
      <line x1="130" y1="220" x2="240" y2="130" stroke="#3B5BA8" strokeWidth="0.8" opacity="0.6" />
      <line x1="240" y1="130" x2="320" y2="220" stroke="#3B5BA8" strokeWidth="0.8" opacity="0.6" />
      <line x1="240" y1="130" x2="388" y2="110" stroke="#3B5BA8" strokeWidth="0.8" opacity="0.6" />

      {/* Cheminée */}
      <rect x="195" y="148" width="22" height="48" fill="#1A2C5B" />
      <rect x="190" y="146" width="32" height="6" fill="#0A1530" />

      {/* ───── Pompe à chaleur (unité extérieure) côté gauche ───── */}
      <g transform="translate(80 320)">
        {/* Socle */}
        <rect x="-2" y="48" width="64" height="6" fill="#9D9D8A" opacity="0.5" />
        {/* Boîtier */}
        <rect x="0" y="0" width="60" height="50" fill="url(#pac-body)" stroke="#1A2C5B" strokeWidth="2" rx="3" />
        {/* Grille ventilateur */}
        <circle cx="22" cy="25" r="16" fill="#1A2C5B" />
        <circle cx="22" cy="25" r="12" fill="none" stroke="#3B5BA8" strokeWidth="1" />
        {/* Pales (3 traits) */}
        <g stroke="#7CA6E8" strokeWidth="1.5" strokeLinecap="round">
          <line x1="22" y1="13" x2="28" y2="22" />
          <line x1="32" y1="29" x2="22" y2="34" />
          <line x1="12" y1="22" x2="22" y2="16" />
        </g>
        {/* Témoin LED */}
        <circle cx="50" cy="10" r="2" fill="#3F8B5E" />
        {/* Ouïes latérales */}
        <line x1="44" y1="20" x2="56" y2="20" stroke="#1A2C5B" strokeWidth="1" />
        <line x1="44" y1="26" x2="56" y2="26" stroke="#1A2C5B" strokeWidth="1" />
        <line x1="44" y1="32" x2="56" y2="32" stroke="#1A2C5B" strokeWidth="1" />
      </g>

      {/* ───── Arbre côté droit ───── */}
      <g transform="translate(395 280)">
        {/* Tronc */}
        <path d="M -3 90 L -3 30 Q -5 24, 0 22 Q 5 24, 3 30 L 3 90 Z" fill="#6B4A2B" />
        {/* Feuillage — cluster d'ellipses superposées */}
        <ellipse cx="0"   cy="20"  rx="32" ry="30" fill="url(#leaves)" />
        <ellipse cx="-22" cy="30"  rx="22" ry="22" fill="url(#leaves)" opacity="0.92" />
        <ellipse cx="22"  cy="32"  rx="22" ry="22" fill="url(#leaves)" opacity="0.92" />
        <ellipse cx="0"   cy="-2"  rx="22" ry="20" fill="url(#leaves)" opacity="0.9" />
        {/* Highlights */}
        <ellipse cx="-8"  cy="6"  rx="10" ry="8" fill="#A5CFB4" opacity="0.55" />
        <ellipse cx="-22" cy="22" rx="6"  ry="5" fill="#A5CFB4" opacity="0.4" />
      </g>

      {/* ───── Pennant tricolore discret en bas (signal FR) ───── */}
      <g transform="translate(290 410)">
        <rect x="0"  y="0" width="14" height="14" fill="#002395" />
        <rect x="14" y="0" width="14" height="14" fill="#FFFFFF" />
        <rect x="28" y="0" width="14" height="14" fill="#ED2939" />
        <rect x="0"  y="0" width="42" height="14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
      </g>

      {/* ───── Petits points décoratifs hexagones flottants ───── */}
      <g opacity="0.25">
        <path d="M 75 95 L 88 102 L 88 116 L 75 123 L 62 116 L 62 102 Z" fill="none" stroke="#A5CFB4" strokeWidth="1.2" />
        <path d="M 415 380 L 426 386 L 426 398 L 415 404 L 404 398 L 404 386 Z" fill="#A5CFB4" opacity="0.35" />
      </g>
    </svg>
  );
}
