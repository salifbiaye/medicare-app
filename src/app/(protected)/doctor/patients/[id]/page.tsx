import { notFound, redirect } from "next/navigation"
import { PatientRepository } from "@/repository/patient.repository"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon, MailIcon, User, MapPin, Phone, ArrowLeftIcon, 
  FilePlus2, FileText, Heart, DropletIcon, List, Plus
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AnimatedLayout } from "@/components/animations/animated-layout"
import { ParticlesBackground } from "@/components/animations/particles-background"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MedicalReportsList } from "@/features/doctor/patients/medical-reports-list"
import { PrescriptionsList } from "@/features/doctor/patients/prescriptions-list"
import { DicomsList } from "@/features/doctor/patients/dicoms-list"

interface PatientPageProps {
  params: {
    id: string
  }
}

export default async function PatientPage({ params }: PatientPageProps) {
  const param = await params
  const patient = await PatientRepository.getPatientWithUserById(param.id)

  if (!patient) {
    notFound()
  }

  // Check if patient has a medical record
  if (!patient.medicalRecord) {
    redirect(`/doctor/patients/new?patientId=${param.id}`)
  }

  const medicalRecord = await PatientRepository.getMedicalRecordById(patient.medicalRecord.id)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-12 pt-6 dark:from-background dark:to-background/95">
      <div className="px-4">
        <AnimatedLayout>
          <ParticlesBackground />
          <div className="text-background dark:text-foreground">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
                <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-xl">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <div className="mt-4 sm:mt-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">{patient.user.name}</h1>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 dark:text-muted-foreground">
                    <MailIcon className="h-4 w-4" />
                    <span>{patient.user.email}</span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline" className="rounded-md bg-accent dark:bg-primary/5 px-2.5 py-1 font-medium text-primary">
                      ID: {param.id}
                    </Badge>
                    {patient.socialSecurityNumber && (
                      <Badge variant="outline" className="rounded-md bg-accent dark:bg-primary/5 px-2.5 py-1 font-medium text-primary">
                        N° SS: {patient.socialSecurityNumber}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-col items-end gap-2 sm:mt-0">
                {patient.user.birthDate && (
                  <div className="flex items-center gap-1.5 text-sm dark:text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Né(e) le {format(new Date(patient.user.birthDate), "d MMMM yyyy", { locale: fr })}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm dark:text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Dossier médical créé le {format(new Date(medicalRecord?.createdAt || ""), "d MMMM yyyy", { locale: fr })}</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedLayout>

        <div className="mb-4 flex justify-between">
          <Link href="/doctor/patients" passHref>
            <Button variant="ghost" className="gap-2">
              <ArrowLeftIcon className="h-4 w-4" />
              Retour à la liste des patients
            </Button>
          </Link>
          
          <div className="space-x-2">
            <Link href={`/doctor/patients/${param.id}/edit?type=medicalreport`} passHref>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un rapport médical
              </Button>
            </Link>
            <Link href={`/doctor/patients/${param.id}/edit?type=prescription`} passHref>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter une prescription
              </Button>
            </Link>
            <Link href={`/doctor/patients/${param.id}/edit?type=dicomimage`} passHref>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter une image DICOM
              </Button>
            </Link>
          </div>
        </div>

        {/* Informations patient */}
        <div className="grid gap-8 md:grid-cols-2 mb-8">
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
                  <dd className="text-base font-medium">{patient.user.email}</dd>
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

        {/* Contenu du dossier médical avec onglets */}
        <div className="mt-8">
          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="reports">
                <FileText className="h-4 w-4 mr-2" />
                Rapports médicaux
              </TabsTrigger>
              <TabsTrigger value="prescriptions">
                <List className="h-4 w-4 mr-2" />
                Prescriptions
              </TabsTrigger>
              <TabsTrigger value="dicoms">
                <DropletIcon className="h-4 w-4 mr-2" />
                Images DICOM
              </TabsTrigger>
            </TabsList>
            <TabsContent value="reports">
              <div className="rounded-xl bg-gray-200 backdrop-blur-sm p-6 dark:bg-card/40">
                <MedicalReportsList medicalRecordId={medicalRecord?.id || ""} />
              </div>
            </TabsContent>
            <TabsContent value="prescriptions">
              <div className="rounded-xl bg-gray-200 backdrop-blur-sm p-6 dark:bg-card/40">
                <PrescriptionsList medicalRecordId={medicalRecord?.id|| ""} patientId={patient.id} />
              </div>
            </TabsContent>
            <TabsContent value="dicoms">
              <div className="rounded-xl bg-gray-200 backdrop-blur-sm p-6 dark:bg-card/40">
                <DicomsList medicalRecordId={medicalRecord?.id || ""} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 