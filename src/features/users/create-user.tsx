"use client"

import React from "react"

import { useRouter } from "next/navigation"
import {DataForm} from "@/components/data-form";
import {toastAlert} from "@/components/ui/sonner-v2";
import {CreateUserFormValues, createUserSchema} from "@/schemas/user.schema";
import {createUserfields, createUsergroups} from "@/fields/user.field";
import {User2} from "lucide-react";
import {createUser} from "@/actions/user.action";
export default function CreateUserPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleCreateUser = async (values:CreateUserFormValues) => {
    setIsLoading(true)
    try {
      console.log("Création de l'utilisateur avec les valeurs :", values)
        await createUser(values)


      toastAlert.success({
        title: "Utilisateur créé avec succès",
        description: "L'utilisateur a été ajouté à la plateforme.",

      })
        router.push("/admin/users")
    } catch (error) {
      toastAlert.error({
        title: "Erreur lors de la création de l'utilisateur",
        description: "Une erreur s'est produite lors de la création de l'utilisateur. Veuillez réessayer.",

      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }



  return (
      <div className="px-4 py-8">
        <DataForm
            schema={createUserSchema}
            fields={createUserfields}
            submitButtonText="Créer l'utilisateur"
            isLoading={isLoading}
            onSubmit={handleCreateUser}
            backLink={{
              text: "Retour à la liste des utilisateurs",
              href: "/admin/users",
            }}
            title="Créer un nouvel utilisateur"
            description="Complétez le formulaire pour ajouter un utilisateur à la plateforme."
            layout="steps"
            theme="modern"
            iconHeader={ <User2 className="h-8 w-8 text-primary" />}
            groups={createUsergroups}
            showProgressBar={true}
            rounded="md"
            animation="fade"
        />
      </div>
  )
}