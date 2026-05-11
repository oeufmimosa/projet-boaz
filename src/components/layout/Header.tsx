import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { TricolorBar } from "@/components/brand/TricolorBar";
import { MobileMenu } from "./MobileMenu";
import { ScrollAwareHeader } from "./ScrollAwareHeader";
import { ServicesDropdown } from "./ServicesDropdown";
import { CallbackButton } from "@/components/callback/CallbackButton";
import { NAV_LINKS } from "@/lib/nav";
import { getContent } from "@/lib/content";

export { NAV_LINKS };

/**
 * Navbar disposition « Effy-style flush left » — full-width viewport,
 * sans wrapper `<Container>` (pas de `max-width`, pas de `mx-auto`).
 * Logo et menu collés au bord gauche, CTA collé au bord droit, marges
 * latérales fluides 16/24/32/40 px via padding direct.
 *
 *   ┌───────────────────────────────────────────────────────────────────┐
 *   │ [Logo] [menu inline collé au logo]      ←gap→     [CTA primary]   │
 *   │ ←───────── flex-1 min-w-0 ─────────→            ←shrink-0→        │
 *   └───────────────────────────────────────────────────────────────────┘
 *
 * Hauteur fixe 64 px à toutes les largeurs.
 *
 * Breakpoints :
 *  - < xs (360)                : burger + mini-CTA + logo `mark` sm
 *  - xs → midnav (360-1099)    : burger + (mini ou plein) CTA + logo `compact` sm
 *                                 (le wordmark est visible dès 360 px de large
 *                                 — cf. iPhone 14 Pro Max 430 px qui a la place)
 *  - midnav → xl   (1100-1279) : menu horizontal + logo `mark` md + CTA
 *  - ≥ xl (1280)               : menu horizontal + logo `compact` md + CTA
 *
 * Règle d'or : `whitespace-nowrap` sur tous les `<NavLink>`. Si à 1100 px le
 * menu déborde malgré `mark` seul, il vaut mieux remonter `midnav` à 1199 px
 * que d'autoriser un chevauchement Parrainage / CTA.
 */
export async function Header() {
  const ctaLabel = await getContent("header.cta", "Simuler mes aides");

  return (
    <>
      <TricolorBar height={6} />
      <ScrollAwareHeader>
        <div className="flex h-16 w-full items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 xl:px-10">
          {/* Zone gauche — logo + menu collé, peut se compresser */}
          <div className="flex min-w-0 flex-1 items-center gap-6">
            <Link
              href="/"
              aria-label="Accueil — Groupe Climat Hexagone"
              className="mr-3 inline-flex shrink-0 items-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Groupe Climat Hexagone"
                className="site-logo h-10 w-auto sm:h-12"
              />
            </Link>

            {/* Menu horizontal — ≥ midnav uniquement, collé à gauche */}
            <nav
              aria-label="Navigation principale"
              className="hidden midnav:flex min-w-0 items-center gap-1"
            >
              {NAV_LINKS.map((l) => {
                if (l.children?.length) {
                  return <ServicesDropdown key={l.href} />;
                }
                const isParrainage = l.href === "/parrainage";
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={
                      isParrainage
                        ? "inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-body-sm font-semibold text-primary-700 transition-colors duration-150 hover:bg-primary-50"
                        : "inline-flex items-center whitespace-nowrap rounded-md px-3 py-2 text-body-sm font-medium text-text transition-colors duration-150 hover:bg-primary-50 hover:text-primary-700"
                    }
                    data-nav
                  >
                    <span>{l.label}</span>
                    {l.badge && (
                      <span
                        aria-hidden
                        className="inline-flex h-5 items-center whitespace-nowrap rounded-full bg-accent-500 px-1.5 text-body-sm font-bold text-primary-900 transition hover:bg-accent-600 hover:scale-[1.03]"
                      >
                        +1&nbsp;000&nbsp;€
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Zone droite — CTA principal + bouton "Être rappelé" + menu mobile */}
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden narrow:inline-flex">
              <LinkButton href="/simulateur" variant="accent" size="md">
                {ctaLabel}
              </LinkButton>
            </span>

            <span className="inline-flex narrow:hidden">
              <LinkButton href="/simulateur" variant="accent" size="sm" className="px-3">
                Simuler
              </LinkButton>
            </span>

            <span className="hidden midnav:inline-flex">
              <CallbackButton />
            </span>

            <span className="inline-flex midnav:hidden">
              <CallbackButton compact />
            </span>

            <span className="inline-flex midnav:hidden">
              <MobileMenu links={NAV_LINKS} ctaLabel={ctaLabel} />
            </span>
          </div>
        </div>
      </ScrollAwareHeader>
    </>
  );
}
