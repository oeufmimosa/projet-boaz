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

  // Chatbox — éditable côté admin via /admin/chatbox
  await upsertContent("chatbox.advisor.name", "Camille — Climat Hexagon");
  await upsertContent("chatbox.advisor.initials", "CH");
  await upsertContent("chatbox.preview", "Discutez avec nous de votre projet");
  await upsertContent("chatbox.autoopen.enabled", "true");
  await upsertContent("chatbox.autoopen.delay_seconds", "0");
  await upsertContent("chatbox.step1.message", "👋 Bonjour ! Je suis Camille de Climat Hexagon. Pour mieux vous orienter, quel est votre projet de rénovation ?");
  await upsertContent("chatbox.step1.followup", "Quels travaux vous intéressent ?");
  await upsertContent("chatbox.step1.options", JSON.stringify([
    { value: "isolation",  label: "🏠 Isolation (combles, murs, sols)" },
    { value: "pac",        label: "🔥 Pompe à chaleur" },
    { value: "solaire",    label: "☀️ Panneaux solaires" },
    { value: "fenetres",   label: "🪟 Fenêtres / menuiseries" },
    { value: "plusieurs",  label: "🧰 Plusieurs travaux" },
    { value: "indecis",    label: "🤔 Je ne sais pas encore" },
  ]), "JSON");
  await upsertContent("chatbox.step2.message", "Très bien ! Vous habitez :");
  await upsertContent("chatbox.step2.options", JSON.stringify([
    { value: "maison",       label: "🏡 Une maison individuelle" },
    { value: "appartement",  label: "🏢 Un appartement" },
  ]), "JSON");
  await upsertContent("chatbox.step3.message", "Et vous êtes :");
  await upsertContent("chatbox.step3.options", JSON.stringify([
    { value: "proprietaire-occupant", label: "👤 Propriétaire occupant" },
    { value: "bailleur",              label: "🔑 Propriétaire bailleur" },
    { value: "locataire",             label: "🏠 Locataire" },
  ]), "JSON");
  await upsertContent("chatbox.step4.message", "Parfait ! Quel est le code postal de votre projet ?");
  await upsertContent("chatbox.handoff.message", "Super, j'ai tout ce qu'il faut pour vous orienter. Je vous prépare une estimation personnalisée avec **les aides auxquelles vous avez droit**. C'est parti ?");
  await upsertContent("chatbox.handoff.cta", "Voir mes aides 🪙");
  await upsertContent("chatbox.handoff.later", "Plus tard");
  await upsertContent("chatbox.resume", "Bon retour ! On continue ?");

  // Simulateur
  await upsertContent("simulator.intro.title", "Estimez vos aides en quelques clics");
  await upsertContent("simulator.intro.subtitle", "[SOUS-TITRE SIMULATEUR]");
  await upsertContent("simulator.merci.title", "Merci, votre demande est enregistrée");
  await upsertContent("simulator.merci.body", "[MESSAGE DE REMERCIEMENT — vous serez recontacté sous 24-48h.]");

  console.log("✓ Contents seeded");
}

