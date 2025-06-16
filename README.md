# Medicare - Plateforme Intégrée de Gestion Médicale

Medicare est une plateforme médicale complète qui révolutionne la gestion des établissements de santé. Elle offre une suite d'outils intégrés pour la gestion des rendez-vous, le suivi des patients, la gestion des dossiers médicaux et la collaboration entre professionnels de santé. La plateforme facilite l'échange sécurisé de données médicales et optimise le parcours de soins des patients.

## Équipe de Développement

- **Salif BIAYE** 
- **Moughamadou Tidiane SECK** 
- **Ndeye Astou DIAGOURAGA** 
- **Ouleymatou Sadiya CISSE** 
- **Sountou SAKHO** 

## Fonctionnalités Principales

### Gestion des Rendez-vous et Consultations
- 🏥 Planification et suivi des rendez-vous
- 👨‍⚕️ Interface médecin pour la gestion des consultations
- 👨‍💼 Interface secrétaire pour la gestion administrative
- 🤒 Espace patient personnalisé
- 📱 Notifications et rappels automatiques

### Dossier Médical Électronique
- 📋 Gestion des dossiers patients
- 🔍 Historique médical complet
- 📊 Suivi des constantes vitales
- 💉 Historique des vaccinations
- 🧬 Résultats d'analyses

### Imagerie Médicale
- 🖼️ Visualisation d'images DICOM
- 📁 Stockage sécurisé des images médicales
- 🔄 Partage d'images entre professionnels
- 📸 Support multi-modalités (radiographie, scanner, IRM)

### Prescription et Documentation
- 📝 Rédaction d'ordonnances électroniques
- 📄 Génération de rapports médicaux
- 🏥 Certificats médicaux
- 📊 Rapports d'analyses
- 🔒 Signature électronique sécurisée

### Services Spécialisés
- 👥 Gestion multi-services (cardiologie, radiologie, etc.)
- 🔬 Suivi des examens de laboratoire
- 💊 Gestion de la pharmacie
- 🚑 Gestion des urgences
- 📈 Statistiques et rapports d'activité

### Sécurité et Conformité
- 🔒 Authentification forte
- 🛡️ Chiffrement des données
- 📜 Conformité RGPD
- 🔐 Traçabilité des accès
- 📋 Gestion des autorisations

## Prérequis

- Node.js (v18 ou supérieur)
- Docker et Docker Compose
- Git

## Installation

1. **Cloner le projet**
```bash
git clone https://github.com/votre-organisation/medicare.git
cd medicare
```

2. **Configuration des variables d'environnement**
```bash
cp .env.example .env
```
Modifiez le fichier `.env` avec vos propres configurations.

3. **Lancement avec Docker**
```bash
docker compose up -d
```

4. **Installation des dépendances (en dehors de Docker)**
```bash
npm install
```

5. **Lancement en mode développement**
```bash
npm run dev
```

L'application sera accessible à l'adresse : `http://localhost:3000`

## Structure du Projet

```
medicare/
├── src/
│   ├── actions/        # Server Actions
│   ├── app/           # Pages et routes
│   ├── components/    # Composants réutilisables
│   ├── features/      # Fonctionnalités spécifiques
│   │   ├── appointments/    # Gestion des rendez-vous
│   │   ├── medical-records/ # Dossiers médicaux
│   │   ├── imaging/        # Imagerie médicale
│   │   ├── prescriptions/  # Ordonnances et rapports
│   │   └── services/       # Services spécialisés
│   ├── lib/          # Bibliothèques et configurations
│   ├── repository/   # Couche d'accès aux données
│   └── services/     # Logique métier
├── prisma/          # Schémas et migrations
└── public/         # Assets statiques
```

## Technologies Utilisées

- **Frontend**: Next.js 15, React, TailwindCSS, Shadcn/ui
- **Backend**: Prisma ORM
- **Base de données**: PostgreSQL
- **Conteneurisation**: Docker
- **Imagerie Médicale**: Cornestone.js
- **PDF**: React-PDF
- **Sécurité**: NextAuth.js, JWT


