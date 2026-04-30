import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";

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
    <section className="border-b border-border bg-muted/30 py-12 sm:py-20">
      <Container className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">{title}</h1>
          <p className="mt-4 text-lg text-muted-fg">{subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href="/simulateur" size="lg">{ctaPrimary}</LinkButton>
            <LinkButton href="/aides" size="lg" variant="secondary">{ctaSecondary}</LinkButton>
          </div>
        </div>
        <Placeholder label="[Visuel principal]" ratio="4/3" />
      </Container>
    </section>
  );
}
