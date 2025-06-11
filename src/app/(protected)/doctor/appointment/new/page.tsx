import AppointmentNew from "@/features/doctor/appointment-new"
import { getPatientsAction } from "@/actions/appointment.action"
import { CalendarPlus } from "lucide-react"
import { AnimatedHeader, AnimatedLayout } from "@/components/animations/animated-layout"
import { ParticlesBackground } from "@/components/animations/particles-background"

export default async function NewAppointmentPage() {
  const patientsResult = await getPatientsAction()

  if (!patientsResult.success || !patientsResult.data) {
    throw new Error("Failed to load patients data")
  }

  const patients = patientsResult.data.map(patient => ({
    id: patient.id,
    user: {
      name: patient.user.name
    }
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-12 pt-6 dark:from-background dark:to-background/95">
      <div className="px-4">
        <AnimatedLayout>
          <ParticlesBackground />
          <AnimatedHeader>
            <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-full mr-4">
              <CalendarPlus className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl text-background dark:text-foreground font-bold tracking-tight">Nouveau Rendez-vous</h1>
              <p className="text-background/80 dark:text-foreground/50">Planifiez une nouvelle consultation</p>
            </div>
          </AnimatedHeader>
        </AnimatedLayout>

        <div className="mt-8">
          <div className="container mx-auto">
            <AppointmentNew patients={patients} />
          </div>
        </div>
      </div>
    </div>
  )
}
