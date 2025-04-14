# Shadow Fit App

Une application moderne de suivi d'entraînement et de fitness, conçue pour aider les utilisateurs à atteindre leurs objectifs de remise en forme.

## 🎯 Objectifs

Shadow Fit est une application complète qui permet aux utilisateurs de :
- Suivre leurs séances d'entraînement
- Gérer leur progression musculaire
- Planifier leurs routines d'exercices
- Visualiser leurs statistiques de performance
- Suivre leur progression au fil du temps

## 🏗️ Architecture du Projet

Le projet suit une architecture modulaire et maintenable, organisée comme suit :

```
src/
├── _tests_/                   # Tests globaux (middleware, utils)
│   ├── middleware.test.ts
│   └── lib/
├── app/                       # Pages et routes de l'application
├── actions/                   # Actions serveur Next.js
│   └── training/
│       ├── startTraining.ts
│       └── startTraining.test.ts
├── components/                # Composants React réutilisables
│   ├── MuscleCard.tsx
│   └── MuscleCard.test.tsx
├── hooks/                     # Hooks personnalisés
│   ├── useMuscleTracker.ts
│   └── useMuscleTracker.test.ts
├── lib/                       # Utilitaires et configurations
│   └── prisma.ts
├── repository/                # Couche d'accès aux données
│   ├── training.repository.ts
│   └── training.repository.test.ts
├── services/                  # Logique métier
│   ├── training.service.ts
│   └── training.service.test.ts
├── utils/                     # Fonctions utilitaires
├── types/                     # Définitions TypeScript
└── constants/                 # Constantes de l'application
```

## 🛠️ Technologies Utilisées

- **Framework Frontend** : Next.js
- **Langage** : TypeScript
- **Base de données** : Prisma
- **Styling** : Tailwind CSS
- **Tests** : 
  - Jest pour les tests unitaires
  - React Testing Library pour les tests de composants
  - Playwright pour les tests e2e

## 🚀 Démarrage

1. Installer les dépendances :
```bash
npm install
```

2. Configurer la base de données :
```bash
npx prisma generate
npx prisma db push
```

3. Démarrer le serveur de développement :
```bash
npm run dev
```

## 📊 Tests

- Tests unitaires : `npm run test:unit`
- Tests d'intégration : `npm run test:integration`
- Tests e2e : `npm run test:e2e`
- Tous les tests : `npm run test`

## 📝 Bonnes Pratiques

- TypeScript pour la sécurité des types
- Tests automatisés à tous les niveaux
- Architecture modulaire et maintenable
- Séparation claire des responsabilités
- Documentation du code
- Revue systématique du code

## 🔍 Fonctionnalités Principales

- Suivi des séances d'entraînement en temps réel
- Visualisation de la progression musculaire
- Planification des routines d'exercices
- Statistiques détaillées de performance
- Interface utilisateur intuitive et responsive

## 📱 Support

Pour toute question ou problème, veuillez ouvrir une issue sur le repository GitHub.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
