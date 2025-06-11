import { notFound } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon, MailIcon, User, MapPin, Phone,
  FileText, Heart, DropletIcon, List
} from "lucide-react"
import { AnimatedHeader, AnimatedLayout } from "@/components/animations/animated-layout"
import { ParticlesBackground } from "@/components/animations/particles-background"
import { PatientRepository } from "@/repository/patient.repository"

import {auth} from "@/lib/auth";
import {headers} from "next/headers";


export default async function MedicalRecordPage() {
  const headersValue = await headers()
 const session = await auth.api.getSession({ headers: headersValue })
  
  if (!session?.user) {
    notFound()
  }

  const patient =await PatientRepository.getPatientByUserId(session.user.id)

  if (!patient) {
    notFound()
  }

  // Check if patient has a medical record
  if (!patient.medicalRecord) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Aucun dossier médical</h1>
          <p className="mt-2 text-muted-foreground">
            Vous n'avez pas encore de dossier médical. Veuillez contacter votre médecin.
          </p>
        </div>
      </div>
    )
  }

  const medicalRecord = await PatientRepository.getMedicalRecordById(patient.medicalRecord.id)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-12 pt-6 dark:from-background dark:to-background/95">
      <div className="px-4">
        <AnimatedLayout>
          <ParticlesBackground />
          <AnimatedHeader>
            <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-full mr-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl text-background dark:text-foreground font-bold tracking-tight">Mon Dossier Médical</h1>
              <p className="text-background/80 dark:text-foreground/50">Consultez vos informations médicales</p>
            </div>
          </AnimatedHeader>
        </AnimatedLayout>

        {/* Informations patient */}
        <div className="grid gap-8 md:grid-cols-2 mb-8 mt-8">
          <div className="overflow-hidden rounded-xl bg-gray-200 backdrop-blur-sm transition-all hover:shadow-lg dark:bg-card/40">
            <div className="border-b border-border/40 bg-gray-600 p-6 dark:bg-muted">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-background dark:text-foreground">
                <User className="h-5 w-5" />
                Informations personnelles
              </h2>
            </div>
            <div className="p-6">
              <dl className="space-y-6">
                <div className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</dt>
                  <dd className="text-base font-medium">{session.user.email}</dd>
                </div>

                <div className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Téléphone</dt>
                  <dd className="text-base font-medium">
                    {patient.user.phone ? (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {patient.user.phone}
                      </div>
                    ) : (
                      <Badge variant="outline">Non renseigné</Badge>
                    )}
                  </dd>
                </div>

                <div className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Adresse</dt>
                  <dd className="text-base font-medium">
                    {patient.user.address ? (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {patient.user.address}
                      </div>
                    ) : (
                      <Badge variant="outline">Non renseigné</Badge>
                    )}
                  </dd>
                </div>

                <div className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Genre</dt>
                  <dd className="text-base font-medium">{patient.user.gender === "MALE" ? "Homme" : "Femme"}</dd>
                </div>

                <div className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Date de naissance</dt>
                  <dd className="flex items-center gap-2 text-base font-medium">
                    {patient.user.birthDate ? (
                      <>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(patient.user.birthDate), "PPP", { locale: fr })}
                      </>
                    ) : (
                      <Badge variant="outline">Non renseigné</Badge>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Informations médicales */}
          <div className="overflow-hidden rounded-xl bg-gray-200 backdrop-blur-sm transition-all hover:shadow-lg dark:bg-card/40">
            <div className="border-b border-border/40 bg-gray-600 p-6 dark:bg-muted">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-background dark:text-foreground">
                <Heart className="h-5 w-5" />
                Informations médicales
              </h2>
            </div>
            <div className="p-6">
              <dl className="space-y-6">
                <div className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Numéro de sécurité sociale</dt>
                  <dd className="text-base font-medium">
                    {patient.socialSecurityNumber || <Badge variant="outline">Non renseigné</Badge>}
                  </dd>
                </div>

                <div className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Groupe sanguin</dt>
                  <dd className="text-base font-medium">
                    {patient.bloodGroup ? (
                      <div className="flex items-center gap-2">
                        <DropletIcon className="h-4 w-4 text-red-500" />
                        {patient.bloodGroup}
                      </div>
                    ) : (
                      <Badge variant="outline">Non renseigné</Badge>
                    )}
                  </dd>
                </div>

                <div className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Allergies</dt>
                  <dd className="text-base font-medium">
                    {patient.allergies ? (
                      <div className="flex items-start gap-2">
                        <List className="h-4 w-4 mt-1" />
                        <div>{patient.allergies}</div>
                      </div>
                    ) : (
                      <Badge variant="outline">Aucune allergie connue</Badge>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}