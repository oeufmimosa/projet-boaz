import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { TricolorAccent, TricolorBar } from "@/components/brand/TricolorBar";
import { IllusSuccess } from "@/components/illustrations";
import { HexConfetti } from "@/components/simulator/HexConfetti";
import { getContent } from "@/lib/content";

export const metadata = { title: "Merci" };

export default async function MerciPage() {
  const [title, body] = await Promise.all([
    getContent("simulator.merci.title", "Votre demande est partie"),
    getContent("simulator.merci.body"),
  ]);

  return (
    <>
      <HexConfetti />
      <Section>
        <Container className="max-w-3xl text-center">
          <IllusSuccess size={180} className="mx-auto" />
          <h1 className="mt-6 font-display text-display-lg">{title}</h1>
          <TricolorAccent className="mx-auto mt-3" />
          <p className="mt-4 text-body-lg text-text-muted">{body}</p>

          <h2 className="mt-12 font-display text-display-md">Et après ?</h2>
          <Timeline />

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LinkButton href="/aides" variant="outline">Découvrir les aides en détail</LinkButton>
            <LinkButton href="/" variant="primary">Retour à l'accueil</LinkButton>
          </div>
        </Container>
      </Section>
      <TricolorBar />
    </>
  );
}

function Timeline() {
  const steps: { title: string; description: string; state: "current" | "todo" }[] = [
    { title: "Nous étudions votre dossier", description: "Notre équipe analyse votre projet en moins de 24h.", state: "current" },
    { title: "Un conseiller vous contacte",  description: "Nous vous appelons pour confirmer vos travaux.",   state: "todo" },
    { title: "Devis gratuit personnalisé",   description: "Vous recevez un devis détaillé avec aides chiffrées.", state: "todo" },
  ];
  return (
    <ol className="mt-6 grid gap-6 md:grid-cols-3 md:gap-4">
      {steps.map((s, i) => (
        <li key={i} className="relative rounded-lg border border-border bg-surface p-5 text-left">
          <Hex state={s.state} number={i + 1} />
          <p className="mt-4 font-display text-display-sm">{s.title}</p>
          <p className="mt-2 text-body-sm text-text-muted">{s.description}</p>
          {i < steps.length - 1 && (
            <span aria-hidden className="hidden md:block absolute right-[-16px] top-12 h-0.5 w-8 border-t-2 border-dashed border-primary-300" />
          )}
        </li>
      ))}
    </ol>
  );
}

function Hex({ state, number }: { state: "current" | "todo"; number: number }) {
  const fill = state === "current" ? "var(--color-primary-700)" : "var(--color-surface)";
  const stroke = state === "current" ? "var(--color-primary-700)" : "var(--color-primary-200)";
  return (
    <span className={`relative inline-flex h-12 w-11 items-center justify-center ${state === "current" ? "hex-pulse-merci" : ""}`}>
      <svg viewBox="0 0 56 64" className="absolute inset-0 h-full w-full" aria-hidden>
        <path d="M28 2 52 16v32L28 62 4 48V16Z" fill={fill} stroke={stroke} strokeWidth="3" />
      </svg>
      <span className={`relative font-display font-bold ${state === "current" ? "text-accent-500" : "text-primary-700"}`}>
        {number}
      </span>
      <style>{`
        @keyframes hexPulseMerci { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
        .hex-pulse-merci { animation: hexPulseMerci 1.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce){ .hex-pulse-merci { animation: none } }
      `}</style>
    </span>
  );
}
