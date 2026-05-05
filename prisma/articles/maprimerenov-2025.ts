/**
 * Article témoin SEO — « MaPrimeRénov' 2025 : qui peut en bénéficier et combien ? »
 *
 * Sujet le plus délicat du calendrier éditorial : chiffres officiels à
 * vérifier rigoureusement, fortes conséquences si erreur. Cet article sert
 * de moule pour les 7 articles restants (Phase 3).
 *
 * Sources publiques utilisées (à recouper avant chaque republication
 * annuelle des barèmes — la grille MaPrimeRénov' bouge au 1er janvier) :
 *   - https://www.maprimerenov.gouv.fr/                                       (site officiel Anah)
 *   - https://www.maprimerenov.gouv.fr/prestataires/conditions-revenus        (plafonds par profil)
 *   - https://france-renov.gouv.fr/                                            (cadre général)
 *   - https://www.economie.gouv.fr/cedef/cee                                   (cumul CEE)
 *   - https://www.service-public.fr/particuliers/vosdroits/F35083              (procédure officielle)
 *   - https://www.ademe.fr/                                                    (prix de marché)
 *
 * Tonalité : pédagogique, prudente sur les chiffres, voix « Groupe Climat
 * Hexagone » (cf. docs/seo.md). Toutes les fourchettes sont volontairement
 * larges. Si un chiffre exact est cité, il est entouré d'une formulation
 * qui le rend valide même si l'Anah modifie de quelques pourcents
 * (« autour de », « en moyenne », « selon votre profil »).
 *
 * TODO client/SEO :
 *   - revérifier les plafonds 2025 sur maprimerenov.gouv.fr et figer date
 *   - remplacer la cover image par une vraie photo (1200×630, alt complet)
 *   - publier après revue éditoriale finale
 */

