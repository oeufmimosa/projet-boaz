import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { TricolorBar } from "@/components/brand/TricolorBar";
import { Logo } from "@/components/brand/Logo";
import { FrenchBadge } from "@/components/brand/FrenchBadge";
import { NewsletterForm } from "./NewsletterForm";
import { FooterAccordion } from "./FooterAccordion";
import { getContent } from "@/lib/content";
import { FOOTER_COLUMNS } from "@/lib/nav";

const COLUMNS = FOOTER_COLUMNS;

export async function Footer() {
  const [copyright, newsletterTitle] = await Promise.all([
    getContent("footer.copyright", "© Groupe Climat Hexagone — Tous droits réservés"),
    getContent("footer.newsletter.title", "Restez informé"),
  ]);

  return (
    <footer className="mt-auto bg-primary-900 text-text-inverse">
      <TricolorBar />

      <Container className="py-12 sm:py-16">
        {/* Bandeau marque + newsletter */}
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <Logo variant="white" layout="wordmark" size="lg" />
            <p className="mt-4 max-w-md text-body text-primary-100">
              Rénovation énergétique • Entreprise française. Nous accompagnons
              propriétaires et bailleurs dans leurs travaux de A à Z.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-md border border-primary-700 px-3 py-1.5 text-body-sm text-primary-200">
                Qualibat / RGE
              </span>
            </div>
          </div>
          <div className="min-w-0 overflow-hidden rounded-lg border border-primary-800 bg-primary-800 p-5">
            <h3 className="font-display text-display-sm">{newsletterTitle}</h3>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Colonnes — desktop / accordéon mobile */}
        <div className="mt-12 hidden gap-8 md:grid md:grid-cols-4">
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <h4 className="font-display text-body font-bold uppercase tracking-wide text-primary-200">
                {c.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="text-body text-primary-100 transition-colors duration-150 hover:text-accent-500"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="md:hidden mt-10">
          <FooterAccordion columns={COLUMNS} />
        </div>

        {/* Bandeau bas — copyright + badge "Entreprise française" */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-primary-800 pt-6 text-body-sm text-primary-200 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <p>{copyright}</p>
            <FrenchBadge variant="dark" />
          </div>
        </div>

        <p className="mt-6 text-xs italic text-primary-300">
          Informations données à titre indicatif. Les caractéristiques, performances, économies
          potentielles et aides mobilisables peuvent varier selon le logement, les équipements
          installés, les conditions techniques et la réglementation en vigueur.
        </p>
      </Container>
    </footer>
  );
}
