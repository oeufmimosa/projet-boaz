import { Hero } from "@/components/home/Hero";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { KeyFigures } from "@/components/home/KeyFigures";
import { Testimonials } from "@/components/home/Testimonials";
import { Partners } from "@/components/home/Partners";
import { FAQ } from "@/components/home/FAQ";
import { getContent, getJsonContent, getContentsByPrefix } from "@/lib/content";
import { TRAVAUX_LIST } from "@/lib/travaux";

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
    getJsonContent<{ name: string; logo?: string }[]>("home.partners.items", []),
    getContent("home.faq.title"),
    getJsonContent<{ q: string; a: string }[]>("home.faq.items", []),
    getContentsByPrefix("travaux."),
  ]);

  const services = TRAVAUX_LIST.map((t) => ({
    slug: t.slug,
    title: travauxContent.get(`travaux.${t.slug}.title`) ?? t.title,
    short: travauxContent.get(`travaux.${t.slug}.short`) ?? "",
  }));

  return (
    <>
      <Hero
        title={heroTitle}
        subtitle={heroSubtitle}
        ctaPrimary={heroCta}
        ctaSecondary={heroCtaSec}
      />
      <ServicesGrid title={servicesTitle} subtitle={servicesSubtitle} services={services} />
      <HowItWorks title={howTitle} steps={howSteps} />
      <KeyFigures title={figuresTitle} items={figuresItems} />
      <Testimonials title={testiTitle} items={testiItems} />
      <Partners title={partnersTitle} items={partnersItems} />
      <FAQ title={faqTitle} items={faqItems} />
    </>
  );
}
