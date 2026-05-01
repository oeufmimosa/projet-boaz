import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Détail soumission" };
export const dynamic = "force-dynamic";

export default async function SubmissionDetail({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { type?: string };
}) {
  const type = searchParams.type === "contact" ? "contact" : "quote";

  if (type === "quote") {
    const q = await prisma.quote.findUnique({ where: { id: params.id } });
    if (!q) notFound();
    let answers: Record<string, unknown> = {};
    try { answers = JSON.parse(q.answers); } catch {}

    return (
      <div>
        <Link href="/admin/soumissions" className="text-sm text-primary">← Retour</Link>
        <h1 className="mt-3 text-2xl font-bold">Simulation #{q.id}</h1>
        <p className="mt-1 text-sm text-text-muted">{new Date(q.createdAt).toLocaleString("fr-FR")}</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-md border border-border bg-surface p-4">
            <h2 className="font-semibold">Coordonnées</h2>
            <ul className="mt-3 space-y-1 text-sm">
              <li><strong>Nom :</strong> {q.firstName} {q.lastName}</li>
              <li><strong>Email :</strong> {q.email}</li>
              <li><strong>Téléphone :</strong> {q.phone}</li>
              <li><strong>CP / Ville :</strong> {q.postalCode} {q.city}</li>
              <li><strong>Email envoyé :</strong> {q.emailSent ? "oui" : "non"}{q.emailError ? ` (${q.emailError})` : ""}</li>
            </ul>
          </div>
          <div className="rounded-md border border-border bg-surface p-4">
            <h2 className="font-semibold">Réponses</h2>
            <dl className="mt-3 divide-y divide-border text-sm">
              {Object.entries(answers).map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 gap-2 py-2">
                  <dt className="text-text-muted">{k}</dt>
                  <dd className="col-span-2">{Array.isArray(v) ? v.join(", ") : String(v ?? "")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    );
  }

  const m = await prisma.contactMessage.findUnique({ where: { id: params.id } });
  if (!m) notFound();
  return (
    <div>
      <Link href="/admin/soumissions?tab=contact" className="text-sm text-primary">← Retour</Link>
      <h1 className="mt-3 text-2xl font-bold">Message #{m.id}</h1>
      <p className="mt-1 text-sm text-text-muted">{new Date(m.createdAt).toLocaleString("fr-FR")}</p>
      <div className="mt-6 rounded-md border border-border bg-surface p-4">
        <ul className="space-y-1 text-sm">
          <li><strong>Nom :</strong> {m.name}</li>
          <li><strong>Email :</strong> {m.email}</li>
          <li><strong>Téléphone :</strong> {m.phone}</li>
          <li><strong>Email envoyé :</strong> {m.emailSent ? "oui" : "non"}{m.emailError ? ` (${m.emailError})` : ""}</li>
        </ul>
        <pre className="mt-4 whitespace-pre-wrap rounded bg-surface-2 p-3 text-sm">{m.message}</pre>
      </div>
    </div>
  );
}
