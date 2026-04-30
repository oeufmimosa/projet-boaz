import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { Placeholder } from "@/components/ui/Placeholder";

export function ServicesGrid({
  title,
  subtitle,
  services,
}: {
  title: string;
  subtitle: string;
  services: { slug: string; title: string; short: string }[];
}) {
  return (
    <Section>
      <Container>
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
          <p className="mt-2 text-muted-fg">{subtitle}</p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/travaux/${s.slug}`}
                className="block h-full rounded border border-border bg-white p-4 transition hover:border-primary hover:shadow-sm"
              >
                <Placeholder label={s.title} ratio="16/9" className="mb-3" />
                <h3 className="text-base font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-fg line-clamp-2">{s.short}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
