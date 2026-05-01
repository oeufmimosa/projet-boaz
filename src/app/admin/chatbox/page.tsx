import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ChatboxEditor } from "@/components/admin/ChatboxEditor";

export const metadata = { title: "Chatbox (admin)" };
export const dynamic = "force-dynamic";

const KEYS = [
  "chatbox.advisor.name",
  "chatbox.advisor.initials",
  "chatbox.preview",
  "chatbox.autoopen.enabled",
  "chatbox.autoopen.delay_seconds",
  "chatbox.step1.message",
  "chatbox.step1.followup",
  "chatbox.step1.options",
  "chatbox.step2.message",
  "chatbox.step2.options",
  "chatbox.step3.message",
  "chatbox.step3.options",
  "chatbox.step4.message",
  "chatbox.handoff.message",
  "chatbox.handoff.cta",
  "chatbox.handoff.later",
  "chatbox.resume",
];

export default async function AdminChatboxPage() {
  const rows = await prisma.content.findMany({
    where: { key: { in: KEYS } },
    orderBy: { key: "asc" },
  });
  const items = rows.map((r) => ({
    id: r.id,
    key: r.key,
    value: r.value,
    type: r.type as "TEXT" | "RICHTEXT" | "JSON" | "IMAGE_REF",
  }));

  const [completedCount, totalCount, convertedCount] = await Promise.all([
    prisma.chatLead.count({ where: { completed: true } }),
    prisma.chatLead.count(),
    prisma.chatLead.count({ where: { convertedToQuoteId: { not: null } } }),
  ]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-bold">Chatbox</h1>
        <Link href="/admin/chatbox/leads" className="text-body-sm text-primary-700 hover:underline">
          Voir les leads ({totalCount}) →
        </Link>
      </div>

      <ul className="mb-8 grid gap-3 sm:grid-cols-3">
        <Stat label="Conversations" value={totalCount} />
        <Stat label="Complétées" value={completedCount} />
        <Stat label="Converties en simulation" value={convertedCount} />
      </ul>

      <p className="mb-6 text-body-sm text-text-muted">
        Modifiez ici le nom du conseiller, les messages d'accueil, les options
        de chaque étape (JSON) et l'ouverture automatique. Les changements
        sont propagés au prochain chargement de page.
      </p>

      <ChatboxEditor items={items} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <li className="rounded-md border border-border bg-surface p-4">
      <p className="text-body-sm text-text-muted">{label}</p>
      <p className="mt-1 font-display text-display-sm">{value}</p>
    </li>
  );
}
