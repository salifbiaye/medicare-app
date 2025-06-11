import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { PatientRepository } from "@/repository/patient.repository"
import { getPatientAppointmentsAction } from "@/actions/appointment.action"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/features/patient/calendar/page"
import { AnimatedHeader, AnimatedLayout } from "@/components/animations/animated-layout"
import { ParticlesBackground } from "@/components/animations/particles-background"

export default async function CalendarPage() {
  const headersValue = await headers()
  const session = await auth.api.getSession({ headers: headersValue })

  if (!session?.user) {
    notFound()
  }

  const patient = await PatientRepository.getPatientByUserId(session.user.id)

  if (!patient) {
    notFound()
  }

  const result = await getPatientAppointmentsAction(patient.id)
  
  if (!result.success || !result.data) {
    return <div className="text-red-500">Échec du chargement des rendez-vous</div>
  }

  return (
    <div className="py-6 px-4">
      <AnimatedLayout>
        <ParticlesBackground />
        <AnimatedHeader>
          <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-full mr-4">
            <CalendarIcon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl text-background dark:text-foreground font-bold tracking-tight">Mon Calendrier</h1>
            <p className="text-background/80 dark:text-foreground/50">Consultez et gérez vos rendez-vous médicaux</p>
          </div>
        </AnimatedHeader>
      </AnimatedLayout>

      <div className="mt-8">
        <Calendar appointments={result.data} />
      </div>
    </div>
  )
}