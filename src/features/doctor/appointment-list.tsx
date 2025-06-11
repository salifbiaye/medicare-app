'use client'

import { getDoctorAppointmentsAction } from "@/actions/appointment.action"
import { deleteAppointmentAction } from "@/actions/appointment.action"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toastAlert } from "@/components/ui/sonner-v2"
import { useEffect, useState } from "react"

interface AppointmentListProps {
  appointments: any[]
  onAppointmentDelete?: (id: string) => void
}

const getStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case 'scheduled':
      return 'Planifié'
    case 'completed':
      return 'Terminé'
    case 'cancelled':
      return 'Annulé'
    case 'pending':
      return 'En attente'
    default:
      return status
  }
}

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
  }
}

export default function AppointmentList({ appointments, onAppointmentDelete }: AppointmentListProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      const result = await deleteAppointmentAction(id)
      if (result.success) {
        toastAlert.success({
          title: "Suppression réussie",
          description: "Le rendez-vous a été supprimé avec succès"
        })
        onAppointmentDelete?.(id)
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      toastAlert.error({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="bg-card rounded-lg shadow-sm p-4 hover:shadow-md transition-all duration-200 dark:bg-card/90"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">
              {appointment.patient?.user?.name || "-"}
            </h3>
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusStyle(appointment.status)}`}>
              {getStatusLabel(appointment.status)}
            </span>
          </div>
          <div className="text-muted-foreground mb-4">
            {format(new Date(appointment.date), "dd MMMM yyyy HH:mm", { locale: fr })}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Link
                href={`/doctor/appointment/${appointment.id}/edit`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors dark:border-input/50 dark:bg-background/50 dark:hover:bg-accent/50"
              >
                Modifier
              </Link>
              <Button
                variant="destructive"
                size="sm"
                className="inline-flex items-center gap-2"
                onClick={() => handleDelete(appointment.id)}
                disabled={loading}
              >
                {loading ? "Suppression..." : "Supprimer"}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
