# Shadow Fit App

A modern workout and fitness tracking application, designed to help users achieve their fitness goals.

## 🎯 Theme and Objectives

Shadow Fit is a comprehensive fitness application that allows users to:
- Track their workout sessions
- Manage their muscle progression
- Plan their exercise routines
- Visualize their performance statistics

## 🏗️ Project Architecture

The project follows a modular and maintainable architecture, organized as follows:

```
src/
├── _tests_/                   # Global tests (middleware, utils)
│   ├── middleware.test.ts
│   └── lib/
├── app/                       # Application pages and routes
├── actions/                   # Next.js server actions
│   └── training/
│       ├── startTraining.ts
├── components/                # Reusable Global React components
│   ├── MuscleCard.tsx
├── features/                # Reusable Specific components
   ├── auth/    
   ├── training/    
   └── program/
├── hooks/                     # Custom hooks
│   ├── useMuscleTracker.ts
├── lib/                       # Utilities and configurations
│   └── prisma.ts
├── repository/                # Data access layer
│   ├── training.repository.ts
├── services/                  # Business logic
│   ├── training.service.ts
├── utils/                     # Utility functions
├── types/                     # TypeScript definitions
└── constants/                 # Application constants

tests/                         # Tests organized by type
├── unit/                      # Unit tests
│   └── training.service.test.ts
├── integration/               # Integration tests
│   └── startTrainingFlow.test.ts
└── e2e/                       # End-to-end tests
    └── userCanTrainFlow.spec.ts
```

### Application Layers

1. **Presentation (Components)**
   - Reusable React components
   - Component tests with React Testing Library

2. **Business Logic (Services)**
   - Services containing business logic
   - Unit tests for services

3. **Data Access (Repository)**
   - Abstraction layer for data access
   - Repository tests

4. **Server Actions (Actions)**
   - Next.js server actions
   - Integration tests for flows

## 🛠️ Technologies Used

- **Frontend Framework**: Next.js
- **Language**: TypeScript
- **Database**: Prisma
- **Styling**: Tailwind CSS
- **Testing**: 
  - Jest for unit tests
  - React Testing Library for component tests
  - Playwright for e2e tests

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure the database:
```bash
npx prisma generate
npx prisma db push
```

3. Start the development server:
```bash
npm run dev
```

## 📊 Tests

- Unit tests: `npm run test:unit`
- Integration tests: `npm run test:integration`
- E2E tests: `npm run test:e2e`
- All tests: `npm run test`

## 📝 Best Practices

- TypeScript for type safety
- Automated tests at all levels
- Modular and maintainable architecture
- Clear separation of responsibilities
- Code documentation
- Systematic code review

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
# medicare-app
# medicare-app
