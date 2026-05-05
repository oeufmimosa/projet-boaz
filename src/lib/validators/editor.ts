import { z } from "zod";

/** Clé content/image — format restreint pour limiter les abus. */
export const contentKeySchema = z
  .string()
  .trim()
  .min(2)
  .max(120)
  .regex(/^[a-z0-9._{}/-]+$/i, "Clé invalide");

export const draftSetSchema = z.object({
  key: contentKeySchema,
  type: z.enum(["content", "image"]).default("content"),
  /** Pour type=content */
  value: z.string().max(50_000).optional(),
  /** Pour type=image — URL d'un MediaAsset uploadé en draft */
  url: z.string().url().optional(),
});

export const publishSchema = z.object({
  /** Si absent, publie tous les drafts */
  keys: z.array(contentKeySchema).optional(),
});
