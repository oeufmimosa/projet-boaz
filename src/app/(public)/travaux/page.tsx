import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { Placeholder } from "@/components/ui/Placeholder";
import { TRAVAUX_LIST } from "@/lib/travaux";
import { getContentsByPrefix } from "@/lib/content";

export const metadata = { title: "Travaux de rénovation énergétique" };

export default async function TravauxIndexPage() {
  const contents = await getContentsByPrefix("travaux.");

  return (
    <Section>
      <Container>
        <header className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-bold sm:text-4xl">Tous les travaux de rénovation</h1>
          <p className="mt-3 text-text-muted">
            [INTRO PAGE TRAVAUX — paragraphe d'accroche listant les catégories.]
          </p>
        </header>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRAVAUX_LIST.map((t) => {
            const title = contents.get(`travaux.${t.slug}.title`) ?? t.title;
            const short = contents.get(`travaux.${t.slug}.short`) ?? "";
            return (
              <li key={t.slug}>
                <Link
                  href={`/travaux/${t.slug}`}
                  className="block h-full rounded-md border border-border bg-surface p-4 hover:border-primary"
                >
                  <Placeholder label={title} ratio="16/9" className="mb-3" />
                  <h2 className="text-lg font-semibold">{title}</h2>
                  <p className="mt-1 text-sm text-text-muted">{short}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
