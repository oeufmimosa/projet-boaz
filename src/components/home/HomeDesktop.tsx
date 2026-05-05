import { Hero } from "./desktop/Hero";
import { ServicesGridInteractive } from "./ServicesGridInteractive";
import { HowItWorks } from "./desktop/HowItWorks";
import { KeyFigures } from "./desktop/KeyFigures";
import { Testimonials } from "./desktop/Testimonials";
import { Partners } from "./desktop/Partners";
import { FAQ } from "./desktop/FAQ";
import { ParrainageSection } from "./ParrainageSection";
import { ExpertiseSection } from "./ExpertiseSection";
import type { HomeData } from "./types";

/** Home desktop — visible uniquement à partir du breakpoint lg. */
export function HomeDesktop({ data }: { data: HomeData }) {
  return (
    <div className="hidden lg:block">
      <Hero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        ctaPrimary={data.hero.ctaPrimary}
        ctaSecondary={data.hero.ctaSecondary}
      />
      <ServicesGridInteractive />
      <ExpertiseSection />
      <KeyFigures title={data.figures.title} items={data.figures.items} />
      <HowItWorks title={data.how.title} steps={data.how.steps} />
      <ParrainageSection />
      <Testimonials title={data.testi.title} items={data.testi.items} />
      <Partners title={data.partners.title} items={data.partners.items} />
      <FAQ title={data.faq.title} items={data.faq.items} />
    </div>
  );
}
