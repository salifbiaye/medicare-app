import { getDoctorAppointmentsAction } from "@/actions/appointment.action"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Plus, CalendarDays } from "lucide-react"
import Link from "next/link"
import AppointmentList from "@/features/doctor/appointment-list"
import { AnimatedHeader, AnimatedLayout } from "@/components/animations/animated-layout"
import { ParticlesBackground } from "@/components/animations/particles-background"

interface Appointment {
  id: string
  patient: {
    user: {
      name: string
    }
  }
  date: string
  status: string
}

export default async function AppointmentPage() {
  const result = await getDoctorAppointmentsAction()

  const appointments = result.success && result.data ? result.data : [] as Appointment[]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-12 pt-6 dark:from-background dark:to-background/95">
      <div className="px-4">
        <AnimatedLayout>
          <ParticlesBackground />
          <AnimatedHeader>
            <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-full mr-4">
              <CalendarDays className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl text-background dark:text-foreground font-bold tracking-tight">Mes Rendez-vous</h1>
              <p className="text-background/80 dark:text-foreground/50">Gérez et planifiez vos consultations</p>
            </div>
          </AnimatedHeader>
        </AnimatedLayout>

        <div className="mt-8">
          <div className="container mx-auto">
            <div className="flex justify-end mb-6">
              <Link
                href="/doctor/appointment/new"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors dark:bg-primary/90 dark:text-primary-foreground/90 dark:hover:bg-primary/80"
              >
                <Plus size={16} />
                Nouveau Rendez-vous
              </Link>
            </div>
            <AppointmentList appointments={appointments} />
          </div>
        </div>
      </div>
    </div>
  )
}
