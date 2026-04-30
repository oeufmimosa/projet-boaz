"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactInput } from "@/lib/validators/contact";
import { Input, Textarea, FieldWrap } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: ContactInput) => {
    setServerError(null);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setServerError(body?.error ?? "Une erreur est survenue.");
      return;
    }
    reset();
    setDone(true);
  };

  if (done) {
    return (
      <div role="status" className="rounded border border-accent bg-accent/10 p-4 text-sm">
        Merci, votre message a bien été envoyé.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <FieldWrap label="Nom" htmlFor="c-name" required error={errors.name?.message}>
        <Input id="c-name" {...register("name")} autoComplete="name" />
      </FieldWrap>
      <FieldWrap label="Email" htmlFor="c-email" required error={errors.email?.message}>
        <Input id="c-email" type="email" {...register("email")} autoComplete="email" />
      </FieldWrap>
      <FieldWrap label="Téléphone" htmlFor="c-phone" error={errors.phone?.message}>
        <Input id="c-phone" type="tel" {...register("phone")} autoComplete="tel" />
      </FieldWrap>
      <FieldWrap label="Message" htmlFor="c-message" required error={errors.message?.message}>
        <Textarea id="c-message" {...register("message")} />
      </FieldWrap>
      {serverError && <p role="alert" className="text-sm text-red-600">{serverError}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Envoi…" : "Envoyer"}
      </Button>
    </form>
  );
}
