# Cahier des Charges - Medicare

## 1. Présentation du Projet

### 1.1 Contexte
Medicare est une application web de gestion hospitalière développée pour moderniser la gestion des établissements de santé au Sénégal.

### 1.2 Objectifs
- Digitaliser la gestion hospitalière
- Faciliter la gestion des rendez-vous et des patients
- Améliorer la coordination entre les services
- Sécuriser les données médicales
- Permettre le partage et la visualisation des images DICOM

## 2. Fonctionnalités Existantes

### 2.1 Authentification et Autorisation
- Système d'authentification avec BetterAuth
- Gestion des rôles (Admin, Directeur, Médecin, Secrétaire, Patient)
- Onboarding personnalisé selon le rôle
- Vérification d'email
- Réinitialisation de mot de passe

### 2.2 Administration
- Gestion complète des hôpitaux (CRUD)
- Import/Export des données
- Tableau de bord avec statistiques
- Gestion des utilisateurs et des rôles

### 2.3 Direction d'Hôpital
- Gestion du personnel médical
- Gestion des services
- Tableau de bord avec statistiques
- Vue d'ensemble de l'établissement

### 2.4 Médecins
- Gestion des rendez-vous
- Gestion des patients
- Visualisation DICOM
- Partage d'images médicales
- Prescriptions et rapports médicaux

### 2.5 Secrétariat
- Gestion des demandes de rendez-vous
- Planification des rendez-vous
- Gestion administrative

### 2.6 Patients
- Demande de rendez-vous
- Consultation du dossier médical
- Accès aux prescriptions
- Historique des consultations

### 2.7 Fonctionnalités Communes
- Notifications en temps réel
- Mode sombre/clair
- Interface responsive
- Export de données
- Filtres et recherche avancée

## 3. Architecture Technique

### 3.1 Frontend
- Next.js 14
- React
- TailwindCSS
- shadcn/ui
- Framer Motion pour les animations

### 3.2 Backend
- API Routes Next.js
- BetterAuth pour l'authentification
- PostgreSQL avec Prisma
- Gestion des fichiers DICOM

### 3.3 Sécurité
- Authentification sécurisée
- Protection des routes
- Validation des données
- Gestion des sessions

## 4. Structure de l'Application

### 4.1 Routes Principales
```
/
├── (auth)
│   ├── login
│   ├── register
│   ├── onboarding
│   ├── forgot-password
│   └── reset-password
├── (landing)
│   └── page
├── (protected)
│   ├── admin
│   │   ├── dashboard
│   │   ├── hospitals
│   │   └── users
│   ├── director
│   │   ├── dashboard
│   │   ├── services
│   │   └── staff
│   ├── doctor
│   │   ├── appointments
│   │   ├── patients
│   │   ├── dicom-viewer
│   │   └── treatments
│   ├── secretary
│   │   └── dashboard
│   └── patient
│       ├── appointments
│       └── medical-record
```

## 5. Contraintes et Exigences

### 5.1 Techniques
- Compatibilité navigateurs modernes
- Responsive design
- Performance optimisée
- Gestion des fichiers DICOM

### 5.2 Sécurité
- Protection des données médicales
- Authentification forte
- Traçabilité des actions
- Gestion des permissions

### 5.3 Légales
- Conformité RGPD
- Secret médical
- Conservation des données 