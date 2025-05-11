"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function ParticlesBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { theme } = useTheme()

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
                this.color = theme === 'dark'
                    ? `rgba(${Math.floor(Math.random() * 50 + 100)}, ${Math.floor(Math.random() * 50 + 100)}, ${Math.floor(Math.random() * 155 + 100)}, ${Math.random() * 0.3 + 0.1})`
                    : `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.random() * 0.3 + 0.1})`
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
            particlesArray.length = 0 // Clear existing particles
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle())
            }
        }

        const animate = () => {
            if (!ctx) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Dégradé de fond basé sur le thème
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
            if (theme === 'dark') {
                gradient.addColorStop(0, "rgba(38,38,38,255)") // Couleur sombre
            } else {
                gradient.addColorStop(0, "rgba(74,85,101,255)") // Couleur claire
            }

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
    }, [theme]) // Ajoutez theme comme dépendance

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" style={{ height: "300px" }} />
}