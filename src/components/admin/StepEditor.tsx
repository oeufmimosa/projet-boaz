"use client";

import { useState } from "react";
import { Input, Textarea, FieldWrap } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { adminFetch } from "@/lib/client-csrf";

type FieldType = "RADIO" | "CHECKBOX" | "NUMBER" | "TEXT" | "EMAIL" | "TEL" | "SELECT" | "TEXTAREA";
interface Step {
  id: string;
  order: number;
  key: string;
  label: string;
  helpText: string;
  fieldType: FieldType;
  required: boolean;
  options: string;
  config: string;
}

const TYPES: FieldType[] = ["RADIO", "CHECKBOX", "NUMBER", "TEXT", "EMAIL", "TEL", "SELECT", "TEXTAREA"];

export function StepEditor({ steps: initial }: { steps: Step[] }) {
  const [steps, setSteps] = useState<Step[]>(initial);
  const [msg, setMsg] = useState<string | null>(null);

  const update = (id: string, patch: Partial<Step>) =>
    setSteps((p) => p.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const save = async (s: Step) => {
    setMsg(null);
    const optionsParsed = s.options ? safeJson(s.options) : undefined;
    const configParsed = s.config ? safeJson(s.config) : undefined;
    if (s.options && optionsParsed === SENTINEL) return setMsg("JSON invalide dans options");
    if (s.config && configParsed === SENTINEL) return setMsg("JSON invalide dans config");

    const res = await adminFetch(`/api/simulator/steps/${s.id}`, {
      method: "PUT",
      body: JSON.stringify({
        order: s.order,
        key: s.key,
        label: s.label,
        helpText: s.helpText || undefined,
        fieldType: s.fieldType,
        required: s.required,
        options: optionsParsed,
        config: configParsed,
      }),
    });
    setMsg(res.ok ? `Enregistré : ${s.key}` : "Erreur");
  };

  const remove = async (s: Step) => {
    if (!confirm(`Supprimer l'étape "${s.key}" ?`)) return;
    const res = await adminFetch(`/api/simulator/steps/${s.id}`, { method: "DELETE" });
    if (res.ok) setSteps((p) => p.filter((x) => x.id !== s.id));
  };

  const addStep = async () => {
    const order = steps.length > 0 ? Math.max(...steps.map((s) => s.order)) + 1 : 1;
    const key = `nouvelle_etape_${order}`;
    const res = await adminFetch("/api/simulator/steps", {
      method: "POST",
      body: JSON.stringify({
        order, key, label: "Nouvelle étape", fieldType: "TEXT", required: true,
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok) setSteps((p) => [...p, {
      id: body.data.id, order, key, label: "Nouvelle étape", helpText: "", fieldType: "TEXT", required: true, options: "", config: "",
    }]);
  };

  return (
    <div className="space-y-4">
      {msg && <p className="text-sm text-accent-500">{msg}</p>}
      <ul className="space-y-3">
        {steps.sort((a, b) => a.order - b.order).map((s) => (
          <li key={s.id} className="rounded-md border border-border bg-surface p-4">
            <div className="grid gap-3 md:grid-cols-4">
              <FieldWrap label="Ordre" htmlFor={`order-${s.id}`}>
                <Input id={`order-${s.id}`} type="number" value={s.order}
                  onChange={(e) => update(s.id, { order: Number(e.target.value) })} />
              </FieldWrap>
              <FieldWrap label="Clé" htmlFor={`key-${s.id}`}>
                <Input id={`key-${s.id}`} value={s.key} onChange={(e) => update(s.id, { key: e.target.value })} />
              </FieldWrap>
              <FieldWrap label="Type" htmlFor={`type-${s.id}`}>
                <select id={`type-${s.id}`} value={s.fieldType}
                  onChange={(e) => update(s.id, { fieldType: e.target.value as FieldType })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2">
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </FieldWrap>
              <FieldWrap label="Requis" htmlFor={`req-${s.id}`}>
                <input id={`req-${s.id}`} type="checkbox" checked={s.required}
                  onChange={(e) => update(s.id, { required: e.target.checked })}
                  className="mt-3 h-5 w-5" />
              </FieldWrap>
            </div>
            <div className="mt-3">
              <FieldWrap label="Libellé" htmlFor={`label-${s.id}`}>
                <Input id={`label-${s.id}`} value={s.label} onChange={(e) => update(s.id, { label: e.target.value })} />
              </FieldWrap>
            </div>
            <div className="mt-3">
              <FieldWrap label="Texte d'aide" htmlFor={`help-${s.id}`}>
                <Input id={`help-${s.id}`} value={s.helpText} onChange={(e) => update(s.id, { helpText: e.target.value })} />
              </FieldWrap>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <FieldWrap label="Options (JSON)" htmlFor={`opts-${s.id}`}>
                <Textarea id={`opts-${s.id}`} value={s.options}
                  onChange={(e) => update(s.id, { options: e.target.value })}
                  placeholder='[{"value":"x","label":"X"}]' />
              </FieldWrap>
              <FieldWrap label="Config (JSON)" htmlFor={`cfg-${s.id}`}>
                <Textarea id={`cfg-${s.id}`} value={s.config}
                  onChange={(e) => update(s.id, { config: e.target.value })}
                  placeholder='{"min":1,"max":100}' />
              </FieldWrap>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <Button size="sm" variant="danger" onClick={() => remove(s)}>Supprimer</Button>
              <Button size="sm" onClick={() => save(s)}>Enregistrer</Button>
            </div>
          </li>
        ))}
      </ul>
      <Button variant="outline" onClick={addStep}>+ Ajouter une étape</Button>
    </div>
  );
}

const SENTINEL = Symbol("invalid-json");
function safeJson(text: string): unknown {
  try { return JSON.parse(text); } catch { return SENTINEL; }
}
