# Shadow Fit App

Une application moderne de suivi d'entraînement et de fitness, conçue pour aider les utilisateurs à atteindre leurs objectifs de remise en forme.

## 🎯 Thème et Objectifs

Shadow Fit est une application de fitness complète qui permet aux utilisateurs de :
- Suivre leurs séances d'entraînement
- Gérer leur progression musculaire
- Planifier leurs routines d'exercices
- Visualiser leurs statistiques de performance

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

tests/                         # Tests organisés par type
├── unit/                      # Tests unitaires
│   └── training.service.test.ts
├── integration/               # Tests d'intégration
│   └── startTrainingFlow.test.ts
└── e2e/                       # Tests end-to-end
    └── userCanTrainFlow.spec.ts
```

### Couches de l'Application

1. **Présentation (Components)**
   - Composants React réutilisables
   - Tests de composants avec React Testing Library

2. **Logique Métier (Services)**
   - Services contenant la logique métier
   - Tests unitaires des services

3. **Accès aux Données (Repository)**
   - Couche d'abstraction pour l'accès aux données
   - Tests de repository

4. **Actions Serveur (Actions)**
   - Actions Next.js pour les opérations serveur
   - Tests d'intégration des flux

## 🛠️ Technologies Utilisées

- **Framework Frontend**: Next.js
- **Langage**: TypeScript
- **Base de Données**: Prisma
- **Styling**: Tailwind CSS
- **Tests**: 
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

3. Démarrer l'application en mode développement :
```bash
npm run dev
```

## 📊 Tests

- Tests unitaires : `npm run test:unit`
- Tests d'intégration : `npm run test:integration`
- Tests e2e : `npm run test:e2e`
- Tous les tests : `npm run test`

## 📝 Bonnes Pratiques

- Utilisation de TypeScript pour la sécurité du typage
- Tests automatisés à tous les niveaux
- Architecture modulaire et maintenable
- Séparation claire des responsabilités
- Documentation du code
- Revue de code systématique

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
