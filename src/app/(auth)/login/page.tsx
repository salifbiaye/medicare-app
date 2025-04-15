"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dumbbell, Loader2, ArrowRight } from 'lucide-react'

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

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)
  const router = useRouter()

  // Refs pour les éléments
  const particlesRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Citations motivantes
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

  // Rotation des citations
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length)
    }, 5000)

    return () => clearInterval(quoteInterval)
  }, [motivationalQuotes.length])

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simuler une connexion
    setTimeout(() => {
      console.log({ email, password, rememberMe })
      setIsLoading(false)
      router.push("/dashboard")
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
              style={{ backgroundImage: 'url("/auth/login.png")' }}
          >
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 z-0"></div>
          </div>

          {/* Section des citations motivantes */}
          <div className="absolute bottom-0 left-0 right-0 p-10 text-white z-20">
            <div
                className="quote-container backdrop-blur-sm bg-black/20 p-6 rounded-xl border border-white/10 shadow-glow transition-all duration-500"
            >
              <p className="text-2xl font-bold mb-3 leading-tight">"{motivationalQuotes[currentQuote].text}"</p>
              <p className="text-lg text-gray-300 flex items-center">
                <span className="inline-block w-10 h-[1px] bg-gray-400 mr-3"></span>
                {motivationalQuotes[currentQuote].author}
              </p>
            </div>

            <div className="flex mt-6 space-x-2">
              {motivationalQuotes.map((_, index) => (
                  <div
                      key={index}
                      className={`h-1 rounded-full transition-all duration-500 ${
                          index === currentQuote ? "w-10 bg-white shadow-glow" : "w-2 bg-gray-500/50"
                      }`}
                  />
              ))}
            </div>
          </div>

          {/* Badge flottant */}
          <div className="absolute top-10 right-10 z-20 animate-float">
            <div className="backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20 shadow-glow flex items-center">
              <Dumbbell className="h-4 w-4 mr-2 text-gray-300" />
              <span className="text-white font-medium">Premium Experience</span>
            </div>
          </div>
        </div>

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

              <div className="space-y-2 form-field">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Mot de passe
                  </Label>
                  <Link
                      href="/forgot-password"
                      className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-300"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-zinc-900/80 border-zinc-800 focus:border-gray-500 pl-4 h-12 rounded-lg transition-all duration-300 focus:shadow-input"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 form-field">
                <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                    className="border-zinc-700 data-[state=checked]:bg-gray-500 data-[state=checked]:border-gray-500"
                />
                <Label htmlFor="remember" className="text-sm font-normal text-gray-400">
                  Se souvenir de moi
                </Label>
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
                        Connexion en cours...
                      </>
                  ) : (
                      <span className="flex items-center justify-center">
                    Se connecter
                    <ArrowRight className="ml-2 h-5 w-5 opacity-70 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-black text-zinc-400">Ou continuer avec</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 social-buttons">
                <Button
                    variant="outline"
                    className="w-full border-zinc-800 hover:bg-zinc-900 transition-all duration-300 h-12 rounded-lg group"
                >
                  <svg
                      className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                      viewBox="0 0 24 24"
                  >
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                  </svg>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">Google</span>
                </Button>
                <Button
                    variant="outline"
                    className="w-full border-zinc-800 hover:bg-zinc-900 transition-all duration-300 h-12 rounded-lg group"
                >
                  <svg
                      className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">Facebook</span>
                </Button>
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-sm text-zinc-400">
                Vous n'avez pas de compte ?{" "}
                <Link
                    href="/register"
                    className="text-gray-500 hover:text-gray-300 transition-colors duration-300 relative inline-block group"
                >
                  <span>Créer un compte</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  )
}
