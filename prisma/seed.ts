import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Strings stables — voir lib/validators/content.ts pour les zod enums correspondants.
const ContentType = {
  TEXT: "TEXT",
  RICHTEXT: "RICHTEXT",
  JSON: "JSON",
  IMAGE_REF: "IMAGE_REF",
} as const;
type ContentType = (typeof ContentType)[keyof typeof ContentType];

const FieldType = {
  RADIO: "RADIO",
  CHECKBOX: "CHECKBOX",
  NUMBER: "NUMBER",
  TEXT: "TEXT",
  EMAIL: "EMAIL",
  TEL: "TEL",
  SELECT: "SELECT",
  TEXTAREA: "TEXTAREA",
} as const;
type FieldType = (typeof FieldType)[keyof typeof FieldType];

const prisma = new PrismaClient();

/**
 * Catégories réelles d'Effy. Les slugs sont stables — ils servent d'URLs
 * publiques (/travaux/[slug]) et de clés de contenu (travaux.<slug>.title).
 */
const TRAVAUX = [
  { slug: "isolation-combles", title: "Isolation des combles" },
  { slug: "isolation-murs", title: "Isolation des murs" },
  { slug: "isolation-sols", title: "Isolation des sols" },
  { slug: "pompe-a-chaleur-air-eau", title: "Pompe à chaleur air/eau" },
  { slug: "pompe-a-chaleur-air-air", title: "Pompe à chaleur air/air" },
  { slug: "chaudiere", title: "Chaudière (gaz / biomasse)" },
  { slug: "photovoltaique", title: "Panneaux photovoltaïques" },
  { slug: "fenetres", title: "Fenêtres" },
  { slug: "vmc-double-flux", title: "VMC double flux" },
  { slug: "audit-energetique", title: "Audit énergétique" },
];

const AIDES = [
  { key: "maprimerenov", title: "MaPrimeRénov'" },
  { key: "cee", title: "Certificats d'Économie d'Énergie (CEE)" },
  { key: "eco-ptz", title: "Éco-prêt à taux zéro" },
  { key: "tva-reduite", title: "TVA à 5,5 %" },
  { key: "aides-locales", title: "Aides locales" },
];

async function upsertContent(key: string, value: string, type: ContentType = "TEXT") {
  await prisma.content.upsert({
    where: { key },
    update: { value, type },
    create: { key, value, type },
  });
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe!2026";
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });
  console.log(`✓ Admin: ${email}`);
}

