"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { DataForm } from "@/components/data-form"
import { toastAlert } from "@/components/ui/sonner-v2"
import { CreateServiceFormValues, createServiceSchema } from "@/schemas/service.schema"
import { createServiceFields } from "@/fields/service.field"
import { Stethoscope } from "lucide-react"
import { updateServiceAction } from "@/actions/service.action"
import { createServiceGroups } from "@/groups/service.groups"
import { Service } from "@prisma/client"

export default function EditServicePage({ service, hospitalName, directorHospitalId }: { 
  service: Service, 
  hospitalName: string,
  directorHospitalId?: string 
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [fields, setFields] = React.useState<any[]>([])

  const data = {
    type: service.type,
    name: service.name || "",
    description: service.description || "",
    hospitalId: service.hospitalId,
  }

  // Charger et modifier les champs
  React.useEffect(() => {
    const loadFields = async () => {
      // Obtenir les champs de base
      const baseFields = [...createServiceFields];
      
      // Modifier les champs pour le champ hospitalId
      const modifiedFields = baseFields.map(field => {
        if (field.name === "hospitalId") {
          // Cas où l'utilisateur est directeur - on fixe l'hôpital
          if (directorHospitalId && directorHospitalId === service.hospitalId) {
            return {
              ...field,
              defaultValue: service.hospitalId,
              disabled: true,

            };
          }
          // Cas standard - on pré-sélectionne mais on permet de changer
          return {
            ...field,
            defaultValue: service.hospitalId
          };
        }
        return field;
      });
      
      setFields(modifiedFields);
    };
    
    loadFields();
  }, [service, hospitalName, directorHospitalId]);

  const handleEditService = async (values: CreateServiceFormValues) => {
    setIsLoading(true)
    try {
      // S'assurer que l'hôpital est bien celui du directeur si applicable
      if (directorHospitalId && directorHospitalId === service.hospitalId) {
        values.hospitalId = service.hospitalId;
      }

      await updateServiceAction(service.id, values)

      toastAlert.success({
        title: "Service modifié avec succès",
        description: "Le service a été modifié avec succès.",
      })
      router.push("/director/services")
    } catch (error) {
      toastAlert.error({
        title: "Erreur lors de la modification du service",
        description: "Une erreur s'est produite lors de la modification du service. Veuillez réessayer.",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-4 py-8">
      {fields.length > 0 && (
        <DataForm
          schema={createServiceSchema}
          fields={fields}
          initialData={data}
          submitButtonText="Enregistrer les modifications"
          isLoading={isLoading}
          onSubmit={handleEditService}
          backLink={{
            text: "Retour à la liste des services",
            href: "/director/services",
          }}
          title="Modifier le service"
          description="Complétez le formulaire pour modifier les informations du service."
          layout="standard"
          theme="modern"
          iconHeader={<Stethoscope className="h-8 w-8 text-primary" />}
          groups={createServiceGroups}
          showProgressBar={true}
          rounded="md"
          animation="fade"
        />
      )}
    </div>
  )
} 