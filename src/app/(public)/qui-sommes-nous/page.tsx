import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Card";
import { TricolorBar } from "@/components/brand/TricolorBar";
import { FrenchBadge } from "@/components/brand/FrenchBadge";
import { KeyFigures } from "@/components/home/desktop/KeyFigures";
import { LinkButton } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getAssetByKey } from "@/lib/media";
import { REALISATIONS, formatEuros } from "@/lib/realisations";

export const metadata: Metadata = {
  title: "Qui sommes-nous — Spécialiste de la rénovation énergétique",
  description:
    "Entreprise française spécialisée en rénovation énergétique : pompe à chaleur, photovoltaïque, isolation thermique extérieure. Étude personnalisée, installation par des artisans RGE.",
  alternates: { canonical: "/qui-sommes-nous" },
  openGraph: {
    title: "Qui sommes-nous — Groupe Climat Hexagone",
    description:
      "Entreprise française spécialisée en rénovation énergétique. Étude personnalisée et artisans RGE.",
    url: "/qui-sommes-nous",
    type: "article",
  },
};

const PILLARS = [
  {
    icon: "🔍",
    title: "Étude personnalisée",
    body: "Analyse de votre logement, de vos consommations et de vos besoins pour un projet sur-mesure et réellement rentable.",
  },
  {
    icon: "⚙️",
    title: "Solutions performantes",
    body: "Matériel de qualité, équipements certifiés, technologies de pointe sélectionnés auprès de marques reconnues.",
  },
  {
    icon: "🛠️",
    title: "Installation soignée",
    body: "Par nos équipes ou nos partenaires installateurs RGE agréés, dans les règles de l'art.",
  },
  {
    icon: "🔄",
    title: "Suivi & entretien",
    body: "Sérénité garantie : maintenance, garantie, accompagnement long terme après la mise en service.",
  },
];

const ENGAGEMENTS = [
  { title: "Certification RGE", body: "Travaux réalisés par des partenaires Reconnus Garants de l'Environnement." },
  { title: "Garantie décennale", body: "Tous les chantiers couverts par une assurance décennale." },
  { title: "Devis gratuit", body: "Sans engagement, étude complète de vos aides incluses." },
  { title: "Aides étudiées", body: "MaPrimeRénov', CEE, Éco-PTZ : nous calculons et déclarons pour vous." },
  { title: "Accompagnement A à Z", body: "De la première visite à l'entretien, un interlocuteur dédié." },
  { title: "France métropolitaine", body: "Chantiers partout en France métropolitaine." },
];

// ⚠️ Chiffres clés : valeurs `[X]` bloquantes (cf. docs/seo.md). Le composant
// <KeyFigures> détecte ces placeholders et applique un ring doré + animation
// pulse pour qu'un chiffre non renseigné saute aux yeux côté admin.
// TODO client : remplacer chaque `[X]` avant mise en production publique.
const FIGURES = [
  { value: "[X]+",   label: "Chantiers réalisés" },
  { value: "[X] ans", label: "D'expérience" },
  { value: "[X] %",  label: "Clients satisfaits" },
  { value: "100 %",  label: "Artisans RGE certifiés" },
];

