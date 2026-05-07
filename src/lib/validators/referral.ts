import { z } from "zod";

export const REFERRAL_PROJECT_SLUGS = [
  "pompe-a-chaleur-air-eau",
  "pompe-a-chaleur-air-air",
  "isolation-thermique-exterieure",
  "ballon-thermodynamique",
  "systeme-solaire-combine",
  "autre",
] as const;

export const REFERRAL_STATUSES = [
  "PENDING",
  "CONTACTED",
  "ELIGIBLE",
  "CONVERTED",
  "PAID",
  "REJECTED",
] as const;

export type ReferralStatus = (typeof REFERRAL_STATUSES)[number];

const optionalEmail = z.string().trim().email("Email invalide").max(200).optional().or(z.literal(""));
const optionalPhone = z
  .string()
  .trim()
  .max(30)
  .regex(/^[\d\s+().-]*$/, "Numéro invalide")
  .optional()
  .or(z.literal(""));

export const referralSchema = z
  .object({
    sponsorTitle: z.enum(["M.", "Mme"]).optional().or(z.literal("")),
    sponsorLastName: z.string().trim().min(2, "Nom trop court").max(100),
    sponsorFirstName: z.string().trim().min(2, "Prénom trop court").max(100),
    sponsorEmail: z.string().trim().email("Email invalide").max(200),
    sponsorPhone: optionalPhone,

    refereeFirstName: z.string().trim().min(2, "Prénom trop court").max(100),
    refereeLastName: z.string().trim().min(2, "Nom trop court").max(100),
    refereeEmail: optionalEmail,
    refereePhone: optionalPhone,
    refereePostalCode: z.string().trim().regex(/^\d{5}$/, "Code postal sur 5 chiffres"),
    projectType: z.enum(REFERRAL_PROJECT_SLUGS),
    message: z.string().trim().max(2000).optional().or(z.literal("")),

    consentGiven: z.literal(true, {
      errorMap: () => ({ message: "Le consentement du filleul est requis." }),
    }),
  })
  .refine(
    (d) => Boolean(d.refereeEmail && d.refereeEmail.length > 0) || Boolean(d.refereePhone && d.refereePhone.length > 0),
    {
      message: "Au moins un moyen de contact (email ou téléphone) est nécessaire pour le filleul.",
      path: ["refereePhone"],
    },
  );

export type ReferralInput = z.infer<typeof referralSchema>;
