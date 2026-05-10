import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { TricolorBar } from "@/components/brand/TricolorBar";
import { ReferralForm } from "@/components/referral/ReferralForm";
import { LinkButton } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getAssetByKey } from "@/lib/media";
import { SERVICES_LIST } from "@/lib/services";

export const metadata = {
  title: "Parrainage — gagnez jusqu'à 1 000 € par filleul",
  description:
    "Recommandez Groupe Climat Hexagone à un proche : pour chaque projet de rénovation énergétique réalisé, recevez jusqu'à 1 000 € de prime.",
};

const STEPS = [
  {
    n: 1,
    title: "Vous recommandez un proche",
    body: "Vos amis, votre famille ou vos voisins envisagent des travaux de rénovation énergétique ? Transmettez-nous leurs coordonnées via le formulaire.",
  },
  {
    n: 2,
    title: "Nous étudions son projet",
    body: "Notre équipe contacte votre filleul sous 48 h, vérifie son éligibilité aux aides et le met en relation avec l'un de nos partenaires installateurs RGE.",
  },
  {
    n: 3,
    title: "Vous touchez votre prime",
    body: "Une fois les travaux réalisés et le chantier validé, votre prime vous est versée dans un délai de 30 jours maximum.",
  },
];

export default async function ParrainagePage() {
  const heroImg = await getAssetByKey("parrainage.hero");
  const formImg = await getAssetByKey("parrainage.form.image");
  // Photos des 5 produits pour le marquee "Travaux éligibles"
  const productCards = await Promise.all(
    SERVICES_LIST.map(async (s) => ({
      slug: s.slug,
      label: s.label,
      image: await getAssetByKey(`home.services.cards.${s.slug}.image`),
    })),
  );
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: "Parrainage", href: "/parrainage" },
        ]}
      />

      {/* a) Hero */}
      <section className="relative isolate overflow-hidden bg-primary-900 text-text-inverse">
        {heroImg && (
          <Image
            src={heroImg.url}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-10 object-cover"
            {...(heroImg.blurDataURL
              ? { placeholder: "blur" as const, blurDataURL: heroImg.blurDataURL }
              : {})}
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background: heroImg
              ? "linear-gradient(180deg, rgba(6,26,16,0.78) 0%, rgba(6,26,16,0.55) 50%, rgba(6,26,16,0.92) 100%)"
              : "linear-gradient(180deg, rgba(15,61,38,0.6), rgba(6,26,16,0.85))",
          }}
        />
        <Container className="relative py-20 sm:py-28">
          <p className="font-body text-body-sm uppercase tracking-[0.18em] text-accent-500">
            Programme parrainage
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            Vous avez été satisfait de notre accompagnement&nbsp;?
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg text-white/90">
            Recommandez Groupe Climat Hexagone à un proche et gagnez jusqu'à
            {" "}<span className="rounded bg-accent-500 px-2 py-0.5 font-bold text-primary-800">1&nbsp;000&nbsp;€</span>{" "}
            pour chaque projet réalisé par vos filleuls.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="#formulaire" variant="accent" size="lg">
              Parrainer un proche ici
            </LinkButton>
            <Link
              href="#comment-ca-marche"
              className="inline-flex h-[52px] items-center px-5 font-display font-semibold text-white/90 underline-offset-4 hover:underline"
            >
              Comment ça marche&nbsp;?
            </Link>
          </div>
          <div className="mt-10">
            <TricolorBar />
          </div>
        </Container>
      </section>

      {/* b) Comment ça marche */}
      <Section id="comment-ca-marche" tone="muted">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-primary-800 sm:text-4xl">
              Comment ça marche
            </h2>
            <p className="mt-3 text-text-muted">
              Trois étapes simples pour transformer une recommandation en prime.
            </p>
          </div>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="rounded-lg border border-border bg-surface p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center bg-primary-700 font-display text-xl font-extrabold text-white"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                  {s.n}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-primary-800">{s.title}</h3>
                <p className="mt-2 text-body-sm text-text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* c) Ce que vous y gagnez */}
      <Section tone="dark">
        <Container className="text-center">
          <p className="font-body text-body-sm uppercase tracking-[0.18em] text-accent-500">
            Ce que vous y gagnez
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
            Jusqu'à <span className="text-accent-500">1 000 €&nbsp;TTC</span>
          </h2>
          <p className="mt-2 text-body-lg text-white/85">par dossier transformé</p>

          <ul className="mx-auto mt-10 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
            {[
              "Versement rapide (30 j max)",
              "Aucune limite de filleuls",
              "Cumulable avec d'autres avantages",
            ].map((label) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-md bg-white/10 p-4 backdrop-blur-sm"
              >
                <span
                  aria-hidden
                  className="flex h-6 w-6 shrink-0 items-center justify-center bg-accent-500 text-primary-900 text-xs font-bold"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                  ✓
                </span>
                <span className="text-body-sm">{label}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex justify-center">
            <TricolorBar />
          </div>
        </Container>
      </Section>

      {/* d) Formulaire */}
      <Section id="formulaire" tone="muted">
        <Container className="max-w-5xl">
          <h2 className="font-display text-3xl font-bold text-primary-800 sm:text-4xl">
            Contactez-nous pour votre <span className="text-accent-600">parrainage</span>
          </h2>
          <p className="mt-3 text-text-muted">
            Remplissez le formulaire ci-dessous. Nous prenons contact avec votre filleul sous 48 h.
          </p>

          {/* Carte unique : image en haut + formulaire 2 colonnes en dessous */}
          <div className="mt-8 overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
            {formImg && (
              <div className="bg-surface-2 px-6 py-6 sm:py-8">
                {/* Image au ratio natif 3:2, largeur réduite à 60 % et
                    centrée → on voit la photo en entier sans cadrage. */}
                <div className="relative mx-auto aspect-[3/2] w-3/5 max-w-xl overflow-hidden rounded-md shadow-sm">
                  <Image
                    src={formImg.url}
                    alt="Témoignage de filleule après l'installation de sa pompe à chaleur"
                    fill
                    sizes="(max-width: 1024px) 60vw, 600px"
                    className="object-cover"
                    {...(formImg.blurDataURL
                      ? { placeholder: "blur" as const, blurDataURL: formImg.blurDataURL }
                      : {})}
                  />
                </div>
              </div>
            )}
            <div className="p-6 sm:p-8">
              <ReferralForm />
            </div>
          </div>
        </Container>
      </Section>

      {/* e) Travaux éligibles — marquee horizontal des 5 produits */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-primary-800 sm:text-4xl">
              Travaux éligibles
            </h2>
            <p className="mt-3 text-text-muted">
              Tous les travaux de rénovation énergétique sont éligibles : pompe à chaleur,
              isolation, ballon thermodynamique, système solaire combiné.
            </p>
          </div>
        </Container>
        <div className="products-marquee group mt-10">
          <ul className="products-marquee-track" aria-label="Produits éligibles au parrainage">
            {Array.from({ length: 6 }, (_, copyIdx) =>
              productCards.map((p, idx) => (
                <li
                  key={`${p.slug}-${copyIdx}-${idx}`}
                  aria-hidden={copyIdx > 0}
                >
                  <Link href={`/services/${p.slug}`} className="products-marquee-item">
                    <div className="relative h-[130px] w-full overflow-hidden bg-primary-900">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image.url}
                          alt={p.label}
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          aria-hidden
                          className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-900"
                        />
                      )}
                      <div
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-2/5"
                        style={{ background: "linear-gradient(to top, rgba(10,42,26,0.92), transparent)" }}
                      />
                    </div>
                    <div className="flex flex-1 items-center bg-primary-900 px-3 py-2 text-white">
                      <p className="line-clamp-2 font-display text-xs font-bold leading-tight">
                        {p.label}
                      </p>
                    </div>
                  </Link>
                </li>
              )),
            ).flat()}
          </ul>
        </div>
      </Section>
    </>
  );
}