export default async function QuiSommesNousPage() {
  const heroImg = await getAssetByKey("expertise.hero");
  const teamImg = await getAssetByKey("expertise.team.photo");
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
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
            className="absolute inset-0 -z-10 object-cover object-center"
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
              ? "linear-gradient(90deg, rgba(6,26,16,0.92) 0%, rgba(6,26,16,0.78) 40%, rgba(6,26,16,0.55) 100%)"
              : "linear-gradient(135deg, rgba(6,26,16,0.85), rgba(15,61,38,0.75), rgba(31,106,64,0.80))",
          }}
        />
        <Container className="relative py-20 sm:py-28">
          <FrenchBadge variant="dark" />
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            Notre <span className="text-accent-500">expertise</span> en rénovation énergétique
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg text-white/90">
            Une entreprise française à votre service, spécialiste de la pompe à chaleur,
            du photovoltaïque et de l'isolation thermique. Nous sécurisons votre projet
            de A à Z, des études aux aides en passant par l'installation.
          </p>
          <div className="mt-8">
            <TricolorBar />
          </div>
        </Container>
      </section>

      {/* a-bis) Nos réalisations — placée tout en haut, juste après le hero */}
      <Section id="realisations" className="bg-primary-50">
        <Container>
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="font-body text-body-sm uppercase tracking-[0.18em] text-accent-600">
              Nos chantiers
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary-800 sm:text-4xl">
              Nos réalisations
            </h2>
            <p className="mt-3 text-text-muted">
              Pompe à chaleur, isolation thermique extérieure, photovoltaïque, ballon thermodynamique :
              voici comment notre équipe accompagne des propriétaires partout en France.
            </p>
          </div>

          {/* ⚠️ Disclaimer placeholder — à retirer une fois les cas réels substitués */}
          <div
            data-content="placeholder"
            className="mx-auto mb-10 max-w-4xl rounded-lg border border-accent-500/40 bg-accent-500/5 p-5 text-body-sm text-amber-900 ring-1 ring-accent-500/30"
          >
            <strong>Note pour la phase de mise en page :</strong> les six réalisations
            ci-dessous sont des <strong>cas fictifs réalistes</strong> destinés à valider
            la structure et le rendu. Les chiffres d&apos;aides correspondent à des ordres
            de grandeur 2025 cohérents mais ne proviennent pas de dossiers réels. Avant
            mise en production, le client doit substituer ces cas par des chantiers
            vérifiables avec consentement écrit RGPD du client final.
          </div>

          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {REALISATIONS.map((r) => (
              <li key={r.slug}>
                <div
                  data-content={r.placeholder ? "placeholder" : undefined}
                  className={`flex h-full flex-col overflow-hidden rounded-lg border bg-surface ${
                    r.placeholder
                      ? "border-accent-500/40 ring-1 ring-accent-500/20"
                      : "border-border"
                  }`}
                >
                  {(() => {
                    const imgs = [r.coverImage, ...(r.additionalImages ?? [])];
                    if (imgs.length > 1) {
                      return (
                        <div className="grid aspect-[3/2] w-full grid-cols-2 gap-0.5 bg-border">
                          {imgs.slice(0, 2).map((src, idx) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={`${src}-${idx}`}
                              src={src}
                              alt={`Photo client ${idx + 1} — ${r.title}`}
                              className="h-full w-full object-cover"
                            />
                          ))}
                        </div>
                      );
                    }
                    return (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.coverImage}
                        alt={`Photo avant/après — ${r.title}`}
                        className="aspect-[3/2] w-full object-cover"
                      />
                    );
                  })()}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-body-sm uppercase tracking-wide text-accent-600">
                      {r.location}
                    </p>
                    <h3 className="mt-2 font-display text-lg font-semibold text-primary-800">
                      {r.title}
                    </h3>
                    <ul className="mt-3 space-y-1 text-body-sm text-text-muted">
                      <li>
                        <strong className="text-text">Aides obtenues :</strong>{" "}
                        {formatEuros(r.aidesObtainedEuros)}
                      </li>
                      <li>
                        <strong className="text-text">Économies/an :</strong>{" "}
                        {formatEuros(r.yearlySavingsEuros)}
                      </li>
                      <li>
                        <strong className="text-text">Durée :</strong> {r.durationDays} jours
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* b) Quatre piliers */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-primary-800 sm:text-4xl">
              Notre expertise à votre service
            </h2>
            <p className="mt-3 text-text-muted">
              Quatre piliers qui structurent chacun de nos chantiers.
            </p>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2">
            {PILLARS.map((p) => (
              <li
                key={p.title}
                className="flex gap-4 rounded-lg border border-border bg-surface p-6 shadow-sm"
              >
                <div
                  aria-hidden
                  className="flex h-14 w-14 shrink-0 items-center justify-center bg-primary-50 text-2xl"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                  {p.icon}
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-primary-800">{p.title}</h3>
                  <p className="mt-2 text-body-sm text-text-muted">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* c) Engagements */}
      <Section tone="muted">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-primary-800 sm:text-4xl">
              Nos engagements
            </h2>
            <p className="mt-3 text-text-muted">
              Des garanties claires, sans surprise, pour chaque chantier.
            </p>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ENGAGEMENTS.map((e) => (
              <li
                key={e.title}
                className="rounded-lg border border-border bg-surface p-5 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="inline-block h-3 w-3 bg-accent-500"
                    style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                  />
                  <h3 className="font-display font-semibold text-primary-800">{e.title}</h3>
                </div>
                <p className="mt-2 text-body-sm text-text-muted">{e.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* d) Notre histoire — TEXTE GÉNÉRIQUE PLACEHOLDER.
           ⚠️ Le récit ci-dessous est un placeholder éditorial qui décrit une
           orientation générale (transparence, accompagnement). Pour une vraie
           histoire d'entreprise (date de création, fondateurs, étapes clés),
           le client doit fournir un récit factuel et le substituer ici.
           Tant qu'il n'est pas remplacé, l'encart porte un ring doré et
           data-content="placeholder" pour le repérer en admin. */}
      <Section>
        <Container className="grid items-center gap-10 md:grid-cols-2">
          <div
            data-content="placeholder"
            className="rounded-lg border border-accent-500/40 bg-accent-500/5 p-6 ring-1 ring-accent-500/30"
          >
            <p className="font-body text-body-sm uppercase tracking-[0.18em] text-accent-600">
              Notre histoire
              <span className="ml-2 rounded-full bg-accent-500 px-2 py-0.5 text-[0.6rem] font-bold text-primary-900">
                à compléter
              </span>
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary-800 sm:text-4xl">
              Une équipe, une mission
            </h2>
            <div className="mt-4 space-y-4 text-text-muted">
              <p>
                Notre vocation : rendre la rénovation énergétique accessible à tous,
                avec un accompagnement humain et transparent. Notre équipe réunit
                des conseillers et des techniciens engagés sur la durée auprès des
                particuliers comme des bailleurs.
              </p>
              <p>
                Notre approche repose sur la transparence : étude réelle de votre logement,
                explication claire des aides, suivi de chantier rigoureux. Pas de promesse en l'air,
                des gains de consommation mesurables.
              </p>
              <p className="text-body-sm italic text-amber-700">
                {/* TODO client : remplacer par le vrai récit (date de création,
                    fondateurs, étapes marquantes, valeurs). 200-300 mots. */}
                <strong>Encart à personnaliser par le client</strong> — date de création,
                fondateurs, étapes marquantes à substituer ici (cf. docs/seo.md, checklist).
              </p>
            </div>
          </div>
          {teamImg ? (
            <figure className="overflow-hidden rounded-lg border border-border shadow-sm">
              <div className="relative aspect-[4/3]">
                <Image
                  src={teamImg.url}
                  alt="Photo de l'équipe Groupe Climat Hexagone"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  {...(teamImg.blurDataURL
                    ? { placeholder: "blur" as const, blurDataURL: teamImg.blurDataURL }
                    : {})}
                />
              </div>
              {teamImg.attribution && (
                <figcaption className="border-t border-border bg-surface-2 px-3 py-1.5 text-xs text-text-muted">
                  {teamImg.attributionUrl ? (
                    <a href={teamImg.attributionUrl} target="_blank" rel="noopener noreferrer nofollow" className="hover:underline">
                      {teamImg.attribution}
                    </a>
                  ) : teamImg.attribution}
                </figcaption>
              )}
            </figure>
          ) : (
            <div
              aria-hidden
              data-content="placeholder"
              className="aspect-[4/3] rounded-lg bg-gradient-to-br from-primary-100 to-primary-300 ring-1 ring-accent-500/30"
            >
              <div className="flex h-full flex-col items-center justify-center text-primary-700">
                <span className="text-sm font-semibold">Photo équipe à fournir</span>
                <span className="text-xs opacity-75">(format ~1200×800, JPG/WebP)</span>
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* e) Chiffres clés */}
      <KeyFigures title="Notre savoir-faire en chiffres" items={FIGURES} />

      {/* f) CTA finale */}
      <Section>
        <Container className="text-center">
          <h2 className="font-display text-3xl font-bold text-primary-800 sm:text-4xl">
            Discutons de votre projet
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-text-muted">
            Estimez vos aides en quelques clics ou prenez contact pour un échange direct.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LinkButton href="/simulateur" variant="primary" size="lg">
              Simuler mes travaux
            </LinkButton>
            <LinkButton href="/contact" variant="outline" size="lg">
              Nous contacter
            </LinkButton>
          </div>
        </Container>
      </Section>
    </>
  );
}
