"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { DataForm } from "@/components/data-form"
import { toastAlert } from "@/components/ui/sonner-v2"
import { getSchemaByRole } from "@/schemas/user.schema"
import { getFieldsByRole } from "@/fields/user.field"
import { getGroupsByRole } from "@/groups/user.groups"
import { createUserAction } from "@/actions/user.action"
import { RoleSelector } from "./role-selector"
import { User2, Stethoscope, ClipboardList, Building2 } from "lucide-react"

type Role = "PATIENT" | "DOCTOR" | "CHIEF_DOCTOR" | "SECRETARY" | "DIRECTOR" | "ADMIN"

export default function CreateUserPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [selectedRole, setSelectedRole] = React.useState<Role>("PATIENT")

    const handleCreateUser = async (values: any) => {
        setIsLoading(true)
        try {
            await createUserAction(values)

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

    // Get the appropriate icon based on role
    const getRoleIcon = () => {
        switch (selectedRole) {
            case "PATIENT":
                return <User2 className="h-8 w-8 text-primary" />
            case "DOCTOR":
            case "CHIEF_DOCTOR":
                return <Stethoscope className="h-8 w-8 text-primary" />
            case "SECRETARY":
                return <ClipboardList className="h-8 w-8 text-primary" />
            case "DIRECTOR":
                return <Building2 className="h-8 w-8 text-primary" />
            default:
                return <User2 className="h-8 w-8 text-primary" />
        }
    }

    // Get the appropriate title based on role
    const getRoleTitle = () => {
        switch (selectedRole) {
            case "PATIENT":
                return "Créer un nouveau patient"
            case "DOCTOR":
                return "Créer un nouveau médecin"
            case "CHIEF_DOCTOR":
                return "Créer un nouveau médecin en chef"
            case "SECRETARY":
                return "Créer une nouvelle secrétaire"
            case "DIRECTOR":
                return "Créer un nouveau directeur"
            default:
                return "Créer un nouvel utilisateur"
        }
    }

    // Get the appropriate description based on role
    const getRoleDescription = () => {
        switch (selectedRole) {
            case "PATIENT":
                return "Complétez le formulaire pour ajouter un patient à la plateforme."
            case "DOCTOR":
            case "CHIEF_DOCTOR":
                return "Complétez le formulaire pour ajouter un médecin à la plateforme."
            case "SECRETARY":
                return "Complétez le formulaire pour ajouter une secrétaire à la plateforme."
            case "DIRECTOR":
                return "Complétez le formulaire pour ajouter un directeur à la plateforme."
            default:
                return "Complétez le formulaire pour ajouter un utilisateur à la plateforme."
        }
    }

    return (
        <div className="px-4 py-8 w-full">
            <RoleSelector selectedRole={selectedRole} onRoleChange={(role) => setSelectedRole(role)} />

            <DataForm
                schema={getSchemaByRole(selectedRole)}
                fields={getFieldsByRole(selectedRole)}
                submitButtonText="Créer l'utilisateur"
                isLoading={isLoading}
                onSubmit={handleCreateUser}
                backLink={{
                    text: "Retour à la liste des utilisateurs",
                    href: "/admin/users",
                }}
                title={getRoleTitle()}
                description={getRoleDescription()}
                layout="steps"
                theme="modern"
                iconHeader={getRoleIcon()}
                groups={getGroupsByRole(selectedRole)}
                showProgressBar={true}
                rounded="md"
                animation="fade"
            />
        </div>
    )
}
