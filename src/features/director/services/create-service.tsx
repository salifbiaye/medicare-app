"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { DataForm } from "@/components/data-form"
import { toastAlert } from "@/components/ui/sonner-v2"
import { CreateServiceFormValues, createServiceSchema } from "@/schemas/service.schema"
import { createServiceFields } from "@/fields/service.field"
import { Stethoscope } from "lucide-react"
import { createServiceAction } from "@/actions/service.action"
import { createServiceGroups } from "@/groups/service.groups"

export default function CreateServicePage({ hospitalId }: { hospitalId?: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [fields, setFields] = React.useState<any[]>([])

  // Charger et modifier les champs
  React.useEffect(() => {
    const loadFields = async () => {
      // Obtenir les champs de base
      const baseFields = [...createServiceFields];
      
      if (hospitalId) {
        // Modifier les champs pour pré-remplir l'hôpital du directeur
        const modifiedFields = baseFields.map(field => {
          if (field.name === "hospitalId") {
            return {
              ...field,
              defaultValue: hospitalId,
              disabled: true,


            };
          }
          return field;
        });
        
        setFields(modifiedFields);
      } else {
        setFields(baseFields);
      }
    };
    
    loadFields();
  }, [hospitalId]);

  const handleCreateService = async (values: CreateServiceFormValues) => {
    setIsLoading(true)
    try {
      // S'assurer que l'hôpital est bien celui du directeur si un hospitalId est fourni
      if (hospitalId) {
        values.hospitalId = hospitalId;
      }

      await createServiceAction(values)

      toastAlert.success({
        title: "Service créé avec succès",
        description: "Le service a été ajouté à la plateforme.",
      })
      router.push("/director/services")
    } catch (error) {
      toastAlert.error({
        title: "Erreur lors de la création du service",
        description: "Une erreur s'est produite lors de la création du service. Veuillez réessayer.",
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
          submitButtonText="Créer le service"
          isLoading={isLoading}
          onSubmit={handleCreateService}
          backLink={{
            text: "Retour à la liste des services",
            href: "/director/services",
          }}
          title="Créer un nouveau service"
          description="Complétez le formulaire pour ajouter un service à la plateforme."
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