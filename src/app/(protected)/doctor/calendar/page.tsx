import { getDoctorAppointmentsAction } from "@/actions/appointment.action"
import { Calendar } from "@/features/doctor/calendar/page"
import { Calendar as CalendarIcon } from "lucide-react"
import { AnimatedHeader, AnimatedLayout } from "@/components/animations/animated-layout"
import { ParticlesBackground } from "@/components/animations/particles-background"

export default async function CalendarPage() {
  const result = await getDoctorAppointmentsAction()
  
  if (!result.success || !result.data) {
    return <div className="text-red-500">Échec du chargement des rendez-vous</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-12 pt-6 dark:from-background dark:to-background/95">
      <div className="px-4">
        <AnimatedLayout>
          <ParticlesBackground />
          <AnimatedHeader>
            <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-full mr-4">
              <CalendarIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl text-background dark:text-foreground font-bold tracking-tight">Mon Calendrier</h1>
              <p className="text-background/80 dark:text-foreground/50">Gérez vos rendez-vous et votre emploi du temps</p>
            </div>
          </AnimatedHeader>
        </AnimatedLayout>

        <div className="mt-8">
          <Calendar appointments={result.data} />
        </div>
      </div>
    </div>
  )
}



