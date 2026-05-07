import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { TricolorAccent } from "@/components/brand/TricolorBar";
import { SimulatorWizard } from "@/components/simulator/SimulatorWizard";
import { prisma } from "@/lib/prisma";
import { getContent } from "@/lib/content";
import type { SimulatorStepDTO, FieldType } from "@/types/simulator";

export const metadata = { title: "Simulateur" };
export const dynamic = "force-dynamic";

export default async function SimulatorPage() {
  const [title, rawSteps] = await Promise.all([
    getContent("simulator.intro.title", "Estimez vos aides en quelques clics"),
    prisma.simulatorStep.findMany({ orderBy: { order: "asc" } }),
  ]);

  const steps: SimulatorStepDTO[] = rawSteps.map((s) => ({
    id: s.id,
    order: s.order,
    key: s.key,
    label: s.label,
    helpText: s.helpText,
    fieldType: s.fieldType as FieldType,
    required: s.required,
    options: s.options ? JSON.parse(s.options) : undefined,
    config: s.config ? JSON.parse(s.config) : undefined,
  }));

  return (
    <Section>
      <Container className="max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="font-display text-display-lg">{title}</h1>
          <TricolorAccent className="mx-auto mt-3" />
        </header>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-md sm:p-10">
          {steps.length === 0 ? (
            <p className="text-body-sm text-error">Le simulateur n'est pas configuré (aucune étape).</p>
          ) : (
            <SimulatorWizard steps={steps} />
          )}
        </div>
      </Container>
    </Section>
  );
}
