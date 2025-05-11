"use client"

import React from "react"

import { useRouter } from "next/navigation"
import {DataForm} from "@/components/data-form";
import {toastAlert} from "@/components/ui/sonner-v2";
import {CreateUserFormValues, createUserSchema} from "@/schemas/user.schema";
import {createUserfields, createUsergroups} from "@/fields/user.field";
import {User2} from "lucide-react";
import { updateUserAction} from "@/actions/user.action";
import {User} from "@prisma/client";
export default function EditUserPage({user}:{user: User}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const data = {
        name: user.name,
        email: user.email,
        gender:user.gender,
        role: user.role,
        profileCompleted: user.profileCompleted,
        emailVerified: user.emailVerified,

    }
    const handleEditUser = async (values:CreateUserFormValues) => {
        setIsLoading(true)
        try {
            await updateUserAction(user.id,values)

            toastAlert.success({
                title: "Utilisateur modifié avec succès",
                description: "L'utilisateur a été modifié à la plateforme.",

            })
            router.push("/admin/users")
        } catch (error) {
            toastAlert.error({
                title: "Erreur lors de la  modification de l'utilisateur",
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
                initialData={data}
                submitButtonText="Enregistrer les modifications"
                isLoading={isLoading}
                onSubmit={handleEditUser}
                backLink={{
                    text: "Retour à la liste des utilisateurs",
                    href: "/admin/users",
                }}
                title="Modifier l'utilisateur"
                description="Complétez le formulaire pour modifier un utilisateur."
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