// verify-email-page.tsx
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
import {verifiedEmailAction} from "@/actions/auth.action";

// Schéma Zod pour la validation OTP
const verifyEmailSchema = z.object({
    otp: z.string()
        .length(6, { message: "Le code doit contenir exactement 6 caractères" })
        .regex(/^[0-9]+$/, { message: "Le code ne doit contenir que des chiffres" })
})

type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>

export default function VerifyEmailPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isVerified,] = useState(false)
    const [currentQuote] = useState(0)
    const searchParams = useSearchParams()
    const email = searchParams.get("email")

    const motivationalQuotes = [
        {
            text: "La persévérance transforme l'échec en accomplissement extraordinaire.",
            author: "Inconnu",
        },
        {
            text: "Chaque vérification est une étape vers une sécurité renforcée.",
            author: "Inconnu",
        },
        {
            text: "La discipline est la clé de voûte de toute réussite durable.",
            author: "Jim Rohn",
        },
        {
            text: "Votre engagement aujourd'hui construit votre réussite de demain.",
            author: "Inconnu",
        },
    ]

    const verifyEmailFields:Array<{
        type: "text" | "email" | "password" | "otp"
        name: keyof VerifyEmailFormValues
        label: string
        placeholder: string
        required: boolean
    }> = [
        {
            type: "otp",
            name: "otp",
            label: "Code de vérification",
            placeholder: "123456",
            required: true,
        },
    ]

    const handleSubmit = async (values: VerifyEmailFormValues) => {
        if (!email) {
            toastAlert.error({
                title: "Email manquant",
                description: "Veuillez utiliser le lien complet reçu par email.",
                duration: 5000,
            })
            return
        }

        setIsLoading(true)
        const loadingToastId = toastAlert.loading({
            title: "Vérification en cours...",
            description: "Nous validons votre code de sécurité.",
            duration: Infinity,
        })

            await authClient.emailOtp.verifyEmail({
                email,
                otp: values.otp,
            },{
                onRequest: () => {

                },
                onSuccess: async () => {
                    toast.dismiss(loadingToastId)
                    toastAlert.success({
                        title: "Email vérifié",
                        description: "Votre adresse email a été confirmée avec succès.",
                        duration: 5000,
                    })
                    const result = await verifiedEmailAction(email)
                    if (result.success) {
                        redirect("/login");
                    } else {
                        toast.dismiss(loadingToastId)
                        toastAlert.error({
                            title: "Erreur de vérification",
                            description: result.error || "Une erreur s'est produite lors de la vérification de votre adresse email.",
                            duration: 5000,
                        })
                    }

                },
                onError: (ctx) => {
                    toast.dismiss(loadingToastId)
                    toastAlert.error({
                        title: "Erreur de vérification",
                        description: ctx.error.message || "Le code est invalide ou a expiré. Veuillez réessayer.",
                        duration: 5000,
                    })
                },

            })

            setIsLoading(false)
    }

    const handleResendOtp = async () => {
        if (!email) return
       const loadingToastId = toastAlert.loading({
            title: "Envoi du code...",
            description: "Un nouveau code de vérification est en cours d'envoi.",
            duration: Infinity,
        })

        setIsLoading(true)

            await authClient.emailOtp.sendVerificationOtp({
                email,
                type: "email-verification",
            }, {
                onRequest: () => {

                },
                onSuccess: () => {
                    toast.dismiss(loadingToastId)
                    toastAlert.success({
                        title: "Code envoyé",
                        description: "Un nouveau code a été envoyé à votre adresse email.",
                        duration: 5000,
                    })
                  redirect("/verify-email?email=" + email + "&type=email-verification" + "&message=Un email de vérification a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception." + "&error=" + "Un nouveau code a été envoyé à votre adresse email." + "&success=" + "Un nouveau code a été envoyé à votre adresse email." + "&info=" + "Un nouveau code a été envoyé à votre adresse email." + "&warning=" + "Un nouveau code a été envoyé à votre adresse email." + "&alert=" + "Un nouveau code a été envoyé à votre adresse email." + "&notification=" + "Un nouveau code a été envoyé à votre adresse email." + "&toast=" + "Un nouveau code a été envoyé à votre adresse email.");
                },
                onError: (ctx) => {
                    toast.dismiss(loadingToastId)
                    toastAlert.error({
                        title: "Erreur d'envoi",
                        description: ctx.error.message || "Une erreur est survenue lors de l'envoi du code.",
                        duration: 5000,
                    })
                },
            });

            setIsLoading(false)

    }

    return (
        <div className="login-container flex min-h-screen bg-black overflow-hidden">
            {/* Partie image (côté droit) */}
            <SideImageForm
                backgroundImage={'url("/auth/verify-email.png")'}
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
                            {isVerified ? "Email vérifié !" : "Vérification d'email"}
                        </h1>
                        <p className="text-zinc-400 text-center">
                            {isVerified
                                ? "Votre adresse email a été confirmée avec succès."
                                : `Entrez le code à 6 chiffres envoyé à ${email || "votre email"}`}
                        </p>
                    </div>

                    {!isVerified && (
                        <div className="mb-6 text-center">
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={isLoading}
                                className="text-sm text-gray-400 hover:text-gray-300 disabled:opacity-50 transition-colors duration-300"
                            >
                                Vous n&apos;avez pas reçu de code ? <span className="underline">Renvoyer</span>
                            </button>
                        </div>
                    )}

                    <AuthForm
                        schema={verifyEmailSchema}
                        fields={verifyEmailFields}
                        submitButtonText={isVerified ? "Continuer vers l'application" : "Vérifier le code"}
                        isLoading={isLoading}
                        onSubmit={handleSubmit}
                        footerText={isVerified ? "" : "Revenir à la page de connexion"}
                        footerLinkText={isVerified ? "" : "Se connecter"}
                        footerLinkHref={isVerified ? "" : "/login"}
                    />
                </div>
            </div>
        </div>
    )
}