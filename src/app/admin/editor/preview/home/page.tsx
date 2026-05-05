import { Hero } from "@/components/home/desktop/Hero";
import { getContent } from "@/lib/content";

export const metadata = { title: "Aperçu — Accueil" };
export const dynamic = "force-dynamic";

/**
 * Contenu de la home rendu dans l'iframe d'aperçu de l'éditeur.
 * Phase 1 : seul le hero est éditable.
 */
export default async function EditorPreviewHomePage() {
  const [heroTitle, heroSubtitle, heroCta, heroCtaSec] = await Promise.all([
    getContent("home.hero.title"),
    getContent("home.hero.subtitle"),
    getContent("home.hero.cta_primary", "Simuler"),
    getContent("home.hero.cta_secondary", "Découvrir"),
  ]);

  return (
    <Hero
      title={heroTitle}
      subtitle={heroSubtitle}
      ctaPrimary={heroCta}
      ctaSecondary={heroCtaSec}
    />
  );
}
