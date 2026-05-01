import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Lead chatbox" };
export const dynamic = "force-dynamic";

export default async function ChatLeadDetail({ params }: { params: { id: string } }) {
  const lead = await prisma.chatLead.findUnique({ where: { id: params.id } });
  if (!lead) notFound();
  const answers = safeParse(lead.answers);

  return (
    <div>
      <Link href="/admin/chatbox/leads" className="text-body-sm text-primary-700">← Retour</Link>
      <h1 className="mt-3 text-2xl font-bold">Lead #{lead.id}</h1>
      <p className="mt-1 text-body-sm text-text-muted">
        {new Date(lead.createdAt).toLocaleString("fr-FR")}
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-md border border-border bg-surface p-4">
          <h2 className="font-semibold">Conversation</h2>
          <ul className="mt-3 space-y-2 text-body-sm">
            <li><strong>Projet :</strong> {answers.step1 ?? "—"}</li>
            <li><strong>Logement :</strong> {answers.step2 ?? "—"}</li>
            <li><strong>Statut :</strong> {answers.step3 ?? "—"}</li>
            <li><strong>Code postal :</strong> {lead.postalCode ?? answers.step4 ?? "—"}</li>
            <li><strong>Ville :</strong> {lead.city ?? "—"}</li>
          </ul>
        </div>
        <div className="rounded-md border border-border bg-surface p-4">
          <h2 className="font-semibold">État</h2>
          <ul className="mt-3 space-y-2 text-body-sm">
            <li><strong>Statut :</strong> {lead.completed ? "Complété (handoff)" : "Abandonné"}</li>
            <li>
              <strong>Converti en simulation :</strong>{" "}
              {lead.convertedToQuoteId ? (
                <Link className="text-primary-700" href={`/admin/soumissions/${lead.convertedToQuoteId}?type=quote`}>
                  Quote #{lead.convertedToQuoteId}
                </Link>
              ) : "—"}
            </li>
            <li><strong>Mis à jour :</strong> {new Date(lead.updatedAt).toLocaleString("fr-FR")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function safeParse(s: string): Record<string, string> {
  try { return JSON.parse(s); } catch { return {}; }
}
