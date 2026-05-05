"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { referralSchema, ReferralInput, REFERRAL_PROJECT_SLUGS } from "@/lib/validators/referral";
import { Input, Textarea, Select, FieldWrap } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const PROJECT_LABELS: Record<typeof REFERRAL_PROJECT_SLUGS[number], string> = {
  "panneau-photovoltaique": "Panneau photovoltaïque",
  "isolation-thermique-exterieure": "Isolation thermique extérieure (ITE)",
  "chauffe-eau-solaire-individuel": "Chauffe-eau solaire individuel (CESI)",
  "ballon-thermodynamique": "Ballon thermodynamique",
  "systeme-solaire-combine": "Système solaire combiné (SSC)",
  "pompe-a-chaleur": "Pompe à chaleur (Air-Eau / Air-Air)",
  autre: "Autre / Plusieurs travaux",
};

export function ReferralForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReferralInput>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      sponsorTitle: "",
      sponsorPhone: "",
      refereeEmail: "",
      refereePhone: "",
      message: "",
    } as Partial<ReferralInput> as ReferralInput,
  });
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: ReferralInput) => {
    setServerError(null);
    const res = await fetch("/api/referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setServerError(body?.error ?? "Une erreur est survenue.");
      return;
    }
    router.push("/parrainage/merci");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      {/* Deux colonnes côte-à-côte (md+) : parrain à gauche, filleul à droite.
          Stack vertical sur mobile. */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Colonne PARRAIN */}
        <fieldset className="flex flex-col gap-4">
          <legend className="font-display text-lg font-semibold text-primary-700">
            Vos informations (parrain)
          </legend>

          <FieldWrap label="Civilité" htmlFor="r-title">
            <Select id="r-title" {...register("sponsorTitle")}>
              <option value="">—</option>
              <option value="Mme">Mme</option>
              <option value="M.">M.</option>
            </Select>
          </FieldWrap>

          <FieldWrap label="Prénom" htmlFor="r-sponsor-first" required error={errors.sponsorFirstName?.message}>
            <Input id="r-sponsor-first" {...register("sponsorFirstName")} autoComplete="given-name" />
          </FieldWrap>
          <FieldWrap label="Nom" htmlFor="r-sponsor-last" required error={errors.sponsorLastName?.message}>
            <Input id="r-sponsor-last" {...register("sponsorLastName")} autoComplete="family-name" />
          </FieldWrap>

          <FieldWrap label="Email" htmlFor="r-sponsor-email" required error={errors.sponsorEmail?.message}>
            <Input id="r-sponsor-email" type="email" {...register("sponsorEmail")} autoComplete="email" />
          </FieldWrap>

          <FieldWrap label="Téléphone (optionnel)" htmlFor="r-sponsor-phone" error={errors.sponsorPhone?.message}>
            <Input id="r-sponsor-phone" type="tel" {...register("sponsorPhone")} autoComplete="tel" />
          </FieldWrap>
        </fieldset>

        {/* Colonne FILLEUL */}
        <fieldset className="flex flex-col gap-4">
          <legend className="font-display text-lg font-semibold text-primary-700">
            Informations du filleul
          </legend>

          <FieldWrap label="Prénom" htmlFor="r-referee-first" required error={errors.refereeFirstName?.message}>
            <Input id="r-referee-first" {...register("refereeFirstName")} />
          </FieldWrap>
          <FieldWrap label="Nom" htmlFor="r-referee-last" required error={errors.refereeLastName?.message}>
            <Input id="r-referee-last" {...register("refereeLastName")} />
          </FieldWrap>

          <FieldWrap
            label="Email"
            htmlFor="r-referee-email"
            hint="Au moins un moyen de contact (email ou téléphone) est nécessaire."
            error={errors.refereeEmail?.message}
          >
            <Input id="r-referee-email" type="email" {...register("refereeEmail")} />
          </FieldWrap>

          <FieldWrap label="Téléphone" htmlFor="r-referee-phone" error={errors.refereePhone?.message}>
            <Input id="r-referee-phone" type="tel" {...register("refereePhone")} />
          </FieldWrap>

          <FieldWrap label="Code postal" htmlFor="r-referee-cp" required error={errors.refereePostalCode?.message}>
            <Input id="r-referee-cp" inputMode="numeric" maxLength={5} {...register("refereePostalCode")} />
          </FieldWrap>
        </fieldset>
      </div>

      {/* Bloc bas full-width : projet, message, consentement, soumission */}
      <div className="flex flex-col gap-4 border-t border-border pt-6">
        <FieldWrap label="Type de projet" htmlFor="r-project" required error={errors.projectType?.message}>
          <Select id="r-project" {...register("projectType")} defaultValue="">
            <option value="" disabled>Choisir un service —</option>
            {REFERRAL_PROJECT_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {PROJECT_LABELS[slug]}
              </option>
            ))}
          </Select>
        </FieldWrap>

        <FieldWrap
          label="Message (optionnel)"
          htmlFor="r-message"
          hint="Précisez le contexte du projet de votre filleul si vous le souhaitez."
          error={errors.message?.message}
        >
          <Textarea id="r-message" rows={4} {...register("message")} />
        </FieldWrap>

        <label className="flex gap-3 rounded-md border border-border bg-surface-2 p-4 text-body-sm">
          <input
            type="checkbox"
            {...register("consentGiven")}
            className="mt-1 h-4 w-4 accent-primary-600"
          />
          <span>
            Je confirme avoir l'accord de mon filleul pour transmettre ses coordonnées à
            {" "}<strong>Groupe Climat Hexagone</strong>.
          </span>
        </label>
        {errors.consentGiven && (
          <p role="alert" className="-mt-3 text-body-sm text-error">
            {errors.consentGiven.message}
          </p>
        )}

        {serverError && (
          <p role="alert" className="text-body-sm text-error">{serverError}</p>
        )}

        <Button type="submit" variant="accent" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours…" : "Soumettre le parrainage"}
        </Button>
      </div>
    </form>
  );
}
