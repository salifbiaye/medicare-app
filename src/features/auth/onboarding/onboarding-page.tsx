"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dumbbell, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Particles from "@/components/ui/particles";


// Type for particles


export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0)
    const [gender, setGender] = useState<"male" | "female" | null>(null)
    const [direction, setDirection] = useState(0) // -1 for left, 1 for right
    const router = useRouter()

    const particlesRef = useRef<HTMLCanvasElement>(null)
    const animationFrameRef = useRef<number | null>(null)

    // Generate particles
    useEffect(() => {
        const canvas = particlesRef.current
        if (!canvas || typeof window === "undefined") return

        // Get canvas context
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Adjust canvas size
        const resizeCanvas = () => {
            if (canvas) {
                canvas.width = canvas.offsetWidth
                canvas.height = canvas.offsetHeight
            }
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        // Configure particles



        return () => {
            window.removeEventListener("resize", resizeCanvas)
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
                animationFrameRef.current = null
            }
        }
    }, [])

    // Navigation between steps
    const goToNextStep = () => {
        if (currentStep < 2) {
            setDirection(1)
            setCurrentStep((prev) => prev + 1)
        } else {
            router.push("/dashboard")
        }
    }

    const goToPrevStep = () => {
        if (currentStep > 0) {
            setDirection(-1)
            setCurrentStep((prev) => prev - 1)
        }
    }


    // Animation variants
    const pageVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
            },
        },
        exit: (direction: number) => ({
            x: direction > 0 ? "-100%" : "100%",
            opacity: 0,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
            },
        }),
    }

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (custom: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: custom * 0.2,
                duration: 0.8,
                ease: [0.04, 0.62, 0.23, 0.98],
            },
        }),
    }

    // Step content
    const steps = [
        // Step 1: Gender Selection
        <motion.div
            key="step-1"
            className="h-full w-full flex flex-col"
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
        >
            <div className="flex flex-col lg:flex-row h-full">
                {/* Main image section */}
                <div className="relative w-full lg:w-1/2 h-[40vh] lg:h-full overflow-hidden">
                    <motion.div
                        className="absolute  rounded-tr-[40px] rounded-br-[40px] inset-0 bg-cover bg-center"
                        style={{ backgroundImage: 'url("/auth/gender_selection.png")' }}
                        initial={{ scale: 1.1, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        <Particles/>
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

                    <motion.div
                        className="absolute inset-0 flex flex-col justify-center items-start p-8 lg:p-16"
                        initial="hidden"
                        animate="visible"
                        variants={contentVariants}
                        custom={0}
                    >
                        <h1 className="text-3xl lg:text-5xl font-bold mb-4 text-white max-w-xl leading-tight">
                            Begin Your <span className="text-gray-300">Transformation</span> Journey
                        </h1>
                        <p className="text-lg text-zinc-300 max-w-xl mb-8">
                            We&apos;ll create a personalized fitness program tailored to your unique needs and goals.
                        </p>
                    </motion.div>
                </div>

                {/* Selection section */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative">
                    <motion.div
                        className="w-full max-w-md space-y-10"
                        initial="hidden"
                        animate="visible"
                        variants={contentVariants}
                        custom={1}
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-3">Select Your Profile</h2>
                            <p className="text-zinc-400">This helps us customize your training experience</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <motion.div
                                onClick={() => setGender("male")}
                                className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer group ${
                                    gender === "male" ? "border-gray-300 shadow-glow" : "border-zinc-800 hover:border-zinc-600"
                                }`}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="aspect-square relative">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                        style={{ backgroundImage: 'url("/auth/male-training.png")' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center items-center">
                  <span
                      className={`text-lg font-medium transition-all duration-300 ${
                          gender === "male" ? "text-white" : "text-zinc-400 group-hover:text-white"
                      }`}
                  >
                    Male
                  </span>
                                </div>
                                {gender === "male" && (
                                    <motion.div
                                        className="absolute top-3 right-3 h-6 w-6 rounded-full bg-white flex items-center justify-center"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 text-black"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </motion.div>
                                )}
                            </motion.div>

                            <motion.div
                                onClick={() => setGender("female")}
                                className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer group ${
                                    gender === "female" ? "border-gray-300 shadow-glow" : "border-zinc-800 hover:border-zinc-600"
                                }`}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="aspect-square relative">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                        style={{ backgroundImage: 'url("/auth/female-training.png")' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center items-center">
                  <span
                      className={`text-lg font-medium transition-all duration-300 ${
                          gender === "female" ? "text-white" : "text-zinc-400 group-hover:text-white"
                      }`}
                  >
                    Female
                  </span>
                                </div>
                                {gender === "female" && (
                                    <motion.div
                                        className="absolute top-3 right-3 h-6 w-6 rounded-full bg-white flex items-center justify-center"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 text-black"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>

                        <motion.div className="pt-8" initial="hidden" animate="visible" variants={contentVariants} custom={2}>
                            <Button
                                onClick={goToNextStep}
                                disabled={!gender}
                                className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white h-14 rounded-lg font-medium transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] shadow-button disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                            >
                <span className="flex items-center justify-center">
                  Continue
                  <ChevronRight className="ml-2 h-5 w-5" />
                </span>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.div>,

        // Step 2: Training Program
        <motion.div
            key="step-2"
            className="h-full w-full flex flex-col"
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
        >
            <div className="flex flex-col lg:flex-row h-full">
                {/* Content section */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative order-2 lg:order-1">
                    <motion.div
                        className="w-full max-w-md space-y-8"
                        initial="hidden"
                        animate="visible"
                        variants={contentVariants}
                        custom={0}
                    >
                        <div>
                            <h2 className="text-3xl font-bold mb-3">Your Training Journey</h2>
                            <p className="text-zinc-400 text-lg">Surpass your limits with a program designed specifically for you.</p>
                        </div>

                        <div className="space-y-6 mt-8">
                            <motion.div className="flex items-start gap-4 group" variants={contentVariants} custom={1}>
                                <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mt-0.5 group-hover:bg-gray-700 transition-colors duration-300">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-xl font-medium text-white mb-2">Tailored Exercises</h4>
                                    <p className="text-zinc-400">
                                        Specifically selected for your body type and goals, ensuring optimal results.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div className="flex items-start gap-4 group" variants={contentVariants} custom={2}>
                                <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mt-0.5 group-hover:bg-gray-700 transition-colors duration-300">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-xl font-medium text-white mb-2">Intelligent Progression</h4>
                                    <p className="text-zinc-400">
                                        Automatic evolution based on your performance and progress, keeping you challenged.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div className="flex items-start gap-4 group" variants={contentVariants} custom={3}>
                                <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mt-0.5 group-hover:bg-gray-700 transition-colors duration-300">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-xl font-medium text-white mb-2">Detailed Tracking</h4>
                                    <p className="text-zinc-400">
                                        Visualize your results and track your evolution with precise statistics and insights.
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div className="flex space-x-4 pt-8" variants={contentVariants} custom={4}>
                            <Button
                                onClick={goToPrevStep}
                                variant="outline"
                                className="w-1/3 border-zinc-800 hover:bg-zinc-900 transition-all duration-300 h-14 rounded-lg"
                            >
                                <ChevronLeft className="mr-2 h-5 w-5" />
                                Back
                            </Button>

                            <Button
                                onClick={goToNextStep}
                                className="w-2/3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white h-14 rounded-lg font-medium transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] shadow-button"
                            >
                <span className="flex items-center justify-center">
                  Continue
                  <ChevronRight className="ml-2 h-5 w-5" />
                </span>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Image section */}
                <div className="relative w-full lg:w-1/2 h-[40vh] lg:h-full overflow-hidden order-1 lg:order-2">
                    <motion.div
                        className="absolute rounded-tl-[40px] rounded-bl-[40px] inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage:
                                gender === "female" ? 'url("/auth/female-training.png")' : 'url("/auth/male-training.png")',
                        }}
                        initial={{ scale: 1.1, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        <Particles/>
                    </motion.div>

                    <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/60 to-transparent" />

                    <motion.div
                        className="absolute bottom-0 right-0 p-8 lg:p-16 max-w-lg"
                        initial="hidden"
                        animate="visible"
                        variants={contentVariants}
                        custom={1}
                    >
                        <div className="backdrop-blur-sm bg-black/30 p-6 rounded-xl border border-white/10 shadow-glow">
                            <h3 className="text-xl font-semibold text-white mb-3">Personalized Program</h3>
                            <p className="text-zinc-300">
                                Our advanced algorithm creates a training program adapted to your goals, level, and personal
                                constraints.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>,

        // Step 3: Ready to Start
        <motion.div
            key="step-3"
            className="h-full w-full flex flex-col"
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
        >
            <div className="flex flex-col lg:flex-row h-full">
                {/* Content section */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative order-2 lg:order-1">
                    <motion.div
                        className="w-full max-w-md space-y-8"
                        initial="hidden"
                        animate="visible"
                        variants={contentVariants}
                        custom={0}
                    >
                        <div>
                            <h2 className="text-3xl font-bold mb-3">Ready to Begin</h2>
                            <p className="text-zinc-400 text-lg">Your personalized fitness journey awaits you.</p>
                        </div>

                        <div className="space-y-6 mt-8">
                            <motion.div className="flex items-start gap-4 group" variants={contentVariants} custom={1}>
                                <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mt-0.5 group-hover:bg-gray-700 transition-colors duration-300">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-xl font-medium text-white mb-2">Profile Configured</h4>
                                    <p className="text-zinc-400">Your personal profile has been set up based on your selections.</p>
                                </div>
                            </motion.div>

                            <motion.div className="flex items-start gap-4 group" variants={contentVariants} custom={2}>
                                <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mt-0.5 group-hover:bg-gray-700 transition-colors duration-300">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-xl font-medium text-white mb-2">Program Created</h4>
                                    <p className="text-zinc-400">Your personalized training program is ready and waiting for you.</p>
                                </div>
                            </motion.div>

                            <motion.div className="flex items-start gap-4 group" variants={contentVariants} custom={3}>
                                <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mt-0.5 group-hover:bg-gray-700 transition-colors duration-300">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-xl font-medium text-white mb-2">Start Now</h4>
                                    <p className="text-zinc-400">Access your dashboard to begin your transformation journey today.</p>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div className="flex space-x-4 pt-8" variants={contentVariants} custom={4}>
                            <Button
                                onClick={goToPrevStep}
                                variant="outline"
                                className="w-1/3 border-zinc-800 hover:bg-zinc-900 transition-all duration-300 h-14 rounded-lg"
                            >
                                <ChevronLeft className="mr-2 h-5 w-5" />
                                Back
                            </Button>

                            <Button
                                onClick={() => router.push("/dashboard")}
                                className="w-2/3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white h-14 rounded-lg font-medium transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] shadow-button"
                            >
                                <motion.span
                                    className="flex items-center justify-center"
                                    initial={{ x: 0 }}
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatType: "loop",
                                        ease: "easeInOut",
                                    }}
                                >
                                    Access Dashboard
                                    <ArrowRight className="ml-2 h-5 w-5 opacity-70" />
                                </motion.span>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Image section */}
                <div className="relative w-full lg:w-1/2 h-[40vh] lg:h-full overflow-hidden order-1 lg:order-2">
                    <motion.div
                        className="absolute rounded-tl-[40px] rounded-bl-[40px] inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage:
                                gender === "female" ? 'url("/auth/female_altere.png")' : 'url("/auth/male_altere.png")',
                        }}
                        initial={{ scale: 1.1, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        <Particles/>
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/60 to-transparent" />

                    <motion.div
                        className="absolute bottom-0 right-0 p-8 lg:p-16 max-w-lg"
                        initial="hidden"
                        animate="visible"
                        variants={contentVariants}
                        custom={1}
                    >
                        <div className="backdrop-blur-sm bg-black/30 p-6 rounded-xl border border-white/10 shadow-glow">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                                <h3 className="text-xl font-semibold text-white">Ready to Transform</h3>
                            </div>
                            <p className="text-zinc-300">
                                Your journey to a better you starts now. Access your dashboard to view your personalized program.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>,
    ]

    return (
        <div className="h-screen bg-black overflow-hidden">
            {/* Particles effect */}
            <canvas ref={particlesRef} className="fixed inset-0 z-0 opacity-40 w-full h-full"></canvas>

            {/* Grid pattern */}
            <div className="fixed inset-0 grid-pattern opacity-10 z-0"></div>

            {/* Logo */}

            <div className="absolute top-6 left-3/4 animate-float  z-50">
                <div
                    className="backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20 shadow-glow flex items-center">
                    <Dumbbell className="h-4 w-4 mr-2 text-gray-300"/>
                    <span className="text-white font-medium">ShadowFit</span>
                </div>
            </div>
            {/* Step indicators */}
            <div className="absolute top-8 right-8 z-50 flex space-x-2">
                {[0, 1, 2].map((index) => (
                    <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                            index === currentStep ? "w-10 bg-white shadow-glow" : "w-2 bg-gray-500/50"
                        }`}
                    />
                ))}
            </div>

            {/* Main content with AnimatePresence for smooth transitions */}
            <div className="h-full">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    {steps[currentStep]}
                </AnimatePresence>
            </div>
        </div>
    )
}
