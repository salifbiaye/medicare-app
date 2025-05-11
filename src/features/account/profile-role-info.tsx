"use client"

import type { User, Role } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
    <div>
      <div className="border-b px-6 py-5">
        <h3 className="text-lg font-medium">Informations Professionnelles</h3>
        <p className="text-sm text-muted-foreground">Détails spécifiques à votre rôle dans le système</p>
      </div>

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
