"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { DataForm } from "@/components/data-form"
import { toastAlert } from "@/components/ui/sonner-v2"
import { getSchemaByRole } from "@/schemas/user.schema"
import { getFieldsByRole } from "@/fields/user.field"
import { getGroupsByRole } from "@/groups/user.groups"
import { RoleSelector } from "./role-selector"
import { User2, Stethoscope, ClipboardList, Building2 } from "lucide-react"
import {
    CreatePatientFormValues,
    CreateDoctorFormValues,
    CreateSecretaryFormValues,
    CreateDirectorFormValues,
    CreateAdminFormValues,
} from "@/schemas/user.schema"
import {createPatientAction} from "@/actions/patient.action";
import {createDoctorAction} from "@/actions/doctor.action";
import {createSecretaryAction} from "@/actions/secretary.action";
import {createDirectorAction} from "@/actions/director.action";

type Role = "PATIENT" | "DOCTOR" | "CHIEF_DOCTOR" | "SECRETARY" | "DIRECTOR" | "ADMIN"

type FormValues = {
    PATIENT: CreatePatientFormValues
    DOCTOR: CreateDoctorFormValues
    CHIEF_DOCTOR: CreateDoctorFormValues
    SECRETARY: CreateSecretaryFormValues
    DIRECTOR: CreateDirectorFormValues
    ADMIN: CreateAdminFormValues
}

type ActionResult = {
    success: boolean | "partial"
    message?: string
    error?: string
    data?: any
}

type PatientResult = {
    id: string
    userId: string
    socialSecurityNumber?: string | null
    bloodGroup?: string | null
    allergies?: string | null
    user: {
        id: string
        name: string
        email: string
        gender: "MALE" | "FEMALE"
        emailVerified: boolean
        profileCompleted: boolean
        role: "PATIENT"
        birthDate: Date | null
        phone: string | null
        address: string | null
        createdAt: Date
        updatedAt: Date
        image: string | null
    }
}

export default function CreateUserPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [selectedRole, setSelectedRole] = React.useState<Role>("PATIENT")

    const handleCreateUser = async (values: FormValues[Role]) => {
        setIsLoading(true)

        try {
            console.log("Tentative de création d'utilisateur avec le rôle:", selectedRole);
            console.log("Valeurs du formulaire:", values);
            
            let result: ActionResult;
            switch (selectedRole) {
                case "PATIENT":
                    const patientResult = await createPatientAction(values as CreatePatientFormValues)
                    result = {
                        success: true,
                        data: patientResult
                    }
                    break;
                case "DOCTOR":
                case "CHIEF_DOCTOR":
                    result = await createDoctorAction(values as CreateDoctorFormValues)
                    break;
                case "SECRETARY":
                    console.log("Appel de createSecretaryAction avec:", values);
                    const secretaryResponse = await createSecretaryAction(values as CreateSecretaryFormValues);
                    console.log("Résultat de createSecretaryAction:", secretaryResponse);
                    result = secretaryResponse as ActionResult;
                    break;
                case "DIRECTOR":
                    const directorResponse = await createDirectorAction(values as CreateDirectorFormValues);
                    result = directorResponse as ActionResult;
                    break;
                default:
                    throw new Error("Rôle non supporté")
            }

            if (result.success === false) {
                toastAlert.error({
                    title: "Erreur lors de la création de l'utilisateur",
                    description: result.error || "Une erreur s'est produite lors de la création de l'utilisateur. Veuillez réessayer.",
                })
            } else if (result.success === "partial") {
                toastAlert.info({
                    title: "Création partielle",
                    description: result.message || "Certains utilisateurs n'ont pas pu être créés.",
                })
            } else {
                toastAlert.success({
                    title: "Utilisateur créé avec succès",
                    description: "L'utilisateur a été ajouté à la plateforme.",
                })
            }

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
                fields={getFieldsByRole(selectedRole) as any}
                submitButtonText="Créer l'utilisateur"
                isLoading={isLoading}
                onSubmit={handleCreateUser as any}
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
