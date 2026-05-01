"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Illustration } from "@/components/illustrations/Illustration";
import { SelectMark } from "@/components/simulator/SelectMark";
import { ChoiceCard } from "@/components/simulator/ChoiceCard";

/**
 * Section de styleguide démo pour la nouvelle direction du simulateur :
 * 3 illustrations témoins, SelectMark dans ses deux états, ChoiceCard
 * interactive (single + multi-select) pour valider l'approche visuelle.
 */
export function SimulatorPreview() {
  const [logement, setLogement] = useState<"house" | "apartment">("house");
  const [travaux, setTravaux] = useState<string[]>(["heat-pump-air-water"]);

  const toggleTravaux = (v: string) => {
    setTravaux((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
    );
  };

  return (
    <>
      <h3 className="font-display text-display-sm mb-4">Illustrations témoins</h3>
      <Card className="mb-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { key: "house",              label: "house" },
            { key: "apartment",          label: "apartment" },
            { key: "heat-pump-air-water",label: "heat-pump-air-water" },
          ].map((it) => (
            <div key={it.key} className="text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-md bg-surface-2">
                <Illustration name={it.key} size="md" />
              </div>
              <p className="mt-2 font-mono text-[0.7rem] text-text-muted">{it.label}</p>
            </div>
          ))}
        </div>
      </Card>

      <h3 className="font-display text-display-sm mb-4">SelectMark hexagonal</h3>
      <Card className="mb-8">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <SelectMark checked={false} size={32} />
            <p className="mt-2 text-body-sm text-text-muted">unchecked</p>
          </div>
          <div className="text-center">
            <SelectMark checked size={32} />
            <p className="mt-2 text-body-sm text-text-muted">checked</p>
          </div>
        </div>
      </Card>

      <h3 className="font-display text-display-sm mb-4">ChoiceCard — sélection unique</h3>
      <Card className="mb-8">
        <p className="mb-4 text-body-sm text-text-muted">
          Cliquer pour basculer. Anim de bounce sur l'illustration sélectionnée.
        </p>
        <div role="radiogroup" className="grid gap-4 sm:grid-cols-2">
          <ChoiceCard
            label="Maison"
            helper="Le plus courant"
            illustrationKey="house"
            value="house"
            selected={logement === "house"}
            onSelect={() => setLogement("house")}
          />
          <ChoiceCard
            label="Appartement"
            illustrationKey="apartment"
            value="apartment"
            selected={logement === "apartment"}
            onSelect={() => setLogement("apartment")}
          />
        </div>
      </Card>

      <h3 className="font-display text-display-sm mb-4">ChoiceCard — multi-sélection</h3>
      <Card className="mb-8">
        <p className="mb-4 text-body-sm text-text-muted">
          {travaux.length} sélectionné{travaux.length > 1 ? "s" : ""}.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <ChoiceCard
            multiple
            label="Pompe à chaleur"
            illustrationKey="heat-pump-air-water"
            value="heat-pump-air-water"
            selected={travaux.includes("heat-pump-air-water")}
            onSelect={() => toggleTravaux("heat-pump-air-water")}
          />
          <ChoiceCard
            multiple
            label="Maison"
            illustrationKey="house"
            value="house"
            selected={travaux.includes("house")}
            onSelect={() => toggleTravaux("house")}
          />
          <ChoiceCard
            multiple
            label="Appartement"
            illustrationKey="apartment"
            value="apartment"
            selected={travaux.includes("apartment")}
            onSelect={() => toggleTravaux("apartment")}
          />
        </div>
      </Card>

      <h3 className="font-display text-display-sm mb-4">ChoiceCard — désactivée</h3>
      <Card>
        <div className="grid gap-4 sm:grid-cols-2 max-w-md">
          <ChoiceCard
            label="Indisponible"
            illustrationKey="house"
            value="x"
            selected={false}
            disabled
            onSelect={() => {}}
          />
          <ChoiceCard
            label="Bientôt"
            helper="Coming soon"
            illustrationKey="apartment"
            value="y"
            selected={false}
            disabled
            onSelect={() => {}}
          />
        </div>
      </Card>
    </>
  );
}
