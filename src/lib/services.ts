/**
 * Catalogue central des 6 services réels du client. Source de vérité pour
 * /services, /services/[slug], la grille de la home, le menu et la chatbox.
 *
 * Les FAQ ci-dessous citent des chiffres publics 2025. Sources en commentaire
 * à côté de chaque chiffre. À revérifier annuellement (les barèmes changent
 * au 1er janvier).
 *
 * TODO SEO/client : revérifier les fourchettes ADEME et MaPrimeRénov' au
 * prochain millésime de barème.
 */
export type FaqItem = { q: string; a: string };

export type Service = {
  slug: string;
  label: string;
  short: string;
  icon: string;
  description: string;
  advantages: string[];
  aides: string;
  faq: FaqItem[];
};

export const SERVICES_LIST: Service[] = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "panneau-photovoltaique",
    label: "Panneau photovoltaïque",
    short: "Produisez votre propre électricité grâce au solaire.",
    icon: "☀️",
    description:
      "L'installation de panneaux photovoltaïques vous permet de produire votre propre électricité, " +
      "réduire votre facture EDF et revendre votre surplus. Étude personnalisée du potentiel solaire " +
      "de votre toiture, dimensionnement précis et installation par un partenaire RGE.",
    advantages: [
      "Jusqu'à 70 % d'économies sur votre facture d'électricité",
      "Revente du surplus à EDF OA",
      "Garantie matériel jusqu'à 25 ans",
      "Aides MaPrimeRénov' et prime à l'autoconsommation",
    ],
    aides: "Prime à l'autoconsommation, TVA réduite à 10 %, exonération d'impôt sur la revente partielle.",
    faq: [
      {
        q: "Combien coûte une installation photovoltaïque ?",
        // Source : ADEME, fourchette de prix moyens marché résidentiel 2024.
        // À revérifier sur https://www.ademe.fr/ et https://france-renov.gouv.fr/
        a: "Pour une installation résidentielle, comptez en moyenne 8 000 à 15 000 € pose comprise pour 3 kWc (puissance courante) selon la marque des panneaux, l'orientation et la complexité de la toiture. Avec la prime à l'autoconsommation et la TVA réduite à 10 %, le coût net peut descendre nettement.",
      },
      {
        q: "Quelle puissance de panneaux choisir ?",
        a: "Pour un foyer de 4 personnes consommant ~4 500 kWh/an, une installation de 3 kWc est généralement bien dimensionnée. Notre étude personnalisée mesure votre consommation réelle, l'ensoleillement de votre toiture et votre profil de consommation pour recommander la puissance optimale (3 à 9 kWc en résidentiel).",
      },
      {
        q: "Vais-je revendre mon surplus ?",
        a: "Oui. EDF Obligation d'Achat (EDF OA) rachète votre surplus à un tarif fixé pour 20 ans. Le tarif est révisé trimestriellement par la CRE (Commission de Régulation de l'Énergie) — en moyenne autour de 0,12 €/kWh pour les installations résidentielles selon le millésime. Notre conseiller vous donne le tarif applicable au moment de votre devis.",
      },
      {
        q: "Quelle est la durée de vie des panneaux ?",
        a: "Les panneaux photovoltaïques ont une durée de vie de 25 à 30 ans. Les fabricants garantissent en général 25 ans une production minimale de 80 % de la puissance initiale. L'onduleur (qui convertit le courant continu en alternatif) a une durée de vie plus courte, 10 à 15 ans, et peut être remplacé.",
      },
      {
        q: "Faut-il un permis ou des démarches ?",
        a: "Pour une installation en toiture inférieure à 3 kWc, une simple déclaration préalable de travaux suffit dans la plupart des cas. Au-delà ou en cas de bâtiment classé, des autorisations supplémentaires peuvent être nécessaires. Nous gérons l'ensemble des démarches administratives pour vous.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "pompe-a-chaleur",
    label: "Pompe à chaleur (Air-Eau / Air-Air)",
    short: "Chauffage haute performance, été comme hiver.",
    icon: "🔥",
    description:
      "La pompe à chaleur capte l'énergie de l'air extérieur pour chauffer votre logement et produire " +
      "de l'eau chaude (Air-Eau) ou rafraîchir en été (Air-Air). Solution la plus rentable pour " +
      "remplacer une vieille chaudière fioul ou gaz.",
    advantages: [
      "Jusqu'à 75 % d'économies de chauffage",
      "Chauffage + climatisation possibles (Air-Air)",
      "Énergie renouvelable : 1 kWh consommé = 3 à 4 kWh restitués",
      "Éligible à MaPrimeRénov' et CEE",
    ],
    aides: "MaPrimeRénov' jusqu'à 5 000 €, CEE jusqu'à 4 000 €, Éco-PTZ.",
    faq: [
      {
        q: "Quelle différence entre PAC air-eau et air-air ?",
        a: "Une PAC air-eau alimente votre circuit de chauffage central (radiateurs ou plancher chauffant) ET produit l'eau chaude sanitaire. Une PAC air-air diffuse de l'air chaud (ou frais en été) via des unités intérieures, sans toucher à votre eau chaude. Si vous avez déjà des radiateurs à eau, l'air-eau est généralement plus simple à intégrer.",
      },
      {
        q: "Quel est le prix d'une pompe à chaleur ?",
        // Source : ADEME, "Coûts d'investissement des équipements de chauffage", 2024.
        // À recouper sur https://france-renov.gouv.fr/
        a: "Selon l'ADEME, une PAC air-eau coûte en moyenne 9 000 à 18 000 € posée selon la puissance et la complexité de l'installation. Une PAC air-air est généralement moins chère (6 000 à 12 000 € pour un système multi-split). Avec MaPrimeRénov' et les CEE, la dépense réelle peut être divisée par deux à trois pour un foyer aux revenus modestes.",
      },
      {
        q: "Quelles aides pour une pompe à chaleur ?",
        a: "MaPrimeRénov' couvre les PAC air-eau et géothermiques (l'air-air est exclu de MaPrimeRénov' en 2025). Les CEE viennent en complément, versées par les fournisseurs d'énergie. L'éco-PTZ peut financer le reste à charge. Lors de l'étude, nous calculons le montant cumulable applicable à votre profil de revenus.",
      },
      {
        q: "Une PAC fonctionne-t-elle quand il fait très froid ?",
        a: "Oui, les PAC modernes fonctionnent jusqu'à -15 °C voire -20 °C, mais leur performance baisse avec le froid. Sous certains climats (montagne notamment), une résistance d'appoint électrique prend le relais lors des pointes de froid. Pour la France métropolitaine hors haute montagne, une PAC seule couvre l'essentiel des besoins.",
      },
      {
        q: "Quel entretien ?",
        a: "Un entretien annuel par un professionnel est obligatoire pour les PAC de plus de 4 kW (décret 2020-912). Comptez 150 à 250 € par an. C'est le seul entretien régulier nécessaire. La durée de vie d'une PAC bien entretenue est de 15 à 20 ans.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "isolation-thermique-exterieure",
    label: "Isolation thermique extérieure (ITE)",
    short: "Réduisez vos pertes de chaleur jusqu'à 25 %.",
    icon: "🧱",
    description:
      "L'ITE consiste à envelopper votre maison d'un manteau isolant côté extérieur. " +
      "C'est la solution la plus efficace pour traiter les ponts thermiques, sans réduire " +
      "votre surface habitable, tout en ravalant la façade.",
    advantages: [
      "Suppression des ponts thermiques",
      "Pas de perte de surface intérieure",
      "Ravalement de façade inclus",
      "Confort d'été et d'hiver renforcé",
    ],
    aides: "MaPrimeRénov', CEE, Éco-PTZ. TVA à 5,5 %.",
    faq: [
      {
        q: "Combien coûte une ITE ?",
        // Source : ADEME, fourchette indicative isolation extérieure résidentiel 2024.
        a: "L'ITE coûte en moyenne 100 à 220 € le m² de façade selon l'isolant choisi (polystyrène, laine de roche, laine de bois) et la finition (enduit, bardage). Pour une maison avec 100 m² de façade, prévoyez 12 000 à 25 000 € avant aides.",
      },
      {
        q: "ITE ou ITI : laquelle choisir ?",
        a: "L'ITE (extérieure) est plus performante car elle traite les ponts thermiques en continu et ne réduit pas votre surface habitable. L'ITI (intérieure) est moins chère mais moins efficace et empiète sur les pièces. Si l'aspect extérieur peut être modifié et que la façade a besoin d'un ravalement, l'ITE est presque toujours le meilleur choix.",
      },
      {
        q: "Quelle épaisseur d'isolant ?",
        a: "Pour atteindre les exigences MaPrimeRénov' et BBC, comptez 14 à 20 cm d'isolant selon le matériau. La résistance thermique (R) doit être supérieure à 3,7 m².K/W pour les murs en zone H1 (la moitié nord de la France). Notre étude calcule l'épaisseur optimale en fonction de votre situation.",
      },
      {
        q: "Faut-il un permis ?",
        a: "Une déclaration préalable de travaux est obligatoire car l'ITE modifie l'aspect extérieur. Si votre maison est dans le périmètre des Bâtiments de France (proximité d'un monument historique), des contraintes supplémentaires s'appliquent. Nous gérons les démarches administratives en amont du chantier.",
      },
      {
        q: "Combien de temps dure le chantier ?",
        a: "Pour une maison de taille moyenne (100-150 m² de façade), le chantier dure 2 à 4 semaines selon la météo et la finition. La pose se fait sans interrompre votre vie dans la maison — on n'intervient pas à l'intérieur, sauf pour les contours de fenêtres.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "chauffe-eau-solaire-individuel",
    label: "Chauffe-eau solaire individuel (CESI)",
    short: "Eau chaude sanitaire grâce au soleil.",
    icon: "💧",
    description:
      "Le CESI utilise des capteurs solaires pour chauffer l'eau de votre ballon. " +
      "Couvre 50 à 80 % de vos besoins en eau chaude annuels. Solution sobre et fiable.",
    advantages: [
      "50 à 80 % de l'eau chaude couverte par le soleil",
      "Compatible avec la plupart des installations existantes",
      "Durée de vie : 20 à 25 ans",
      "Aides MaPrimeRénov' + CEE",
    ],
    aides: "MaPrimeRénov' jusqu'à 4 000 €, CEE, TVA à 5,5 %.",
    faq: [
      {
        q: "Combien coûte un CESI ?",
        // Source : fourchette de marché résidentiel 2024 (ADEME, France Rénov').
        a: "Comptez 5 000 à 8 000 € pour un CESI complet posé (capteurs + ballon + circulateur), pour un foyer de 4 personnes. La part des aides cumulées (MaPrimeRénov' + CEE) peut couvrir 50 % à 70 % du coût pour les foyers modestes.",
      },
      {
        q: "Combien d'eau chaude le CESI peut-il couvrir ?",
        a: "Selon la zone climatique et le dimensionnement, un CESI couvre 50 à 80 % de vos besoins annuels en eau chaude. L'appoint (gaz, électricité ou pompe à chaleur) prend le relais quand le soleil ne suffit pas, principalement en hiver et lors des grosses consommations.",
      },
      {
        q: "Quelle surface de capteurs solaires ?",
        a: "Comptez environ 1 m² de capteur par personne dans le foyer, avec un minimum de 4 m² pour le rendement. Pour 4 personnes, prévoyez 4 à 5 m² de capteurs et un ballon de 250 à 400 litres. Notre étude dimensionne en fonction de vos consommations réelles et de l'orientation de la toiture.",
      },
      {
        q: "Est-ce que ça marche partout en France ?",
        a: "Oui, mais le rendement varie : un CESI couvre ~70 % des besoins en région méditerranéenne contre ~50 % dans le nord de la France. Le système reste rentable partout grâce au dimensionnement et à l'appoint. Notre étude vous donne une estimation chiffrée selon votre commune.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "ballon-thermodynamique",
    label: "Ballon thermodynamique",
    short: "Chauffe-eau économique nouvelle génération.",
    icon: "🛢️",
    description:
      "Le ballon thermodynamique fonctionne sur le principe de la pompe à chaleur : " +
      "il puise l'énergie dans l'air ambiant pour chauffer l'eau. Trois fois moins gourmand " +
      "qu'un chauffe-eau électrique classique.",
    advantages: [
      "Jusqu'à 70 % d'économies sur l'eau chaude",
      "Installation simple, peu d'entretien",
      "Éligible à MaPrimeRénov' et CEE",
      "Faible empreinte carbone",
    ],
    aides: "MaPrimeRénov', CEE, TVA à 5,5 %.",
    faq: [
      {
        q: "Comment fonctionne un ballon thermodynamique ?",
        a: "Il combine une mini pompe à chaleur et un ballon de stockage. La PAC capte les calories de l'air ambiant (cave, garage, buanderie) et les transfère à l'eau du ballon. Pour 1 kWh d'électricité consommée, il restitue environ 3 kWh de chaleur — d'où les économies face à un chauffe-eau électrique classique.",
      },
      {
        q: "Combien coûte un ballon thermodynamique ?",
        // Source : fourchette de marché 2024, données ADEME / France Rénov'.
        a: "Comptez 2 500 à 4 500 € posé pour un ballon de 200 à 270 litres, dimensionné pour 3 à 5 personnes. Avec MaPrimeRénov' et les CEE, la dépense nette peut être divisée par deux pour un foyer aux revenus modestes.",
      },
      {
        q: "Faut-il une pièce non chauffée ?",
        a: "Idéalement oui : le ballon a besoin d'une pièce d'au moins 10 à 20 m³ pour bien fonctionner (cave, buanderie, garage). Si vous ne disposez pas de ce volume, certains modèles peuvent être raccordés à l'extérieur via des gaines. Notre installateur vérifie la compatibilité chez vous.",
      },
      {
        q: "Quel entretien ?",
        a: "Très peu : un nettoyage annuel du filtre suffit dans la plupart des cas. Une visite de contrôle tous les 2 à 5 ans par un professionnel est recommandée pour vérifier le compresseur et le fluide frigorigène. Durée de vie typique : 15 à 20 ans.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "systeme-solaire-combine",
    label: "Système solaire combiné (SSC)",
    short: "Chauffage et eau chaude solaires.",
    icon: "🔆",
    description:
      "Le SSC est l'évolution du CESI : capteurs solaires qui chauffent à la fois l'eau sanitaire " +
      "et le chauffage central. Couvre 30 à 60 % des besoins en chauffage selon la région.",
    advantages: [
      "Chauffage + eau chaude couverts par le solaire",
      "30 à 60 % d'économies de chauffage",
      "Compatible avec un appoint pompe à chaleur ou chaudière",
      "Aides cumulables MaPrimeRénov' + CEE",
    ],
    aides: "MaPrimeRénov' jusqu'à 10 000 €, CEE, Éco-PTZ.",
    faq: [
      {
        q: "Quelle différence avec un CESI ?",
        a: "Le CESI ne chauffe que l'eau sanitaire. Le SSC ajoute le chauffage central : les capteurs alimentent un ballon tampon qui sert à la fois pour l'eau chaude ET pour le circuit de chauffage (radiateurs basse température ou plancher chauffant). Le SSC est plus puissant, plus complexe à installer et plus rentable sur le long terme.",
      },
      {
        q: "Combien coûte un SSC ?",
        // Source : fourchette de marché 2024 (France Rénov', ADEME).
        a: "Un SSC complet (capteurs + ballon tampon + régulation + appoint) coûte en moyenne 15 000 à 25 000 € posé pour une maison individuelle. C'est un investissement important compensé par des économies durables et des aides MaPrimeRénov' particulièrement généreuses pour ce type d'équipement.",
      },
      {
        q: "Quelle surface de capteurs ?",
        a: "Comptez 10 à 15 m² de capteurs solaires thermiques pour une maison de 100 à 150 m² selon la zone climatique. Le ballon tampon associé est plus volumineux qu'un CESI : 500 à 1 000 litres. Notre étude calcule les dimensions exactes selon vos besoins de chauffage et votre toiture.",
      },
      {
        q: "Quel chauffage d'appoint avec un SSC ?",
        a: "Un SSC ne couvre jamais 100 % des besoins de chauffage : un appoint est obligatoire pour les périodes les plus froides. Les options compatibles sont la pompe à chaleur, la chaudière à granulés, ou une chaudière à condensation existante. Notre conseiller vous oriente vers le combo le plus rentable à long terme.",
      },
    ],
  },
];

export const SERVICE_SLUGS = SERVICES_LIST.map((s) => s.slug);

export function isValidServiceSlug(slug: string): boolean {
  return SERVICE_SLUGS.includes(slug);
}

export function getService(slug: string): Service | undefined {
  return SERVICES_LIST.find((s) => s.slug === slug);
}
