// LoginPage.tsx
"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Dumbbell } from "lucide-react"
import SideImageForm from "@/features/auth/side-image-form"
import { AuthForm } from "@/features/auth/auth-form"
import {toastAlert} from "@/components/ui/sonner-v2";

// Schéma Zod pour le formulaire de connexion
const loginSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
})

// Type déduit du schéma
type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuote] = useState(0)
  const router = useRouter()
  const particlesRef = useRef<HTMLCanvasElement>(null)

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

  // Configuration des champs du formulaire avec typage strict
  const loginFields: Array<{
    type: "email" | "password"
    name: keyof LoginFormValues
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
    {
      type: "password",
      name: "password",
      label: "Mot de passe",
      placeholder: "••••••••",
      required: true,
    },
  ]

  const handleSubmit = (values: LoginFormValues) => {
    setIsLoading(true)
    console.log("Submitting:", values)
    toastAlert.success({
      title: "Opération réussie",
      description: "Votre profil a été mis à jour avec succès",
      duration: 4000,
    })

    setTimeout(() => {
      setIsLoading(false)
      // router.push("/dashboard")
    }, 1500)
  }

  return (
      <div className="login-container flex min-h-screen bg-black overflow-hidden">
        {/* Partie image (côté droit) */}
        <SideImageForm
            particlesRef={particlesRef}
            backgroundImage={'url("/auth/login.png")'}
            motivationalQuotes={motivationalQuotes}
            currentQuote={currentQuote}
        />

        {/* Formulaire de connexion (côté gauche) */}
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
                Connexion à votre compte
              </h1>
              <p className="text-zinc-400 text-center">
                Entrez vos identifiants pour accéder à votre espace personnel
              </p>
            </div>

            <AuthForm
                schema={loginSchema}
                fields={loginFields}
                submitButtonText="Se connecter"
                isLoading={isLoading}
                onSubmit={handleSubmit}
                footerText="Vous n'avez pas de compte ?"
                footerLinkText="Créer un compte"
                footerLinkHref="/register"
                socialButtons={true}
                forgotPasswordLink={true}
            />
          </div>
        </div>
      </div>
  )
}