"use client"

import { useEffect, useRef } from "react"

interface Particle {
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    color: string
}

export default function Particles() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particles = useRef<Particle[]>([])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
            initParticles()
        }

        // Augmenter le nombre de particules pour un effet plus dense
        const initParticles = () => {
            particles.current = []
            const particleCount = Math.floor((canvas.width * canvas.height) / 6000) // Augmenté de 10000 à 6000 pour plus de particules

            for (let i = 0; i < particleCount; i++) {
                particles.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    color: `rgba(${30 + Math.random() * 30}, ${100 + Math.random() * 50}, ${200 + Math.random() * 55}, ${0.3 + Math.random() * 0.4})`,
                })
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particles.current.forEach((particle) => {
                particle.x += particle.speedX
                particle.y += particle.speedY

                if (particle.x < 0 || particle.x > canvas.width) {
                    particle.speedX = -particle.speedX
                }

                if (particle.y < 0 || particle.y > canvas.height) {
                    particle.speedY = -particle.speedY
                }

                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                ctx.fillStyle = particle.color
                ctx.fill()
            })

            requestAnimationFrame(animate)
        }

        window.addEventListener("resize", resizeCanvas)
        resizeCanvas()
        animate()

        return () => {
            window.removeEventListener("resize", resizeCanvas)
        }
    }, [])

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 opacity-70" />
}
