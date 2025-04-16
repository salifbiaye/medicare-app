// ForgotPasswordPage.tsx
"use client"

import { useState } from "react"
import { z } from "zod"
import { Dumbbell } from "lucide-react"
import SideImageForm from "@/features/auth/side-image-form"
import { AuthForm } from "@/features/auth/auth-form"
import { toastAlert } from "@/components/ui/sonner-v2"
import { toast } from "sonner"
import {authClient} from "@/lib/authClient";
import {verifyEmailAction} from "@/actions/auth.action";

// Schéma Zod pour le formulaire de réinitialisation de mot de passe
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide" }),
})

// Type déduit du schéma
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuote] = useState(0)

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
      text: "La douleur que vous ressentez aujourd'hui sera la force que vous ressentirez demain.",
      author: "Arnold Schwarzenegger",
    },
    {
      text: "Le corps atteint ce que l'esprit croit.",
      author: "Napoleon Hill",
    },
    {
      text: "Ne comptez pas les jours, faites que les jours comptent.",
      author: "Muhammad Ali",
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
    const loadingToastId =     toastAlert.loading({
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
      <div className="login-container flex min-h-screen bg-black overflow-hidden">
        {/* Partie image (côté droit) */}
        <SideImageForm
            backgroundImage={'url("/auth/forgot-password.png")'}
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
        </div>
      </div>
  )
}