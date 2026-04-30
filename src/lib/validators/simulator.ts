import { z } from "zod";

/**
 * Server-side schema for /api/simulator/submit. The wizard collects free-form
 * answers keyed by SimulatorStep.key plus a "coordonnees" composite step.
 * We validate that contact fields are present and well-formed; everything
 * else is stored as-is in `answers` (JSON).
 */
export const quoteSubmissionSchema = z.object({
  answers: z.record(z.string(), z.union([z.string(), z.number(), z.array(z.string()), z.boolean(), z.null()])),
  civility: z.enum(["mr", "mme", "autre"]).optional(),
  firstName: z.string().trim().min(1, "Prénom requis").max(80),
  lastName: z.string().trim().min(1, "Nom requis").max(80),
  email: z.string().trim().email("Email invalide").max(200),
  phone: z
    .string()
    .trim()
    .min(6, "Téléphone requis")
    .max(30)
    .regex(/^[\d\s+().-]+$/, "Numéro invalide"),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Code postal invalide"),
  city: z.string().trim().min(1, "Ville requise").max(100),
  consent: z.literal(true, { errorMap: () => ({ message: "Consentement requis" }) }),
});

export type QuoteSubmissionInput = z.infer<typeof quoteSubmissionSchema>;
