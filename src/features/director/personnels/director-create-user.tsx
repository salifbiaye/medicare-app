"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { DataForm } from "@/components/data-form"
import { toastAlert } from "@/components/ui/sonner-v2"
import { getSchemaByRole } from "@/schemas/user.schema"
import { getFieldsByRole } from "@/fields/user.field"
import { getGroupsByRole } from "@/groups/user.groups"
import { Stethoscope, ClipboardList } from "lucide-react"
import {
    CreateDoctorFormValues,
    CreateSecretaryFormValues,
} from "@/schemas/user.schema"
import { createDoctorAction } from "@/actions/doctor.action"
import { createSecretaryAction } from "@/actions/secretary.action"
import DirectorRoleSelector from "@/features/director/personnels/director-role";

type Role = "DOCTOR" | "SECRETARY"

type ActionResult = {
    success: boolean | "partial"
    message?: string
    error?: string
    data?: any
}

export default function DirectorCreateUserPage({ hospitalId }: { hospitalId: string }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [selectedRole, setSelectedRole] = React.useState<Role>("SECRETARY")
    const [fields, setFields] = React.useState<any[]>([])

    // Charger et modifier les champs
    React.useEffect(() => {

        const loadFields = async () => {
            // Obtenir les champs de base pour le rôle sélectionné
            const baseFields = getFieldsByRole(selectedRole) as any[];

            // Modifier les champs pour pré-remplir l'hôpital du directeur
            const modifiedFields = baseFields.map(field => {
                if (field.name === "hospitalId") {
                    return {
                        ...field,
                        defaultValue: hospitalId,
                        disabled: true,
                        options: [{ value: hospitalId, label: "Votre hôpital" }]
                    };
                }
                // Pour le champ role de secrétaire, assurez-vous qu'il est correctement défini
                if (selectedRole === "SECRETARY" && field.name === "role") {

                    return {
                        ...field,
                        defaultValue: "SECRETARY",
                        hidden: false
                    };
                }
                return field;
            });

            setFields(modifiedFields);
        };

        loadFields();
    }, [selectedRole, hospitalId]);

    const handleCreateUser = async (values: any) => {
        setIsLoading(true)

        try {
            // S'assurer que l'hôpital est bien celui du directeur
            if (values.hospitalId !== hospitalId) {
                values.hospitalId = hospitalId;
            }

            // S'assurer que le rôle est correctement défini
            if (selectedRole === "SECRETARY" && (!values.role || values.role !== "SECRETARY")) {
                values.role = "SECRETARY";
            }


            let result: ActionResult;

            if (selectedRole === "DOCTOR") {
                result = await createDoctorAction(values as CreateDoctorFormValues);
            } else if (selectedRole === "SECRETARY") {
                result = await createSecretaryAction(values as CreateSecretaryFormValues);
            } else {
                throw new Error("Rôle non supporté");
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
                router.push("/director/staff")
            }
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
            case "DOCTOR":
                return <Stethoscope className="h-8 w-8 text-primary" />
            case "SECRETARY":
                return <ClipboardList className="h-8 w-8 text-primary" />
            default:
                return <Stethoscope className="h-8 w-8 text-primary" />
        }
    }

    // Get the appropriate title based on role
    const getRoleTitle = () => {
        switch (selectedRole) {
            case "DOCTOR":
                return "Créer un nouveau médecin"
            case "SECRETARY":
                return "Créer une nouvelle secrétaire"
            default:
                return "Créer un nouvel utilisateur"
        }
    }

    // Get the appropriate description based on role
    const getRoleDescription = () => {
        switch (selectedRole) {
            case "DOCTOR":
                return "Complétez le formulaire pour ajouter un médecin à votre hôpital."
            case "SECRETARY":
                return "Complétez le formulaire pour ajouter une secrétaire à votre hôpital."
            default:
                return "Complétez le formulaire pour ajouter un utilisateur à la plateforme."
        }
    }

    return (
        <div className="px-4 py-8 w-full">
            <DirectorRoleSelector selectedRole={selectedRole} onRoleChange={(role) => setSelectedRole(role as Role)} />

            {fields.length > 0 && (
                <DataForm
                    schema={getSchemaByRole(selectedRole)}
                    fields={fields}
                    submitButtonText="Créer l'utilisateur"
                    isLoading={isLoading}
                    onSubmit={handleCreateUser}
                    backLink={{
                        text: "Retour à la liste du personnels",
                        href: "/director/staff",
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
            )}
        </div>
    )
}