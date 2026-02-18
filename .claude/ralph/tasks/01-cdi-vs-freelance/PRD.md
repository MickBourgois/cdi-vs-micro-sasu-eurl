# Feature: Comparateur CDI vs Freelance Auto-Entrepreneur

## Vision
Une application web permettant de comparer en un coup d'œil le revenu net d'un poste en CDI
versus une mission en freelance auto-entrepreneur, à partir d'un salaire brut annuel ou d'un TJM
et d'un nombre de jours travaillés dans l'année.

## Problème
Lorsqu'on reçoit une proposition (CDI ou mission freelance), il est difficile de comparer
directement les deux car les structures de rémunération sont très différentes :
- CDI : on raisonne en salaire brut, l'employeur paie des charges patronales en plus
- Freelance AE : on raisonne en TJM (Taux Journalier Moyen), les cotisations sociales sont de 22% du CA

Résultat : impossible de savoir rapidement lequel rapporte le plus en net dans la poche.

## Solution
Un calculateur en deux colonnes (CDI | Freelance) avec :
- Saisie intuitive des paramètres de chaque côté
- Calcul en temps réel du revenu net
- Un panneau de comparaison clair avec le verdict et l'écart
- Partage de la simulation via URL

## Utilisateurs cibles
Développeurs, consultants, profils tech/digital qui reçoivent des propositions des deux types
et veulent comparer rapidement sans Excel.

## Périmètre (MVP)

### Côté CDI
- Input : salaire brut annuel (€)
- Input : statut (Cadre ~25%, Non-cadre ~22%, Taux personnalisé)
- Calculs affichés :
  - Revenu net annuel et mensuel (après charges salariales)
  - Coût total employeur annuel (brut × 1.42 à 1.45)
  - TJM équivalent mission (coût employeur / jours, indicatif)

### Côté Freelance Auto-Entrepreneur (BNC/Services)
- Input : TJM (€/jour)
- Input : nombre de jours travaillés/an (défaut : 218 jours — convention française)
- Calculs affichés :
  - CA annuel brut (TJM × jours)
  - Cotisations sociales (22% du CA)
  - Revenu net annuel et mensuel (CA × 0.78)

### Panneau de comparaison
- Verdict visuel : CDI gagne / Freelance gagne
- Écart en euros par an
- Écart en pourcentage
- TJM break-even : quel TJM faut-il pour égaler le net CDI ?
- Salaire brut CDI break-even : quel brut CDI équivaut au net AE ?

## Phases de développement

### Phase 1 : Foundation
- [ ] Initialiser le projet Next.js avec TypeScript + Tailwind CSS + App Router
- [ ] Créer les types TypeScript et la bibliothèque de calculs (CDI + AE)

### Phase 2 : Composants de saisie
- [ ] Créer le formulaire CDI (salaire brut + statut/taux)
- [ ] Créer le formulaire Freelance AE (TJM + jours)

### Phase 3 : Affichage des résultats
- [ ] Créer les cartes de résultats CDI (net, coût employeur, TJM equiv.)
- [ ] Créer les cartes de résultats AE (CA, cotisations, net)
- [ ] Créer le panneau de comparaison (verdict, écart, break-even)

### Phase 4 : Intégration & UX
- [ ] Assembler la page principale avec layout responsive 2 colonnes
- [ ] Ajouter le partage par URL (serialize/deserialize les inputs dans les query params)
- [ ] Design polish : couleurs, animations, tooltips explicatifs, header/footer

## Hors périmètre (V1)
- Calcul de l'impôt sur le revenu (trop variable selon situation personnelle)
- Statuts freelance autres qu'auto-entrepreneur (SASU, EURL, portage salarial)
- Simulation de retraite ou prévoyance
- Historique de simulations
- Authentification utilisateur

## Notes techniques
- Stack : Next.js 14+ App Router, TypeScript, Tailwind CSS
- Framework de calculs : fonctions pures dans `src/lib/calculations.ts`
- Pas de backend ni de base de données — tout en client-side
- Charges patronales CDI : ~42% du brut (approximation standard)
- Cotisations AE : 22% du CA (services BNC, taux 2025)
- Jours travaillés par défaut : 218 (52 semaines - 5 sem congés - ~11 jours fériés)
- Déploiement cible : Vercel (simple next build)
