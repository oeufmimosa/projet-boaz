import { z } from "zod";

export const contentUpsertSchema = z.object({
  key: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9._-]+$/i, "Clé invalide (a-z, 0-9, point, tiret, underscore)"),
  value: z.string().max(50_000),
  type: z.enum(["TEXT", "RICHTEXT", "JSON", "IMAGE_REF"]).default("TEXT"),
});

export type ContentUpsertInput = z.infer<typeof contentUpsertSchema>;

export const articleSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug invalide (a-z, 0-9, tirets)"),
  title: z.string().trim().min(2).max(200),
  excerpt: z.string().max(500).optional().or(z.literal("")),
  content: z.string().max(50_000),
  coverImage: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(false),
});

export type ArticleInput = z.infer<typeof articleSchema>;

export const simulatorStepSchema = z.object({
  key: z.string().trim().regex(/^[a-z0-9_]+$/, "Clé invalide").min(2).max(60),
  label: z.string().trim().min(2).max(200),
  helpText: z.string().max(500).optional().or(z.literal("")),
  fieldType: z.enum(["RADIO", "CHECKBOX", "NUMBER", "TEXT", "EMAIL", "TEL", "SELECT", "TEXTAREA"]),
  required: z.boolean(),
  order: z.number().int().min(1),
  options: z
    .array(z.object({ value: z.string().min(1), label: z.string().min(1) }))
    .optional(),
  config: z.record(z.string(), z.unknown()).optional(),
});

export type SimulatorStepInput = z.infer<typeof simulatorStepSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(1).max(200),
});
export type LoginInput = z.infer<typeof loginSchema>;
