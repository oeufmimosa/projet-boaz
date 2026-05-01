"use client";

import { SimulatorStepDTO, AnswerValue } from "@/types/simulator";
import { ChoiceCardGroup } from "./ChoiceCardGroup";
import { RadioField } from "./fields/RadioField";
import { CheckboxField } from "./fields/CheckboxField";
import { NumberField } from "./fields/NumberField";
import { TextField } from "./fields/TextField";
import { SelectField } from "./fields/SelectField";

/**
 * Choisit la représentation visuelle d'une étape :
 *  - RADIO / CHECKBOX avec illustrations sur les options → ChoiceCardGroup
 *  - RADIO / CHECKBOX sans illustration → fallback radio/checkbox compacts
 *  - SELECT, NUMBER, TEXT, EMAIL, TEL, TEXTAREA → champs texte standards
 */
export function StepRenderer({
  step,
  value,
  onChange,
}: {
  step: SimulatorStepDTO;
  value: AnswerValue;
  onChange: (v: AnswerValue) => void;
}) {
  const opts = step.options ?? [];
  const cfg = step.config ?? {};
  const hasIllus = opts.some((o) => Boolean(o.illustrationKey));

  switch (step.fieldType) {
    case "RADIO":
      return hasIllus ? (
        <ChoiceCardGroup
          name={step.key}
          options={opts}
          value={typeof value === "string" ? value : null}
          onChange={(v) => onChange(v as AnswerValue)}
        />
      ) : (
        <RadioField
          name={step.key}
          options={opts}
          value={typeof value === "string" ? value : null}
          onChange={onChange}
        />
      );
    case "CHECKBOX":
      return hasIllus ? (
        <ChoiceCardGroup
          name={step.key}
          options={opts}
          multiple
          value={Array.isArray(value) ? value : []}
          onChange={(v) => onChange(v as AnswerValue)}
        />
      ) : (
        <CheckboxField
          name={step.key}
          options={opts}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
        />
      );
    case "NUMBER":
      return (
        <NumberField
          name={step.key}
          value={typeof value === "number" ? value : null}
          onChange={onChange}
          config={cfg as { min?: number; max?: number; placeholder?: string }}
        />
      );
    case "SELECT":
      return (
        <SelectField
          name={step.key}
          options={opts}
          value={typeof value === "string" ? value : null}
          onChange={onChange}
        />
      );
    case "TEXTAREA":
      return (
        <TextField
          name={step.key}
          multiline
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
          config={cfg as { placeholder?: string }}
        />
      );
    case "EMAIL":
      return (
        <TextField
          name={step.key}
          type="email"
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
          config={cfg as { placeholder?: string }}
        />
      );
    case "TEL":
      return (
        <TextField
          name={step.key}
          type="tel"
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
          config={cfg as { placeholder?: string }}
        />
      );
    case "TEXT":
    default:
      return (
        <TextField
          name={step.key}
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
          config={cfg as { placeholder?: string }}
        />
      );
  }
}
