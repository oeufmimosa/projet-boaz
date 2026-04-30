import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { SimulatorWizard } from "@/components/simulator/SimulatorWizard";
import { prisma } from "@/lib/prisma";
import { getContent } from "@/lib/content";
import type { SimulatorStepDTO, FieldType } from "@/types/simulator";

export const metadata = { title: "Simulateur" };
export const dynamic = "force-dynamic";

export default async function SimulatorPage() {
  const [title, subtitle, rawSteps] = await Promise.all([
    getContent("simulator.intro.title", "Simulateur"),
    getContent("simulator.intro.subtitle"),
    prisma.simulatorStep.findMany({ orderBy: { order: "asc" } }),
  ]);

  const steps: SimulatorStepDTO[] = rawSteps.map((s) => ({
    id: s.id,
    order: s.order,
    key: s.key,
    label: s.label,
    helpText: s.helpText,
    // fieldType est une string en DB; valeurs garanties par zod en écriture.
    fieldType: s.fieldType as FieldType,
    required: s.required,
    options: s.options ? JSON.parse(s.options) : undefined,
    config: s.config ? JSON.parse(s.config) : undefined,
  }));

  return (
    <Section>
      <Container className="max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-3 text-muted-fg">{subtitle}</p>
        </header>
        <div className="rounded border border-border bg-white p-6 sm:p-8">
          {steps.length === 0 ? (
            <p className="text-sm text-red-600">Le simulateur n'est pas configuré (aucune étape).</p>
          ) : (
            <SimulatorWizard steps={steps} />
          )}
        </div>
      </Container>
    </Section>
  );
}
