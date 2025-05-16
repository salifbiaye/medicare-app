import { notFound } from "next/navigation"
import { ServiceRepository } from "@/repository/service.repository"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, FileText, Stethoscope, Building2, ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AnimatedLayout } from "@/components/animations/animated-layout"
import { ParticlesBackground } from "@/components/animations/particles-background"

// Type mapping for ServiceType to French labels
const serviceTypeLabels: Record<string, string> = {
  GENERAL_PRACTICE: "Médecine générale",
  OPHTHALMOLOGY: "Ophtalmologie",
  CARDIOLOGY: "Cardiologie",
  PEDIATRICS: "Pédiatrie",
  DERMATOLOGY: "Dermatologie",
  NEUROLOGY: "Neurologie",
  ORTHOPEDICS: "Orthopédie",
  GYNECOLOGY: "Gynécologie",
  RADIOLOGY: "Radiologie",
  PSYCHIATRY: "Psychiatrie",
  UROLOGY: "Urologie",
  ENT: "ORL",
}

interface ServicePageProps {
  params: {
    id: string
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const param = await params
  const service = await ServiceRepository.getServiceById(param.id)

  if (!service) {
    notFound()
  }

  // Fetch the hospital name
  const hospital = await ServiceRepository.getHospitalById(service.hospitalId)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-12 pt-6 dark:from-background dark:to-background/95">
      <div className="px-4">
        <AnimatedLayout>
          <ParticlesBackground />
          <div className="text-background dark:text-foreground">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
                <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-xl">
                  <Stethoscope className="h-12 w-12 text-primary" />
                </div>
                <div className="mt-4 sm:mt-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">{service.name || "Service sans nom"}</h1>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 dark:text-muted-foreground">
                    <Badge variant="secondary">{serviceTypeLabels[service.type] || service.type}</Badge>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline" className="rounded-md bg-accent dark:bg-primary/5 px-2.5 py-1 font-medium text-primary">
                      ID: {param.id}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-col items-end gap-2 sm:mt-0">
                <div className="flex items-center gap-1.5 text-sm dark:text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Créé le {format(new Date(service.createdAt), "d MMMM yyyy", { locale: fr })}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm dark:text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Mis à jour le {format(new Date(service.updatedAt), "d MMMM yyyy", { locale: fr })}</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedLayout>

        <div className="mb-4">
          <Link href="/director/services" passHref>
            <Button variant="ghost" className="gap-2">
              <ArrowLeftIcon className="h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
        </div>

        {/* Contenu principal */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Informations du service */}
          <div className="overflow-hidden rounded-xl bg-gray-200 backdrop-blur-sm transition-all hover:shadow-lg dark:bg-card/40">
            <div className="border-b border-border/40 bg-gray-600 p-6 dark:bg-muted">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-background dark:text-foreground">
                <Stethoscope className="h-5 w-5" />
                Informations du service
              </h2>
            </div>
            <div className="p-6">
              <dl className="space-y-6">
                <div className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</dt>
                  <dd className="text-base font-medium">{serviceTypeLabels[service.type] || service.type}</dd>
                </div>

                <div className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Nom</dt>
                  <dd className="text-base font-medium">
                    {service.name ? (
                      service.name
                    ) : (
                      <Badge variant="outline">Non renseigné</Badge>
                    )}
                  </dd>
                </div>

                <div className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Description</dt>
                  <dd className="text-base font-medium whitespace-pre-wrap">
                    {service.description ? (
                      service.description
                    ) : (
                      <Badge variant="outline">Non renseigné</Badge>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Informations sur l'hôpital */}
          <div className="overflow-hidden rounded-xl bg-gray-200 backdrop-blur-sm transition-all hover:shadow-lg dark:bg-card/40">
            <div className="border-b border-border/40 bg-gray-600 p-6 dark:bg-muted">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-background dark:text-foreground">
                <Building2 className="h-5 w-5" />
                Hôpital
              </h2>
            </div>
            <div className="p-6">
              <dl className="space-y-6">
                <div className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Nom de l'hôpital</dt>
                  <dd className="flex items-center gap-2 text-base font-medium">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {hospital?.name || "Hôpital inconnu"}
                  </dd>
                </div>

                <div className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">ID de l'hôpital</dt>
                  <dd className="text-base font-medium">
                    {service.hospitalId}
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