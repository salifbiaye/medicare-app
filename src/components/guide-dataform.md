```javascript

"use client"

import { z } from "zod"
import { User, Mail, Lock, FileText, Home, Briefcase, Users } from "lucide-react"
import {DataForm} from "@/components/data-form";
// Assurez-vous que le chemin est correct

export default function PatientForm() {
  // Définition du schéma de validation
  const formSchema = z.object({
    firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    address: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    company: z.string().optional(),
    position: z.string().optional(),
    department: z.string().optional(),
    bio: z.string().optional(),
    birthDate: z.date().optional(),
    interests: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    experience: z.number().min(0).max(50).optional(),
    salary: z.number().min(0).optional(),
  })

  // Configuration des champs du formulaire
  const formFields = [
    {
      type: "text" as const,
      name: "firstName",
      label: "Prénom",
      placeholder: "Entrez votre prénom",
      required: true,
      width: "half" as const
    },
    {
      type: "text" as const,
      name: "lastName",
      label: "Nom",
      placeholder: "Entrez votre nom",
      required: true,
      width: "half" as const
    },
    {
      type: "email" as const,
      name: "email",
      label: "Email",
      placeholder: "nom@exemple.com",
      required: true
    },
    {
      type: "password" as const,
      name: "password",
      label: "Mot de passe",
      placeholder: "Entrez un mot de passe sécurisé",
      required: true
    },
    {
      type: "text" as const,
      name: "address",
      label: "Adresse",
      placeholder: "Votre adresse",
      width: "full" as const
    },
    {
      type: "text" as const,
      name: "city",
      label: "Ville",
      placeholder: "Votre ville",
      width: "half" as const
    },
    {
      type: "text" as const,
      name: "zipCode",
      label: "Code postal",
      placeholder: "Code postal",
      width: "half" as const
    },
    {
      type: "text" as const,
      name: "company",
      label: "Entreprise",
      placeholder: "Nom de l'entreprise",
      width: "full" as const
    },
    {
      type: "text" as const,
      name: "position",
      label: "Poste",
      placeholder: "Votre poste",
      width: "half" as const
    },
    {
      type: "select" as const,
      name: "department",
      label: "Département",
      placeholder: "Sélectionnez un département",
      width: "half" as const,
      options: [
        { value: "it", label: "Informatique" },
        { value: "hr", label: "Ressources Humaines" },
        { value: "sales", label: "Ventes" },
        { value: "marketing", label: "Marketing" }
      ]
    },
    {
      type: "textarea" as const,
      name: "bio",
      label: "Biographie",
      placeholder: "Parlez-nous de vous",
      rows: 5
    },
    {
      type: "date" as const,
      name: "birthDate",
      label: "Date de naissance"
    },
    {
      type: "multi-select" as const,
      name: "interests",
      label: "Centres d'intérêt",
      options: [
        { value: "tech", label: "Technologie" },
        { value: "sports", label: "Sports" },
        { value: "art", label: "Art" },
        { value: "music", label: "Musique" },
        { value: "travel", label: "Voyages" }
      ]
    },
    {
      type: "multi-select" as const,
      name: "skills",
      label: "Compétences",
      options: [
        { value: "javascript", label: "JavaScript" },
        { value: "react", label: "React" },
        { value: "nodejs", label: "Node.js" },
        { value: "python", label: "Python" },
        { value: "design", label: "Design" }
      ]
    },
    {
      type: "slide" as const,
      name: "experience",
      label: "Années d'expérience",
      min: 0,
      max: 30,
      step: 1
    },
    {
      type: "number" as const,
      name: "salary",
      label: "Salaire souhaité",
      min: 0,
      width: "half" as const
    }
  ]

  // Configuration des groupes pour Tabs et Steps
  const formGroups = [
    {
      title: "Informations personnelles",
      description: "Vos informations d'identité",
      icon: <User size={18} />,
      fields: ["firstName", "lastName", "email", "password", "birthDate"],
      variant: "outlined"
    },
    {
      title: "Adresse",
      description: "Où pouvons-nous vous contacter ?",
      icon: <Home size={18} />,
      fields: ["address", "city", "zipCode"],
      variant: "outlined"
    },
    {
      title: "Professionnel",
      description: "Votre parcours professionnel",
      icon: <Briefcase size={18} />,
      fields: ["company", "position", "department", "experience", "salary"],
      variant: "outlined"
    },
    {
      title: "À propos de vous",
      description: "Parlez-nous de vous",
      icon: <FileText size={18} />,
      fields: ["bio", "interests", "skills"],
      variant: "outlined"
    }
  ]

  // Gestion de la soumission
  const handleSubmit = (data) => {
    console.log("Données soumises:", data)
    // Traitement des données...
  }

  return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-12 text-center">Exemple de formulaire</h1>

        {/* Exemple avec le layout "tabs" */}
        <div className="mb-20">
          <h2 className="text-2xl font-semibold mb-8">Layout Tabs</h2>
          <DataForm
              schema={formSchema}
              fields={formFields}
              submitButtonText="Enregistrer"
              onSubmit={handleSubmit}
              title="Formulaire à onglets"
              description="Navigation par onglets entre les différentes sections"
              layout="tabs"
              theme="glassmorphism"
              groups={formGroups}
              rounded="lg"
              elevation="md"
              animation="fade"
          />
        </div>

        {/* Exemple avec le layout "steps" */}
        <div className="mb-20">
          <h2 className="text-2xl font-semibold mb-8">Layout Steps</h2>
          <DataForm
              schema={formSchema}
              fields={formFields}
              submitButtonText="Terminer l'inscription"
              onSubmit={handleSubmit}
              title="Formulaire par étapes"
              description="Complétez chaque étape pour finaliser votre inscription"
              layout="steps"
              theme="gradient"
              groups={formGroups}
              showProgressBar={true}
              rounded="md"
              elevation="lg"
              animation="slide"
          />
        </div>

        {/* Exemple avec le layout "wizard" */}
        <div className="mb-20">
          <h2 className="text-2xl font-semibold mb-8">Layout Wizard</h2>
          <DataForm
              schema={formSchema}
              fields={formFields}
              submitButtonText="Terminer"
              onSubmit={handleSubmit}
              title="Assistant d'inscription"
              description="Laissez-vous guider pour créer votre compte"
              layout="wizard"
              theme="neumorphism"
              groups={formGroups}
              showProgressBar={true}
              rounded="lg"
              elevation="md"
              animation="zoom"
          />
        </div>

        {/* Exemple avec le layout "card" */}
        <div className="mb-20">
          <h2 className="text-2xl font-semibold mb-8">Layout Card</h2>
          <DataForm
              schema={formSchema}
              fields={formFields}
              submitButtonText="Enregistrer"
              onSubmit={handleSubmit}
              title="Formulaire en carte"
              description="Tous les champs dans une carte élégante"
              layout="card"
              theme="modern"
              groups={formGroups}
              rounded="lg"
              elevation="xl"
              animation="fade"
          />
        </div>
      </div>
  )
}

```