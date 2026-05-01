/** VMC double flux — bloc cubique avec flèches d'air entrant/sortant. */
export function IllusVMC({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="VMC double flux" className={className}>
      <ellipse cx="60" cy="108" rx="42" ry="5" fill="var(--color-primary-100)" />
      {/* Bloc VMC carré gris */}
      <rect x="36" y="40" width="48" height="48" rx="3" fill="#F1F3F5" stroke="#7C8489" strokeWidth="1.5" />
      {/* Grilles latérales */}
      <g stroke="#5C636A" strokeWidth="0.6" opacity="0.5">
        <line x1="40" y1="48" x2="48" y2="48" />
        <line x1="40" y1="52" x2="48" y2="52" />
        <line x1="40" y1="56" x2="48" y2="56" />
        <line x1="40" y1="60" x2="48" y2="60" />
        <line x1="72" y1="48" x2="80" y2="48" />
        <line x1="72" y1="52" x2="80" y2="52" />
        <line x1="72" y1="56" x2="80" y2="56" />
        <line x1="72" y1="60" x2="80" y2="60" />
      </g>
      {/* Cercle ventilateur central */}
      <circle cx="60" cy="64" r="11" fill="#374151" />
      <circle cx="60" cy="64" r="2" fill="#9CA3AF" />
      <g stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round">
        <path d="M60 64 L54 58" />
        <path d="M60 64 L66 58" />
        <path d="M60 64 L66 70" />
        <path d="M60 64 L54 70" />
      </g>
      {/* Tuyaux */}
      <rect x="40" y="22" width="6" height="18" fill="#7C8489" />
      <rect x="74" y="22" width="6" height="18" fill="#7C8489" />
      {/* Flèche entrée air froid (bleu) */}
      <g stroke="#3B82C4" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M22 30 L40 30" />
        <path d="M35 25 L40 30 L35 35" />
      </g>
      {/* Flèche sortie air chaud (orange) */}
      <g stroke="#F59E0B" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M80 30 L98 30" />
        <path d="M93 25 L98 30 L93 35" />
      </g>
    </svg>
  );
}
