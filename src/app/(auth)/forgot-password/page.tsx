"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dumbbell, Loader2, ArrowRight } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

// Type pour les particules
interface ParticleProps {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  update: () => void
  draw: (ctx: CanvasRenderingContext2D) => void
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Refs pour les éléments
  const particlesRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Génération des particules
  useEffect(() => {
    const canvas = particlesRef.current
    if (!canvas || typeof window === "undefined") return

    // Récupérer le contexte du canvas
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ajuster la taille du canvas
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Configuration des particules
    const particlesArray: ParticleProps[] = []
    const numberOfParticles = 50

    class Particle implements ParticleProps {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 1 - 0.5
        this.speedY = Math.random() * 1 - 0.5
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.3})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const init = () => {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle())
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw(ctx)
      }
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    init()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simuler l'envoi d'email
    setTimeout(() => {
      console.log({ email })
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1500)
  }

  return (
      <div className="login-container flex min-h-screen bg-black overflow-hidden">
        {/* Partie image (côté droit) */}
        <div className="hidden rounded-tr-[40px] rounded-br-[40px] lg:block lg:w-1/2 relative bg-zinc-900 overflow-hidden">
          {/* Effet de particules */}
          <canvas ref={particlesRef} className="absolute inset-0 z-10 opacity-40 w-full h-full"></canvas>

          {/* Motif de grille */}
          <div className="absolute inset-0 grid-pattern opacity-10 z-0"></div>

          {/* Image de fond */}
          <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
              style={{ backgroundImage: 'url("/auth/forgot-password.png")' }}
          >
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 z-0"></div>
          </div>

          {/* Section de texte */}
          <div className="absolute bottom-0 left-0 right-0 p-10 text-white z-20">
            <div className="backdrop-blur-sm bg-black/20 p-6 rounded-xl border border-white/10 shadow-glow">
              <h1 className="text-3xl font-bold mb-4">Réinitialisation du mot de passe</h1>
              <p className="text-lg text-gray-300">
                Nous allons vous envoyer un lien sécurisé pour réinitialiser votre mot de passe et retrouver l'accès à votre compte.
              </p>
            </div>
          </div>

          {/* Badge flottant */}
          <div className="absolute top-10 right-10 z-20 animate-float">
            <div className="backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20 shadow-glow flex items-center">
              <Dumbbell className="h-4 w-4 mr-2 text-gray-300" />
              <span className="text-white font-medium">new life style</span>
            </div>
          </div>
        </div>

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

            {isSubmitted ? (
                <Alert className="bg-emerald-900/30 border-emerald-800 backdrop-blur-sm">
                  <AlertDescription className="text-emerald-100">
                    Si un compte existe avec l'adresse <span className="font-semibold">{email}</span>, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
                  </AlertDescription>
                </Alert>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2 form-field">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                      Email
                    </Label>
                    <div className="relative">
                      <Input
                          id="email"
                          type="email"
                          placeholder="exemple@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-zinc-900/80 border-zinc-800 focus:border-gray-500 pl-4 h-12 rounded-lg transition-all duration-300 focus:shadow-input"
                      />
                    </div>
                  </div>

                  <div>
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 text-white h-12 rounded-lg font-medium transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] shadow-button"
                        disabled={isLoading}
                    >
                      {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Envoi en cours...
                          </>
                      ) : (
                          <span className="flex items-center justify-center">
                      Envoyer les instructions
                      <ArrowRight className="ml-2 h-5 w-5 opacity-70 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                      )}
                    </Button>
                  </div>
                </form>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-zinc-400">
                <Link
                    href="/login"
                    className="text-gray-500 hover:text-gray-300 transition-colors duration-300 relative inline-block group"
                >
                  <span>Retour à la connexion</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  )
}