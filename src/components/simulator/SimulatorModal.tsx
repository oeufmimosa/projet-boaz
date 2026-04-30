"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { SimulatorWizard } from "./SimulatorWizard";
import { SimulatorStepDTO } from "@/types/simulator";

export function SimulatorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [steps, setSteps] = useState<SimulatorStepDTO[] | null>(null);

  useEffect(() => {
    if (!open || steps) return;
    fetch("/api/simulator/steps")
      .then((r) => r.json())
      .then((b) => setSteps(b.data ?? []))
      .catch(() => setSteps([]));
  }, [open, steps]);

  return (
    <Modal open={open} onClose={onClose} title="Simulateur">
      <div className="p-6">
        {steps == null ? (
          <p className="text-sm text-muted-fg">Chargement…</p>
        ) : steps.length === 0 ? (
          <p className="text-sm text-red-600">Le simulateur n'est pas configuré.</p>
        ) : (
          <SimulatorWizard steps={steps} onSubmitted={onClose} />
        )}
      </div>
    </Modal>
  );
}
