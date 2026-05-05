import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { REFERRAL_STATUSES, ReferralStatus } from "@/lib/validators/referral";
import { ReferralActions } from "@/components/admin/ReferralActions";

export const metadata = { title: "Détail parrainage" };
export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<ReferralStatus, string> = {
  PENDING: "En attente",
  CONTACTED: "Contacté",
  ELIGIBLE: "Éligible",
  CONVERTED: "Converti",
  PAID: "Prime versée",
  REJECTED: "Rejeté",
};

export default async function ReferralDetailPage({ params }: { params: { id: string } }) {
  const r = await prisma.referral.findUnique({ where: { id: params.id } });
  if (!r) notFound();

  return (
    <div className="max-w-4xl">
      <Link href="/admin/parrainages" className="text-sm text-primary-700 hover:underline">
        ← Retour à la liste
      </Link>
      <h1 className="mt-3 text-2xl font-bold">Parrainage #{r.id.slice(-6)}</h1>
      <p className="mt-1 text-sm text-text-muted">
        Reçu le {new Date(r.createdAt).toLocaleString("fr-FR")} • IP {r.ipAddress ?? "—"}
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-md border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold text-primary-800">Parrain</h2>
          <ul className="mt-3 space-y-1 text-sm">
            <li><strong>Civilité :</strong> {r.sponsorTitle ?? "—"}</li>
            <li><strong>Nom :</strong> {r.sponsorFirstName} {r.sponsorLastName}</li>
            <li><strong>Email :</strong> <a className="text-primary-700 underline" href={`mailto:${r.sponsorEmail}`}>{r.sponsorEmail}</a></li>
            <li><strong>Téléphone :</strong> {r.sponsorPhone ?? "—"}</li>
          </ul>
          <p className="mt-3 text-xs text-text-muted">
            Email confirmation : {r.sponsorEmailSent ? "✓ envoyé" : "✗ non envoyé"}
          </p>
        </section>

        <section className="rounded-md border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold text-primary-800">Filleul</h2>
          <ul className="mt-3 space-y-1 text-sm">
            <li><strong>Nom :</strong> {r.refereeFirstName} {r.refereeLastName}</li>
            <li><strong>Email :</strong> {r.refereeEmail ? <a className="text-primary-700 underline" href={`mailto:${r.refereeEmail}`}>{r.refereeEmail}</a> : "—"}</li>
            <li><strong>Téléphone :</strong> {r.refereePhone ?? "—"}</li>
            <li><strong>Code postal :</strong> {r.refereePostalCode}</li>
            <li><strong>Projet :</strong> {r.projectType}</li>
          </ul>
          <p className="mt-3 text-xs text-text-muted">
            Email introduction : {r.refereeEmailSent ? "✓ envoyé" : r.refereeEmail ? "✗ non envoyé" : "— pas d'email"}
          </p>
        </section>
      </div>

      {r.message && (
        <section className="mt-6 rounded-md border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold text-primary-800">Message du parrain</h2>
          <pre className="mt-3 whitespace-pre-wrap rounded bg-surface-2 p-3 text-sm">{r.message}</pre>
        </section>
      )}

      <section className="mt-6 rounded-md border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-semibold text-primary-800">Consentement RGPD</h2>
        <p className="mt-2 text-sm">
          {r.consentGiven ? "✓ Accord du filleul confirmé" : "✗ Pas de consentement"}
          {" "}— le {new Date(r.consentTimestamp).toLocaleString("fr-FR")}
        </p>
      </section>

      <section className="mt-6 rounded-md border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-semibold text-primary-800">Workflow</h2>
        <p className="mt-2 text-sm">
          Statut actuel : <strong>{STATUS_LABELS[r.status as ReferralStatus]}</strong>
        </p>
        {r.rewardPaidAt && (
          <p className="text-sm text-emerald-700">
            Prime de {r.rewardAmount ?? 1000} € versée le {new Date(r.rewardPaidAt).toLocaleDateString("fr-FR")}
          </p>
        )}
        <ReferralActions
          id={r.id}
          status={r.status as ReferralStatus}
          rewardAmount={r.rewardAmount}
          rewardPaidAt={r.rewardPaidAt ? r.rewardPaidAt.toISOString() : null}
          internalNotes={r.internalNotes}
          sponsorEmail={r.sponsorEmail}
        />
      </section>

      {r.emailErrors && (
        <section className="mt-6 rounded-md border border-amber-300 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-900">Erreurs email</h2>
          <pre className="mt-2 whitespace-pre-wrap text-xs text-amber-900">{r.emailErrors}</pre>
        </section>
      )}
    </div>
  );
}
