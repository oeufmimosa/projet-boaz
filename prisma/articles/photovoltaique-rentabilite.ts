/**
 * Article 4/8 — « Photovoltaïque : rentabilité réelle d'une installation en 2025 »
 *
 * Sources publiques utilisées (à recouper avant chaque republication) :
 *   - https://www.cre.fr/                                          (tarif d'achat EDF OA, mis à jour trimestriellement)
 *   - https://www.photovoltaique.info/                              (référence indépendante du marché PV)
 *   - https://france-renov.gouv.fr/                                 (cadre général, annuaire RGE QualiPV)
 *   - https://www.economie.gouv.fr/particuliers/tva-renovation      (TVA réduite 10 % pour PV ≤ 3 kWc)
 *   - https://www.service-public.fr/particuliers/vosdroits/F31176   (déclaration préalable de travaux PV)
 *
 * Tonalité : honnête sur la rentabilité (pas de promesse exagérée).
 * Tarif d'achat : ne pas figer un chiffre précis sans préciser qu'il est
 * révisé trimestriellement par la CRE.
 */

export const articlePhotovoltaiqueRentabilite = {
  slug: "photovoltaique-rentabilite-reelle-installation-2025",
  title: "Photovoltaïque : rentabilité réelle d'une installation en 2025",
  excerpt:
    "Combien produit une installation photovoltaïque, combien elle coûte, à quel tarif EDF rachète le surplus, en combien de temps elle se rentabilise : les chiffres concrets pour 2025.",
  coverImage: "https://placehold.co/1200x630/EAEAEA/0F3D26?text=Photovoltaïque+2025",
  content: `# Photovoltaïque : rentabilité réelle d'une installation en 2025

*Mise à jour : 2026 — barèmes 2025 en vigueur. Tarifs EDF OA révisés trimestriellement par la CRE.*

Le photovoltaïque résidentiel attire de plus en plus de propriétaires français — facture EDF en hausse, équipements moins chers, prime à l'autoconsommation, revente du surplus. Mais derrière les promesses, la rentabilité réelle dépend de **chiffres précis** : production, prix de l'installation, tarif de revente, mode d'usage. Ce guide pose les chiffres concrets pour 2025, sans promesse marketing.

## Combien produit un panneau photovoltaïque ?

Un **kWc** (kilowatt-crête) est l'unité de puissance des panneaux. En France métropolitaine, **1 kWc produit en moyenne 900 à 1 400 kWh par an** selon la zone climatique :

| Région | Production annuelle moyenne |
|---|---|
| Nord (Lille, Calais) | **~900 kWh/kWc** |
| Île-de-France | **~1 050 kWh/kWc** |
| Centre, Bretagne, Bourgogne | **~1 100 kWh/kWc** |
| Sud-Ouest (Bordeaux, Toulouse) | **~1 250 kWh/kWc** |
| Sud-Est (Marseille, Nice) | **~1 350-1 400 kWh/kWc** |

Une installation type de **3 kWc** produit donc, selon la région, **2 700 à 4 200 kWh/an** — soit 50 à 90 % de la consommation électrique annuelle d'un foyer de 4 personnes (~4 500 kWh/an).

> Source : [photovoltaique.info](https://www.photovoltaique.info/) — données ADEME et bureau d'études indépendants.

## Combien coûte une installation ?

> Source : ADEME et bureau d'études indépendants — fourchette de marché 2024-2025.

Pour une installation **résidentielle posée en toiture**, comptez :

| Puissance | Prix posé (TTC) | Production annuelle (Île-de-France) |
|---|---|---|
| 3 kWc (8-10 panneaux) | **8 000 à 12 000 €** | ~3 150 kWh |
| 6 kWc (16-18 panneaux) | **13 000 à 17 000 €** | ~6 300 kWh |
| 9 kWc (24-28 panneaux) | **18 000 à 24 000 €** | ~9 450 kWh |

Le prix dépend de :
- La **puissance** (économies d'échelle au-delà de 6 kWc)
- L'**orientation et l'inclinaison** de la toiture (sud, 30°, sans ombre = optimum)
- La **complexité de la pose** (toiture pentue, accès difficile, intégration au bâti)
- La **marque** des panneaux et de l'onduleur

## Les 3 modes d'utilisation

### 1. Autoconsommation totale

Vous consommez **toute** votre production. Le surplus, s'il y en a, n'est pas valorisé (renvoyé gratuitement au réseau). C'est rare en pratique : impossible d'aligner sa consommation sur la production sans batterie.

### 2. Autoconsommation avec revente du surplus (le plus courant)

Vous consommez l'électricité produite **en temps réel** et **revendez le surplus à EDF Obligation d'Achat (EDF OA)** au tarif réglementé. C'est le **mode le plus répandu en résidentiel**, qui combine économies de facture et revenus complémentaires.

### 3. Revente totale

Vous revendez **toute** la production à EDF OA, sans en consommer. Plus rare aujourd'hui car le tarif d'achat en revente totale est moins favorable que le mode autoconsommation + surplus.

## Le tarif d'achat 2025 (EDF OA)

> Le tarif d'achat est **révisé tous les trimestres** par la CRE (Commission de Régulation de l'Énergie). Vérifiez le tarif en vigueur sur [photovoltaique.info](https://www.photovoltaique.info/) ou [cre.fr](https://www.cre.fr/) au moment de signer votre contrat.

À titre d'**ordre de grandeur** pour une installation **≤ 9 kWc en autoconsommation + revente du surplus** :

- **Tarif moyen 2025 : autour de 0,12 € à 0,14 €/kWh** revendu
- Contrat sur **20 ans**, indexé annuellement
- Tarif fixé à la signature du contrat (vous êtes protégé des baisses ultérieures)

Pour une installation 3 kWc en Île-de-France, avec autoconsommation à 65 % :
- Production : ~3 150 kWh/an
- Autoconsommé : ~2 050 kWh (économisés sur la facture EDF, ~0,21 €/kWh)
- Revendu : ~1 100 kWh × 0,13 €/kWh = **~143 €/an de revenus**

## Calcul de rentabilité — exemple chiffré

### Cas concret : maison à Bordeaux, 3 kWc

- **Coût installation** : 11 000 € TTC posée
- **Aides 2025** :
  - Prime à l'autoconsommation (~390 €/kWc × 3) : **~1 170 €**
  - TVA réduite à 10 % vs 20 % (déjà incluse au devis) : ~900 € d'économie
- **Reste à charge** : ~9 830 €
- **Production annuelle Bordeaux 3 kWc** : ~3 750 kWh
- **Autoconsommation 65 %** :
  - Économies facture EDF : 2 437 kWh × 0,21 €/kWh = **~512 €/an**
  - Revente du surplus : 1 313 kWh × 0,13 €/kWh = **~170 €/an**
  - **Total annuel : ~682 €**
- **Retour sur investissement** : 9 830 € / 682 €/an ≈ **14 ans**
- **Durée de vie panneaux** : 25-30 ans (garantie 25 ans des fabricants à 80 % de la puissance initiale)
- **Onduleur** : à remplacer une fois pendant la durée de vie (10-15 ans), ~1 200-1 800 €

> **Conclusion** : à Bordeaux, l'installation produit des revenus pendant **15 à 20 ans** après amortissement. Plus la facture EDF augmente (et elle augmente), plus le ROI s'améliore.

### Cas concret : appartement à Lille, 3 kWc

À Lille, avec une production ~25 % moindre (2 700 kWh vs 3 750 kWh), le retour sur investissement passe de 14 à environ **18-20 ans**. La rentabilité reste positive sur la durée de vie des panneaux, mais la marge est plus serrée.

## Aides 2025 pour le photovoltaïque

### Prime à l'autoconsommation

C'est la principale aide directe au PV. Versée par EDF OA sur **5 ans** (1/5 par an) pour les installations en autoconsommation + revente du surplus.

> Tarifs actualisés trimestriellement par la CRE. Pour 3 kWc : ~390 €/kWc × 3 = **~1 170 € total** (à vérifier au trimestre de signature).

### TVA réduite à 10 %

Pour les installations **≤ 3 kWc**, la TVA passe de 20 % à 10 % directement sur le devis. Au-delà, la TVA standard de 20 % s'applique.

### MaPrimeRénov' : non applicable au PV résidentiel

⚠️ **Attention** : MaPrimeRénov' **ne couvre pas les panneaux photovoltaïques** (ils produisent de l'électricité, pas de la chaleur). Seuls le **système solaire combiné (SSC)** et le **chauffe-eau solaire individuel (CESI)** — qui produisent de la chaleur — sont éligibles.

### Aides locales

Certaines régions, départements et communes versent des **subventions complémentaires** pour le PV : Occitanie, Île-de-France, Nouvelle-Aquitaine notamment. À vérifier auprès de votre conseiller ou via [france-renov.gouv.fr](https://france-renov.gouv.fr/).

### Exonération d'impôt sur la revente

Les revenus de revente PV pour une installation **≤ 3 kWc et ≤ 1 site** sont **exonérés d'impôt sur le revenu**. Au-delà, les revenus deviennent imposables au régime des micro-BIC.

## Pièges à éviter

### 1. Sous-estimer l'ombrage

**Une cheminée**, **un arbre**, **un immeuble voisin** peuvent réduire la production de 20 à 50 %. L'étude solaire doit cartographier les masques solaires sur l'année — pas juste à midi en plein été.

### 2. Surdimensionner par rapport à sa consommation

Une installation 9 kWc qui revend 80 % de sa production sera **moins rentable** qu'une 3 kWc qui autoconsomme 65 %. Le tarif de l'électricité achetée à EDF (~0,21 €/kWh) est **bien supérieur** au tarif de revente (~0,13 €/kWh).

### 3. Choisir un démarcheur téléphonique

Le secteur PV résidentiel est connu pour ses pratiques agressives de démarchage. **Une installation valable se construit sur étude** : potentiel solaire mesuré, dimensionnement précis, choix matériel transparent. Les promesses de gain « miracle » sans étude doivent vous alerter.

### 4. Oublier la garantie onduleur

L'onduleur a une **durée de vie plus courte** que les panneaux (10-15 ans contre 25-30 ans). Vérifiez la garantie au contrat ; budgéter son remplacement dans le calcul de rentabilité long terme.

### 5. Installateur non-RGE QualiPV

Sans certification RGE QualiPV au moment de la signature ET de la pose, **aucune aide ni prime à l'autoconsommation** n'est versée. Vérification sur [france-renov.gouv.fr/annuaire-rge](https://france-renov.gouv.fr/annuaire-rge).

## Démarches administratives

### Déclaration préalable de travaux

Pour une **installation en toiture ≤ 3 kWc**, une simple **déclaration préalable de travaux** en mairie suffit dans la plupart des cas. Délai d'instruction : un mois. Au-delà de 3 kWc ou en bâtiment classé, des autorisations supplémentaires s'appliquent.

### Convention de raccordement Enedis

Avant la mise en service, vous signez une **convention de raccordement** avec Enedis (gestionnaire du réseau). Elle décrit les conditions techniques d'injection au réseau. Le coût du raccordement est inclus dans les devis sérieux.

### Contrat EDF OA

Le contrat de revente avec EDF OA est signé **après la mise en service** de votre installation. Il vaut pour 20 ans à tarif fixé à la signature.

## En résumé

- ☀️ **Production** : 1 kWc = 900 à 1 400 kWh/an selon la région
- 💰 **Prix** : 8-12 000 € pour 3 kWc, 13-17 000 € pour 6 kWc
- 🔄 **Mode rentable** : autoconsommation + revente du surplus à EDF OA
- 💶 **Tarif d'achat** : ~0,12-0,14 €/kWh (révisé chaque trimestre par la CRE)
- 🎁 **Aides** : prime à l'autoconsommation (~390 €/kWc × 5 ans), TVA 10 % (≤ 3 kWc), aides locales possibles
- ⏱️ **Retour sur investissement** : 12-20 ans selon région et autoconsommation
- ⏳ **Durée de vie** : 25-30 ans (panneaux), 10-15 ans (onduleur)
- ⚠️ **Pièges** : ombrage, surdimensionnement, démarchage agressif, oubli de l'onduleur

## Faites chiffrer votre projet photovoltaïque

Notre simulateur intègre la production attendue selon votre département, les aides 2025 applicables et le tarif d'achat en vigueur ce trimestre. En quelques questions, vous obtenez un calcul de rentabilité réaliste, sans promesse exagérée.

[Estimer mes aides en 2 min →](/simulateur)

Pour aller plus loin : [voir le service photovoltaïque](/services/panneau-photovoltaique) ou [le guide complet MaPrimeRénov' 2025](/blog/maprimerenov-2025-qui-peut-en-beneficier-et-combien).

---

### Sources publiques utilisées dans cet article

- [photovoltaique.info](https://www.photovoltaique.info/) — référence indépendante du marché PV résidentiel
- [cre.fr](https://www.cre.fr/) — Commission de Régulation de l'Énergie, tarifs d'achat
- [france-renov.gouv.fr](https://france-renov.gouv.fr/) — cadre général, annuaire RGE QualiPV
- [economie.gouv.fr — TVA rénovation](https://www.economie.gouv.fr/particuliers/tva-renovation) — TVA réduite à 10 %
- [service-public.fr — déclaration préalable](https://www.service-public.fr/particuliers/vosdroits/F31176) — démarches d'urbanisme
- [ademe.fr](https://www.ademe.fr/) — production moyenne par zone climatique

*Les tarifs d'achat EDF OA changent chaque trimestre. Les chiffres cités correspondent à des ordres de grandeur 2025 et doivent être confirmés au moment du devis.*
`,
};
