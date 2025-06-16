// ForgotPasswordPage.tsx
"use client"

import { useState } from "react"
import { z } from "zod"
import {ArrowLeft,Syringe} from "lucide-react"
import SideImageForm from "@/features/auth/side-image-form"
import { AuthForm } from "@/features/auth/auth-form"
import { toastAlert } from "@/components/ui/sonner-v2"
import { toast } from "sonner"
import {authClient} from "@/lib/authClient";
import {verifyEmailAction} from "@/actions/auth.action";
import { motion } from "framer-motion"
import {ModeToggle} from "@/components/mode-toggle";
import Link from "next/link";

// Schéma Zod pour le formulaire de réinitialisation de mot de passe
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide" }),
})

// Type déduit du schéma
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuote,setCurrentQuote] = useState(0)

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

  // Configuration des champs du formulaire
  const forgotPasswordFields: Array<{
    type: "email"
    name: keyof ForgotPasswordFormValues
    label: string
    placeholder: string
    required: boolean
  }> = [
    {
      type: "email",
      name: "email",
      label: "Email",
      placeholder: "exemple@email.com",
      required: true,
    },
  ]

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true)
    const { email } = values
    const result = await verifyEmailAction(email)
    if (result.error) {
      toastAlert.error({
        title: "Erreur",
        description: result.error,
        duration: 3000,
      })
      setIsLoading(false)
      return
    }
    const loadingToastId = toastAlert.loading({
      title: "Envoi de l'email...",
      description: "Nous vous enverrons un email pour réinitialiser votre mot de passe.",
      duration: Infinity,
    })

    await authClient.forgetPassword({
      email: email,
      redirectTo: "/reset-password",
    },{
      onRequest: async () => {

      },
      onSuccess: () => {
        toast.dismiss(loadingToastId)
        toastAlert.success({
          title: "Email envoyé",
          description: "Un email de réinitialisation a été envoyé à votre adresse.",
          duration: 5000,
        })
      },
      onError: (ctx) => {
        toast.dismiss(loadingToastId)
        toastAlert.error({
          title: "Erreur",
          description: ctx.error.message || "Une erreur est survenue lors de l'envoi de l'email.",
          duration: 3000,
        })
      },
    });
    setIsLoading(false)
  }

  return (
      <div className="login-container flex min-h-screen b overflow-hidden">


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
                Mot de passe oublié ?
              </h1>
              <p className="text-zinc-400 text-center">
                Entrez votre email pour recevoir un lien de réinitialisation
              </p>
            </div>
            <AuthForm
                schema={forgotPasswordSchema}
                fields={forgotPasswordFields}
                submitButtonText="Envoyer les instructions"
                isLoading={isLoading}
                onSubmit={handleSubmit}
                footerText="Retour à la connexion"
                footerLinkText="Se connecter"
                footerLinkHref="/login"
                socialButtons={false}
            />

          </div>
        </motion.div>

        <SideImageForm
            backgroundImage={'url("/auth/forgot-password.png")'}
            motivationalQuotes={motivationalQuotes}
            currentQuote={currentQuote}
            setCurrentQuote={setCurrentQuote}
        />

      </div>
  )
}