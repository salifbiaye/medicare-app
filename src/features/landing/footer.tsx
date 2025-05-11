"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"
import { motion } from "framer-motion"

export function Footer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Animation de particules pour le fond
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = 300
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Configuration des particules
    const particlesArray: any[] = []
    const numberOfParticles = 50

    class Particle {
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
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.color = `rgba(${Math.floor(Math.random() * 50 + 100)}, ${Math.floor(Math.random() * 50 + 100)}, ${Math.floor(Math.random() * 155 + 100)}, ${Math.random() * 0.3 + 0.1})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        else if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        else if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
      }
    }

    const init = () => {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle())
      }
    }

    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Dégradé de fond
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.05)")
      gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.05)")
      gradient.addColorStop(1, "rgba(59, 130, 246, 0.05)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw()
      }
      requestAnimationFrame(animate)
    }

    init()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
      <footer className="relative overflow-hidden border-t border-gray-100 dark:border-gray-800">
        {/* Canvas pour l'animation de fond */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" style={{ height: "300px" }} />

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex flex-col items-center">
            {/* Logo animé */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-primary shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300">
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                    <Heart className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <span className="font-bold text-2xl bg-clip-text text-transparent bg-primary group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
                Medicare
              </span>
              </Link>
            </motion.div>

            {/* Tagline */}
            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center text-gray-600 dark:text-gray-400 max-w-xl mb-10"
            >
              Révolutionner les soins de santé au Sénégal grâce à des solutions innovantes de télémédecine accessibles à
              tous, partout.
            </motion.p>

            {/* Ligne décorative */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="w-24 h-1 bg-primary rounded-full mb-10"
            />

            {/* Réseaux sociaux */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex gap-6 mb-10"
            >
              {[
                {
                  icon: (
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                  ),
                  label: "Facebook",
                },
                {
                  icon: (
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                  ),
                  label: "Twitter",
                },
                {
                  icon: (
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                      </svg>
                  ),
                  label: "Instagram",
                },
                {
                  icon: (
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect width="4" height="12" x="2" y="9"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                  ),
                  label: "LinkedIn",
                },
              ].map((social, index) => (
                  <motion.a
                      key={index}
                      href="#"
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                      aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
              ))}
            </motion.div>

            {/* Copyright */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-center text-sm text-gray-500 dark:text-gray-400"
            >
              &copy; {new Date().getFullYear()} Medicare. Tous droits réservés.
            </motion.div>
          </div>
        </div>
      </footer>
  )
}
