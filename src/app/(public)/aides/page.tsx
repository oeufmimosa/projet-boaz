import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { AIDES_LIST } from "@/lib/travaux";
import { getContent, getContentsByPrefix } from "@/lib/content";

export const metadata = { title: "Aides à la rénovation énergétique" };

export default async function AidesPage() {
  const [heroTitle, heroSubtitle, contents] = await Promise.all([
    getContent("aides.hero.title"),
    getContent("aides.hero.subtitle"),
    getContentsByPrefix("aides."),
  ]);

  return (
    <>
      <section className="border-b border-border bg-surface-2 py-12 sm:py-16">
        <Container className="max-w-3xl">
          <h1 className="text-3xl font-bold sm:text-4xl">{heroTitle}</h1>
          <p className="mt-3 text-text-muted">{heroSubtitle}</p>
        </Container>
      </section>

      <Section>
        <Container>
          <ul className="grid gap-4 md:grid-cols-2">
            {AIDES_LIST.map((a) => (
              <li key={a.key} className="rounded-md border border-border bg-surface p-6">
                <h2 className="text-xl font-semibold">
                  {contents.get(`aides.${a.key}.title`) ?? a.title}
                </h2>
                <p className="mt-2 text-text-muted whitespace-pre-line">
                  {contents.get(`aides.${a.key}.description`) ?? ""}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <LinkButton href="/simulateur" size="lg">Estimer mes aides</LinkButton>
          </div>
        </Container>
      </Section>
    </>
  );
}
