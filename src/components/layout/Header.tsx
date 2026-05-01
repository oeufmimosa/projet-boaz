import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { FrenchBadge } from "@/components/brand/FrenchBadge";
import { TricolorBar } from "@/components/brand/TricolorBar";
import { MobileMenu } from "./MobileMenu";
import { ScrollAwareHeader } from "./ScrollAwareHeader";
import { getContent } from "@/lib/content";

export const NAV_LINKS = [
  { href: "/travaux", label: "Travaux" },
  { href: "/aides", label: "Aides" },
  { href: "/simulateur", label: "Simulateur" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export async function Header() {
  const ctaLabel = await getContent("header.cta", "Simuler mes travaux");

  return (
    <>
      <TricolorBar />
      <ScrollAwareHeader>
        <Container className="flex h-16 lg:h-20 items-center justify-between gap-4">
          {/* Logo : wordmark masqué sous 380 px pour gagner de la place */}
          <Link href="/" aria-label="Accueil — Groupe Climat Hexagon" className="shrink-0">
            <span className="block sm:hidden"><Logo size={32} withWordmark={false} /></span>
            <span className="hidden sm:block"><Logo size={36} /></span>
          </Link>

          {/* Nav desktop — centrée */}
          <nav
            aria-label="Navigation principale"
            className="hidden lg:flex items-center gap-7 absolute left-1/2 -translate-x-1/2"
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-body-sm font-semibold transition-colors duration-150 nav-link hover:text-primary-600"
                data-nav
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Bloc droit : badge + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <FrenchBadge />
            <LinkButton href="/simulateur" variant="primary" size="md">
              {ctaLabel}
            </LinkButton>
          </div>

          {/* Mobile : mini-CTA + burger */}
          <div className="flex lg:hidden items-center gap-2">
            <LinkButton href="/simulateur" variant="accent" size="sm" className="px-3">
              Simuler
            </LinkButton>
            <MobileMenu links={NAV_LINKS} ctaLabel={ctaLabel} />
          </div>
        </Container>
      </ScrollAwareHeader>
    </>
  );
}
