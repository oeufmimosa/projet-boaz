import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { REFERRAL_STATUSES, ReferralStatus } from "@/lib/validators/referral";

export const metadata = { title: "Parrainages" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

const STATUS_LABELS: Record<ReferralStatus, string> = {
  PENDING: "En attente",
  CONTACTED: "Contacté",
  ELIGIBLE: "Éligible",
  CONVERTED: "Converti",
  PAID: "Prime versée",
  REJECTED: "Rejeté",
};

const STATUS_COLORS: Record<ReferralStatus, string> = {
  PENDING: "bg-amber-100 text-amber-900",
  CONTACTED: "bg-blue-100 text-blue-900",
  ELIGIBLE: "bg-purple-100 text-purple-900",
  CONVERTED: "bg-emerald-100 text-emerald-900",
  PAID: "bg-primary-700 text-white",
  REJECTED: "bg-zinc-200 text-zinc-700",
};

export default async function ParrainagesListPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string; page?: string };
}) {
  const status = REFERRAL_STATUSES.includes(searchParams.status as ReferralStatus)
    ? (searchParams.status as ReferralStatus)
    : undefined;
  const q = (searchParams.q ?? "").trim();
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { sponsorEmail: { contains: q } },
            { sponsorLastName: { contains: q } },
            { refereeLastName: { contains: q } },
            { refereePostalCode: { contains: q } },
          ],
        }
      : {}),
  };

  const [items, total, counts] = await Promise.all([
    prisma.referral.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.referral.count({ where }),
    prisma.referral.groupBy({ by: ["status"], _count: true }),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const countByStatus = new Map(counts.map((c) => [c.status, c._count]));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Parrainages</h1>
        <span className="text-sm text-text-muted">{total} soumission{total > 1 ? "s" : ""}</span>
        <a
          href="/api/admin/referral/export"
          className="ml-auto text-sm text-primary-700 hover:underline"
        >
          Exporter CSV
        </a>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 border-b border-border pb-3">
        <FilterChip label="Tous" href={buildHref({ q })} active={!status} count={total} />
        {REFERRAL_STATUSES.map((s) => (
          <FilterChip
            key={s}
            label={STATUS_LABELS[s]}
            href={buildHref({ status: s, q })}
            active={status === s}
            count={countByStatus.get(s) ?? 0}
          />
        ))}
      </div>

      <form className="mb-4 flex gap-2" action="/admin/parrainages" method="GET">
        {status && <input type="hidden" name="status" value={status} />}
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Rechercher email, nom, code postal…"
          className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-md bg-primary-700 px-4 py-2 text-sm font-semibold text-white">
          Filtrer
        </button>
      </form>

      {items.length === 0 ? (
        <p className="text-text-muted">Aucun parrainage pour ces critères.</p>
      ) : (
        <table className="w-full overflow-hidden rounded-md border border-border bg-surface text-sm">
          <thead className="bg-surface-2 text-left">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Parrain</th>
              <th className="p-3">Filleul</th>
              <th className="p-3">CP</th>
              <th className="p-3">Projet</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Prime</th>
              <th className="p-3">—</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => {
              const st = r.status as ReferralStatus;
              return (
                <tr key={r.id} className="border-t border-border align-top">
                  <td className="p-3 whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="p-3">
                    <div>{r.sponsorFirstName} {r.sponsorLastName}</div>
                    <div className="text-xs text-text-muted">{r.sponsorEmail}</div>
                  </td>
                  <td className="p-3">
                    <div>{r.refereeFirstName} {r.refereeLastName}</div>
                    <div className="text-xs text-text-muted">
                      {r.refereeEmail || r.refereePhone || "—"}
                    </div>
                  </td>
                  <td className="p-3">{r.refereePostalCode}</td>
                  <td className="p-3 max-w-[140px] truncate text-xs">{r.projectType}</td>
                  <td className="p-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[st]}`}>
                      {STATUS_LABELS[st]}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {r.rewardPaidAt
                      ? `${r.rewardAmount ?? 1000} € ✓`
                      : r.rewardAmount
                      ? `${r.rewardAmount} €`
                      : "—"}
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/parrainages/${r.id}`} className="text-primary-700 hover:underline">
                      voir
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {pages > 1 && (
        <nav className="mt-4 flex items-center gap-2 text-sm" aria-label="Pagination">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildHref({ status, q, page: String(p) })}
              className={`rounded px-3 py-1 ${p === page ? "bg-primary-700 text-white" : "border border-border"}`}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

function FilterChip({
  label,
  href,
  active,
  count,
}: {
  label: string;
  href: string;
  active: boolean;
  count: number;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
        active
          ? "bg-primary-700 text-white"
          : "bg-surface-2 text-text-muted hover:bg-primary-50 hover:text-primary-700"
      }`}
    >
      {label} <span className="ml-1 opacity-70">({count})</span>
    </Link>
  );
}

function buildHref(params: { status?: string; q?: string; page?: string }) {
  const sp = new URLSearchParams();
  if (params.status) sp.set("status", params.status);
  if (params.q) sp.set("q", params.q);
  if (params.page) sp.set("page", params.page);
  const qs = sp.toString();
  return `/admin/parrainages${qs ? `?${qs}` : ""}`;
}
