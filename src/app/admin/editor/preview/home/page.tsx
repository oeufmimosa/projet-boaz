import { HomeDesktop } from "@/components/home/HomeDesktop";
import type { HomeData } from "@/components/home/types";
import { getContent, getJsonContent } from "@/lib/content";
import { SERVICES_LIST } from "@/lib/services";

export const metadata = { title: "Aperçu — Accueil" };
export const dynamic = "force-dynamic";

/**
 * Contenu de la home rendu dans l'iframe d'aperçu de l'éditeur. Affiche la
 * version desktop complète. Les composants enveloppés dans <EditableText> /
 * <EditableButton> deviennent éditables inline ; les autres textes (hardcodés
 * ou non-wrappés) sont visibles mais s'editent via /admin/contenus.
 */
export default async function EditorPreviewHomePage() {
  const [
    heroTitle, heroSubtitle, heroCta, heroCtaSec,
    servicesTitle, servicesSubtitle,
    howTitle, howSteps,
    figuresTitle, figuresItems,
    testiTitle, testiItems,
    partnersTitle, partnersItems,
    faqTitle, faqItems,
  ] = await Promise.all([
    getContent("home.hero.title"),
    getContent("home.hero.subtitle"),
    getContent("home.hero.cta_primary", "Simuler"),
    getContent("home.hero.cta_secondary", "Découvrir"),
    getContent("home.services.title"),
    getContent("home.services.subtitle"),
    getContent("home.how.title"),
    getJsonContent<{ title: string; description: string }[]>("home.how.steps", []),
    getContent("home.figures.title"),
    getJsonContent<{ value: string; label: string }[]>("home.figures.items", []),
    getContent("home.testimonials.title"),
    getJsonContent<{ name: string; city: string; quote: string; rating: number }[]>("home.testimonials.items", []),
    getContent("home.partners.title"),
    getJsonContent<{ name: string }[]>("home.partners.items", []),
    getContent("home.faq.title"),
    getJsonContent<{ q: string; a: string }[]>("home.faq.items", []),
  ]);

  const services = SERVICES_LIST.map((s) => ({
    slug: s.slug,
    title: s.label,
    short: s.short,
  }));

  const data: HomeData = {
    hero:    { title: heroTitle, subtitle: heroSubtitle, ctaPrimary: heroCta, ctaSecondary: heroCtaSec },
    services:{ title: servicesTitle, subtitle: servicesSubtitle, items: services },
    how:     { title: howTitle, steps: howSteps },
    figures: { title: figuresTitle, items: figuresItems },
    testi:   { title: testiTitle, items: testiItems },
    partners:{ title: partnersTitle, items: partnersItems },
    faq:     { title: faqTitle, items: faqItems },
  };

  return <HomeDesktop data={data} />;
}
