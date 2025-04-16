// LoginPage.tsx
"use client"

import { useState } from "react"

import { z } from "zod"
import { Dumbbell } from "lucide-react"
import SideImageForm from "@/features/auth/side-image-form"
import { AuthForm } from "@/features/auth/auth-form"
import {toastAlert} from "@/components/ui/sonner-v2";
import {authClient} from "@/lib/authClient";
import {toast} from "sonner";
import {verifyEmailAction} from "@/actions/auth.action";
import {redirect} from "next/navigation";

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

  const verifyEmail = async (email: string ) => {
    const {  error } = await authClient.emailOtp.sendVerificationOtp({
      email: email,
      type: "email-verification",
    })

    // Redirect to the email verification page or show a success message
    redirect("/verify-email?email=" + email + "&type=email-verification" + "&message=Un email de vérification a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception." + "&error=" + error?.message || "")
  }
  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    const { email, password } = values;

    // Affiche le toast de chargement
    const loadingToastId = toastAlert.loading({
      title: "Connexion en cours...",
      description: "Veuillez patienter pendant que nous vérifions vos identifiants.",
      duration: Infinity,
    });
    const result = await verifyEmailAction(email)
    if (result.error) {
      toastAlert.error({
        title: "Erreur de vérification",
        description: "Une erreur s'est produite lors de la vérification de votre adresse email.",
        duration: 5000,
      })
      verifyEmail(email)
      setIsLoading(false)
      return
    }


    await authClient.signIn.email({
      email: email,
      password: password,
    }, {
      onRequest: () => {
        // Ne pas supprimer le toast de chargement ici
        // Retirer cette ligne: toast.dismiss(loadingToastId);
      },
      onSuccess: async () => {
        // Supprimer le toast de chargement à la réussite
        toast.dismiss(loadingToastId);

          toastAlert.success({
            title: "Connexion réussie",
            description: "Vous êtes maintenant connecté à votre compte.",
            duration: 4000,
          });
          redirect("/dashboard");

      },
      onError: (ctx) => {
        // Supprimer le toast de chargement en cas d'erreur
        toast.dismiss(loadingToastId);

        if(ctx.error.message === "Invalid email or password") {
          toastAlert.error({
            title: "Erreur de connexion",
            description: "Adresse email ou mot de passe incorrect.",
            duration: 3000,
          });
        } else {
          toast.dismiss(loadingToastId)
          toastAlert.error({
            title: "Erreur de connexion",
            description: "Une erreur est survenue lors de la connexion. Veuillez réessayer.",
            duration: 3000,
          });
        }
      },
    });

    setIsLoading(false);
  }

  return (
      <div className="login-container flex min-h-screen bg-black overflow-hidden">
        {/* Partie image (côté droit) */}
        <SideImageForm
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