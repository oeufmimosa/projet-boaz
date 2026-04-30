import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getContent } from "@/lib/content";
import { NewsletterForm } from "./NewsletterForm";

const COLUMNS: Array<{ title: string; links: { href: string; label: string }[] }> = [
  {
    title: "Travaux",
    links: [
      { href: "/travaux/isolation-combles", label: "Isolation des combles" },
      { href: "/travaux/pompe-a-chaleur-air-eau", label: "Pompe à chaleur" },
      { href: "/travaux/photovoltaique", label: "Photovoltaïque" },
      { href: "/travaux", label: "Tous les travaux" },
    ],
  },
  {
    title: "Aides",
    links: [
      { href: "/aides", label: "MaPrimeRénov'" },
      { href: "/aides", label: "CEE" },
      { href: "/aides", label: "Éco-prêt" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/cgu", label: "CGU" },
      { href: "/confidentialite", label: "Confidentialité" },
      { href: "/cookies", label: "Cookies" },
    ],
  },
];

export async function Footer() {
  const [copyright, newsletterTitle, newsletterDesc] = await Promise.all([
    getContent("footer.copyright", "© Projet Boaz"),
    getContent("footer.newsletter.title", "Newsletter"),
    getContent("footer.newsletter.description", "[DESCRIPTION NEWSLETTER]"),
  ]);

  return (
    <footer className="mt-16 border-t border-border bg-muted/40">
      <Container className="py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-fg">
                {c.title}
              </h3>
              <ul className="space-y-2 text-sm">
                {c.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="hover:text-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-fg">
              {newsletterTitle}
            </h3>
            <p className="mb-3 text-sm text-muted-fg">{newsletterDesc}</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-fg sm:flex-row sm:items-center">
          <p>{copyright}</p>
          <ul className="flex gap-4" aria-label="Réseaux sociaux">
            <li><a href="#" aria-label="Facebook">Facebook</a></li>
            <li><a href="#" aria-label="LinkedIn">LinkedIn</a></li>
            <li><a href="#" aria-label="Instagram">Instagram</a></li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
