"use client";

import { Input, FieldWrap } from "@/components/ui/Input";

export interface ContactInfo {
  civility: "mr" | "mme" | "autre";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  consent: boolean;
}

export function ContactStep({
  value,
  onChange,
  errors,
}: {
  value: ContactInfo;
  onChange: (v: ContactInfo) => void;
  errors: Partial<Record<keyof ContactInfo, string>>;
}) {
  const upd = <K extends keyof ContactInfo>(k: K, v: ContactInfo[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FieldWrap label="Civilité" htmlFor="civility" required error={errors.civility}>
        <select
          id="civility"
          value={value.civility}
          onChange={(e) => upd("civility", e.target.value as ContactInfo["civility"])}
          className="w-full rounded-md border border-border bg-surface px-3 py-2"
        >
          <option value="mr">M.</option>
          <option value="mme">Mme</option>
          <option value="autre">Autre</option>
        </select>
      </FieldWrap>
      <div className="hidden sm:block" />

      <FieldWrap label="Prénom" htmlFor="firstName" required error={errors.firstName}>
        <Input id="firstName" autoComplete="given-name" value={value.firstName}
          onChange={(e) => upd("firstName", e.target.value)} />
      </FieldWrap>
      <FieldWrap label="Nom" htmlFor="lastName" required error={errors.lastName}>
        <Input id="lastName" autoComplete="family-name" value={value.lastName}
          onChange={(e) => upd("lastName", e.target.value)} />
      </FieldWrap>

      <FieldWrap label="Email" htmlFor="email" required error={errors.email}>
        <Input id="email" type="email" autoComplete="email" value={value.email}
          onChange={(e) => upd("email", e.target.value)} />
      </FieldWrap>
      <FieldWrap label="Téléphone" htmlFor="phone" required error={errors.phone}>
        <Input id="phone" type="tel" autoComplete="tel" value={value.phone}
          onChange={(e) => upd("phone", e.target.value)} />
      </FieldWrap>

      <div className="mt-6 sm:col-span-2">
        <label className="flex items-start gap-3 text-xs">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0"
            checked={value.consent}
            onChange={(e) => upd("consent", e.target.checked)}
          />
          <span className="space-y-2">
            <span className="block">
              En soumettant ce formulaire, vous acceptez d&apos;être recontacté(e) dans le cadre
              de votre demande d&apos;étude énergétique et d&apos;estimation des aides disponibles.
            </span>
            <span className="block text-text-muted">
              Les informations renseignées restent confidentielles et sont utilisées uniquement
              pour le traitement de votre demande, conformément à notre{" "}
              <a href="/confidentialite" className="text-primary underline">politique de confidentialité</a>{" "}
              et à la réglementation RGPD en vigueur.
            </span>
            <span className="block text-text-muted">
              Les simulations et estimations communiquées sont fournies à titre indicatif et
              restent soumises aux critères d&apos;éligibilité des dispositifs en vigueur.
            </span>
          </span>
        </label>
        {errors.consent && <p className="mt-1 text-sm text-red-600">{errors.consent}</p>}
      </div>
    </div>
  );
}
