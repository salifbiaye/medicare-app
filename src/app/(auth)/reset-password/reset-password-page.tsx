"use client"

import { useState, Suspense } from "react"
import { z } from "zod"
import {ArrowLeft, Dumbbell, Syringe} from "lucide-react"
import SideImageForm from "@/features/auth/side-image-form"
import { AuthForm } from "@/features/auth/auth-form"
import { toastAlert } from "@/components/ui/sonner-v2"
import {redirect, useSearchParams} from "next/navigation"
import { authClient } from "@/lib/authClient"
import { toast } from "sonner"
import { motion } from "framer-motion"
import {ModeToggle} from "@/components/mode-toggle";
import Link from "next/link";

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

// Separate component for the content that uses useSearchParams
export function ResetPasswordContent() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess] = useState(false)
    const [currentQuote,setCurrentQuote] = useState(0)
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const motivationalQuotes = [
        {
            text: "Mangez au moins 5 fruits et légumes par jour pour préserver votre vitalité.",
            author: "PNNS",
        },
        {
            text: "Boire suffisamment d'eau chaque jour est un acte simple pour une grande santé.",
            author: "OMS",
        },
        {
            text: "Une bonne alimentation est le carburant d'un corps et d'un esprit performants.",
            author: "Auteur inconnu",
        },
        {
            text: "Bien manger aujourd'hui, c'est investir dans votre santé de demain.",
            author: "Diététiciens de France",
        },
        {
            text: "Votre assiette est votre première ordonnance santé.",
            author: "Hippocrate (adapté)",
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

        await authClient.resetPassword({
            newPassword: password,
            token: token,
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
        <div className="login-container flex min-h-screen overflow-hidden">
            <motion.div initial={{y: 200, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        transition={{type: "spring", stiffness: 100}}
                        className="w-full lg:w-1/2 relative flex items-center justify-center p-8">
                <div className="absolute top-4 left-4 w-full flex justify-between pt-2 p-8 ">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4"/>
                        Retour à l'accueil
                    </Link>
                    <ModeToggle/>
                </div>
                <div className="max-w-md w-full">
                    <div className="flex flex-col items-center mb-10 transition-all duration-300">
                        <div className="flex items-center gap-2 font-bold text-2xl mb-4 logo-glow">
                            <Syringe className="h-7 w-7 text-primary"/>
                            <span className="text-gray-800 dark:text-white">
                Medicare
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
            </motion.div>

            <SideImageForm
                setCurrentQuote={setCurrentQuote}
                backgroundImage={'url("/auth/reset-password.png")'}
                motivationalQuotes={motivationalQuotes}
                currentQuote={currentQuote}
            />
        </div>
    )
}
