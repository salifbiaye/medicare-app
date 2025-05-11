// LoginPage.tsx
"use client"

import { useState } from "react"

import { z } from "zod"
import {ArrowLeft, Syringe} from 'lucide-react';
import SideImageForm from "@/features/auth/side-image-form"
import { AuthForm } from "@/features/auth/auth-form"
import {toastAlert} from "@/components/ui/sonner-v2";
import {authClient} from "@/lib/authClient";
import {toast} from "sonner";
import {verifyEmailAction} from "@/actions/auth.action";
import {redirect} from "next/navigation";
import { motion } from "framer-motion";
import {ModeToggle} from "@/components/mode-toggle";
import Link from "next/link";

// Schéma Zod pour le formulaire de connexion
const loginSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
})

// Type déduit du schéma
type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
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
    redirect("/verify-email?email=" + email + "&type=email-verification" + "&message=A verification email has been sent to your address. Please check your inbox." + "&error=" + error?.message || "")
  }
  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    const { email, password } = values;

    // Affiche le toast de chargement
    const loadingToastId = toastAlert.loading({
      title: "Logging in...",
      description: "Please wait while we verify your credentials.",
      duration: Infinity,
    });
    const result = await verifyEmailAction(email)
    if (result.error) {
      toast.dismiss(loadingToastId)
      toastAlert.error({
        title: "Verification error",
        description: result.error,
        duration: 5000,
      })
      if(result.error === "Email non vérifié") {
        verifyEmail(email)
      }
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
          title: "Login successful",
          description: "You are now logged into your patient.",
          duration: 4000,
        });
        redirect("/dashboard");

      },
      onError: (ctx) => {
        // Supprimer le toast de chargement en cas d'erreur
        toast.dismiss(loadingToastId);

        if(ctx.error.message === "Invalid email or password") {
          toastAlert.error({
            title: "Login error",
            description: "Incorrect email or password.",
            duration: 3000,
          });
        } else {
          toast.dismiss(loadingToastId)
          toastAlert.error({
            title: "Login error",
            description: "An error occurred during login. Please try again.",
            duration: 3000,
          });
        }
      },
    });

    setIsLoading(false);
  }

  return (
      <div className="login-container flex min-h-screen bg-background overflow-hidden">


        <motion.div initial={{y: 200, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{type: "spring", stiffness: 100}}
                    className="w-full relative  lg:w-1/2 flex items-center justify-center p-8">
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
        </motion.div>


        <SideImageForm
            setCurrentQuote={setCurrentQuote}
            backgroundImage={'url("/auth/login.png")'}
            motivationalQuotes={motivationalQuotes}
            currentQuote={currentQuote}
        />
      </div>
  )
}