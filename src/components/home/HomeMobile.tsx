import { HeroMobile } from "./mobile/HeroMobile";
import { KeyFiguresCompact } from "./mobile/KeyFiguresCompact";
import { ChatHomeInvite } from "./mobile/ChatHomeInvite";
import { ServicesGridCompact } from "./mobile/ServicesGridCompact";
import { HowItWorksCompact } from "./mobile/HowItWorksCompact";
import { TestimonialSingle } from "./mobile/TestimonialSingle";
import { RelaunchCTA } from "./mobile/RelaunchCTA";
import { MiniFAQ } from "./mobile/MiniFAQ";
import type { HomeData } from "./types";

/**
 * Home mobile dédiée — visible jusqu'au breakpoint lg.
 * Ordre voulu : Hero → Chiffres → Chatbox invite → Services → How it works
 *  → 1 témoignage → Relaunch CTA → Mini-FAQ.
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
      <ServicesGridCompact services={data.services.items} />
      <HowItWorksCompact />
      <TestimonialSingle item={data.testi.items[0]} />
      <RelaunchCTA />
      <MiniFAQ items={data.faq.items} />
    </div>
  );
}
