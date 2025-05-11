// RegisterPage.tsx
"use client"

import { useState } from "react"
import { z } from "zod"
import {ArrowLeft, Dumbbell, Syringe} from "lucide-react"
import SideImageForm from "@/features/auth/side-image-form"
import { AuthForm } from "@/features/auth/auth-form"
import {authClient} from "@/lib/authClient";
import {toastAlert} from "@/components/ui/sonner-v2";
import {toast} from "sonner";
import {redirect} from "next/navigation";
import { motion } from "framer-motion"
import {ModeToggle} from "@/components/mode-toggle";
import Link from "next/link";

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
  const [currentQuote,setCurrentQuote] = useState(0)


  const motivationalQuotes = [
    {
      text: "Mangez au moins 5 fruits et légumes par jour pour préserver votre vitalité.",
      author: "PNNS",
    },
    {
      text: "Boire suffisamment d’eau chaque jour est un acte simple pour une grande santé.",
      author: "OMS",
    },
    {
      text: "Une bonne alimentation est le carburant d’un corps et d’un esprit performants.",
      author: "Auteur inconnu",
    },
    {
      text: "Bien manger aujourd’hui, c’est investir dans votre santé de demain.",
      author: "Diététiciens de France",
    },
    {
      text: "Votre assiette est votre première ordonnance santé.",
      author: "Hippocrate (adapté)",
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
  const verifyEmail = async (email: string) => {
    const {  error } = await authClient.emailOtp.sendVerificationOtp({
      email: email,
      type: "email-verification",
    })

    // Redirect to the email verification page or show a success message
    redirect("/verify-email?email=" + email + "&type=email-verification" + "&message=Un email de vérification a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception." + "&error=" + error?.message || "")
  }
  const handleSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true)
    const loadingToastId =     toastAlert.loading({
      title: "Inscription en cours...",
      description: "Veuillez patienter pendant que nous traitons votre inscription.",
      duration: Infinity,
    })
    const { email, password, fullName } = values;
    await authClient.signUp.email({
      email: email,
      password: password,
      name: fullName,
      callbackURL: "/login",
    },{
      onRequest: () => {

      },
      onSuccess: () => {
        toast.dismiss(loadingToastId);
        toastAlert.success({
            title: "Inscription réussie",
            description: "Votre compte a été créé avec succès !",
            duration: 3000,
        });
        //handleClick();
        verifyEmail(email)
      },
      onError: (ctx) => {
        if (ctx.error.message === "Email already exists") {
          toastAlert.error({
            title: "Erreur d'inscription",
            description: "Cet email est déjà utilisé.",
            duration: 3000,
          });

          // form.setError("email", {
          //   type: "manual",
          //   message: ctx.error.message,
          // })
        }
      },
    });
    setIsLoading(false)
  }

  return (
      <div className="register-container flex min-h-screen  overflow-hidden">


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
                socialButtons={false}
                forgotPasswordLink={false}
            />
          </div>
        </motion.div>

        <SideImageForm
            setCurrentQuote={setCurrentQuote}
            backgroundImage={'url("/auth/register.png")'}
            motivationalQuotes={motivationalQuotes}
            currentQuote={currentQuote}
        />
      </div>
  )
}