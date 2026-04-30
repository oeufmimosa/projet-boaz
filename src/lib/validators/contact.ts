import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(100),
  email: z.string().trim().email("Email invalide").max(200),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[\d\s+().-]*$/, "Numéro invalide")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(10, "Message trop court").max(5000),
});

export type ContactInput = z.infer<typeof contactSchema>;
