/**
 * Navigation centrale — utilisée par Header (desktop), MobileMenu (drawer)
 * et Footer (colonnes). Source unique de vérité pour les liens du site.
 *
 * Les "services" listés ici doivent rester synchrones avec les pages
 * /services/[slug] et avec la grille de la home et de /parrainage.
 */
export type NavLink = {
  href: string;
  label: string;
  children?: NavLink[];
  /** Pastille à afficher à côté du label (ex. "Gagnez 1 000 €"). */
  badge?: string;
  /** Description courte (utilisée dans le dropdown desktop). */
  description?: string;
  /** Emoji ou marqueur visuel. */
  icon?: string;
};

export const SERVICES: NavLink[] = [
  {
    href: "/services/panneau-photovoltaique",
    label: "Panneau photovoltaïque",
    icon: "☀️",
    description: "Produisez votre propre électricité.",
  },
  {
    href: "/services/pompe-a-chaleur",
    label: "Pompe à chaleur",
    icon: "🔥",
    description: "Air-Eau ou Air-Air, chauffage haute performance.",
  },
  {
    href: "/services/isolation-thermique-exterieure",
    label: "Isolation thermique extérieure (ITE)",
    icon: "🧱",
    description: "Réduisez vos pertes de chaleur jusqu'à 25 %.",
  },
  {
    href: "/services/chauffe-eau-solaire-individuel",
    label: "Chauffe-eau solaire (CESI)",
    icon: "💧",
    description: "Eau chaude sanitaire grâce au soleil.",
  },
  {
    href: "/services/ballon-thermodynamique",
    label: "Ballon thermodynamique",
    icon: "🛢️",
    description: "Chauffe-eau économique nouvelle génération.",
  },
  {
    href: "/services/systeme-solaire-combine",
    label: "Système solaire combiné (SSC)",
    icon: "🔆",
    description: "Chauffage + eau chaude solaires.",
  },
];

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Accueil" },
  { href: "/qui-sommes-nous", label: "Qui sommes-nous ?" },
  { href: "/services", label: "Services", children: SERVICES },
  { href: "/contact", label: "Contact" },
  { href: "/parrainage", label: "Parrainage", badge: "Gagnez 1 000 €" },
];

export const FOOTER_COLUMNS: Array<{ title: string; links: NavLink[] }> = [
  {
    title: "Services",
    links: SERVICES.map((s) => ({ href: s.href, label: s.label })).concat({
      href: "/services",
      label: "Tous nos services",
    }),
  },
  {
    title: "Entreprise",
    links: [
      { href: "/qui-sommes-nous", label: "Qui sommes-nous ?" },
      { href: "/parrainage", label: "Parrainage" },
    ],
  },
  {
    title: "Aides & ressources",
    links: [
      { href: "/aides", label: "MaPrimeRénov'" },
      { href: "/aides", label: "Certificats CEE" },
      { href: "/aides", label: "Éco-prêt à taux zéro" },
      { href: "/blog", label: "Blog" },
      { href: "/simulateur", label: "Simulateur" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/cgu", label: "CGU" },
      { href: "/confidentialite", label: "Confidentialité" },
      { href: "/cookies", label: "Cookies" },
    ],
  },
];
