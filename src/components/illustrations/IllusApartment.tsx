/**
 * Immeuble isométrique style "emoji". Façade gris clair, fenêtres alternées
 * (lumineuses jaunes / vitres bleues), porte vitrée dorée. Lecture immédiate
 * "immeuble urbain".
 */
export function IllusApartment({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label="Appartement"
      className={className}
    >
      <ellipse cx="60" cy="110" rx="44" ry="5" fill="var(--color-primary-100)" />

      {/* Toit plat (vue 3/4) */}
      <path d="M60 14 L92 30 L92 36 L60 20 Z" fill="#7C8489" />
      <path d="M60 14 L28 30 L28 36 L60 20 Z" fill="#929A9F" />
      <path d="M28 36 L60 20 L92 36 L60 52 Z" fill="#A2A8AD" />

      {/* Murs */}
      <path d="M28 36 L60 52 L60 110 L28 94 Z" fill="#D8DDE2" />
      <path d="M60 52 L92 36 L92 94 L60 110 Z" fill="#A8B0B6" />

      {/* Fenêtres mur gauche — alternance lumineuse / froide */}
      <path d="M33 50 L39 53 L39 60 L33 57 Z" fill="#F6D75E" />
      <path d="M45 56 L51 59 L51 66 L45 63 Z" fill="#9BC8E0" />
      <path d="M33 66 L39 69 L39 76 L33 73 Z" fill="#9BC8E0" />
      <path d="M45 72 L51 75 L51 82 L45 79 Z" fill="#F6D75E" />
      <path d="M33 82 L39 85 L39 92 L33 89 Z" fill="#F6D75E" />

      <g stroke="#5C636A" strokeWidth="0.5" fill="none">
        <path d="M33 50 L39 53 L39 60 L33 57 Z" />
        <path d="M45 56 L51 59 L51 66 L45 63 Z" />
        <path d="M33 66 L39 69 L39 76 L33 73 Z" />
        <path d="M45 72 L51 75 L51 82 L45 79 Z" />
        <path d="M33 82 L39 85 L39 92 L33 89 Z" />
      </g>

      {/* Fenêtres mur droit */}
      <path d="M66 53 L72 50 L72 57 L66 60 Z" fill="#9BC8E0" />
      <path d="M78 47 L84 44 L84 51 L78 54 Z" fill="#F6D75E" />
      <path d="M66 69 L72 66 L72 73 L66 76 Z" fill="#F6D75E" />
      <path d="M78 63 L84 60 L84 67 L78 70 Z" fill="#9BC8E0" />
      <path d="M66 85 L72 82 L72 89 L66 92 Z" fill="#9BC8E0" />
      <path d="M78 79 L84 76 L84 83 L78 86 Z" fill="#F6D75E" />

      <g stroke="#5C636A" strokeWidth="0.5" fill="none" opacity="0.7">
        <path d="M66 53 L72 50 L72 57 L66 60 Z" />
        <path d="M78 47 L84 44 L84 51 L78 54 Z" />
        <path d="M66 69 L72 66 L72 73 L66 76 Z" />
        <path d="M78 63 L84 60 L84 67 L78 70 Z" />
        <path d="M66 85 L72 82 L72 89 L66 92 Z" />
        <path d="M78 79 L84 76 L84 83 L78 86 Z" />
      </g>

      {/* Porte vitrée dorée */}
      <path d="M52 92 L60 96 L60 108 L52 104 Z" fill="#5C636A" />
      <path d="M53 94 L59 97 L59 106 L53 103 Z" fill="var(--color-accent-500)" opacity="0.85" />

      {/* Antenne */}
      <path d="M60 14 L60 6" stroke="#5C636A" strokeWidth="1.2" />
      <circle cx="60" cy="6" r="1.2" fill="#5C636A" />
    </svg>
  );
}