async function seedContent() {
  // Header / Footer / global
  await upsertContent("site.name", "Projet Boaz");
  await upsertContent("site.tagline", "[ACCROCHE GLOBALE — rénovation énergétique]");
  await upsertContent("header.cta", "Simuler mes aides");
  await upsertContent("footer.copyright", "© Projet Boaz — Tous droits réservés");
  await upsertContent("footer.newsletter.title", "Newsletter");
  await upsertContent("footer.newsletter.description", "[DESCRIPTION NEWSLETTER]");

  // Home — Hero
  await upsertContent("home.hero.title", "[TITRE HERO — proposition de valeur principale]");
  await upsertContent("home.hero.subtitle", "[SOUS-TITRE HERO — argument principal en une phrase]");
  await upsertContent("home.hero.cta_primary", "Simuler mes travaux");
  await upsertContent("home.hero.cta_secondary", "Découvrir les aides");
  await upsertContent("home.hero.image", "https://placehold.co/1200x600?text=Hero", ContentType.IMAGE_REF);

  // Home — Services (utilise les TRAVAUX réels)
  await upsertContent("home.services.title", "Nos catégories de travaux");
  await upsertContent("home.services.subtitle", "[SOUS-TITRE SECTION SERVICES]");
  for (const t of TRAVAUX) {
    await upsertContent(`travaux.${t.slug}.title`, t.title);
    await upsertContent(`travaux.${t.slug}.short`, `[DESCRIPTION COURTE — ${t.title}]`);
    await upsertContent(`travaux.${t.slug}.description`, `[DESCRIPTION LONGUE — ${t.title}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.]`);
    await upsertContent(`travaux.${t.slug}.advantages`, JSON.stringify([
      "[Avantage 1]",
      "[Avantage 2]",
      "[Avantage 3]",
      "[Avantage 4]",
    ]), ContentType.JSON);
    await upsertContent(`travaux.${t.slug}.image`, `https://placehold.co/800x500?text=${encodeURIComponent(t.title)}`, ContentType.IMAGE_REF);
  }

  // Home — How it works
  await upsertContent("home.how.title", "Comment ça marche");
  await upsertContent("home.how.steps", JSON.stringify([
    { title: "Étape 1 — Simulez", description: "[DESCRIPTION ÉTAPE 1]" },
    { title: "Étape 2 — Recevez votre estimation", description: "[DESCRIPTION ÉTAPE 2]" },
    { title: "Étape 3 — Choisissez un artisan RGE", description: "[DESCRIPTION ÉTAPE 3]" },
    { title: "Étape 4 — Lancez vos travaux", description: "[DESCRIPTION ÉTAPE 4]" },
  ]), ContentType.JSON);

  // Home — Key figures
  await upsertContent("home.figures.title", "Ils nous font confiance");
  await upsertContent("home.figures.items", JSON.stringify([
    { value: "100 000+", label: "[Particuliers accompagnés]" },
    { value: "1 500+", label: "[Artisans partenaires RGE]" },
    { value: "500 M€", label: "[Aides versées]" },
    { value: "4,7/5", label: "[Note moyenne clients]" },
  ]), ContentType.JSON);

  // Home — Testimonials
  await upsertContent("home.testimonials.title", "Ils témoignent");
  await upsertContent("home.testimonials.items", JSON.stringify([
    { name: "[NOM 1]", city: "[VILLE 1]", quote: "[CITATION 1 — lorem ipsum dolor sit amet.]", rating: 5 },
    { name: "[NOM 2]", city: "[VILLE 2]", quote: "[CITATION 2 — lorem ipsum dolor sit amet.]", rating: 5 },
    { name: "[NOM 3]", city: "[VILLE 3]", quote: "[CITATION 3 — lorem ipsum dolor sit amet.]", rating: 4 },
  ]), ContentType.JSON);

  // Home — Partners
  await upsertContent("home.partners.title", "Nos partenaires");
  await upsertContent("home.partners.items", JSON.stringify([
    { name: "[Partenaire 1]", logo: "https://placehold.co/200x80?text=Logo+1" },
    { name: "[Partenaire 2]", logo: "https://placehold.co/200x80?text=Logo+2" },
    { name: "[Partenaire 3]", logo: "https://placehold.co/200x80?text=Logo+3" },
    { name: "[Partenaire 4]", logo: "https://placehold.co/200x80?text=Logo+4" },
    { name: "[Partenaire 5]", logo: "https://placehold.co/200x80?text=Logo+5" },
  ]), ContentType.JSON);

  // Home — FAQ
  await upsertContent("home.faq.title", "Questions fréquentes");
  await upsertContent("home.faq.items", JSON.stringify([
    { q: "[QUESTION 1] ?", a: "[RÉPONSE 1 — lorem ipsum.]" },
    { q: "[QUESTION 2] ?", a: "[RÉPONSE 2 — lorem ipsum.]" },
    { q: "[QUESTION 3] ?", a: "[RÉPONSE 3 — lorem ipsum.]" },
    { q: "[QUESTION 4] ?", a: "[RÉPONSE 4 — lorem ipsum.]" },
  ]), ContentType.JSON);

  // Aides
  await upsertContent("aides.hero.title", "Les aides à la rénovation énergétique");
  await upsertContent("aides.hero.subtitle", "[SOUS-TITRE PAGE AIDES]");
  for (const a of AIDES) {
    await upsertContent(`aides.${a.key}.title`, a.title);
    await upsertContent(`aides.${a.key}.description`, `[DESCRIPTION — ${a.title}. Lorem ipsum dolor sit amet.]`);
  }

  // Contact
  await upsertContent("contact.hero.title", "Contactez-nous");
  await upsertContent("contact.hero.subtitle", "[SOUS-TITRE CONTACT]");

  // Pages légales
  await upsertContent("legal.mentions.title", "Mentions légales");
  await upsertContent("legal.mentions.body", "[CONTENU MENTIONS LÉGALES]", ContentType.RICHTEXT);
  await upsertContent("legal.cgu.title", "Conditions générales d'utilisation");
  await upsertContent("legal.cgu.body", "[CONTENU CGU]", ContentType.RICHTEXT);
  await upsertContent("legal.privacy.title", "Politique de confidentialité");
  await upsertContent("legal.privacy.body", "[CONTENU CONFIDENTIALITÉ]", ContentType.RICHTEXT);
  await upsertContent("legal.cookies.title", "Politique cookies");
  await upsertContent("legal.cookies.body", "[CONTENU COOKIES]", ContentType.RICHTEXT);

  // Simulateur
  await upsertContent("simulator.intro.title", "Estimez vos aides en quelques clics");
  await upsertContent("simulator.intro.subtitle", "[SOUS-TITRE SIMULATEUR]");
  await upsertContent("simulator.merci.title", "Merci, votre demande est enregistrée");
  await upsertContent("simulator.merci.body", "[MESSAGE DE REMERCIEMENT — vous serez recontacté sous 24-48h.]");

  console.log("✓ Contents seeded");
}

