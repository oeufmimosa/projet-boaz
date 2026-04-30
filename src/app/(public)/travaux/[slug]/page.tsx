import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";
import { TRAVAUX_LIST, isValidTravauxSlug } from "@/lib/travaux";
import { getContent, getJsonContent } from "@/lib/content";

export async function generateStaticParams() {
  return TRAVAUX_LIST.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  if (!isValidTravauxSlug(params.slug)) return {};
  const title = await getContent(`travaux.${params.slug}.title`, "Travaux");
  return { title };
}

export default async function TravauxDetailPage({ params }: { params: { slug: string } }) {
  if (!isValidTravauxSlug(params.slug)) notFound();

  const [title, description, advantages] = await Promise.all([
    getContent(`travaux.${params.slug}.title`),
    getContent(`travaux.${params.slug}.description`),
    getJsonContent<string[]>(`travaux.${params.slug}.advantages`, []),
  ]);

  return (
    <>
      <section className="border-b border-border bg-muted/30 py-12 sm:py-16">
        <Container className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-2 text-sm font-medium uppercase text-primary">Travaux</p>
            <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
            <p className="mt-4 text-muted-fg whitespace-pre-line">{description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href="/simulateur" size="lg">Simuler mes aides</LinkButton>
              <LinkButton href="/contact" size="lg" variant="secondary">Être recontacté</LinkButton>
            </div>
          </div>
          <Placeholder label={`[Visuel ${title}]`} ratio="4/3" />
        </Container>
      </section>

      <Section>
        <Container className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">Avantages</h2>
            <ul className="mt-4 space-y-2">
              {advantages.map((a, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span aria-hidden className="mt-1 text-accent">✓</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded border border-border bg-white p-6">
            <h2 className="text-2xl font-bold">Aides disponibles</h2>
            <p className="mt-2 text-muted-fg">
              [DESCRIPTION DES AIDES MOBILISABLES POUR CES TRAVAUX]
            </p>
            <div className="mt-4">
              <LinkButton href="/aides" variant="secondary">Voir toutes les aides</LinkButton>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
