"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui/cn";
import { Logo } from "@/components/brand/Logo";

const ITEMS = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/editor", label: "Éditeur visuel" },
  { href: "/admin/contenus", label: "Contenus" },
  { href: "/admin/images", label: "Images" },
  { href: "/admin/simulateur", label: "Simulateur" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/temoignages", label: "Témoignages" },
  { href: "/admin/chatbox", label: "Chatbox" },
  { href: "/admin/soumissions", label: "Soumissions" },
  { href: "/admin/parrainages", label: "Parrainages" },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  return (
    <aside className="w-full border-b border-primary-700 bg-primary-800 text-text-inverse md:w-64 md:shrink-0 md:border-b-0 md:border-r md:min-h-screen">
      <div className="px-5 pt-5 pb-3">
        <Link href="/" className="inline-block">
          <Logo variant="white" layout="wordmark" size="sm" />
        </Link>
        <p className="mt-3 text-body-sm text-primary-200 break-all">{email}</p>
      </div>

      <nav aria-label="Navigation admin" className="flex md:flex-col gap-1 overflow-x-auto px-3 pb-4">
        {ITEMS.map((it) => {
          const active =
            pathname === it.href ||
            (it.href !== "/admin" && pathname.startsWith(it.href));
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative rounded-md px-4 py-2.5 text-body-sm font-semibold whitespace-nowrap transition-colors",
                active
                  ? "bg-primary-900 text-text-inverse"
                  : "text-primary-100 hover:bg-primary-700",
              )}
            >
              {active && (
                <span aria-hidden className="absolute left-0 top-1/2 hidden h-6 w-1 -translate-y-1/2 rounded-r bg-accent-500 md:block" />
              )}
              {it.label}
            </Link>
          );
        })}
      </nav>

      <form action="/api/auth/logout" method="POST" className="hidden md:block px-5 pb-6 pt-4 border-t border-primary-700">
        <button type="submit" className="text-body-sm text-primary-200 hover:text-accent-500">
          Se déconnecter
        </button>
      </form>
    </aside>
  );
}
