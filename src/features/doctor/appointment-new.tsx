"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { DataForm } from "@/components/data-form"
import { toastAlert } from "@/components/ui/sonner-v2"
import { appointmentSchema } from "@/schemas/appointment.schema"
import { Calendar, Clock } from "lucide-react"
import { createAppointmentAction } from "@/actions/appointment.action"
import { appointmentGroups } from "@/groups/appointment.groups"

interface Patient {
  id: string
  user: {
    name: string
  }
}

interface AppointmentNewProps {
  patients: Patient[]
}

export default function AppointmentNew({ patients }: AppointmentNewProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleCreateAppointment = async (values: any) => {
    setIsLoading(true)
    try {
      const result = await createAppointmentAction(values)
      
      if (result.success) {
        toastAlert.success({
          title: "Rendez-vous créé avec succès",
          description: "Le rendez-vous a été ajouté à l'agenda.",
        })
        router.push("/doctor/appointment")
      }
    } catch (error) {
      toastAlert.error({
        title: "Erreur lors de la création du rendez-vous",
        description: "Une erreur s'est produite. Veuillez réessayer.",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const fields = [
    {
      type: "select" as const,
      name: "patientId" as const,
      label: "Patient",
      options: patients.map(patient => ({
        value: patient.id,
        label: patient.user.name
      }))
    },
    {
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
        submitButtonText="Créer le rendez-vous"
        isLoading={isLoading}
        onSubmit={handleCreateAppointment}
        backLink={{
          text: "Retour à la liste des rendez-vous",
          href: "/doctor/appointment",
        }}
        title="Créer un nouveau rendez-vous"
        description="Complétez le formulaire pour ajouter un rendez-vous à l'agenda."
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

