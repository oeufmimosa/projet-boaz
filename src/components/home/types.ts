/**
 * Données partagées par HomeDesktop et HomeMobile, lues côté serveur.
 */
export interface HomeData {
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  services: {
    title: string;
    subtitle: string;
    items: { slug: string; title: string; short: string }[];
  };
  how: {
    title: string;
    steps: { title: string; description: string }[];
  };
  figures: {
    title: string;
    items: { value: string; label: string }[];
  };
  testi: {
    title: string;
    items: { name: string; city: string; quote: string; rating: number; placeholder?: boolean }[];
  };
  partners: {
    title: string;
    items: { name: string }[];
  };
  faq: {
    title: string;
    items: { q: string; a: string }[];
  };
}
