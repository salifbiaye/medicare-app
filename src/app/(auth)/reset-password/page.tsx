// reset-password-page.tsx
"use client"

import { useState } from "react"
import { z } from "zod"
import { Dumbbell } from "lucide-react"
import SideImageForm from "@/features/auth/side-image-form"
import { AuthForm } from "@/features/auth/auth-form"
import { toastAlert } from "@/components/ui/sonner-v2"
import {redirect, useSearchParams} from "next/navigation"
import { authClient } from "@/lib/authClient"
import { toast } from "sonner"

// Schéma Zod pour la réinitialisation de mot de passe
const resetPasswordSchema = z.object({
    password: z.string()
        .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
        .regex(/[A-Z]/, { message: "Doit contenir au moins une majuscule" })
        .regex(/[a-z]/, { message: "Doit contenir au moins une minuscule" })
        .regex(/[0-9]/, { message: "Doit contenir au moins un chiffre" })
        .regex(/[^A-Za-z0-9]/, { message: "Doit contenir au moins un caractère spécial" }),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"]
})

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess] = useState(false)
    const [currentQuote] = useState(0)
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const motivationalQuotes = [
        {
            text: "La discipline est le pont entre les objectifs et les accomplissements.",
            author: "Jim Rohn",
        },
        {
            text: "Le succès n'est pas final, l'échec n'est pas fatal. C'est le courage de continuer qui compte.",
            author: "Winston Churchill",
        },
        {
            text: "Chaque nouveau jour est une nouvelle opportunité de recommencer.",
            author: "Inconnu",
        },
        {
            text: "La persévérance est le secret de tous les triomphes.",
            author: "Victor Hugo",
        },
    ]

    const resetPasswordFields :Array<{
        type: "text" | "email" | "password"
        name: keyof ResetPasswordFormValues
        label: string
        placeholder: string
        required: boolean
    }> = [
        {
            type: "password",
            name: "password",
            label: "Nouveau mot de passe",
            placeholder: "••••••••",
            required: true,
        },
        {
            type: "password",
            name: "confirmPassword",
            label: "Confirmer le mot de passe",
            placeholder: "••••••••",
            required: true,
        },
    ]

    const handleSubmit = async (values: ResetPasswordFormValues) => {
        if (!token) {
            toastAlert.error({
                title: "Token manquant",
                description: "Le lien de réinitialisation est invalide ou expiré.",
                duration: 5000,
            })
            return
        }

        setIsLoading(true)
        const loadingToastId = toastAlert.loading({
            title: "Réinitialisation en cours...",
            description: "Veuillez patienter pendant que nous mettons à jour votre mot de passe.",
            duration: Infinity,
        })
        setIsLoading(true);
        const { password } = values;

        // Simulate an API call to reset the password
        await authClient.resetPassword({
            newPassword: password,
            token: token, // Replace with the actual token from the URL or context
        }, {
            onRequest: () => {

            },
            onSuccess: () => {
                toast.dismiss(loadingToastId)
              toastAlert.success({
                title: "Mot de passe réinitialisé",
                description: "Votre mot de passe a été réinitialisé avec succès.",
                duration: 5000,
              })
            redirect("/login" + "?resetPassword=true" + "&email=" + searchParams.get("email") || "")
            },
            onError: (ctx) => {
                toast.dismiss(loadingToastId)
                toastAlert.error({
                    title: "Erreur",
                    description: ctx.error.message || "Une erreur est survenue lors de la réinitialisation du mot de passe.",
                    duration: 3000,
                })
            },
        });

        setIsLoading(false);

    }

    return (
        <div className="login-container flex min-h-screen bg-black overflow-hidden">
            {/* Partie image (côté droit) */}
            <SideImageForm
                backgroundImage={'url("/auth/reset-password.png")'}
                motivationalQuotes={motivationalQuotes}
                currentQuote={currentQuote}
            />

            {/* Formulaire (côté gauche) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <div className="flex flex-col items-center mb-10 transition-all duration-300">
                        <div className="flex items-center gap-2 font-bold text-2xl mb-4 logo-glow">
                            <Dumbbell className="h-7 w-7 text-gray-400" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-500">
                ShadowFit
              </span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">
                            {isSuccess ? "Mot de passe mis à jour" : "Réinitialiser votre mot de passe"}
                        </h1>
                        <p className="text-zinc-400 text-center">
                            {isSuccess
                                ? "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe."
                                : "Entrez votre nouveau mot de passe ci-dessous."}
                        </p>
                    </div>

                    <AuthForm
                        schema={resetPasswordSchema}
                        fields={resetPasswordFields}
                        submitButtonText={isSuccess ? "Aller à la page de connexion" : "Réinitialiser le mot de passe"}
                        isLoading={isLoading}
                        onSubmit={handleSubmit}
                        footerText={isSuccess ? "" : "Revenir à la page de connexion"}
                        footerLinkText={isSuccess ? "" : "Se connecter"}
                        footerLinkHref={isSuccess ? "" : "/login"}
                    />
                </div>
            </div>
        </div>
    )
}