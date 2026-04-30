"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui/cn";

const ITEMS = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/contenus", label: "Contenus" },
  { href: "/admin/images", label: "Images" },
  { href: "/admin/simulateur", label: "Simulateur" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/soumissions", label: "Soumissions" },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  return (
    <aside className="w-full md:w-60 md:shrink-0 border-b md:border-b-0 md:border-r border-border bg-muted/30 p-4">
      <div className="mb-6">
        <Link href="/" className="text-sm font-bold">← Voir le site</Link>
        <p className="mt-2 text-xs text-muted-fg break-all">{email}</p>
      </div>
      <nav aria-label="Navigation admin" className="flex md:flex-col gap-1 overflow-x-auto">
        {ITEMS.map((it) => {
          const active = pathname === it.href || (it.href !== "/admin" && pathname.startsWith(it.href));
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "rounded px-3 py-2 text-sm whitespace-nowrap",
                active ? "bg-primary text-primary-fg" : "hover:bg-muted",
              )}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>
      <form action="/api/auth/logout" method="POST" className="mt-6">
        <button type="submit" className="text-sm text-muted-fg hover:text-red-600">
          Se déconnecter
        </button>
      </form>
    </aside>
  );
}
