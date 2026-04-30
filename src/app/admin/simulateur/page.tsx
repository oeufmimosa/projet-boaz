import { prisma } from "@/lib/prisma";
import { StepEditor } from "@/components/admin/StepEditor";

export const metadata = { title: "Simulateur (admin)" };
export const dynamic = "force-dynamic";

export default async function AdminSimulatorPage() {
  const steps = await prisma.simulatorStep.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Étapes du simulateur</h1>
      <p className="mb-6 text-sm text-muted-fg">
        Réordonnez en modifiant le champ "ordre", puis enregistrez chaque étape. Les options sont
        en JSON (ex : <code>[{`{"value":"oui","label":"Oui"}`}]</code>).
      </p>
      <StepEditor steps={steps.map((s) => ({
        id: s.id,
        order: s.order,
        key: s.key,
        label: s.label,
        helpText: s.helpText ?? "",
        // fieldType est une string en DB (SQLite); l'éditeur attend l'union TS.
        fieldType: s.fieldType as "RADIO" | "CHECKBOX" | "NUMBER" | "TEXT" | "EMAIL" | "TEL" | "SELECT" | "TEXTAREA",
        required: s.required,
        options: s.options ?? "",
        config: s.config ?? "",
      }))} />
    </div>
  );
}