export const articleMaprimerenov2025 = {
  slug: "maprimerenov-2025-qui-peut-en-beneficier-et-combien",
  title: "MaPrimeRénov' 2025 : qui peut en bénéficier et combien ?",
  excerpt:
    "Profils Bleu, Jaune, Violet, Rose : qui touche quoi en 2025 ? Plafonds de revenus, montants par travaux, cumul CEE et Éco-PTZ, démarches : le guide complet pour préparer votre demande.",
  coverImage: "https://placehold.co/1200x630/EAEAEA/0F3D26?text=MaPrimeRenov+2025",
  content: `# MaPrimeRénov' 2025 : qui peut en bénéficier et combien ?

*Mise à jour : 2026 — barèmes 2025 en vigueur. À revérifier annuellement sur [maprimerenov.gouv.fr](https://www.maprimerenov.gouv.fr/).*

MaPrimeRénov' est l'aide d'État la plus importante pour financer des travaux de rénovation énergétique en France. En 2025, elle continue de couvrir l'isolation, le chauffage performant, l'eau chaude solaire, et les rénovations globales — mais ses règles évoluent presque chaque année. Si vous prévoyez des travaux dans les douze mois, voici ce qu'il faut savoir : qui est éligible, quels montants, quelles démarches, et comment éviter les pièges qui retardent (ou refusent) un dossier.

## Qu'est-ce que MaPrimeRénov' ?

MaPrimeRénov' est une aide financière versée par l'**Agence nationale de l'habitat (Anah)**. Elle remplace depuis 2020 l'ancien Crédit d'impôt pour la transition énergétique (CITE) et l'aide « Habiter mieux agilité ». Concrètement, c'est un **forfait** versé après les travaux, dont le montant varie selon trois facteurs : votre profil de revenus, le type de travaux engagés, et la performance énergétique visée.

Contrairement à un crédit d'impôt, MaPrimeRénov' n'est **pas une réduction sur votre impôt** : c'est une somme versée directement sur votre compte bancaire après validation du dossier. C'est aussi cumulable avec d'autres aides — primes CEE, Éco-PTZ, TVA réduite, aides locales — ce qui multiplie son intérêt.

> **Point important** : MaPrimeRénov' n'est pas automatique. Il faut **déposer un dossier en ligne** sur le site officiel maprimerenov.gouv.fr **avant le début des travaux**. Un dossier déposé après est refusé, sans exception.

## Les 4 profils MaPrimeRénov' en 2025

L'Anah classe les ménages en quatre catégories selon le **revenu fiscal de référence (RFR)** et la composition du foyer. Plus vos revenus sont modestes, plus l'aide est généreuse.

### Profil Bleu — Revenus très modestes

Ce profil concerne les ménages aux ressources les plus limitées. **Les aides sont les plus élevées**, avec un taux de financement qui peut atteindre 90 % du coût HT pour certains travaux d'efficacité énergétique réalisés en parcours accompagné. À titre d'ordre de grandeur, le plafond pour une personne seule est d'environ 17 000 € de RFR en province et 23 500 € en Île-de-France.

### Profil Jaune — Revenus modestes

Toujours éligibles à des aides élevées, les ménages « Jaune » bénéficient d'un taux de financement intermédiaire. Le plafond pour une personne seule est d'environ 21 800 € en province et 28 700 € en Île-de-France.

### Profil Violet — Revenus intermédiaires

Le profil Violet a accès à MaPrimeRénov' avec des montants modérés, plafonnés par travaux. Selon les types de gestes engagés, l'aide peut couvrir 30 à 60 % du coût HT. Plafond pour une personne seule : environ 30 500 € en province et 40 000 € en Île-de-France.

### Profil Rose — Revenus supérieurs

Au-delà des seuils précédents, les ménages Rose touchent une aide réduite, principalement orientée vers les **rénovations globales** et les gestes les plus impactants (isolation thermique extérieure, pompe à chaleur). C'est encore intéressant si votre projet est conséquent, mais l'aide ne couvre pas plus de 10 à 20 % du coût pour un geste isolé.

> **Plafonds exacts à vérifier** : la grille officielle est sur [maprimerenov.gouv.fr/prestataires/conditions-revenus](https://www.maprimerenov.gouv.fr/prestataires/conditions-revenus). Les plafonds varient selon la composition du foyer (1 à 5+ personnes) et la zone géographique (Île-de-France ou province). À chaque personne supplémentaire, le plafond monte d'environ 5 000 à 8 000 € selon le profil.

### Le RFR, où le trouve-t-on ?

Votre **revenu fiscal de référence** figure sur votre dernier avis d'imposition, en case 25 (« RFR du foyer fiscal »). Pour les couples ou colocations, c'est le **cumul des RFR du foyer** qui est pris en compte. Si vous avez emménagé récemment, l'avis de l'année précédente fait foi.

## Quels travaux sont éligibles en 2025 ?

MaPrimeRénov' couvre une large palette de travaux d'efficacité énergétique, à condition qu'ils soient réalisés par un **artisan certifié RGE** (Reconnu Garant de l'Environnement). Voici la liste des grands gestes financés :

### Chauffage performant

- **Pompe à chaleur air-eau** (couverte) ou géothermique (couverte avec montants élevés)
- **Pompe à chaleur air-air** : ⚠️ **exclue de MaPrimeRénov' en 2025** (mais éligible aux primes CEE)
- **Chaudière à granulés ou bois bûches** (label Flamme Verte 7★ minimum)
- **Système solaire combiné (SSC)** : forte aide, jusqu'à 10 000 € pour les profils modestes
- **Chauffe-eau thermodynamique** (ballon à pompe à chaleur intégrée)

### Isolation

- **Isolation thermique extérieure (ITE)** des murs
- **Isolation des toitures** (combles, toitures terrasses)
- **Isolation des planchers bas** (sur cave, vide sanitaire, garage)
- *L'isolation par l'intérieur (ITI) reste éligible aux primes CEE mais a perdu MaPrimeRénov' en 2024.*

### Eau chaude sanitaire

- **Chauffe-eau solaire individuel (CESI)** — aide pouvant aller jusqu'à 4 000 € pour les profils modestes
- **Chauffe-eau thermodynamique**

### Ventilation

- **VMC double flux** : éligible, mais conditions techniques strictes (étanchéité du logement)

### Rénovation globale (parcours accompagné)

C'est **la voie la plus généreuse en aides** : si votre projet vise un saut de **2 classes énergétiques minimum** sur le DPE et inclut au moins **deux gestes de travaux**, vous accédez au parcours accompagné. Une **prime bonifiée** s'ajoute à MaPrimeRénov', plafonnée à plusieurs milliers d'euros.

## Combien pouvez-vous toucher ? Exemples chiffrés

Les montants varient considérablement selon le geste et le profil. Voici quelques **ordres de grandeur** réalistes pour 2025 (à confirmer avec un conseiller pour votre projet précis) :

### Pompe à chaleur air-eau

- Profil Bleu : **jusqu'à environ 5 000 €**
- Profil Jaune : **jusqu'à environ 4 000 €**
- Profil Violet : **jusqu'à environ 3 000 €**
- Profil Rose : aide réduite, ordre de grandeur **1 000 €**

### Isolation thermique extérieure (ITE)

- Profil Bleu : **75 €/m² de paroi traitée** (forfait)
- Profil Jaune : **60 €/m²**
- Profil Violet : **40 €/m²**
- Profil Rose : **15 €/m²** (et plafonné à 100 m²)

### Chauffe-eau solaire individuel

- Profil Bleu : **environ 4 000 €**
- Profil Jaune : **environ 3 000 €**
- Profil Violet : **environ 2 000 €**
- Profil Rose : **environ 1 000 €**

### Système solaire combiné (chauffage + eau chaude)

- Profil Bleu : **jusqu'à environ 10 000 €**
- Profil Jaune : **jusqu'à environ 8 000 €**
- Profil Violet : **jusqu'à environ 4 000 €**

> **Important** : ces chiffres sont des ordres de grandeur. Les montants exacts sont régulièrement réajustés par décret. Pour un calcul précis, utilisez le simulateur officiel [maprimerenov.gouv.fr](https://www.maprimerenov.gouv.fr/) ou demandez une étude personnalisée à un conseiller France Rénov' (gratuit).

## Comment monter votre dossier MaPrimeRénov' ?

La procédure est entièrement dématérialisée. Voici les étapes dans l'ordre :

### Étape 1 — Avant les travaux : créer son compte et déposer la demande

Connectez-vous à [maprimerenov.gouv.fr](https://www.maprimerenov.gouv.fr/) et créez votre compte personnel. Vous devrez fournir :

- Votre dernier avis d'imposition (pour calculer votre profil)
- Le devis détaillé de l'artisan RGE
- Des informations sur votre logement (adresse, surface, ancienneté)
- Un RIB pour le versement

**Le dossier doit être déposé avant la signature du devis et le début des travaux.** Un dossier déposé après est automatiquement refusé.

### Étape 2 — Validation et accord de l'Anah

L'Anah examine votre dossier sous **15 jours à 2 mois** selon la période. Vous recevez une notification d'accord par email avec le **montant prévisionnel** de votre prime.

### Étape 3 — Réalisation des travaux par l'artisan RGE

L'artisan que vous avez choisi doit être **certifié RGE** au moment de la signature du devis ET au moment des travaux. Vérifiez sa certification sur [france-renov.gouv.fr/annuaire-rge](https://france-renov.gouv.fr/annuaire-rge).

### Étape 4 — Demande de paiement après les travaux

Une fois les travaux terminés et la facture acquittée, vous devez **redéposer une demande de paiement** sur votre espace MaPrimeRénov', avec :

- La facture finale acquittée
- Une attestation de fin de travaux signée par l'artisan
- Éventuellement des photos avant/après

Le **paiement intervient sous 2 à 4 mois** sur votre compte bancaire.

### Étape 5 — Cas particulier : avance pour les profils Bleu

Si vous êtes en profil Bleu et que les travaux dépassent un certain montant, vous pouvez demander **une avance de 70 % du montant de l'aide** au moment de la validation du dossier (avant les travaux). C'est une mesure introduite pour ne pas pénaliser les ménages qui ne peuvent pas avancer la trésorerie.

## Les pièges à éviter

Avoir son dossier accepté ne garantit pas le paiement. Voici les erreurs qui causent le plus de refus :

### 1. Travaux commencés avant la validation du dossier

C'est la cause numéro un de refus. **Aucun travail ne peut commencer avant l'accord de l'Anah**, pas même la livraison du matériel sur le chantier. Attendez l'email d'accord, puis lancez le chantier.

### 2. Artisan pas RGE pour le geste réalisé

Un artisan peut être RGE pour l'isolation mais pas pour la pompe à chaleur. **Vérifiez que sa certification couvre exactement le geste que vous lui faites réaliser.** Sinon, le dossier est rejeté au paiement.

### 3. Devis et facture ne correspondent pas

Si la facture finale diffère du devis (matériel changé, surface ajustée, prestation ajoutée), le dossier peut être renvoyé pour ajustement. Pour éviter les blocages, demandez à l'artisan d'établir un **devis modificatif** signé avant la facture finale.

### 4. Logement de moins de 15 ans

MaPrimeRénov' exige un logement construit **depuis au moins 15 ans** au moment du dépôt du dossier (sauf cas particulier d'isolation pour un logement neuf défectueux). Une maison de 2012 sera donc éligible à partir de 2027.

### 5. Résidence secondaire ou non occupée à titre principal

Le logement doit être votre **résidence principale** (ou celle de votre locataire si vous êtes bailleur), occupé au moins **8 mois par an**. Une résidence secondaire est exclue.

## Cumuler MaPrimeRénov' avec d'autres aides

C'est là que le calcul devient intéressant. MaPrimeRénov' est cumulable avec :

### Les primes CEE (Certificats d'Économies d'Énergie)

Versées par les fournisseurs d'énergie (EDF, TotalEnergies, Engie, Cdiscount Énergie, etc.), elles sont **directement déduites du devis** dans la majorité des cas. Pour une pompe à chaleur, comptez en ordre de grandeur **2 500 à 5 000 €** de prime CEE pour un foyer modeste, en plus de MaPrimeRénov'.

### L'Éco-prêt à taux zéro

Ce prêt à 0 % d'intérêts permet de financer le **reste à charge** après MaPrimeRénov' et CEE, jusqu'à **50 000 €** sur 20 ans pour un bouquet de travaux. Mensualités étalées, intérêts pris en charge par l'État.

### La TVA à 5,5 %

Automatiquement appliquée sur les travaux d'amélioration énergétique éligibles (au lieu de 20 % ou 10 %), pour les logements de plus de 2 ans. Pas de démarche : elle apparaît directement sur le devis.

### Les aides locales

Régions, départements, communes : certaines collectivités versent des subventions complémentaires. La région Occitanie a par exemple soutenu fortement le solaire ; certaines communes ajoutent une prime pour la rénovation globale. Vérifiez à votre adresse exacte via le simulateur France Rénov' ou auprès de votre conseiller.

### Calcul cumulé : exemple concret

Pour un foyer profil Jaune installant une pompe à chaleur air-eau à 12 000 € TTC :
- MaPrimeRénov' : ~4 000 €
- Prime CEE Coup de pouce : ~3 500 €
- TVA réduite à 5,5 % au lieu de 20 % : ~1 700 € d'économie de TVA déjà incluse au devis
- **Total : reste à charge d'environ 4 500 €** (au lieu de 12 000 €)

Le reste à charge peut être financé par un Éco-PTZ pour étaler la dépense sur plusieurs années sans intérêts.

## En résumé

- 🏠 **Qui ?** Propriétaires (occupants ou bailleurs) d'un logement de plus de 15 ans, résidence principale.
- 💰 **Combien ?** De quelques centaines d'euros (profil Rose, geste simple) à plus de 10 000 € (profil Bleu, rénovation globale ou SSC).
- 📋 **Comment ?** Dossier en ligne **avant les travaux** sur maprimerenov.gouv.fr, artisan RGE obligatoire.
- ⚠️ **Pièges :** ne pas commencer les travaux avant l'accord, vérifier la certification RGE de l'artisan pour le geste précis, conserver tous les justificatifs.
- 🤝 **Cumul :** MaPrimeRénov' + CEE + Éco-PTZ + TVA 5,5 % + aides locales sont **toutes cumulables**.

## Faites estimer votre éligibilité en 2 minutes

Notre simulateur intègre la grille officielle MaPrimeRénov' 2025 et vos primes CEE applicables. En quelques questions sur votre logement, vos travaux et vos revenus, vous obtenez une estimation chiffrée du montant que vous pouvez mobiliser — sans inscription ni engagement.

[Estimer mes aides en 2 min →](/simulateur)

Vous préférez parler à un conseiller ? [Contactez-nous](/contact) : nous étudions votre projet, vérifions votre éligibilité, et vous proposons un plan de financement complet incluant un artisan RGE de notre réseau.

---

### Sources publiques utilisées dans cet article

- [maprimerenov.gouv.fr](https://www.maprimerenov.gouv.fr/) — site officiel de l'Anah
- [maprimerenov.gouv.fr — conditions de revenus](https://www.maprimerenov.gouv.fr/prestataires/conditions-revenus) — plafonds par profil et composition du foyer
- [france-renov.gouv.fr](https://france-renov.gouv.fr/) — cadre général et annuaire RGE
- [economie.gouv.fr — CEE](https://www.economie.gouv.fr/cedef/cee) — Certificats d'Économies d'Énergie
- [service-public.fr — éco-PTZ](https://www.service-public.fr/particuliers/vosdroits/F32937) — Éco-prêt à taux zéro

*Les barèmes MaPrimeRénov' évoluent par décret. Cet article a été rédigé en référence à la grille 2025 ; certains montants peuvent être ajustés au 1er janvier 2026. Notre équipe vérifie systématiquement la grille en vigueur lors de l'étude de votre projet.*
`,
};
