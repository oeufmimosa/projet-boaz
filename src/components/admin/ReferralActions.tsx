"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/client-csrf";
import { REFERRAL_STATUSES, ReferralStatus } from "@/lib/validators/referral";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select, FieldWrap } from "@/components/ui/Input";

const STATUS_LABELS: Record<ReferralStatus, string> = {
  PENDING: "En attente",
  CONTACTED: "Contacté",
  ELIGIBLE: "Éligible",
  CONVERTED: "Converti",
  PAID: "Prime versée",
  REJECTED: "Rejeté",
};

export function ReferralActions({
  id,
  status,
  rewardAmount,
  rewardPaidAt,
  internalNotes,
  sponsorEmail,
}: {
  id: string;
  status: ReferralStatus;
  rewardAmount: number | null;
  rewardPaidAt: string | null;
  internalNotes: string | null;
  sponsorEmail: string;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState(internalNotes ?? "");
  const [amount, setAmount] = useState<string>(String(rewardAmount ?? 1000));
  const [paidAt, setPaidAt] = useState<string>(rewardPaidAt ? rewardPaidAt.slice(0, 10) : "");
  const [nextStatus, setNextStatus] = useState<ReferralStatus>(status);

  async function call(action: string, payload: Record<string, unknown> = {}) {
    setPending(action);
    setError(null);
    try {
      const res = await adminFetch(`/api/admin/referral/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ action, ...payload }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error ?? "Erreur");
        return;
      }
      startTransition(() => router.refresh());
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="mt-4 grid gap-6 md:grid-cols-2">
      <div className="rounded-md border border-border bg-surface-2 p-4">
        <FieldWrap label="Changer le statut" htmlFor="r-status">
          <Select
            id="r-status"
            value={nextStatus}
            onChange={(e) => setNextStatus(e.target.value as ReferralStatus)}
          >
            {REFERRAL_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </Select>
        </FieldWrap>
        <Button
          type="button"
          className="mt-3 w-full"
          disabled={pending !== null || nextStatus === status}
          onClick={() => call("status", { status: nextStatus })}
        >
          {pending === "status" ? "Mise à jour…" : "Enregistrer le statut"}
        </Button>
      </div>

      <div className="rounded-md border border-border bg-surface-2 p-4">
        <FieldWrap label="Notes internes" htmlFor="r-notes">
          <Textarea id="r-notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </FieldWrap>
        <Button
          type="button"
          variant="outline"
          className="mt-3 w-full"
          disabled={pending !== null}
          onClick={() => call("notes", { notes })}
        >
          {pending === "notes" ? "Enregistrement…" : "Enregistrer les notes"}
        </Button>
      </div>

      <div className="rounded-md border border-accent-500 bg-accent-500/10 p-4 md:col-span-2">
        <h3 className="font-semibold text-primary-800">Marquer la prime versée</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <FieldWrap label="Montant (€)" htmlFor="r-amount">
            <Input id="r-amount" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </FieldWrap>
          <FieldWrap label="Date de versement" htmlFor="r-paid">
            <Input id="r-paid" type="date" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} />
          </FieldWrap>
        </div>
        <Button
          type="button"
          variant="accent"
          className="mt-3"
          disabled={pending !== null || !amount || !paidAt}
          onClick={() => call("pay", { amount: Number(amount), paidAt })}
        >
          {pending === "pay" ? "Enregistrement…" : "Marquer prime versée"}
        </Button>
      </div>

      <div className="md:col-span-2">
        <Button
          type="button"
          variant="ghost"
          disabled={pending !== null}
          onClick={() => call("resend-sponsor")}
          title={`Renvoyer la confirmation à ${sponsorEmail}`}
        >
          {pending === "resend-sponsor" ? "Envoi…" : "Renvoyer email confirmation au parrain"}
        </Button>
      </div>

      {error && (
        <p role="alert" className="md:col-span-2 text-sm text-error">{error}</p>
      )}
    </div>
  );
}
