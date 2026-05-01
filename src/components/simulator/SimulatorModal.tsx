"use client";

import { useEffect, useState } from "react";
import { SimulatorShell } from "./SimulatorShell";
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

  if (!open) return null;
  if (steps === null) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(10, 42, 26, 0.6)" }}>
        <p className="rounded-md bg-surface px-4 py-3 text-body-sm">Chargement…</p>
      </div>
    );
  }
  return <SimulatorShell open={open} onClose={onClose} steps={steps} />;
}