async function seedSimulatorSteps() {
  await prisma.simulatorStep.deleteMany({});

  // Mapping illustrations pour la liste des travaux
  const TRAVAUX_ILLUS: Record<string, string> = {
    "isolation-combles": "insulation-attic",
    "isolation-murs": "insulation-walls",
    "isolation-sols": "insulation-floor",
    "pompe-a-chaleur-air-eau": "heat-pump-air-water",
    "pompe-a-chaleur-air-air": "heat-pump-air-air",
    "chaudiere": "boiler",
    "photovoltaique": "solar",
    "fenetres": "windows",
    "vmc-double-flux": "vmc",
    "audit-energetique": "audit",
  };

  const steps: Array<{
    key: string;
    label: string;          // peut contenir **fragment** à surligner
    helpText?: string;
    encouragement?: string;
    helpTooltip?: string;
    fieldType: FieldType;
    required: boolean;
    options?: Array<{ value: string; label: string; helper?: string; illustrationKey?: string }>;
    config?: Record<string, unknown>;
  }> = [
    {
      key: "logement_type",
      label: "Parlez-nous de **votre logement**",
      helpText: "Votre projet concerne :",
      fieldType: FieldType.RADIO,
      required: true,
      options: [
        { value: "maison",      label: "Maison",       helper: "Le plus courant", illustrationKey: "house" },
        { value: "appartement", label: "Appartement",                              illustrationKey: "apartment" },
      ],
    },
    {
      key: "statut",
      label: "Et vous êtes **propriétaire ou locataire** ?",
      encouragement: "🎉 Parfait, déjà 1 minute restante !",
      fieldType: FieldType.RADIO,
      required: true,
      options: [
        { value: "proprietaire-occupant", label: "Propriétaire occupant", illustrationKey: "owner-living" },
        { value: "bailleur",              label: "Propriétaire bailleur", illustrationKey: "owner-renting" },
        { value: "locataire",             label: "Locataire",             illustrationKey: "tenant" },
      ],
    },
    {
      key: "travaux",
      label: "Quels **travaux** vous intéressent ?",
      helpText: "Plusieurs choix possibles.",
      fieldType: FieldType.CHECKBOX,
      required: true,
      options: TRAVAUX.map((t) => ({
        value: t.slug,
        label: t.title,
        illustrationKey: TRAVAUX_ILLUS[t.slug],
      })),
    },
    {
      key: "surface",
      label: "Quelle **surface** fait votre logement ?",
      helpText: "En mètres carrés habitables.",
      fieldType: FieldType.NUMBER,
      required: true,
      config: { min: 10, max: 1000, placeholder: "Ex : 95" },
    },
    {
      key: "chauffage_actuel",
      label: "Votre **chauffage actuel** est :",
      encouragement: "✨ Vous y êtes presque !",
      fieldType: FieldType.RADIO,
      required: true,
      options: [
        { value: "gaz",        label: "Gaz",            illustrationKey: "heating-gas" },
        { value: "electrique", label: "Électrique",     illustrationKey: "heating-electric" },
        { value: "fioul",      label: "Fioul",          illustrationKey: "heating-fuel" },
        { value: "bois",       label: "Bois / biomasse",illustrationKey: "heating-wood" },
        { value: "pac",        label: "Pompe à chaleur",illustrationKey: "heating-pump" },
        { value: "autre",      label: "Autre",          illustrationKey: "heating-other" },
      ],
    },
    {
      key: "annee_construction",
      label: "**Année de construction** du logement",
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
      label: "Combien de **personnes** dans votre foyer ?",
      encouragement: "🪙 Vos aides arrivent...",
      fieldType: FieldType.RADIO,
      required: true,
      options: [
        { value: "1",     label: "1 personne",      illustrationKey: "household-1" },
        { value: "2",     label: "2 personnes",     illustrationKey: "household-2" },
        { value: "3",     label: "3 personnes",     illustrationKey: "household-3" },
        { value: "4",     label: "4 personnes",     illustrationKey: "household-4" },
        { value: "5plus", label: "5 ou plus",       illustrationKey: "household-5plus" },
      ],
    },
    {
      key: "revenus",
      label: "Votre **tranche de revenus fiscaux**",
      helpText: "Sert uniquement à estimer le montant de vos aides.",
      helpTooltip: "Vous trouvez votre RFR sur votre dernier avis d'imposition (case 25).",
      fieldType: FieldType.RADIO,
      required: true,
      options: [
        { value: "tres-modeste",  label: "Très modestes" },
        { value: "modeste",       label: "Modestes" },
        { value: "intermediaire", label: "Intermédiaires" },
        { value: "superieur",     label: "Supérieurs" },
      ],
    },
    {
      key: "code_postal",
      label: "**Code postal** du logement",
      helpText: "Format attendu : 75001 Paris.",
      fieldType: FieldType.TEXT,
      required: true,
      config: { placeholder: "Ex : 75001 Paris" },
    },
    {
      key: "coordonnees",
      label: "Vos **coordonnées**",
      helpText: "🔒 Vos données sont protégées (RGPD). Nous vous recontactons sous 24-48h.",
      fieldType: FieldType.TEXT,
      required: true,
      config: { compound: true },
    },
  ];

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    // Cast `as any` : le client Prisma typé peut ne pas avoir les nouveaux
    // champs si `prisma generate` n'a pas pu se rejouer (DLL Windows verrouillée
    // par le dev server). Les colonnes existent en DB grâce à la migration.
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
        encouragement: s.encouragement ?? null,
        helpTooltip: s.helpTooltip ?? null,
      } as never,
    });
  }
  console.log(`✓ ${steps.length} simulator steps`);
}

async function seedTestimonials() {
  // Cast en any : modèle Testimonial peut ne pas être encore typé.
  const tm = (prisma as unknown as {
    testimonial: {
      deleteMany: (a: unknown) => Promise<unknown>;
      create: (a: unknown) => Promise<unknown>;
    };
  }).testimonial;
  await tm.deleteMany({});
  const items = [
    { quote: "J'ai obtenu 8 200 € d'aides pour ma PAC, en 3 semaines !", authorName: "Marc", authorCity: "Lyon", rating: 5, context: "PAC" },
    { quote: "Isolation des combles posée en 1 jour, facture divisée par 2.", authorName: "Sophie", authorCity: "Bordeaux", rating: 5, context: "Isolation" },
    { quote: "Très bien accompagnée du devis aux travaux, transparence totale.", authorName: "Émilie", authorCity: "Nantes", rating: 5, context: "Photovoltaïque" },
  ];
  for (let i = 0; i < items.length; i++) {
    await tm.create({ data: { ...items[i], order: i, active: true } });
  }
  console.log(`✓ ${items.length} testimonials`);
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
  await seedTestimonials();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
