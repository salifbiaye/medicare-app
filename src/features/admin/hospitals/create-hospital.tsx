"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { DataForm } from "@/components/data-form"
import { toastAlert } from "@/components/ui/sonner-v2"
import { CreateHospitalFormValues, createHospitalSchema } from "@/schemas/hospital.schema"
import { createHospitalfields, createHospitalgroups } from "@/fields/hospital.field"
import { Building2 } from "lucide-react"
import { createHospitalAction } from "@/actions/hospital.action"

export default function CreateHospitalPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleCreateHospital = async (values: CreateHospitalFormValues) => {
    setIsLoading(true)
    try {
      await createHospitalAction(values)

      toastAlert.success({
        title: "Hôpital créé avec succès",
        description: "L'hôpital a été ajouté à la plateforme.",
      })
      router.push("/admin/hospitals")
    } catch (error) {
      toastAlert.error({
        title: "Erreur lors de la création de l'hôpital",
        description: "Une erreur s'est produite lors de la création de l'hôpital. Veuillez réessayer.",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-4 py-8">
      <DataForm
        schema={createHospitalSchema}
        fields={createHospitalfields}
        submitButtonText="Créer l'hôpital"
        isLoading={isLoading}
        onSubmit={handleCreateHospital}
        backLink={{
          text: "Retour à la liste des hôpitaux",
          href: "/admin/hospitals",
        }}
        title="Créer un nouvel hôpital"
        description="Complétez le formulaire pour ajouter un hôpital à la plateforme."
        layout="steps"
        theme="modern"
        iconHeader={<Building2 className="h-8 w-8 text-primary" />}
        groups={createHospitalgroups}
        showProgressBar={true}
        rounded="md"
        animation="fade"
      />
    </div>
  )
} 