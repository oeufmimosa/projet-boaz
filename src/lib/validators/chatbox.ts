import { z } from "zod";

export const chatLeadCreateSchema = z.object({
  answers: z.object({
    step1: z.string().optional(),
    step2: z.string().optional(),
    step3: z.string().optional(),
    step4: z.string().optional(),
  }),
  postalCode: z.string().regex(/^\d{5}$/).optional(),
  city: z.string().max(120).optional(),
  completed: z.boolean().default(false),
});
export type ChatLeadCreateInput = z.infer<typeof chatLeadCreateSchema>;

export const chatLeadUpdateSchema = z.object({
  completed: z.boolean().optional(),
  convertedToQuoteId: z.string().optional(),
});
