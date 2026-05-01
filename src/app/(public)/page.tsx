import { HomeDesktop } from "@/components/home/HomeDesktop";
import { HomeMobile } from "@/components/home/HomeMobile";
import type { HomeData } from "@/components/home/types";
import { getContent, getJsonContent, getContentsByPrefix } from "@/lib/content";
import { TRAVAUX_LIST } from "@/lib/travaux";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    heroTitle, heroSubtitle, heroCta, heroCtaSec,
    servicesTitle, servicesSubtitle,
    howTitle, howSteps,
    figuresTitle, figuresItems,
    testiTitle, testiItems,
    partnersTitle, partnersItems,
    faqTitle, faqItems,
    travauxContent,
    advisorName, advisorInitials,
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
    getContentsByPrefix("travaux."),
    getContent("chatbox.advisor.name", "Camille — Climat Hexagon"),
    getContent("chatbox.advisor.initials", "CH"),
  ]);

  const services = TRAVAUX_LIST.map((t) => ({
    slug: t.slug,
    title: travauxContent.get(`travaux.${t.slug}.title`) ?? t.title,
    short: travauxContent.get(`travaux.${t.slug}.short`) ?? "",
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

  return (
    <>
      <HomeDesktop data={data} />
      <HomeMobile data={data} advisorName={advisorName} advisorInitials={advisorInitials} />
    </>
  );
}
