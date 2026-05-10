import { NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/callback — Demande de rappel par un expert.
 * Tous les champs sont required SAUF email (optionnel).
 *
 * Pour l'instant on log la demande côté serveur. À brancher plus tard sur
 * un mailer (notification interne) ou une table dédiée si besoin.
 */
const callbackSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(6, "Téléphone trop court")
    .max(20, "Téléphone trop long")
    .regex(/^[\d\s+().\-]{6,}$/, "Format de téléphone invalide"),
  lastName: z.string().trim().min(1, "Nom requis").max(100),
  firstName: z.string().trim().min(1, "Prénom requis").max(100),
  // Le client envoie soit un slug standard (chaudiere-gaz-fioul, electricite,
  // pac, bois) soit la valeur libre saisie quand "Autre" est selectionne.
  heating: z
    .string()
    .trim()
    .min(1, "Mode de chauffage requis")
    .max(120, "Mode de chauffage trop long"),
  email: z
    .string()
    .trim()
    .email("Email invalide")
    .max(200)
    .optional()
    .or(z.literal("")),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON invalide" }, { status: 400 });
  }

  const parsed = callbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Données invalides", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { phone, lastName, firstName, heating, email } = parsed.data;

  logger.info(
    {
      phone,
      lastName,
      firstName,
      heating,
      email: email || null,
      ts: new Date().toISOString(),
    },
    "Demande de rappel reçue",
  );

  return NextResponse.json({ ok: true });
}
