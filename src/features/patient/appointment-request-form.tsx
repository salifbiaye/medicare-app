"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { DataForm } from "@/components/data-form"
import { appointmentRequestSchema, AppointmentRequestFormValues } from "@/schemas/appointment-request.schema"
import { appointmentRequestFields } from "@/fields/appointment-request.field"
import { appointmentRequestGroups } from "@/groups/appointment-request.groups"
import { createAppointmentRequestAction } from "@/actions/appointment-request.action"
import { toastAlert } from "@/components/ui/sonner-v2"
import { MessageSquare } from "lucide-react"

interface AppointmentRequestFormProps {
  hospitalId: string
  hospitalName: string
  patientId?: string
}

export function AppointmentRequestForm({ hospitalId, hospitalName, patientId }: AppointmentRequestFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (values: AppointmentRequestFormValues) => {
    setIsLoading(true)
    try {
      // Assurez-vous que hospitalId est défini dans les valeurs
      const formData = {
        ...values,
        hospitalId,
        patientId: patientId || null,
      }

      const result = await createAppointmentRequestAction(formData)

      if (result.error) {
        toastAlert.error({
          title: "Erreur",
          description: result.error,
          duration: 3000,
        })
        return
      }

      toastAlert.success({
        title: "Demande envoyée",
        description: "Votre demande de rendez-vous a été envoyée avec succès",
        duration: 3000,
      })

      // Redirection vers la page des demandes
      router.push("/patient/requests")
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande:", error)
      toastAlert.error({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <DataForm
        schema={appointmentRequestSchema}
        // @ts-ignore - Les types ne correspondent pas parfaitement mais le composant fonctionne correctement
        fields={appointmentRequestFields}
        submitButtonText="Envoyer ma demande"
        isLoading={isLoading}
        onSubmit={handleSubmit}
        initialData={{ hospitalId }}
        title={`Demande de rendez-vous - ${hospitalName}`}
        description="Veuillez remplir ce formulaire pour demander un rendez-vous médical. Notre équipe traitera votre demande dans les plus brefs délais."
        layout="standard"
        theme="glassmorphism"
        groups={appointmentRequestGroups}
        iconHeader={<MessageSquare className="h-6 w-6 text-primary" />}
        rounded="lg"
        elevation="md"
        animation="fade"
      />
    </div>
  )
} 