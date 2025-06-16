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
import {verifiedEmailAction} from "@/actions/auth.action";
import { motion } from "framer-motion"
import {ModeToggle} from "@/components/mode-toggle";
import Link from "next/link";

// Schéma Zod pour la validation OTP
const verifyEmailSchema = z.object({
    otp: z.string()
        .length(6, { message: "Le code doit contenir exactement 6 caractères" })
        .regex(/^[0-9]+$/, { message: "Le code ne doit contenir que des chiffres" })
})

type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>

// Separate component for the content that uses useSearchParams
export function VerifyEmailContent() {
    const [isLoading, setIsLoading] = useState(false)
    const [isVerified,] = useState(false)
    const [currentQuote,setCurrentQuote] = useState(0)
    const searchParams = useSearchParams()
    const email = searchParams.get("email")

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
                redirect("/verify-email?email=" + email + "&type=email-verification" + "&message=Un email de vérification a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception.");
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
        <div className="login-container flex min-h-screen overflow-hidden">
            <motion.div initial={{y: 200, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        transition={{type: "spring", stiffness: 100}}
                        className="w-full lg:w-1/2 relative flex items-center justify-center p-8">
                <div className="absolute top-4 left-4 w-full  flex justify-between pt-2 p-8 ">
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
                        socialButtons={false}
                        onSubmit={handleSubmit}
                        footerText={isVerified ? "" : "Revenir à la page de connexion"}
                        footerLinkText={isVerified ? "" : "Se connecter"}
                        footerLinkHref={isVerified ? "" : "/login"}
                    />
                </div>
            </motion.div>

            <SideImageForm
                setCurrentQuote={setCurrentQuote}
                backgroundImage={'url("/auth/verify-email.png")'}
                motivationalQuotes={motivationalQuotes}
                currentQuote={currentQuote}
            />
        </div>
    )
}
