import { z } from "zod";

export const testimonialSchema = z.object({
  quote:      z.string().trim().min(5).max(500),
  authorName: z.string().trim().min(1).max(80),
  authorCity: z.string().trim().min(1).max(80),
  rating:     z.number().int().min(1).max(5).default(5),
  context:    z.string().trim().max(80).optional().or(z.literal("")),
  active:     z.boolean().default(true),
  order:      z.number().int().min(0).default(0),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
