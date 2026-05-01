export type FieldType =
  | "RADIO"
  | "CHECKBOX"
  | "NUMBER"
  | "TEXT"
  | "EMAIL"
  | "TEL"
  | "SELECT"
  | "TEXTAREA";

export interface SimulatorOption {
  value: string;
  label: string;
  helper?: string;
  illustrationKey?: string;
}

export interface SimulatorStepDTO {
  id: string;
  order: number;
  key: string;
  label: string;
  helpText?: string | null;
  fieldType: FieldType;
  required: boolean;
  options?: SimulatorOption[];
  config?: Record<string, unknown>;
  // Extensions phase 4
  illustrationKey?: string | null;
  encouragement?: string | null;
  helpTooltip?: string | null;
}

export type AnswerValue = string | number | string[] | boolean | null;
export type AnswersMap = Record<string, AnswerValue>;
