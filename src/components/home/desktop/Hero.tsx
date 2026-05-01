import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { FrenchBadge } from "@/components/brand/FrenchBadge";

const REASSURANCE = [
  { value: "100 000+", label: "Particuliers accompagnés" },
  { value: "1 500+",  label: "Artisans RGE" },
  { value: "4,7/5",   label: "Note moyenne clients" },
];

export function Hero({
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}) {
  return (
    <section className="relative overflow-hidden bg-primary-800 text-text-inverse">
      <div aria-hidden className="absolute inset-0 hex-pattern opacity-60" />

      <Container className="relative py-12 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <FrenchBadge variant="dark" />
            <h1 className="mt-5 text-display-xl font-display">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-body-lg text-primary-100">
              {subtitle}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <LinkButton href="/simulateur" variant="accent" size="lg" className="w-full sm:w-auto">
                {ctaPrimary}
              </LinkButton>
              <LinkButton href="/aides" variant="inverse" size="lg" className="w-full sm:w-auto">
                {ctaSecondary}
              </LinkButton>
            </div>
          </div>

          {/* Visuel hexagonal — placeholder en attendant l'illustration finale */}
          <div className="relative mx-auto w-full max-w-md aspect-[4/3]">
            <HexVisual />
          </div>
        </div>

        {/* Bandeau réassurance — séparateurs tricolores verticaux fins */}
        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-primary-700 bg-primary-700 sm:grid-cols-3">
          {REASSURANCE.map((r, i) => (
            <div key={i} className="relative bg-primary-800 p-5 text-center">
              <p className="font-display text-display-md text-accent-500">{r.value}</p>
              <p className="mt-1 text-body-sm text-primary-200">{r.label}</p>
              {i < REASSURANCE.length - 1 && (
                <div
                  aria-hidden
                  className="absolute right-0 top-1/2 hidden h-10 w-0.5 -translate-y-1/2 sm:flex flex-col overflow-hidden"
                >
                  <div className="flex-1" style={{ background: "var(--color-fr-blue)" }} />
                  <div className="flex-1" style={{ background: "var(--color-fr-white)" }} />
                  <div className="flex-1" style={{ background: "var(--color-fr-red)" }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/** Gros hexagone décoratif vert→vert-clair, placeholder du visuel hero. */
function HexVisual() {
  return (
    <svg
      viewBox="0 0 400 460"
      role="img"
      aria-label="Visuel — hexagone décoratif"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id="hex-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-primary-300)" />
          <stop offset="1" stopColor="var(--color-primary-600)" />
        </linearGradient>
      </defs>
      {/* hexagones décoratifs en arrière-plan */}
      <g opacity="0.18" fill="var(--color-primary-200)" aria-hidden>
        <path d="M340 50 380 73v46l-40 23-40-23V73Z" />
        <path d="M60 380 100 403v46l-40 23-40-23v-46Z" />
      </g>
      {/* hexagone principal */}
      <path
        d="M200 30 360 120v220L200 430 40 340V120Z"
        fill="url(#hex-grad)"
        stroke="var(--color-primary-700)"
        strokeWidth="2"
      />
      {/* drapeau dans l'hexagone principal */}
      <g clipPath="path('M200 30 360 120v220L200 430 40 340V120Z')" opacity="0.85">
        <rect x="40" y="30" width="106.66" height="400" fill="var(--color-fr-blue)" opacity="0.55" />
        <rect x="146.66" y="30" width="106.66" height="400" fill="var(--color-fr-white)" opacity="0.4" />
        <rect x="253.32" y="30" width="106.66" height="400" fill="var(--color-fr-red)" opacity="0.55" />
      </g>
    </svg>
  );
}
