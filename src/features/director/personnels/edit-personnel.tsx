"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { DataForm } from "@/components/data-form"
import { toastAlert } from "@/components/ui/sonner-v2"
import {
    getSchemaByRole,
    CreatePatientFormValues,
    CreateDoctorFormValues,
    CreateSecretaryFormValues,
    CreateDirectorFormValues,
    CreateAdminFormValues,
    CreateUserFormValues
} from "@/schemas/user.schema"
import { getFieldsByRole } from "@/fields/user.field"
import { getGroupsByRole } from "@/groups/user.groups"
import { User2 } from "lucide-react"
import { updateUserAction } from "@/actions/user.action"
import { updatePatientAction } from "@/actions/patient.action"
import { updateDoctorAction } from "@/actions/doctor.action"
import { updateSecretaryAction } from "@/actions/secretary.action"
import { updateDirectorAction } from "@/actions/director.action"
import { User } from "@prisma/client"

export default function EditPersonnelPage({user}:{user: User}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)

    // Sélectionner le schéma, les champs et les groupes en fonction du rôle de l'utilisateur
    const userSchema = getSchemaByRole(user.role)
    const userFields = getFieldsByRole(user.role)
    const userGroups = getGroupsByRole(user.role)

    // Préparer les données initiales de l'utilisateur
    const data = {
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role,
        profileCompleted: user.profileCompleted,
        emailVerified: user.emailVerified,
        // Note: les champs spécifiques au rôle seraient idéalement inclus ici,
        // mais comme ils ne sont pas disponibles dans l'objet User standard,
        // ils seront vides dans le formulaire
    }

    const handleEditUser = async (values:
                                      | CreatePatientFormValues
                                      | CreateDoctorFormValues
                                      | CreateSecretaryFormValues
                                      | CreateDirectorFormValues
                                      | CreateAdminFormValues
                                      | CreateUserFormValues
    ) => {
        setIsLoading(true)
        try {
            // Mise à jour de l'utilisateur en fonction de son rôle
            switch (user.role) {
                case "PATIENT":
                    await updatePatientAction(user.id, values as CreatePatientFormValues)
                    break
                case "DOCTOR":
                case "CHIEF_DOCTOR":
                    await updateDoctorAction(user.id, values as CreateDoctorFormValues)
                    break
                case "SECRETARY":
                    await updateSecretaryAction(user.id, values as CreateSecretaryFormValues)
                    break
                case "DIRECTOR":
                    await updateDirectorAction(user.id, values as CreateDirectorFormValues)
                    break
                case "ADMIN":
                    await updateUserAction(user.id, values as CreateUserFormValues)
                default:
                    await updateUserAction(user.id, values as CreateUserFormValues)
            }

            toastAlert.success({
                title: "Utilisateur modifié avec succès",
                description: "L'utilisateur a été modifié avec succès.",
            })
            router.push("/director/staff")
        } catch (error) {
            toastAlert.error({
                title: "Erreur lors de la modification de l'utilisateur",
                description: "Une erreur s'est produite lors de la modification de l'utilisateur. Veuillez réessayer.",
            })
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="px-4 py-8">
            <DataForm
                schema={userSchema}
                fields={userFields as any}
                initialData={data}
                submitButtonText="Enregistrer les modifications"
                isLoading={isLoading}
                onSubmit={handleEditUser}
                backLink={{
                    text: "Retour à la liste des utilisateurs",
                    href: "/admin/users",
                }}
                title={`Modifier l'utilisateur (${user.role})`}
                description="Complétez le formulaire pour modifier les informations de l'utilisateur."
                layout="steps"
                theme="modern"
                iconHeader={<User2 className="h-8 w-8 text-primary" />}
                groups={userGroups}
                showProgressBar={true}
                rounded="md"
                animation="fade"
            />
        </div>
    )
}