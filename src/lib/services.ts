/**
 * Catalogue central des services réels du client. Source de vérité pour
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

export type SpecItem = { label: string; value: string };
export type SpecGroup = { title: string; items: SpecItem[] };

export type Service = {
  slug: string;
  label: string;
  short: string;
  icon: string;
  description: string;
  advantages: string[];
  aides: string;
  faq: FaqItem[];
  /** Spécifications techniques affichées sur la page produit (style adper). */
  specs?: SpecGroup[];
};

export const SERVICES_LIST: Service[] = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "pompe-a-chaleur-air-eau",
    label: "Pompe à chaleur Air/Eau",
    short: "Chauffage central et eau chaude par captation de l'air extérieur.",
    icon: "🔥",
    description:
      "La PAC air-eau capte les calories de l'air extérieur pour chauffer l'eau de votre " +
      "circuit de chauffage central (radiateurs ou plancher chauffant) et produire votre eau " +
      "chaude sanitaire. C'est la solution la plus efficace pour remplacer une chaudière fioul, " +
      "gaz ou un chauffage électrique.",
    advantages: [
      "Jusqu'à 75 % d'économies sur la facture de chauffage",
      "Compatible plancher chauffant et radiateurs basse / haute température",
      "Eau chaude sanitaire incluse via ballon couplé",
      "Éligible MaPrimeRénov' + CEE — aides cumulées élevées",
    ],
    aides: "MaPrimeRénov' jusqu'à 5 000 € (foyers très modestes), CEE, Éco-PTZ. TVA à 5,5 %.",
    faq: [
      {
        q: "Combien coûte une PAC air-eau ?",
        // Source : ADEME, "Coûts d'investissement des équipements de chauffage", 2024.
        a: "Selon l'ADEME, une PAC air-eau coûte en moyenne 9 000 à 18 000 € posée selon la puissance, le modèle et la complexité de l'installation. Avec MaPrimeRénov' et les CEE cumulés, la dépense réelle peut être divisée par deux à trois pour un foyer aux revenus modestes.",
      },
      {
        q: "Faut-il un circuit de chauffage central existant ?",
        a: "Oui, idéalement. La PAC air-eau alimente votre circuit hydraulique (radiateurs ou plancher chauffant). Si votre logement est en chauffage électrique sans circuit eau, l'installation est plus lourde — il faudra créer le réseau hydraulique. Notre étude vérifie la faisabilité chez vous.",
      },
      {
        q: "Quelles aides pour une PAC air-eau ?",
        a: "MaPrimeRénov' couvre les PAC air-eau et géothermiques, avec un montant de 4 000 € à 5 000 € selon les revenus. Les CEE viennent en complément, versés par les fournisseurs d'énergie. L'éco-PTZ peut financer le reste à charge. Lors de l'étude, nous calculons le montant cumulable applicable à votre profil.",
      },
      {
        q: "Une PAC fonctionne-t-elle quand il fait très froid ?",
        a: "Oui, les PAC air-eau modernes fonctionnent jusqu'à -15 °C voire -25 °C en version Grand Froid, mais leur performance baisse avec le froid. Sous certains climats (montagne notamment), une résistance d'appoint électrique prend le relais lors des pointes. Pour la France métropolitaine hors haute montagne, une PAC seule couvre l'essentiel des besoins.",
      },
      {
        q: "Quel entretien ?",
        a: "Un entretien annuel par un professionnel est obligatoire pour les PAC de plus de 4 kW (décret 2020-912). Comptez 150 à 250 € par an. C'est le seul entretien régulier nécessaire. La durée de vie d'une PAC bien entretenue est de 15 à 20 ans.",
      },
    ],
    specs: [
      {
        title: "Unité extérieure",
        items: [
          { label: "Type", value: "Air-Eau, technologie Inverter" },
          { label: "Puissance", value: "De 4 kW à 16 kW selon dimensionnement" },
          { label: "Niveau sonore", value: "≤ 45 dB(A) à 1 m (mode silencieux)" },
          { label: "Plage de fonctionnement", value: "−15 °C à +35 °C (jusqu'à −25 °C en version Grand Froid)" },
        ],
      },
      {
        title: "Module hydraulique intérieur",
        items: [
          { label: "Type", value: "Compact mural ou bibloc avec ballon ECS intégré" },
          { label: "Ballon ECS intégré (option)", value: "180 L à 300 L" },
          { label: "Pression circuit chauffage", value: "Jusqu'à 3 bar" },
          { label: "Compatibilité émetteurs", value: "Plancher chauffant, radiateurs basse / haute température" },
        ],
      },
      {
        title: "Fluide frigorigène",
        items: [
          { label: "Type", value: "R32 ou R454B (faible PRG)" },
          { label: "Préchargement usine", value: "Jusqu'à 10 m de liaison sans complément" },
          { label: "Étanchéité", value: "Contrôle annuel obligatoire (décret 2020-912)" },
        ],
      },
      {
        title: "Régulation",
        items: [
          { label: "Pilotage", value: "Thermostat filaire + application Wi-Fi (iOS / Android)" },
          { label: "Modes", value: "ECO, confort, vacances, hors-gel" },
          { label: "Multi-zones", value: "Jusqu'à 3 zones indépendantes (option)" },
          { label: "Programmation", value: "Hebdomadaire avec dérogation manuelle" },
        ],
      },
      {
        title: "Performance énergétique",
        items: [
          { label: "COP nominal", value: "Jusqu'à 4,8 (à 7 °C / 35 °C)" },
          { label: "SCOP (saisonnier)", value: "Jusqu'à 4,2" },
          { label: "Classe énergétique chauffage", value: "A+++ / A++" },
          { label: "Garantie compresseur", value: "5 à 7 ans selon marque" },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "pompe-a-chaleur-air-air",
    label: "Pompe à chaleur Air/Air",
    short: "Climatisation réversible : chauffage et rafraîchissement.",
    icon: "❄️",
    description:
      "La PAC air-air (climatisation réversible) chauffe en hiver et rafraîchit en été en " +
      "captant les calories de l'air. Solution idéale pour les logements sans circuit de " +
      "chauffage central, ou en complément d'un chauffage existant. Installation rapide via " +
      "un système monosplit ou multi-split selon le nombre de pièces.",
    advantages: [
      "Chauffage ET climatisation toute l'année",
      "Installation rapide, sans gros travaux ni circuit hydraulique",
      "Multi-split jusqu'à 5 zones indépendantes",
      "Économies de 50 à 70 % vs un chauffage électrique classique",
    ],
    aides: "CEE uniquement (MaPrimeRénov' exclue depuis 2025). TVA à 10 %.",
    faq: [
      {
        q: "Combien coûte une PAC air-air ?",
        // Source : ADEME, fourchette résidentiel 2024 (France Rénov').
        a: "Comptez 6 000 à 12 000 € posé pour un système multi-split (1 unité extérieure + 3 à 5 unités intérieures). Un monosplit pour une seule pièce démarre autour de 1 500 à 3 000 €. Les CEE peuvent couvrir 500 à 1 500 € selon les revenus du foyer.",
      },
      {
        q: "Pourquoi MaPrimeRénov' n'est-elle pas applicable ?",
        a: "Depuis 2024, les PAC air-air sont exclues de MaPrimeRénov' car l'État privilégie les solutions qui produisent aussi de l'eau chaude sanitaire. Seuls les CEE restent mobilisables. Si vous avez besoin d'eau chaude solaire, orientez-vous plutôt vers une PAC air-eau.",
      },
      {
        q: "PAC air-air ou air-eau, laquelle choisir ?",
        a: "Si vous avez déjà un circuit de chauffage central (radiateurs à eau ou plancher chauffant), l'air-eau est généralement plus rentable et bénéficie de MaPrimeRénov'. Si vous êtes en chauffage électrique sans circuit eau, ou que vous voulez la climatisation, l'air-air est plus pragmatique. Notre conseiller vous oriente selon votre logement.",
      },
      {
        q: "Quel niveau sonore en pièce de vie ?",
        a: "Les unités intérieures modernes tournent entre 19 et 28 dB(A) en mode nuit — c'est plus silencieux qu'un chuchotement. L'unité extérieure produit 45 à 55 dB(A) ; son emplacement (côté jardin, loin des chambres et du voisin) est déterminant pour le confort.",
      },
      {
        q: "Quel entretien ?",
        a: "Un nettoyage des filtres tous les 2 à 3 mois (utilisateur) et une vérification annuelle par un professionnel pour les systèmes au-delà de 4 kW (décret 2020-912). Comptez 150 à 200 € par an. Durée de vie typique : 12 à 15 ans.",
      },
    ],
    specs: [
      {
        title: "Unité extérieure",
        items: [
          { label: "Type", value: "Air-Air, technologie Inverter DC" },
          { label: "Puissance", value: "De 2,5 kW à 14 kW selon nombre de splits" },
          { label: "Niveau sonore", value: "45 à 55 dB(A) à 1 m" },
          { label: "Plage de chauffage", value: "−10 °C à +24 °C (extérieure)" },
          { label: "Plage de rafraîchissement", value: "+18 °C à +43 °C (extérieure)" },
        ],
      },
      {
        title: "Unités intérieures",
        items: [
          { label: "Configurations", value: "Monosplit ou multi-split (jusqu'à 5 unités)" },
          { label: "Types disponibles", value: "Mural, console, gainable, cassette plafond" },
          { label: "Niveau sonore intérieur", value: "19 à 32 dB(A) selon mode" },
          { label: "Filtration", value: "Filtres anti-poussière, anti-pollen, ioniseur option" },
        ],
      },
      {
        title: "Fluide frigorigène",
        items: [
          { label: "Type", value: "R32 (faible PRG, recommandé)" },
          { label: "Liaisons frigorifiques", value: "Cuivre isolé Ø 1/4\" et 3/8\" — longueur jusqu'à 30 m" },
          { label: "Étanchéité", value: "Contrôle annuel obligatoire (décret 2020-912)" },
        ],
      },
      {
        title: "Régulation",
        items: [
          { label: "Pilotage", value: "Télécommande IR + application Wi-Fi (iOS / Android)" },
          { label: "Modes", value: "Auto, Chaud, Froid, Déshumidification, Ventilation, Nuit" },
          { label: "Programmation", value: "Hebdomadaire par unité intérieure" },
          { label: "Compatibilité domotique", value: "Google Home, Alexa, Apple HomeKit selon modèle" },
        ],
      },
      {
        title: "Performance énergétique",
        items: [
          { label: "SCOP (chauffage saisonnier)", value: "Jusqu'à 4,6" },
          { label: "SEER (rafraîchissement saisonnier)", value: "Jusqu'à 8,5" },
          { label: "Classe énergétique chauffage", value: "A+++ / A++" },
          { label: "Classe énergétique froid", value: "A+++ / A++" },
          { label: "Garantie compresseur", value: "5 à 7 ans selon marque" },
        ],
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
    specs: [
      {
        title: "Isolant",
        items: [
          { label: "Type", value: "Polystyrène expansé (PSE), laine de roche, ou fibre de bois" },
          { label: "Épaisseur", value: "De 12 cm à 20 cm selon performance visée" },
          { label: "Résistance thermique R", value: "≥ 3,7 m²·K/W (exigence MaPrimeRénov')" },
          { label: "Conductivité λ", value: "0,032 à 0,038 W/m·K selon matériau" },
          { label: "Réaction au feu", value: "Classement Euroclasse A1 à E selon isolant" },
        ],
      },
      {
        title: "Fixation",
        items: [
          { label: "Méthode", value: "Collage + fixation mécanique par chevilles" },
          { label: "Chevilles", value: "Plastique + acier, dimensionnées selon support" },
          { label: "Profilés", value: "Rail de départ aluminium, profilés d'angle PVC" },
          { label: "Trame d'armature", value: "Toile en fibre de verre noyée dans sous-enduit" },
        ],
      },
      {
        title: "Finition",
        items: [
          { label: "Type", value: "Enduit minéral, hydraulique, organique ou bardage rapporté" },
          { label: "Couleurs", value: "Personnalisable — large palette RAL" },
          { label: "Texture", value: "Lisse, taloché, gratté, rustique" },
          { label: "Durabilité", value: "Tenue ≥ 25 ans pour enduits, ≥ 30 ans pour bardage" },
        ],
      },
      {
        title: "Performance et conformité",
        items: [
          { label: "Réduction des déperditions", value: "Jusqu'à 25 % sur la facture chauffage" },
          { label: "Ponts thermiques", value: "Traités en continu (façade, planchers, encadrements)" },
          { label: "Certifications", value: "ATEC ou Document Technique d'Application (DTA)" },
          { label: "Qualification", value: "Pose par artisan RGE Qualibat 7131 ou 7141" },
        ],
      },
      {
        title: "Mise en œuvre et garanties",
        items: [
          { label: "Échafaudage", value: "Inclus dans la prestation" },
          { label: "Délai chantier", value: "2 à 4 semaines pour 100-150 m² de façade" },
          { label: "Garantie décennale", value: "Couverte par l'assurance de l'installateur" },
          { label: "Garantie produit", value: "10 ans sur le système isolant complet" },
        ],
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
    specs: [
      {
        title: "Pompe à chaleur intégrée",
        items: [
          { label: "Source de chaleur", value: "Air ambiant ou air extrait (VMC)" },
          { label: "COP nominal", value: "≥ 3,0 (selon norme EN 16147)" },
          { label: "Puissance électrique", value: "1 kW à 2 kW" },
          { label: "Fluide frigorigène", value: "R290 ou R134a" },
          { label: "Niveau sonore", value: "≤ 55 dB(A) à 1 m" },
        ],
      },
      {
        title: "Cuve de stockage",
        items: [
          { label: "Capacité", value: "150 L à 300 L (270 L typique pour 4 personnes)" },
          { label: "Isolation", value: "Mousse polyuréthane 50 mm" },
          { label: "Revêtement intérieur", value: "Émail vitrifié + anode magnésium ou titane" },
          { label: "Pression maximale", value: "7 bar" },
        ],
      },
      {
        title: "Raccordements",
        items: [
          { label: "Aéraulique", value: "Conduits Ø 160 mm (entrée + sortie d'air)" },
          { label: "Hydraulique", value: "Raccords 3/4\" — eau froide, ECS, vidange" },
          { label: "Électrique", value: "Mono 230 V, prise dédiée 16 A" },
          { label: "Volume pièce minimum", value: "10 à 20 m³ selon modèle (sur air ambiant)" },
        ],
      },
      {
        title: "Régulation",
        items: [
          { label: "Modes", value: "AUTO, ECO, BOOST, ABSENCE" },
          { label: "Pilotage", value: "Afficheur LCD + Wi-Fi (application mobile en option)" },
          { label: "Programmation", value: "Heures creuses, hebdomadaire" },
          { label: "Sécurités", value: "Anti-légionellose, anti-gel, protection compresseur" },
        ],
      },
      {
        title: "Performance et garanties",
        items: [
          { label: "Temps de chauffe", value: "8 à 10 h pour un ballon de 270 L" },
          { label: "Économies", value: "Jusqu'à 70 % vs un chauffe-eau électrique classique" },
          { label: "Durée de vie", value: "15 à 20 ans" },
          { label: "Garantie PAC", value: "3 à 5 ans selon marque" },
          { label: "Garantie cuve", value: "5 à 7 ans" },
        ],
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
      "Le SSC utilise des capteurs solaires qui chauffent à la fois l'eau sanitaire et le " +
      "chauffage central. Couvre 30 à 60 % des besoins en chauffage selon la région.",
    advantages: [
      "Chauffage + eau chaude couverts par le solaire",
      "30 à 60 % d'économies de chauffage",
      "Compatible avec un appoint pompe à chaleur ou chaudière",
      "Aides cumulables MaPrimeRénov' + CEE",
    ],
    aides: "MaPrimeRénov' jusqu'à 10 000 €, CEE, Éco-PTZ.",
    faq: [
      {
        q: "Comment fonctionne un SSC ?",
        a: "Les capteurs solaires installés en toiture chauffent un fluide caloporteur qui transfère la chaleur à un ballon tampon. Ce ballon sert à la fois pour l'eau chaude sanitaire ET pour le circuit de chauffage (radiateurs basse température ou plancher chauffant). Un appoint (PAC, chaudière, granulés) prend le relais quand le soleil ne suffit pas.",
      },
      {
        q: "Combien coûte un SSC ?",
        // Source : fourchette de marché 2024 (France Rénov', ADEME).
        a: "Un SSC complet (capteurs + ballon tampon + régulation + appoint) coûte en moyenne 15 000 à 25 000 € posé pour une maison individuelle. C'est un investissement important compensé par des économies durables et des aides MaPrimeRénov' particulièrement généreuses pour ce type d'équipement.",
      },
      {
        q: "Quelle surface de capteurs ?",
        a: "Comptez 10 à 15 m² de capteurs solaires thermiques pour une maison de 100 à 150 m² selon la zone climatique. Le ballon tampon associé est volumineux : 500 à 1 000 litres. Notre étude calcule les dimensions exactes selon vos besoins de chauffage et votre toiture.",
      },
      {
        q: "Quel chauffage d'appoint avec un SSC ?",
        a: "Un SSC ne couvre jamais 100 % des besoins de chauffage : un appoint est obligatoire pour les périodes les plus froides. Les options compatibles sont la pompe à chaleur, la chaudière à granulés, ou une chaudière à condensation existante. Notre conseiller vous oriente vers le combo le plus rentable à long terme.",
      },
    ],
    specs: [
      {
        title: "Capteurs solaires",
        items: [
          { label: "Type", value: "Capteurs plans haute performance ou tubulaires sous vide" },
          { label: "Surface installée", value: "10 m² à 15 m² selon surface chauffée" },
          { label: "Rendement optique", value: "≥ 75 %" },
          { label: "Orientation optimale", value: "Sud, inclinaison 45° à 60° (privilégier hiver)" },
          { label: "Garantie", value: "10 ans" },
        ],
      },
      {
        title: "Stockage thermique",
        items: [
          { label: "Type", value: "Ballon tampon multi-couches ou plancher chauffant" },
          { label: "Capacité ballon tampon", value: "500 L à 1 000 L" },
          { label: "Isolation", value: "Mousse polyuréthane 80 à 120 mm" },
          { label: "ECS intégrée", value: "Échangeur sanitaire ou ballon ECS séparé" },
        ],
      },
      {
        title: "Circuit de chauffage",
        items: [
          { label: "Compatibilité", value: "Plancher chauffant ou radiateurs basse température" },
          { label: "Température de départ", value: "30 °C à 50 °C (privilégier basse T° pour rendement)" },
          { label: "Pression circuit", value: "1,5 à 3 bar" },
          { label: "Vase d'expansion", value: "Dimensionné selon volume installation" },
        ],
      },
      {
        title: "Régulation",
        items: [
          { label: "Pilotage", value: "Centrale solaire dédiée + thermostat d'ambiance" },
          { label: "Multi-zones", value: "Jusqu'à 3 zones de chauffage indépendantes" },
          { label: "Priorité ECS", value: "Activable selon saison" },
          { label: "Sécurités", value: "Anti-gel, anti-surchauffe capteurs, anti-légionellose" },
        ],
      },
      {
        title: "Performance",
        items: [
          { label: "Couverture chauffage", value: "30 % à 60 % des besoins annuels" },
          { label: "Couverture ECS", value: "60 % à 80 % des besoins annuels" },
          { label: "Économie sur facture", value: "30 % à 50 %" },
          { label: "Durée de vie capteurs", value: "≥ 25 ans" },
        ],
      },
      {
        title: "Garanties et conformité",
        items: [
          { label: "Capteurs solaires", value: "10 ans" },
          { label: "Ballon tampon", value: "5 à 7 ans" },
          { label: "Pose", value: "2 ans + décennale chantier" },
          { label: "Qualification", value: "RGE QualiSol Combi obligatoire pour aides" },
        ],
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
