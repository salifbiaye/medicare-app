# Rapport Technique - Medicare

## 1. Architecture Technique

### 1.1 Stack Technologique
- **Frontend** : Next.js 15, React, TailwindCSS
- **Backend** : API Routes Next.js
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Authentification** : BetterAuth
- **UI Components** : shadcn/ui
- **Animations** : Framer Motion
- **Formulaires** : React Hook Form + Zod
- **Notifications** : Sonner
- **Gestion DICOM** : dwv-react

### 1.2 Structure du Projet
```
medicare-app/
├───src/
    ├───actions
    ├───app
    │   ├───(auth)
    │   │   ├───forgot-password
    │   │   ├───login
    │   │   ├───onboarding
    │   │   ├───register
    │   │   ├───reset-password
    │   │   └───verify-email
    │   ├───(landing)
    │   ├───(protected)
    │   │   ├───account
    │   │   ├───admin
    │   │   │   ├───dashboard
    │   │   │   │   ├───@hospitals
    │   │   │   │   └───@users
    │   │   │   ├───hospitals
    │   │   │   │   ├───import
    │   │   │   │   ├───new
    │   │   │   │   └───[id]
    │   │   │   │       └───edit
    │   │   │   └───users
    │   │   │       ├───import
    │   │   │       ├───new
    │   │   │       └───[id]
    │   │   │           └───edit
    │   │   ├───director
    │   │   │   ├───dashboard
    │   │   │   │   ├───@personnels
    │   │   │   │   └───@services
    │   │   │   ├───services
    │   │   │   │   ├───import
    │   │   │   │   ├───new
    │   │   │   │   └───[id]
    │   │   │   │       └───edit
    │   │   │   └───staff
    │   │   │       ├───import
    │   │   │       ├───new
    │   │   │       └───[id]
    │   │   │           └───edit
    │   │   ├───doctor
    │   │   │   ├───appointment
    │   │   │   │   ├───new
    │   │   │   │   └───[id]
    │   │   │   │       └───edit
    │   │   │   ├───calendar
    │   │   │   ├───dashboard
    │   │   │   ├───dicom-viewer
    │   │   │   │   └───shared
    │   │   │   ├───patients
    │   │   │   │   ├───new
    │   │   │   │   └───[id]
    │   │   │   │       └───edit
    │   │   │   ├───prescriptions
    │   │   │   │   └───[id]
    │   │   │   ├───reports
    │   │   │   │   └───[id]
    │   │   │   └───treatments
    │   │   ├───notifications
    │   │   ├───patient
    │   │   │   ├───calendar
    │   │   │   ├───medical-record
    │   │   │   ├───prescriptions
    │   │   │   │   └───[id]
    │   │   │   └───requests
    │   │   │       └───[id]
    │   │   └───secretary
    │   │       └───dashboard
    │   └───api
    │       ├───auth
    │       │   └───[...all]
    │       ├───orthanc
    │       │   └───instances
    │       │       └───[id]
    │       ├───patients
    │       │   └───[id]
    │       │       ├───dicoms
    │       │       ├───medical-reports
    │       │       └───prescriptions
    │       └───session
    ├───components
    │   ├───admin
    │   ├───animations
    │   ├───datatable
    │   ├───email-template
    │   ├───input-component
    │   ├───layouts
    │   ├───navbar
    │   └───ui
    ├───features
    │   ├───account
    │   ├───admin
    │   │   ├───dashboard
    │   │   │   ├───hospitals
    │   │   │   └───users
    │   │   ├───hospitals
    │   │   └───users
    │   ├───auth
    │   │   └───onboarding
    │   ├───director
    │   │   ├───dashboard
    │   │   │   ├───personnels
    │   │   │   └───services
    │   │   ├───personnels
    │   │   └───services
    │   ├───doctor
    │   │   ├───appointment-requests
    │   │   ├───calendar
    │   │   ├───dicom-viewer
    │   │   ├───dicomviewer
    │   │   │   └───components
    │   │   ├───patients
    │   │   ├───prescriptions
    │   │   └───reports
    │   ├───landing
    │   ├───notifications
    │   │   ├───components
    │   │   └───lib
    │   ├───patient
    │   │   ├───calendar
    │   │   ├───medical-record
    │   │   └───prescriptions
    │   └───secretary
    │       └───appointment-requests
    ├───fields
    ├───groups
    ├───hooks
    ├───lib
    ├───repository
    ├───schemas
    ├───services
    └───types
```

