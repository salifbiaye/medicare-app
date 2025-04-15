// RegisterPage.tsx
"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Dumbbell } from "lucide-react"
import SideImageForm from "@/features/auth/side-image-form"
import { AuthForm } from "@/features/auth/auth-form"

// Schéma Zod pour le formulaire d'inscription
const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Adresse email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
})

// Type inféré à partir du schéma Zod
type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuote] = useState(0)
  const router = useRouter()
  const particlesRef = useRef<HTMLCanvasElement>(null)

  const motivationalQuotes = [
    {
      text: "Chaque nouveau début est l'occasion de faire quelque chose de grand.",
      author: "Robin Sharma",
    },
    {
      text: "Le meilleur moment pour commencer est maintenant.",
      author: "Unknown",
    },
    {
      text: "L'effort d'aujourd'hui est la force de demain.",
      author: "Unknown",
    },
    {
      text: "Ta seule limite est celle que tu t'imposes.",
      author: "Unknown",
    },
    {
      text: "La progression n'est pas linéaire, mais ta détermination devrait l'être.",
      author: "Unknown",
    },
  ]

  // Configuration des champs du formulaire avec typage strict
  const registerFields: Array<{
    type: "text" | "email" | "password"
    name: keyof RegisterFormValues
    label: string
    placeholder: string
    required: boolean
  }> = [
    {
      type: "text",
      name: "fullName",
      label: "Nom complet",
      placeholder: "Jean Dupont",
      required: true,
    },
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

  const handleSubmit = (values: RegisterFormValues) => {
    setIsLoading(true)
    console.log("Submitting:", values)

    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1500)
  }

  return (
      <div className="register-container flex min-h-screen bg-black overflow-hidden">
        {/* Partie image (côté droit) */}
        <SideImageForm
            particlesRef={particlesRef}
            backgroundImage={'url("/auth/register.png")'}
            motivationalQuotes={motivationalQuotes}
            currentQuote={currentQuote}
        />

        {/* Formulaire d'inscription (côté gauche) */}
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
                Créer un compte
              </h1>
              <p className="text-zinc-400 text-center">
                Rejoignez notre communauté et commencez votre parcours fitness
              </p>
            </div>

            <AuthForm
                schema={registerSchema}
                fields={registerFields}
                submitButtonText="S'inscrire"
                isLoading={isLoading}
                onSubmit={handleSubmit}
                footerText="Vous avez déjà un compte ?"
                footerLinkText="Se connecter"
                footerLinkHref="/login"
                socialButtons={true}
                forgotPasswordLink={false}
            />
          </div>
        </div>
      </div>
  )
}