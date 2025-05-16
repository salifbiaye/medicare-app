"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { DataForm } from "@/components/data-form"
import { toastAlert } from "@/components/ui/sonner-v2"
import { CreateMedicalRecordFormValues, createMedicalRecordSchema } from "@/schemas/medical-record.schema"
import { createMedicalRecordFields } from "@/fields/medical-record.field"
import { FileText, User } from "lucide-react"
import { createMedicalRecordAction } from "@/actions/patient.action"
import { createMedicalRecordGroups } from "@/groups/medical-record.groups"
import { PatientWithUser } from "./columns"

interface CreateMedicalRecordPageProps {
  patient: PatientWithUser
}

export default function CreateMedicalRecordPage({ patient }: CreateMedicalRecordPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleCreateMedicalRecord = async (values: CreateMedicalRecordFormValues) => {
    setIsLoading(true)
    try {
      // Add patientId to the form values
      const data = {
        ...values,
        patientId: patient.id
      }
      
      const result = await createMedicalRecordAction(data)

      if (!result.success) {
        throw new Error(result.error || "Une erreur est survenue lors de la création du dossier médical")
      }

      toastAlert.success({
        title: "Dossier médical créé avec succès",
        description: "Le dossier médical a été ajouté pour ce patient.",
      })
      
      // Redirect to the patient's page
      router.push(`/doctor/patients/${patient.id}`)
    } catch (error) {
      toastAlert.error({
        title: "Erreur lors de la création du dossier médical",
        description: error instanceof Error 
          ? error.message
          : "Une erreur s'est produite lors de la création du dossier médical. Veuillez réessayer.",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-4 py-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-xl">
          <User className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-background dark:text-foreground">
            {patient.user.name}
          </h2>
          <p className="text-background/80 dark:text-foreground/50">{patient.user.email}</p>
          {patient.socialSecurityNumber && (
            <p className="text-sm text-background/60 dark:text-foreground/40">
              N° SS: {patient.socialSecurityNumber}
            </p>
          )}
        </div>
      </div>
      
      <DataForm
        schema={createMedicalRecordSchema}
        fields={createMedicalRecordFields}
        submitButtonText="Créer le dossier médical"
        isLoading={isLoading}
        onSubmit={handleCreateMedicalRecord}
        backLink={{
          text: "Retour à la liste des patients",
          href: "/doctor/patients",
        }}
        title="Créer un nouveau dossier médical"
        description="Complétez le formulaire pour créer un dossier médical pour ce patient."
        layout="standard"
        theme="modern"
        iconHeader={<FileText className="h-8 w-8 text-primary" />}
        groups={createMedicalRecordGroups}
        showProgressBar={false}
        rounded="md"
        animation="fade"
      />
    </div>
  )
} 