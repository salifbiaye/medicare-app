"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { DataForm } from "@/components/data-form"
import { toastAlert } from "@/components/ui/sonner-v2"
import { appointmentSchema } from "@/schemas/appointment.schema"
import {Calendar, Clock} from "lucide-react"
import { createAppointmentAction } from "@/actions/appointment.action"
import { format } from "date-fns"
import { appointmentGroups } from "@/groups/appointment.groups"

interface Patient {
  id: string
  user: {
    name: string
  }
}

type AppointmentStatus = "SCHEDULED"  | "CANCELLED" | "COMPLETED"
type SchemaStatus = "scheduled"  | "cancelled" | "completed"

const mapStatus = (status: AppointmentStatus): SchemaStatus => {
  return status.toLowerCase() as SchemaStatus
}

interface AppointmentEditProps {
  id: string
  appointment: {
    patientId: string
    date: Date | string
    status: AppointmentStatus
    notes?: string
  }
  patients: Patient[]
}

export default function AppointmentEdit({ id, appointment, patients }: AppointmentEditProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleEditAppointment = async (values: any) => {
    setIsLoading(true)
    try {
      const result = await createAppointmentAction({
        ...values,
        id: id
      })
      
      if (result.success) {
        toastAlert.success({
          title: "Rendez-vous modifié avec succès",
          description: "Les modifications ont été enregistrées.",
        })
        router.push("/doctor/appointment")
      }
    } catch (error) {
      toastAlert.error({
        title: "Erreur lors de la modification du rendez-vous",
        description: "Une erreur s'est produite. Veuillez réessayer.",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Ensure date is properly formatted
  const appointmentDate = appointment.date instanceof Date 
    ? appointment.date 
    : typeof appointment.date === 'string' 
      ? new Date(appointment.date)
      : new Date()

  const data = {
    patientId: appointment.patientId,
    date: format(appointmentDate, "yyyy-MM-dd'T'HH:mm"),
    status: mapStatus(appointment.status),
    notes: appointment.notes || "",
  }

  const fields = [
    {
      type: "select" as const,
      name: "patientId" as const,
      label: "Patient",
      disabled: true,
      options: patients.map(patient => ({
        value: patient.id,
        label: patient.user.name
      }))
    }, {
      type: "date-time" as const,
      name: "date" as const,
      label: "Date et heure du rendez-vous",
      placeholder: "Sélectionnez la date et l'heure",
      helpText: "Choisissez une date et une heure (par tranches de 15 minutes)",
      icon: <Clock className="h-4 w-4" />,
      min: Date.now(),
      defaultValue: new Date().toISOString()
    },
    {
      type: "select" as const,
      name: "status" as const,
      label: "Statut",
      options: [
        { value: "SCHEDULED", label: "En attente" },
        { value: "CANCELLED", label: "Annulé" },
        { value: "COMPLETED", label: "Terminé" }
      ]
    },
    {
      type: "textarea" as const,
      name: "notes" as const,
      label: "Notes",
      placeholder: "Ajoutez des notes pour ce rendez-vous"
    }
  ]

  return (
    <div className="px-4 py-8">
      <DataForm
        schema={appointmentSchema}
        fields={fields}
        groups={appointmentGroups}
        initialData={data}
        submitButtonText="Enregistrer les modifications"
        isLoading={isLoading}
        onSubmit={handleEditAppointment}
        backLink={{
          text: "Retour à la liste des rendez-vous",
          href: "/doctor/appointment",
        }}
        title="Modifier le rendez-vous"
        description="Modifiez les informations du rendez-vous."
        layout="standard"
        theme="modern"
        iconHeader={<Calendar className="h-8 w-8 text-primary" />}
        showProgressBar={true}
        rounded="md"
        animation="fade"
      />
    </div>
  )
}
