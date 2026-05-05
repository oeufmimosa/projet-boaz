import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";

/**
 * Fil d'Ariane visuel + JSON-LD `BreadcrumbList`. Chaque item porte un lien
 * sauf le dernier (page courante). Le composant injecte automatiquement le
 * schema BreadcrumbList pour le SEO Google (rich snippets).
 *
 * Usage : monter en haut de la page interne, juste après le header, avec une
 * liste qui inclut systématiquement "Accueil" comme premier item.
 */
export type Crumb = { label: string; href: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null;
  return (
    <>
      <BreadcrumbJsonLd items={items} />
      <nav
        aria-label="Fil d'Ariane"
        className="border-b border-border bg-surface-2"
      >
        <div className="mx-auto flex max-w-container items-center gap-2 overflow-x-auto px-4 py-2 text-body-sm text-text-muted sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2 whitespace-nowrap">
            {items.map((c, i) => {
              const isLast = i === items.length - 1;
              return (
                <li key={c.href} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden className="text-text-muted/60">
                      ›
                    </span>
                  )}
                  {isLast ? (
                    <span aria-current="page" className="font-medium text-primary-800">
                      {c.label}
                    </span>
                  ) : (
                    <Link
                      href={c.href}
                      className="hover:text-primary-700 hover:underline underline-offset-2"
                    >
                      {c.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
}
