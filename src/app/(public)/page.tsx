import type { Metadata } from "next";
import { HomeDesktop } from "@/components/home/HomeDesktop";
import { HomeMobile } from "@/components/home/HomeMobile";
import type { HomeData } from "@/components/home/types";
import { getContent, getJsonContent } from "@/lib/content";
import { SERVICES_LIST } from "@/lib/services";
import { WebSiteJsonLd, FaqJsonLd } from "@/components/seo/StructuredData";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rénovation énergétique en France — Aides cumulées 2025",
  description:
    "Pompe à chaleur, isolation thermique extérieure, photovoltaïque, ballon thermodynamique : faites estimer vos aides en 2 minutes et profitez d'un accompagnement clé en main par des artisans RGE.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Rénovation énergétique en France — Aides cumulées 2025",
    description:
      "Pompe à chaleur, isolation, photovoltaïque : estimez vos aides en 2 minutes et profitez d'un accompagnement par des artisans RGE.",
    url: "/",
    type: "website",
  },
};

export default async function HomePage() {
  const [
    heroTitle, heroSubtitle, heroCta, heroCtaSec,
    servicesTitle, servicesSubtitle,
    howTitle, howSteps,
    figuresTitle, figuresItems,
    testiTitle, testiItems,
    partnersTitle, partnersItems,
    faqTitle, faqItems,
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
    getContent("chatbox.advisor.name", "Camille — Climat Hexagone"),
    getContent("chatbox.advisor.initials", "CH"),
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

  return (
    <>
      <WebSiteJsonLd />
      {data.faq.items.length > 0 && <FaqJsonLd items={data.faq.items} />}
      <HomeDesktop data={data} />
      <HomeMobile data={data} advisorName={advisorName} advisorInitials={advisorInitials} />
    </>
  );
}
