import { HeroMobile } from "./mobile/HeroMobile";
import { KeyFiguresCompact } from "./mobile/KeyFiguresCompact";
import { ChatHomeInvite } from "./mobile/ChatHomeInvite";
import { ServicesGridInteractive } from "./ServicesGridInteractive";
import { HowItWorksCompact } from "./mobile/HowItWorksCompact";
import { RelaunchCTA } from "./mobile/RelaunchCTA";
import { Partners } from "./desktop/Partners";
import { FAQ } from "./desktop/FAQ";
import { ParrainageSection } from "./ParrainageSection";
import { ExpertiseSection } from "./ExpertiseSection";
import type { HomeData } from "./types";

/**
 * Home mobile dédiée — visible jusqu'au breakpoint lg.
 * Ordre voulu : Hero (+ réassurance) → Chiffres → Chatbox invite → Services
 *  → Expertise → How it works → Parrainage → Qualifications → Relaunch CTA → FAQ.
 */
export function HomeMobile({
  data,
  advisorName,
  advisorInitials,
}: {
  data: HomeData;
  advisorName: string;
  advisorInitials: string;
}) {
  return (
    <div className="lg:hidden">
      <HeroMobile title={data.hero.title} subtitle={data.hero.subtitle} />
      <KeyFiguresCompact />
      <ChatHomeInvite advisorName={advisorName} advisorInitials={advisorInitials} />
      <ServicesGridInteractive showBrandsMarquee />
      <ExpertiseSection />
      <HowItWorksCompact />
      <ParrainageSection />
      <Partners title={data.partners.title} items={data.partners.items} />
      <RelaunchCTA />
      <FAQ title={data.faq.title} items={data.faq.items} />
    </div>
  );
}
