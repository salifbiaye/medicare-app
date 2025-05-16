"use client"

import React, { useEffect } from "react"
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
import { getDirectorHospitalIdAction } from "@/actions/director.action"

interface UserWithRelations extends User {
    relationData?: any;
}

export default function EditPersonnelPage({user}:{user: UserWithRelations}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [directorHospitalId, setDirectorHospitalId] = React.useState<string | null>(null)

    // Récupérer l'ID de l'hôpital du directeur connecté
    useEffect(() => {
        const fetchDirectorHospitalId = async () => {
            try {
                const { getDirectorHospitalIdAction } = await import("@/actions/director.action");
                const response = await getDirectorHospitalIdAction();
                if (response.success && response.data) {
                    setDirectorHospitalId(response.data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'hôpital du directeur:", error);
            }
        };
        
        fetchDirectorHospitalId();
    }, []);

    // Sélectionner le schéma, les champs et les groupes en fonction du rôle de l'utilisateur
    const userSchema = getSchemaByRole(user.role)
    const userFields = getFieldsByRole(user.role)
    const userGroups = getGroupsByRole(user.role)

    // Modifier les champs pour désactiver la sélection d'hôpital si on a l'ID de l'hôpital du directeur
    const modifiedFields = React.useMemo(() => {
        if (!directorHospitalId) return userFields;
        
        return userFields.map(field => {
            if (field.name === "hospitalId") {
                return {
                    ...field,
                    disabled: true,
                    defaultValue: directorHospitalId,
                    helpText: "L'hôpital est automatiquement défini selon votre établissement"
                };
            }
            return field;
        });
    }, [userFields, directorHospitalId]);

    // Préparer les données initiales de l'utilisateur en incluant les données relationnelles
    const prepareInitialData = () => {
        const baseData = {
            name: user.name,
            email: user.email,
            gender: user.gender,
            role: user.role,
            profileCompleted: user.profileCompleted,
            emailVerified: user.emailVerified,
            phone: user.phone || "",
            address: user.address || "",
            birthDate: user.birthDate || undefined,
        };

        // Si nous avons des données relationnelles, les ajouter en fonction du rôle
        if (user.relationData) {
            switch (user.role) {
                case "PATIENT":
                    return {
                        ...baseData,
                        socialSecurityNumber: user.relationData.socialSecurityNumber || "",
                        bloodGroup: user.relationData.bloodGroup || "",
                        allergies: user.relationData.allergies || "",
                    };
                case "DOCTOR":
                case "CHIEF_DOCTOR":
                    return {
                        ...baseData,
                        specialty: user.relationData.specialty || "",
                        registrationNumber: user.relationData.registrationNumber || "",
                        hospitalId: directorHospitalId || user.relationData.hospitalId || "",
                        serviceId: user.relationData.serviceId || "",
                        isChief: user.role === "CHIEF_DOCTOR" || user.relationData.isChief || false,
                    };
                case "SECRETARY":
                    return {
                        ...baseData,
                        hospitalId: directorHospitalId || user.relationData.hospitalId || "",
                        serviceId: user.relationData.serviceId || "",
                    };
                case "DIRECTOR":
                    return {
                        ...baseData,
                        hospitalId: directorHospitalId || user.relationData.hospitalId || "",
                    };
                default:
                    return baseData;
            }
        }

        return baseData;
    };

    const initialData = prepareInitialData();

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
            // Si nous avons l'ID de l'hôpital du directeur, l'utiliser
            if (directorHospitalId) {
                if (user.role === "DOCTOR" || user.role === "CHIEF_DOCTOR" || user.role === "SECRETARY") {
                    values = { ...values, hospitalId: directorHospitalId } as any;
                }
            }
            
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
                fields={modifiedFields as any}
                initialData={initialData}
                submitButtonText="Enregistrer les modifications"
                isLoading={isLoading}
                onSubmit={handleEditUser}
                backLink={{
                    text: "Retour à la liste du personnel",
                    href: "/director/staff",
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