"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { DataForm } from "@/components/data-form"
import { toastAlert } from "@/components/ui/sonner-v2"
import { CreateHospitalFormValues, createHospitalSchema } from "@/schemas/hospital.schema"
import { createHospitalfields } from "@/fields/hospital.field"
import { Building2 } from "lucide-react"
import { updateHospitalAction } from "@/actions/hospital.action"
import { Hospital } from "@prisma/client"

export default function EditHospitalPage({ hospital }: { hospital: Hospital }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const data = {
    name: hospital.name,
    address: hospital.address,
    phone: hospital.phone,
    email: hospital.email,
  }

  const handleEditHospital = async (values: CreateHospitalFormValues) => {
    setIsLoading(true)
    try {
      await updateHospitalAction(hospital.id, values)

      toastAlert.success({
        title: "Hôpital modifié avec succès",
        description: "L'hôpital a été modifié avec succès.",
      })
      router.push("/admin/hospitals")
    } catch (error) {
      toastAlert.error({
        title: "Erreur lors de la modification de l'hôpital",
        description: "Une erreur s'est produite lors de la modification de l'hôpital. Veuillez réessayer.",
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
        initialData={data}
        submitButtonText="Enregistrer les modifications"
        isLoading={isLoading}
        onSubmit={handleEditHospital}
        backLink={{
          text: "Retour à la liste des hôpitaux",
          href: "/admin/hospitals",
        }}
        title="Modifier l'hôpital"
        description="Complétez le formulaire pour modifier les informations de l'hôpital."
        layout="standard"
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