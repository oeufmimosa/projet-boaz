import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";
import { getContent } from "@/lib/content";

export const NAV_LINKS = [
  { href: "/travaux", label: "Travaux" },
  { href: "/aides", label: "Aides" },
  { href: "/simulateur", label: "Simulateur" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export async function Header() {
  const [siteName, ctaLabel] = await Promise.all([
    getContent("site.name", "Projet Boaz"),
    getContent("header.cta", "Simuler mes aides"),
  ]);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="placeholder-block flex h-8 w-8 items-center justify-center rounded">
            B
          </span>
          <span>{siteName}</span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-fg hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <LinkButton href="/simulateur" size="sm">
            {ctaLabel}
          </LinkButton>
        </div>

        <div className="md:hidden">
          <MobileMenu links={NAV_LINKS} ctaLabel={ctaLabel} />
        </div>
      </Container>
    </header>
  );
}