async function seedSimulatorSteps() {
  // Wipe existing then recreate to keep order consistent
  await prisma.simulatorStep.deleteMany({});

  const steps = [
    {
      key: "logement_type",
      label: "Quel est votre type de logement ?",
      fieldType: FieldType.RADIO,
      required: true,
      options: [
        { value: "maison", label: "Maison" },
        { value: "appartement", label: "Appartement" },
      ],
    },
    {
      key: "statut",
      label: "Quel est votre statut ?",
      fieldType: FieldType.RADIO,
      required: true,
      options: [
        { value: "proprietaire-occupant", label: "Propriétaire occupant" },
        { value: "bailleur", label: "Propriétaire bailleur" },
        { value: "locataire", label: "Locataire" },
      ],
    },
    {
      key: "travaux",
      label: "Quels travaux envisagez-vous ?",
      helpText: "Plusieurs choix possibles.",
      fieldType: FieldType.CHECKBOX,
      required: true,
      options: TRAVAUX.map((t) => ({ value: t.slug, label: t.title })),
    },
    {
      key: "surface",
      label: "Quelle est la surface de votre logement (m²) ?",
      fieldType: FieldType.NUMBER,
      required: true,
      config: { min: 10, max: 1000, placeholder: "Ex : 95" },
    },
    {
      key: "chauffage_actuel",
      label: "Quel est votre chauffage actuel ?",
      fieldType: FieldType.SELECT,
      required: true,
      options: [
        { value: "fioul", label: "Fioul" },
        { value: "gaz", label: "Gaz" },
        { value: "electrique", label: "Électrique" },
        { value: "bois", label: "Bois / biomasse" },
        { value: "pac", label: "Pompe à chaleur" },
        { value: "autre", label: "Autre" },
      ],
    },
    {
      key: "annee_construction",
      label: "Année de construction du logement",
      fieldType: FieldType.SELECT,
      required: true,
      options: [
        { value: "avant-1948", label: "Avant 1948" },
        { value: "1948-1974", label: "Entre 1948 et 1974" },
        { value: "1975-1989", label: "Entre 1975 et 1989" },
        { value: "1990-2005", label: "Entre 1990 et 2005" },
        { value: "apres-2005", label: "Après 2005" },
      ],
    },
    {
      key: "foyer_personnes",
      label: "Combien de personnes composent votre foyer ?",
      fieldType: FieldType.NUMBER,
      required: true,
      config: { min: 1, max: 15, placeholder: "Ex : 4" },
    },
    {
      key: "revenus",
      label: "Quelle est votre tranche de revenus fiscaux ?",
      helpText: "Cette information sert uniquement à estimer vos aides.",
      fieldType: FieldType.RADIO,
      required: true,
      options: [
        { value: "tres-modeste", label: "Très modestes" },
        { value: "modeste", label: "Modestes" },
        { value: "intermediaire", label: "Intermédiaires" },
        { value: "superieur", label: "Supérieurs" },
      ],
    },
    {
      key: "code_postal",
      label: "Code postal et ville",
      fieldType: FieldType.TEXT,
      required: true,
      config: { placeholder: "Ex : 75001 Paris" },
    },
    {
      key: "coordonnees",
      label: "Vos coordonnées",
      helpText: "Nous vous recontactons sous 24-48h.",
      fieldType: FieldType.TEXT,
      required: true,
      config: { compound: true },
    },
  ];

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    await prisma.simulatorStep.create({
      data: {
        order: i + 1,
        key: s.key,
        label: s.label,
        helpText: s.helpText ?? null,
        fieldType: s.fieldType,
        required: s.required,
        options: s.options ? JSON.stringify(s.options) : null,
        config: s.config ? JSON.stringify(s.config) : null,
      },
    });
  }
  console.log(`✓ ${steps.length} simulator steps`);
}

async function seedArticles() {
  const articles = [
    {
      slug: "isolation-combles-prime",
      title: "Comment financer l'isolation de ses combles en 2026",
      excerpt: "[EXTRAIT ARTICLE 1 — lorem ipsum dolor sit amet.]",
      content: "# [TITRE H1 ARTICLE]\n\n[INTRODUCTION en quelques lignes.]\n\n## Première section\n\n[CONTENU LOREM IPSUM]\n\n## Seconde section\n\n[CONTENU LOREM IPSUM]\n",
      coverImage: "https://placehold.co/1200x600?text=Article+1",
    },
    {
      slug: "pompe-chaleur-guide",
      title: "Pompe à chaleur : le guide complet pour bien choisir",
      excerpt: "[EXTRAIT ARTICLE 2 — lorem ipsum.]",
      content: "# [TITRE H1 ARTICLE]\n\n[INTRO]\n\n## Avantages\n\n- [Point 1]\n- [Point 2]\n- [Point 3]\n",
      coverImage: "https://placehold.co/1200x600?text=Article+2",
    },
    {
      slug: "maprimerenov-2026",
      title: "MaPrimeRénov' en 2026 : ce qui change",
      excerpt: "[EXTRAIT ARTICLE 3 — lorem ipsum.]",
      content: "# [TITRE H1 ARTICLE]\n\n[INTRO]\n\n## Nouveautés\n\n[CONTENU]\n",
      coverImage: "https://placehold.co/1200x600?text=Article+3",
    },
  ];

  for (const a of articles) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        ...a,
        published: true,
        publishedAt: new Date(),
      },
    });
  }
  console.log(`✓ ${articles.length} articles`);
}

async function main() {
  await seedAdmin();
  await seedContent();
  await seedSimulatorSteps();
  await seedArticles();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
