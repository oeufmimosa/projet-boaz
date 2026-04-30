import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";

export function HowItWorks({
  title,
  steps,
}: {
  title: string;
  steps: { title: string; description: string }[];
}) {
  return (
    <Section className="bg-muted/30">
      <Container>
        <h2 className="mb-10 text-2xl font-bold sm:text-3xl">{title}</h2>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={i} className="rounded border border-border bg-white p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-fg font-bold">
                {i + 1}
              </div>
              <h3 className="text-base font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-fg">{s.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
