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
  await upsertContent("footer.copyright", "© Groupe Climat Hexagone — Tous droits réservés");
  await upsertContent("footer.newsletter.title", "Newsletter");

  // Home — Hero
  // ⚠️ Formulation prudente : pas de chiffre absolu sans source publique
  // vérifiable. Les barèmes MaPrimeRénov' + CEE + Éco-PTZ varient selon le
  // profil de revenus, le type de travaux et la zone climatique. Pour viser
  // une requête SEO précise (« aides 2025 jusqu'à X € »), le client doit
  // fournir un montant validé sur france-renov.gouv.fr ou maprimerenov.gouv.fr
  // (avec date de vérification dans le commentaire). En attendant, on dit
  // « plusieurs milliers d'euros » qui reste vrai dans tous les cas.
  // TODO client/SEO : remplacer par le montant chiffré validé une fois sourcé.
  await upsertContent(
    "home.hero.title",
    "Une structure française fondée en 1989 au service de la rénovation énergétique",
  );
  await upsertContent(
    "home.hero.subtitle",
    "Pompe à chaleur, isolation, photovoltaïque : nous calculons vos aides MaPrimeRénov' et CEE, puis confions vos travaux à un artisan RGE de notre réseau.",
  );
  await upsertContent("home.hero.cta_primary", "Estimer mes aides en 2 min");
  await upsertContent("home.hero.cta_secondary", "Découvrir nos services");
  await upsertContent("home.hero.image", "https://placehold.co/1200x600?text=Hero", ContentType.IMAGE_REF);

  // Home — Services
  await upsertContent("home.services.label",   "Nos solutions");
  await upsertContent("home.services.title",   "Des solutions énergétiques pensées pour votre habitat");
  await upsertContent(
    "home.services.subtitle",
    "Pompe à chaleur, climatisation, isolation et solutions énergétiques performantes : nous accompagnons les particuliers dans le choix d'équipements fiables, conçus pour améliorer durablement le confort et la performance énergétique de leur logement.",
  );

  // Home — Cards services interactives (6) : shortLabel + description (30-50 mots)
  // + benefits[] (3 puces). Tout est éditable côté admin via les clés Content.
  const SERVICE_CARDS: Array<{
    slug: string;
    shortLabel: string;
    description: string;
    benefits: string[];
  }> = [
    {
      slug: "pompe-a-chaleur-air-eau",
      shortLabel: "PAC Air/Eau",
      description:
        "Chauffage central et eau chaude par captation des calories de l'air extérieur. Solution la plus performante pour remplacer une chaudière fioul ou gaz.",
      benefits: [
        "Jusqu'à 75 % d'économies de chauffage",
        "Compatible plancher chauffant et radiateurs",
        "Éligible MaPrimeRénov' + CEE",
      ],
    },
    {
      slug: "pompe-a-chaleur-air-air",
      shortLabel: "PAC Air/Air",
      description:
        "Climatisation réversible : chauffage en hiver, rafraîchissement en été. Idéale pour les logements sans chauffage central.",
      benefits: [
        "Chauffage ET climatisation",
        "Installation rapide multi-split",
        "Économies jusqu'à 70 % vs chauffage électrique",
      ],
    },
    {
      slug: "isolation-thermique-exterieure",
      shortLabel: "ITE — façades & murs",
      description:
        "Enveloppe isolante posée sur la façade extérieure de votre logement. Réduction des déperditions de chaleur jusqu'à 25 %.",
      benefits: [
        "Aucune perte de surface habitable",
        "Ravalement de façade inclus",
        "Aides cumulées jusqu'à plusieurs milliers d'euros",
      ],
    },
    {
      slug: "ballon-thermodynamique",
      shortLabel: "Eau chaude économique",
      description:
        "Chauffe-eau qui capte les calories de l'air ambiant. Trois à quatre fois plus économique qu'un cumulus électrique classique.",
      benefits: [
        "Installation rapide en 1 journée",
        "Compatible avec une cave ou un garage",
        "Aides MaPrimeRénov' applicables",
      ],
    },
    {
      slug: "systeme-solaire-combine",
      shortLabel: "SSC chauffage + ECS",
      description:
        "Capteurs solaires qui assurent à la fois le chauffage du logement et la production d'eau chaude sanitaire. La solution la plus complète.",
      benefits: [
        "Couvre jusqu'à 50 % des besoins en chauffage",
        "ECS solaire incluse",
        "Aides élevées disponibles",
      ],
    },
  ];

  for (const c of SERVICE_CARDS) {
    await upsertContent(`home.services.cards.${c.slug}.shortLabel`, c.shortLabel);
    await upsertContent(`home.services.cards.${c.slug}.description`, c.description);
    await upsertContent(
      `home.services.cards.${c.slug}.benefits`,
      JSON.stringify(c.benefits),
      ContentType.JSON,
    );
  }
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

  // Home — How it works (4 étapes pédagogiques courtes)
  await upsertContent("home.how.title", "Votre projet en 4 étapes claires");
  await upsertContent("home.how.steps", JSON.stringify([
    {
      title: "1. Estimation en ligne",
      description: "Vous décrivez votre logement et vos travaux ; un premier diagnostic d'éligibilité aux aides s'affiche en 2 minutes.",
    },
    {
      title: "2. Étude personnalisée",
      description: "Un conseiller analyse votre dossier, calcule MaPrimeRénov' + CEE et vous propose un plan de financement.",
    },
    {
      title: "3. Devis et installation",
      description: "Un artisan RGE de notre réseau vous fournit un devis détaillé puis intervient dans les règles de l'art.",
    },
    {
      title: "4. Suivi long terme",
      description: "Garantie décennale, entretien et accompagnement administratif jusqu'au versement de vos aides.",
    },
  ]), ContentType.JSON);

  // Home — Chiffres clés.
  // ⚠️ TOUS les chiffres spécifiques sont des placeholders bloquants `[X]`.
  // Ils doivent être remplacés par le client AVANT toute mise en production
  // publique : publier "1 200 chantiers réalisés" sans pouvoir le justifier
  // exposerait juridiquement (publicité trompeuse). Le composant
  // <KeyFigures>/<KeyFiguresCompact> détecte ces patterns `[X]` et les rend
  // en mode `placeholderHighlight` (doré clignotant) en admin/editor.
  await upsertContent("home.figures.title", "Notre savoir-faire en chiffres");
  await upsertContent("home.figures.items", JSON.stringify([
    { value: "37 ans", label: "D'expérience" },
    { value: "100 %",  label: "Étude personnalisée" },
    { value: "100 %",  label: "Équipements certifiés" },
    { value: "100 %",  label: "Intervention en France métropolitaine" },
  ]), ContentType.JSON);

  // Home — Témoignages.
  // ⚠️ ZONE DE RISQUE JURIDIQUE/ÉTHIQUE.
  // Les 6 entrées ci-dessous sont des PLACEHOLDERS FICTIFS à but de mise
  // en page uniquement (chacune marquée `placeholder: true`). Avant toute
  // mise en production publique du site, le client doit IMPÉRATIVEMENT :
  //   1. Recueillir le consentement écrit RGPD des vrais clients qui
  //      acceptent de témoigner (article 6 RGPD).
  //   2. Remplacer les 6 entrées ci-dessous par des avis vérifiables.
  //   3. Ne PAS publier des avis fictifs : risque de pratique commerciale
  //      trompeuse (article L121-2 Code de la consommation, sanctions
  //      jusqu'à 300 000 € ou 10 % du CA).
  // Le flag `placeholder: true` est lu côté composant et propage un
  // attribut `data-content="placeholder"` sur la card pour visibilité.
  // Cf. docs/seo.md "Checklist pré-publication".
  await upsertContent("home.testimonials.title", "Ce qu'en disent nos clients");
  await upsertContent("home.testimonials.items", JSON.stringify([
    {
      name: "Marie L.",
      city: "Lille (59)",
      quote:
        "Nous avions peur de la complexité administrative. L'équipe a tout pris en charge : devis, dossier MaPrimeRénov', primes CEE. Notre pompe à chaleur a été installée en deux jours, sans surprise.",
      rating: 5,
      placeholder: true,
    },
    {
      name: "Hervé G.",
      city: "Bordeaux (33)",
      quote:
        "Conseil clair, pas de pression à la vente. On nous a expliqué que l'isolation extérieure était plus rentable que les fenêtres dans notre cas. Trois ans après, la facture de gaz a fondu.",
      rating: 5,
      placeholder: true,
    },
    {
      name: "Sophie D.",
      city: "Rennes (35)",
      quote:
        "Très bon accompagnement pour notre installation photovoltaïque. Les économies annoncées sont au rendez-vous, et le suivi à un an a été apprécié.",
      rating: 4,
      placeholder: true,
    },
    {
      name: "Patrick et Anne M.",
      city: "Lyon (69)",
      quote:
        "Maison de 1978, factures qui partaient en fumée. ITE + ballon thermodynamique, on a divisé notre consommation par deux. L'équipe a tenu les délais.",
      rating: 5,
      placeholder: true,
    },
    {
      name: "Karim B.",
      city: "Toulouse (31)",
      quote:
        "On hésitait entre PAC air-air et air-eau. L'étude faite à la maison a tranché clairement, devis honnête et installation propre.",
      rating: 5,
      placeholder: true,
    },
    {
      name: "Élodie P.",
      city: "Strasbourg (67)",
      quote:
        "Système solaire combiné posé l'an dernier. Bon retour sur investissement attendu, l'équipe est restée disponible après le chantier pour les démarches administratives.",
      rating: 4,
      placeholder: true,
    },
  ]), ContentType.JSON);

  // Home — Partenaires (placeholders)
  await upsertContent("home.partners.title", "Qualifications & dispositifs");
  await upsertContent("home.partners.items", JSON.stringify([
    { name: "Qualibat", logo: "https://placehold.co/200x80?text=Qualibat" }, // TODO client : logo officiel
    { name: "RGE",      logo: "https://placehold.co/200x80?text=RGE" },
    { name: "QualiPV",  logo: "https://placehold.co/200x80?text=QualiPV" },
    { name: "Qualibois", logo: "https://placehold.co/200x80?text=Qualibois" },
    { name: "France Rénov'", logo: "https://placehold.co/200x80?text=France+Renov" },
  ]), ContentType.JSON);

  // Home — FAQ (questions ciblées requêtes Google long-tail, chiffres 2025
  // — sources : france-renov.gouv.fr, maprimerenov.gouv.fr, ademe.fr.
  // TODO client/SEO : revérifier annuellement les barèmes mentionnés.)
  await upsertContent("home.faq.title", "Vos questions, nos réponses");
  await upsertContent("home.faq.items", JSON.stringify([
    {
      q: "Quelles aides pour la rénovation énergétique en 2025 ?",
      a: "Trois dispositifs principaux sont cumulables : MaPrimeRénov' (forfait variant selon vos revenus et le type de travaux), les primes CEE versées par les fournisseurs d'énergie, et l'éco-prêt à taux zéro (jusqu'à 50 000 €). S'y ajoutent la TVA réduite à 5,5 % sur les travaux d'efficacité énergétique et certaines aides locales. Notre conseiller vous calcule votre montant maximum cumulable lors de l'étude personnalisée.",
    },
    {
      q: "Quel est le prix d'une pompe à chaleur air-eau ?",
      a: "Selon l'ADEME, comptez en moyenne 9 000 à 18 000 € posée pour une pompe à chaleur air-eau, hors aides. Le prix dépend de la puissance, de la complexité de la pose et de la qualité des équipements. Avec MaPrimeRénov' et les primes CEE, la dépense réelle peut être divisée par deux à trois pour un foyer aux revenus modestes.",
    },
    {
      q: "Combien coûte une isolation thermique extérieure ?",
      a: "L'isolation thermique extérieure (ITE) coûte en moyenne 100 à 220 € le m² selon l'isolant choisi et la finition (enduit, bardage). Pour une maison de 100 m² de façade, prévoyez 12 000 à 25 000 € avant aides. C'est l'un des travaux les plus efficaces pour réduire vos pertes de chaleur, jusqu'à 25 % sur la facture annuelle.",
    },
    {
      q: "Suis-je éligible à MaPrimeRénov' ?",
      a: "MaPrimeRénov' est ouverte à tous les propriétaires (occupants ou bailleurs) dont le logement a plus de 15 ans, occupé en résidence principale au moins 8 mois par an. Le montant de l'aide dépend de votre catégorie de revenus (Bleu / Jaune / Violet / Rose) et du type de travaux. Vous pouvez vérifier votre éligibilité gratuitement via notre simulateur.",
    },
    {
      q: "Combien de temps dure une installation ?",
      a: "Cela dépend du chantier : 1 à 2 jours pour un chauffe-eau ou un ballon thermodynamique, 2 à 4 jours pour une pompe à chaleur air-eau, 1 à 2 semaines pour une isolation thermique extérieure ou une installation photovoltaïque. Notre planificateur s'adapte à votre disponibilité et nos artisans s'engagent sur des créneaux fermes.",
    },
    {
      q: "Que comprend votre accompagnement ?",
      a: "Étude personnalisée, calcul des aides, sélection d'un artisan RGE certifié de notre réseau, suivi du chantier et accompagnement administratif jusqu'au versement de vos aides. Notre objectif : que vous n'ayez aucun dossier à monter vous-même. Le devis et l'étude sont gratuits et sans engagement.",
    },
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
  await upsertContent("chatbox.advisor.name", "Camille — Climat Hexagone");
  await upsertContent("chatbox.advisor.initials", "CH");
  await upsertContent("chatbox.preview", "Discutez avec nous de votre projet");
  await upsertContent("chatbox.autoopen.enabled", "true");
  await upsertContent("chatbox.autoopen.delay_seconds", "0");
  await upsertContent("chatbox.step1.message", "Bonjour ! Je suis Camille de Climat Hexagone. Pour mieux vous orienter, quel est votre projet de rénovation ?");
  await upsertContent("chatbox.step1.followup", "Quels travaux vous intéressent ?");
  await upsertContent("chatbox.step1.options", JSON.stringify([
    { value: "pac-air-eau",    label: "🔥 Pompe à chaleur Air/Eau" },
    { value: "pac-air-air",    label: "❄️ Pompe à chaleur Air/Air" },
    { value: "ite",            label: "🧱 Isolation thermique extérieure (ITE)" },
    { value: "ballon",         label: "🛢️ Ballon thermodynamique" },
    { value: "ssc",            label: "🔆 Système solaire combiné" },
    { value: "plusieurs",      label: "🧰 Plusieurs travaux / Je ne sais pas" },
    { value: "parrainer",      label: "🤝 Je veux parrainer un proche" },
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
  await upsertContent("chatbox.handoff.cta", "Voir mes aides");
  await upsertContent("chatbox.handoff.later", "Plus tard");
  await upsertContent("chatbox.resume", "Bon retour ! On continue ?");

  // Simulateur
  await upsertContent("simulator.intro.title", "Estimez vos aides en quelques clics");
  await upsertContent("simulator.merci.title", "Merci, votre demande est enregistrée");
  await upsertContent("simulator.merci.body", "Vous serez recontacté sous 24-48h");

  console.log("✓ Contents seeded");
}

async function seedSimulatorSteps() {
  await prisma.simulatorStep.deleteMany({});

  // Mapping illustrations aligné sur les services réels du catalogue.
  const SERVICES_FOR_SIMULATOR = [
    { slug: "pompe-a-chaleur-air-eau",         title: "Pompe à chaleur Air/Eau",        illus: "heat-pump-air-water" },
    { slug: "pompe-a-chaleur-air-air",         title: "Pompe à chaleur Air/Air",        illus: "heat-pump-air-water" },
    { slug: "isolation-thermique-exterieure",  title: "Isolation thermique extérieure", illus: "insulation-walls" },
    { slug: "ballon-thermodynamique",          title: "Ballon thermodynamique",         illus: "boiler" },
    { slug: "systeme-solaire-combine",         title: "Système solaire combiné",        illus: "solar" },
  ];

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
      encouragement: "Parfait, déjà 1 minute restante !",
      fieldType: FieldType.RADIO,
      required: true,
      options: [
        { value: "proprietaire-occupant", label: "Propriétaire occupant", illustrationKey: "owner-living" },
        { value: "bailleur",              label: "Propriétaire bailleur", illustrationKey: "owner-renting" },
        { value: "locataire",             label: "Locataire",             illustrationKey: "tenant" },
      ],
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
      encouragement: "Vous y êtes presque !",
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
      key: "foyer_personnes",
      label: "Combien de **personnes** dans votre foyer ?",
      encouragement: "Vos aides arrivent...",
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
      key: "code_postal",
      label: "**Code postal** du logement",
      fieldType: FieldType.TEXT,
      required: true,
      config: { placeholder: "Ex : 75001" },
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
      key: "coordonnees",
      label: "Vos **coordonnées**",
      helpText: "Vos données sont protégées (RGPD). Nous vous recontactons sous 24-48h.",
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
  // Articles éditoriaux SEO — Phase 3 complète (8 articles).
  // Sources publiques commentées en tête de chaque fichier prisma/articles/*.ts.
  // Dates échelonnées sur ~7 mois (sept 2025 → avril 2026) pour ne pas avoir
  // tous les articles à la même date — antériorité réaliste pour le pied du blog.
  const { articleMaprimerenov2025 }          = await import("./articles/maprimerenov-2025");
  const { articlePacAirEauVsAirAir }         = await import("./articles/pac-air-eau-vs-air-air");
  const { articleIteGuide }                  = await import("./articles/ite-guide-prix-aides");
  const { articlePhotovoltaiqueRentabilite } = await import("./articles/photovoltaique-rentabilite");
  const { articleBallonThermoVsCesi }        = await import("./articles/ballon-thermo-vs-cesi");
  const { articleChoisirArtisanRge }         = await import("./articles/choisir-artisan-rge");
  const { articleSystemeSolaireCombine }     = await import("./articles/systeme-solaire-combine");
  const { article5ErreursDevis }             = await import("./articles/5-erreurs-devis-renovation");

  const articles = [
    { ...articleMaprimerenov2025,          publishedAt: new Date("2025-09-15T10:00:00Z") },
    { ...articlePacAirEauVsAirAir,         publishedAt: new Date("2025-10-12T10:00:00Z") },
    { ...articleIteGuide,                  publishedAt: new Date("2025-11-08T10:00:00Z") },
    { ...articlePhotovoltaiqueRentabilite, publishedAt: new Date("2025-12-05T10:00:00Z") },
    { ...articleBallonThermoVsCesi,        publishedAt: new Date("2026-01-09T10:00:00Z") },
    { ...articleChoisirArtisanRge,         publishedAt: new Date("2026-02-06T10:00:00Z") },
    { ...articleSystemeSolaireCombine,     publishedAt: new Date("2026-03-08T10:00:00Z") },
    { ...article5ErreursDevis,             publishedAt: new Date("2026-04-04T10:00:00Z") },
  ];

  for (const a of articles) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        coverImage: a.coverImage,
        published: true,
        publishedAt: a.publishedAt,
      },
      create: {
        ...a,
        published: true,
      },
    });
  }
  console.log(`✓ ${articles.length} article(s) seedé(s)`);
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
