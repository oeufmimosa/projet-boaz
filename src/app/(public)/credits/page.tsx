import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Crédits photos",
  description:
    "Liste des crédits et attributions pour les photographies utilisées sur le site Groupe Climat Hexagone.",
  alternates: { canonical: "/credits" },
  robots: {
    // Indexable, mais on ne pousse pas pour autant cette page côté SEO
    // (priorité basse dans le sitemap, lien discret en footer).
    index: true,
    follow: true,
  },
};

export const dynamic = "force-dynamic";

type AssetRow = {
  id: string;
  key: string | null;
  url: string;
  filename: string;
  attribution: string | null;
  attributionUrl: string | null;
  licenseType: string | null;
  createdAt: Date;
};

/**
 * Page /credits — liste publique de l'attribution de toutes les photos
 * utilisées sur le site.
 *
 * Deux sections :
 *  1. **Photos sous licence stock** — MediaAsset avec `attribution` non null
 *     (Unsplash, Pexels, etc.) — chaque entrée porte le crédit complet et
 *     un lien cliquable vers la page source.
 *  2. **Autres images** — MediaAsset uploadés localement sans attribution.
 *     Mention générique « Images fournies par Groupe Climat Hexagone — tous
 *     droits réservés. »
 *
 * Cette transparence est une bonne pratique pour les sites qui exploitent
 * du stock à grande échelle, et démontre le respect des licences.
 */
export default async function CreditsPage() {
  let stockAssets: AssetRow[] = [];
  let localAssets: AssetRow[] = [];
  try {
    const all = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
    });
    const rows = all as unknown as AssetRow[];
    stockAssets = rows.filter((a) => a.attribution && a.attribution.trim().length > 0);
    localAssets = rows.filter((a) => !a.attribution || a.attribution.trim().length === 0);
  } catch {
    // En CI ou si la DB est indisponible, on rend la page sans tableau.
  }

  // Regroupement par type de licence pour la lisibilité
  const byLicense = new Map<string, AssetRow[]>();
  for (const a of stockAssets) {
    const license = a.licenseType ?? "Licence non spécifiée";
    if (!byLicense.has(license)) byLicense.set(license, []);
    byLicense.get(license)!.push(a);
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: "Crédits photos", href: "/credits" },
        ]}
      />

      <Section>
        <Container className="max-w-3xl">
          <p className="text-body-sm uppercase tracking-[0.18em] text-accent-600">
            Transparence éditoriale
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-primary-800 sm:text-4xl">
            Crédits photos
          </h1>
          <p className="mt-4 text-body-lg text-text-muted">
            Cette page liste les crédits et attributions pour toutes les
            photographies utilisées sur le site, conformément aux licences des
            banques d'images et au respect du travail des photographes.
          </p>
        </Container>
      </Section>

      {stockAssets.length > 0 && (
        <Section tone="muted">
          <Container className="max-w-4xl">
            <h2 className="font-display text-2xl font-bold text-primary-800 sm:text-3xl">
              Photos sous licence stock
            </h2>
            <p className="mt-3 text-text-muted">
              Photographies issues de banques d'images sous licence permissive
              (Unsplash, Pexels). Attribution affichée par photo conformément à
              notre politique éditoriale.
            </p>

            {Array.from(byLicense.entries()).map(([license, assets]) => (
              <section key={license} className="mt-8">
                <h3 className="font-display text-lg font-semibold text-primary-800">
                  {license}{" "}
                  <span className="text-body-sm font-normal text-text-muted">
                    ({assets.length} photo{assets.length > 1 ? "s" : ""})
                  </span>
                </h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {assets.map((a) => (
                    <li
                      key={a.id}
                      className="overflow-hidden rounded-lg border border-border bg-surface"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={a.url}
                        alt={`Aperçu — ${a.attribution ?? "image"}`}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover"
                      />
                      <div className="border-t border-border p-3 text-body-sm">
                        {a.attributionUrl ? (
                          <a
                            href={a.attributionUrl}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="font-semibold text-primary-700 hover:underline"
                          >
                            {a.attribution}
                          </a>
                        ) : (
                          <span className="font-semibold">{a.attribution}</span>
                        )}
                        {a.key && (
                          <p className="mt-1 text-xs text-text-muted">
                            Emplacement : <code>{a.key}</code>
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </Container>
        </Section>
      )}

      <Section>
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-primary-800 sm:text-3xl">
            Autres images
          </h2>
          <p className="mt-3 text-text-muted">
            Toutes les autres images affichées sur le site (illustrations,
            schémas, photos de chantiers, photos de l'équipe) sont fournies
            par <strong>Groupe Climat Hexagone</strong> — tous droits réservés.
            Pour toute demande d'utilisation, merci de contacter notre équipe via la
            page <Link href="/contact" className="text-primary-700 hover:underline">contact</Link>.
          </p>

          {localAssets.length > 0 && (
            <p className="mt-4 text-body-sm text-text-muted">
              Le site héberge actuellement <strong>{localAssets.length}</strong>{" "}
              image{localAssets.length > 1 ? "s" : ""} de cette catégorie.
            </p>
          )}
        </Container>
      </Section>

      <Section tone="muted">
        <Container className="max-w-3xl">
          <h2 className="font-display text-xl font-bold text-primary-800">
            Politique de licence
          </h2>
          <ul className="mt-3 space-y-2 text-body-sm text-text-muted">
            <li>
              ✅ <strong>Sources légales uniquement</strong> : Unsplash, Pexels, ou
              fonds propres. Aucune image téléchargée depuis Google Images, des
              sites concurrents ou des forums.
            </li>
            <li>
              ✅ <strong>Attribution systématique</strong> : même quand la licence
              ne l'exige pas, nous affichons l'auteur et un lien vers la photo
              originale.
            </li>
            <li>
              ✅ <strong>Pas d'usage de logos partenaires</strong> sans
              autorisation explicite des organismes concernés (Qualibat, RGE,
              France Rénov', etc.).
            </li>
          </ul>
        </Container>
      </Section>
    </>
  );
}