## 2. Fonctionnalités Implémentées

### 2.1 Authentification (BetterAuth)
- Connexion/Inscription
- Vérification d'email
- Réinitialisation de mot de passe
- Onboarding personnalisé
- Protection des routes

### 2.2 Gestion des Hôpitaux
- CRUD complet
- Import/Export
- Tableau de bord statistique
- Gestion des services
- Filtres et recherche

### 2.3 Gestion des Utilisateurs
- Multi-rôles
- Import en masse
- Profils personnalisés
- Permissions granulaires

### 2.4 Module Médical
- Gestion des rendez-vous
- Dossiers médicaux
- Visualisation DICOM
- Partage d'images
- Prescriptions

### 2.5 Notifications
- Temps réel
- Personnalisées par rôle
- Actions contextuelles
- Historique

## 3. Implémentations Techniques

### 3.1 Server Actions
```typescript
// Exemple d'action serveur
export async function createHospitalsAction(data: CreateHospitalFormValues[]) {
    return await HospitalService.createHospitals(data)
}
```

### 3.2 Protection des Routes
```typescript
// Middleware de protection
const Layout = async ({ children }: LayoutProps) => {
    const session = await auth.api.getSession()
    if (!session?.user) {
        redirect('/login')
    }
    // ...
}
```

### 3.3 Gestion DICOM
```typescript
// Partage d'images DICOM
export async function shareDicomAction({
  dicomId,
  doctorEmail
}: {
  dicomId: string
  doctorEmail: string
}) {
  return await DicomService.shareDicom({
    dicomId,
    doctorEmail
  })
}
```

## 4. Interface Utilisateur

### 4.1 Composants Principaux
- DataTable avec filtres et export
- Formulaires dynamiques
- Visualiseur DICOM
- Tableaux de bord
- Calendrier de rendez-vous

### 4.2 Design System
- Thème personnalisé
- Mode sombre/clair
- Composants shadcn/ui
- Animations Framer Motion
- Interface responsive

### 4.3 Navigation
- Layout protégé
- Menu contextuel
- Fil d'Ariane
- Notifications

## 5. Base de Données

### 5.1 Modèles Principaux
```prisma
model User {
  id              String    @id
  email           String    @unique
  role            Role
  profileCompleted Boolean
  // ...
}

model Hospital {
  id        String    @id
  name      String
  services  Service[]
  doctors   Doctor[]
  // ...
}

model Service {
  id          String    @id
  name        String
  hospitalId  String
  // ...
}
```

## 6. Sécurité

### 6.1 Authentification
- BetterAuth pour la gestion des sessions
- Tokens sécurisés
- Validation des emails

### 6.2 Protection des Données
- Middleware de vérification
- Validation avec Zod
- Routes API sécurisées

### 6.3 Autorisations
- Contrôle d'accès par rôle
- Vérification des permissions
- Protection des ressources

## 7. Performance

### 7.1 Optimisations Frontend
- Server Side Rendering
- Lazy loading
- Pagination
- Mise en cache

### 7.2 Optimisations Backend
- Requêtes optimisées
- Indexation
- Rate limiting

## 8. Déploiement

### 8.1 Prérequis
- Node.js 18+
- PostgreSQL 14+
- Configuration DICOM

### 8.2 Variables d'Environnement
```env
DATABASE_URL=
NEXTAUTH_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
``` 