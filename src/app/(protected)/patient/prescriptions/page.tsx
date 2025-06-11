import { notFound } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { List, Calendar, User, Clock, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnimatedHeader, AnimatedLayout } from "@/components/animations/animated-layout"
import { ParticlesBackground } from "@/components/animations/particles-background"
import { PatientRepository } from "@/repository/patient.repository"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { PrescriptionStatus } from "@prisma/client"
import Link from "next/link"

export default async function PrescriptionsPage() {
  const headersValue = await headers()
  const session = await auth.api.getSession({ headers: headersValue })

  if (!session?.user) {
    notFound()
  }

  const patient = await PatientRepository.getPatientByUserId(session.user.id)

  if (!patient) {
    notFound()
  }

  const prescriptions = await PatientRepository.getPatientPrescriptions(patient.id)

  const getStatusBadgeVariant = (status: PrescriptionStatus) => {
    switch (status) {
      case "ACTIVE":
        return "success"
      case "COMPLETED":
        return "secondary"
      case "CANCELLED":
        return "destructive"
      default:
        return "default"
    }
  }

  const getStatusLabel = (status: PrescriptionStatus) => {
    switch (status) {
      case "ACTIVE":
        return "En cours"
      case "COMPLETED":
        return "Terminée"
      case "CANCELLED":
        return "Annulée"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-12 pt-6 dark:from-background dark:to-background/95">
      <div className="px-4">
        <AnimatedLayout>
          <ParticlesBackground />
          <AnimatedHeader>
            <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-full mr-4">
              <List className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl text-background dark:text-foreground font-bold tracking-tight">Mes Prescriptions</h1>
              <p className="text-background/80 dark:text-foreground/50">Historique de vos prescriptions médicales</p>
            </div>
          </AnimatedHeader>
        </AnimatedLayout>

        {/* Liste des prescriptions */}
        <div className="mt-8">
          {prescriptions.length === 0 ? (
            <div className="text-center py-8">
              <List className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-2 text-lg font-semibold">Aucune prescription</h3>
              <p className="text-sm text-muted-foreground">
                Vous n'avez pas encore de prescriptions.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="overflow-hidden rounded-xl bg-card backdrop-blur-sm transition-all hover:bg-accent/5"
                >
                  <div className="border-b border-border/40 bg-muted p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <Badge variant={getStatusBadgeVariant(prescription.status)}>
                          {getStatusLabel(prescription.status)}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>Dr. {prescription.doctor.user.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Créée le {format(new Date(prescription.createdAt), "PPP", { locale: fr })}</span>
                          </div>
                          {prescription.endDate && (
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-4 w-4" />
                              <span>Jusqu'au {format(new Date(prescription.endDate), "PPP", { locale: fr })}</span>
                            </div>
                          )}
                        </div>
                        <Link href={`/patient/prescriptions/${prescription.id}`} passHref>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap line-clamp-4">{prescription.content}</div>
                    </div>
                    {prescription.medicalReportId && (
                      <div className="mt-4 rounded-lg bg-muted/50 p-4">
                        <h4 className="text-sm font-medium">Rapport médical associé</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Cette prescription est liée à un rapport médical
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}