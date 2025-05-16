"use client"

import type { User, Role } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { AnimatedHeader, AnimatedLayout } from "@/components/animations/animated-layout"
import { ParticlesBackground } from "@/components/animations/particles-background"
import {
  UserPlus,
  Stethoscope,
  UserCog,
  UserCheck,
  UserRound,
  Building2,
  Clipboard,
  CalendarClock,
  FileText,
  Pill,
  SquareUser,
} from "lucide-react"

type ProfileRoleInfoProps = {
  user: User
}

export function ProfileRoleInfo({ user }: ProfileRoleInfoProps) {
  const getRoleIcon = (role: Role) => {
    switch (role) {
      case "PATIENT":
        return UserPlus
      case "DOCTOR":
        return Stethoscope
      case "CHIEF_DOCTOR":
        return UserCog
      case "SECRETARY":
        return UserCheck
      case "DIRECTOR":
        return UserRound
      case "ADMIN":
        return UserCheck
      default:
        return UserPlus
    }
  }

  const getRoleColor = (role: Role) => {
    switch (role) {
      case "PATIENT":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "DOCTOR":
        return "bg-green-50 text-green-700 border-green-200"
      case "CHIEF_DOCTOR":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "SECRETARY":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "DIRECTOR":
        return "bg-red-50 text-red-700 border-red-200"
      case "ADMIN":
        return "bg-gray-50 text-gray-700 border-gray-200"
      default:
        return "bg-blue-50 text-blue-700 border-blue-200"
    }
  }

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case "PATIENT":
        return "Patient"
      case "DOCTOR":
        return "Médecin"
      case "CHIEF_DOCTOR":
        return "Médecin en Chef"
      case "SECRETARY":
        return "Secrétaire"
      case "DIRECTOR":
        return "Directeur"
      case "ADMIN":
        return "Administrateur"
      default:
        return "Patient"
    }
  }

  const RoleIcon = getRoleIcon(user.role)

  // Description des fonctionnalités par rôle
  const getRoleDescription = (role: Role) => {
    switch (role) {
      case "PATIENT":
        return {
          title: "En tant que Patient, vous pouvez :",
          features: [
            "Prendre rendez-vous avec des médecins",
            "Consulter votre dossier médical complet",
            "Voir vos prescriptions et ordonnances actives",
            "Recevoir des notifications pour vos rendez-vous à venir",
            "Accéder à vos résultats d'analyses médicales",
            "Contacter votre médecin via messagerie sécurisée"
          ]
        }
      case "DOCTOR":
        return {
          title: "En tant que Médecin, vous pouvez :",
          features: [
            "Gérer votre calendrier de consultations",
            "Consulter et modifier les dossiers médicaux des patients",
            "Créer des prescriptions et ordonnances",
            "Rédiger des rapports médicaux",
            "Partager des dossiers médicaux avec d'autres médecins",
            "Recevoir des notifications pour vos rendez-vous"
          ]
        }
      case "CHIEF_DOCTOR":
        return {
          title: "En tant que Médecin en Chef, vous pouvez :",
          features: [
            "Toutes les fonctionnalités d'un médecin standard",
            "Gérer les médecins de votre service",
            "Valider les rapports médicaux importants",
            "Superviser l'activité de votre service",
            "Accéder aux statistiques de votre service",
            "Gérer les ressources et le planning du service"
          ]
        }
      case "SECRETARY":
        return {
          title: "En tant que Secrétaire, vous pouvez :",
          features: [
            "Gérer les rendez-vous et le planning des médecins",
            "Traiter les demandes de rendez-vous des patients",
            "Gérer les dossiers administratifs des patients",
            "Préparer les documents pour les médecins",
            "Envoyer des notifications aux patients",
            "Gérer l'accueil et l'orientation des patients"
          ]
        }
      case "DIRECTOR":
        return {
          title: "En tant que Directeur, vous pouvez :",
          features: [
            "Superviser l'ensemble des services de l'hôpital",
            "Accéder aux statistiques globales de l'établissement",
            "Gérer les ressources humaines et matérielles",
            "Valider les décisions administratives importantes",
            "Consulter les rapports d'activité des services",
            "Communiquer avec les chefs de service"
          ]
        }
      case "ADMIN":
        return {
          title: "En tant qu'Administrateur, vous pouvez :",
          features: [
            "Gérer tous les utilisateurs du système",
            "Créer et configurer les comptes utilisateurs",
            "Configurer les paramètres globaux de la plateforme",
            "Surveiller l'activité et les performances du système",
            "Gérer les droits d'accès et les permissions",
            "Effectuer la maintenance et les sauvegardes"
          ]
        }
      default:
        return {
          title: "Fonctionnalités disponibles :",
          features: [
            "Accès au tableau de bord principal",
            "Gestion de votre profil utilisateur",
            "Modification de vos paramètres de sécurité",
            "Consultation des notifications du système"
          ]
        }
    }
  }

  const roleFeatures = getRoleDescription(user.role)

  // Mock data for demonstration
  const mockHospital = {
    name: "Hôpital Universitaire de Paris",
    address: "5 Rue du Faubourg Saint-Denis, 75010 Paris",
  }

  const mockService = {
    name: "Cardiologie",
    type: "CARDIOLOGY",
  }

  const mockPatientInfo = {
    socialSecurityNumber: "1 99 12 34 567 890 12",
    bloodGroup: "O+",
    allergies: "Pénicilline, Arachides",
  }

  const mockDoctorInfo = {
    specialty: "CARDIOLOGY",
    registrationNumber: "12345678",
    isChief: false,
  }

  return (
    <div className="w-full p-6">
      <AnimatedLayout>
        <ParticlesBackground />
        <AnimatedHeader>
          <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-full mr-4">
            <SquareUser className="h-8 w-8 text-primary" />
          </div>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl text-background dark:text-foreground font-bold mb-2"
            >
              Informations Professionnelles
            </motion.h1>
            <p className="text-background/80 dark:text-foreground/40">
              Détails spécifiques à votre rôle dans le système
            </p>
          </div>
          <Badge className={`ml-auto ${getRoleColor(user.role)}`}>
            {getRoleLabel(user.role)}
          </Badge>
        </AnimatedHeader>
      </AnimatedLayout>

      <div className="p-6 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Rôle dans le système</CardTitle>
              <RoleIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Votre rôle et vos responsabilités</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className={`rounded-full px-3 py-1 text-sm font-medium ${getRoleColor(user.role)}`}>
                {getRoleLabel(user.role)}
              </div>
              <span className="text-sm text-muted-foreground">
                Depuis le {new Date(user.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Fonctionnalités disponibles</CardTitle>
              <RoleIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Ce que vous pouvez faire avec votre compte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">{roleFeatures.title}</h4>
              <ul className="space-y-2">
                {roleFeatures.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className={`flex-shrink-0 rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-bold ${getRoleColor(user.role)}`}>
                      {index + 1}
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {(user.role === "DOCTOR" ||
          user.role === "CHIEF_DOCTOR" ||
          user.role === "SECRETARY" ||
          user.role === "DIRECTOR") && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Établissement</CardTitle>
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>Informations sur votre établissement de rattachement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">{mockHospital.name}</p>
                  <p className="text-xs text-muted-foreground">{mockHospital.address}</p>
                </div>

                {(user.role === "DOCTOR" || user.role === "CHIEF_DOCTOR" || user.role === "SECRETARY") && (
                  <div className="pt-2">
                    <p className="text-sm font-medium">Service</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {mockService.name}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {user.role === "PATIENT" && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Informations médicales</CardTitle>
                <Clipboard className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>Vos informations médicales importantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs font-medium text-muted-foreground">Numéro de sécurité sociale</p>
                    <p className="mt-1 font-medium">{mockPatientInfo.socialSecurityNumber}</p>
                  </div>

                  <div className="rounded-lg border p-3">
                    <p className="text-xs font-medium text-muted-foreground">Groupe sanguin</p>
                    <p className="mt-1 font-medium">{mockPatientInfo.bloodGroup}</p>
                  </div>
                </div>

                <div className="rounded-lg border p-3">
                  <p className="text-xs font-medium text-muted-foreground">Allergies</p>
                  <p className="mt-1 font-medium">{mockPatientInfo.allergies}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {(user.role === "DOCTOR" || user.role === "CHIEF_DOCTOR") && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Informations professionnelles</CardTitle>
                <Stethoscope className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>Vos informations professionnelles médicales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs font-medium text-muted-foreground">Spécialité</p>
                    <p className="mt-1 font-medium">
                      {mockDoctorInfo.specialty === "CARDIOLOGY" ? "Cardiologie" : mockDoctorInfo.specialty}
                    </p>
                  </div>

                  <div className="rounded-lg border p-3">
                    <p className="text-xs font-medium text-muted-foreground">Numéro d'inscription</p>
                    <p className="mt-1 font-medium">{mockDoctorInfo.registrationNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {mockDoctorInfo.isChief && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      Médecin en Chef
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {user.role === "PATIENT" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Rendez-vous</CardTitle>
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Rendez-vous à venir</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Rapports médicaux</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">7</p>
                <p className="text-xs text-muted-foreground">Rapports disponibles</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Prescriptions</CardTitle>
                  <Pill className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">Prescriptions actives</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
