"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Clock, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)

  // Pour éviter les problèmes d'hydratation avec le thème
  useEffect(() => {
    setMounted(true)
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }

  return (
      <div className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
        {/* Gradient background subtle */}
        <div className="absolute inset-0  dark:bg-background " />

        {/* SVG background elements with proper dark mode support */}
        <div className="absolute inset-0 overflow-hidden">
          <svg
              className="absolute right-0 top-0 h-[80%] w-[60%] text-primary/10 dark:text-muted/60 transition-colors duration-300"
              viewBox="0 0 600 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="400" cy="150" r="300" fill="currentColor" />
          </svg>
          <svg
              className="absolute -left-[10%] -bottom-[10%] h-[80%] w-[60%] text-primary/10 dark:text-muted/60 transition-colors duration-300"
              viewBox="0 0 600 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="200" cy="400" r="300" fill="currentColor" />
          </svg>

          {/* Animated wavy lines */}
          <svg
              className="absolute right-[15%] top-[10%] h-[70%] w-[50%] text-primary/20 dark:text-primary/10 opacity-70 transition-colors duration-300"
              viewBox="0 0 600 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
            <path
                d="M100,50 Q200,120 300,50 T500,50"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                fill="none">
              <animate
                  attributeName="stroke-dashoffset"
                  from="1000"
                  to="0"
                  dur="5s"
                  begin="0s"
                  fill="freeze"
                  repeatCount="1"
              />
            </path>
            <path
                d="M100,100 Q200,170 300,100 T500,100"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                fill="none">
              <animate
                  attributeName="stroke-dashoffset"
                  from="1000"
                  to="0"
                  dur="5s"
                  begin="0.5s"
                  fill="freeze"
                  repeatCount="1"
              />
            </path>
            <path
                d="M100,150 Q200,220 300,150 T500,150"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                fill="none">
              <animate
                  attributeName="stroke-dashoffset"
                  from="1000"
                  to="0"
                  dur="5s"
                  begin="1s"
                  fill="freeze"
                  repeatCount="1"
              />
            </path>
          </svg>
        </div>

        {/* Main content with proper spacing */}
        <div className="relative z-10 flex min-h-screen items-center">
          <div className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24 lg:px-12">
            <motion.div
                className="grid gap-12 md:grid-cols-2 lg:gap-16 items-center"
                variants={containerVariants}
                initial="hidden"
                animate={mounted ? "visible" : "hidden"}
            >
              {/* Left column - Text */}
              <div className="flex flex-col justify-center">
                <motion.div variants={itemVariants}>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                    <span className="block text-foreground">Soins médicaux</span>
                    <span className="block mt-2 text-primary">accessibles à tous</span>
                  </h1>
                </motion.div>

                <motion.p
                    variants={itemVariants}
                    className="mt-6 text-xl leading-8 text-muted-foreground"
                >
                  La plateforme qui connecte patients et professionnels de santé pour une médecine plus efficace et
                  personnalisée.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="mt-10 flex flex-wrap gap-4"
                >
                  <Button
                      asChild
                      size="lg"
                      className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-medium shadow-lg shadow-primary/20 dark:shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 dark:hover:shadow-primary/10 transition-all duration-300 border-0"
                  >
                    <Link href="#link" className="flex items-center">
                      <span>Prendre rendez-vous</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="rounded-full border-primary/20 dark:border-primary/30 bg-background/80 dark:bg-background/50 backdrop-blur-sm px-8 py-6 text-base font-medium text-primary hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary hover:border-primary/30 dark:hover:border-primary/40 transition-all duration-300"
                  >
                    <Link href="#link">
                      <span>Pour les professionnels</span>
                    </Link>
                  </Button>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                    variants={itemVariants}
                    className="mt-12 flex items-center gap-x-2 text-sm text-muted-foreground"
                >
                  <Check size={16} className="text-green-500" />
                  <span>Conforme RGPD</span>
                  <span className="mx-2 h-1 w-1 rounded-full bg-border"></span>
                  <Check size={16} className="text-green-500" />
                  <span>Données chiffrées</span>
                  <span className="mx-2 h-1 w-1 rounded-full bg-border"></span>
                  <Check size={16} className="text-green-500" />
                  <span>Support 24/7</span>
                </motion.div>
              </div>

              {/* Right column - Card with video */}
              <motion.div
                  variants={itemVariants}
                  className="relative flex items-center justify-center"
              >
                <div className="absolute -inset-4 " />
                <div className="relative w-full dark:bg-zinc-900 overflow-hidden rounded-2xl bg-card text-card-foreground p-6 shadow-xl shadow-primary/10 dark:shadow-primary/5   backdrop-blur">
                  {/* Card content */}
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center">
                      <span className="text-primary">Médecine</span>
                      <span className="ml-2">moderne</span>
                    </h2>

                    <p className="text-muted-foreground">Une approche centrée sur le patient pour des soins de qualité</p>

                    {/* Video with enhanced container */}
                    <div className="relative aspect-video overflow-hidden rounded-lg border border-border shadow-sm">
                      <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="h-full w-full  object-cover"
                          src="https://ik.imagekit.io/lrigu76hy/tailark/dna-video.mp4?updatedAt=1745736251477"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>

                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
  )
}