import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { DoctorRepository } from "@/repository/doctor.repository"
import { ScanLine } from "lucide-react"
import { AnimatedHeader, AnimatedLayout } from "@/components/animations/animated-layout"
import { ParticlesBackground } from "@/components/animations/particles-background"
import { SharedDicomList } from "@/features/doctor/dicom-viewer/shared-dicom-list"

export default async function SharedDicomPage() {
  const headersValue = await headers()
  const session = await auth.api.getSession({ headers: headersValue })

  if (!session?.user) {
    notFound()
  }

  const doctor = await DoctorRepository.findDoctorByUserId(session.user.id)
  if (!doctor) {
    notFound()
  }

  // Récupérer les DICOM partagés avec ce médecin
  const sharedDicoms = await DoctorRepository.getSharedDicoms(doctor.id)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-12 pt-6 dark:from-background dark:to-background/95">
      <div className="px-4">
        <AnimatedLayout>
          <ParticlesBackground />
          <AnimatedHeader>
            <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-full mr-4">
              <ScanLine className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl text-background dark:text-foreground font-bold tracking-tight">DICOM Partagés</h1>
              <p className="text-background/80 dark:text-foreground/50">Images DICOM partagées par d'autres médecins</p>
            </div>
          </AnimatedHeader>
        </AnimatedLayout>

        <div className="mt-8">
          <SharedDicomList sharedDicoms={sharedDicoms} />
        </div>
      </div>
    </div>
  )
} 