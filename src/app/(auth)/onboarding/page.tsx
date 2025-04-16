"use client"

import React, { useState, } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import { Dumbbell } from "lucide-react"
import { pageVariants } from "@/lib/animation-variants"
import GenderSelectionStep from "@/features/auth/onboarding/gender-selection-step";
import TrainingProgramStep from "@/features/auth/onboarding/training-program-step";
import ReadyToStartStep from "@/features/auth/onboarding/ready-to-start-step";
import {completeProfileAction} from "@/actions/auth.action";
import {toastAlert} from "@/components/ui/sonner-v2";

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0)
    const [gender, setGender] = useState<"male" | "female">("male")
    const [direction, setDirection] = useState(0) // -1 for left, 1 for right
    const router = useRouter()




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

    const handleComplete = async () => {
        const result = await completeProfileAction(gender)
        if (result.error) {

            toastAlert.error({
                title: "Error",
                description: result.error,
                duration: 2000,
            });

            return
        }
        router.push("/dashboard")
    }

    // Define steps content
    const steps = [
        <GenderSelectionStep
            key="gender-selection"
            gender={gender}
            setGender={setGender}
            goToNextStep={goToNextStep}
            direction={direction}
            pageVariants={pageVariants}
        />,
        <TrainingProgramStep
            key="training-program"
            gender={gender}
            goToPrevStep={goToPrevStep}
            goToNextStep={goToNextStep}
            direction={direction}
            pageVariants={pageVariants}
        />,
        <ReadyToStartStep
            key="ready-to-start"
            gender={gender}
            goToPrevStep={goToPrevStep}
            onComplete={handleComplete}
            direction={direction}
            pageVariants={pageVariants}
        />,
    ]

    return (
        <div className="h-screen bg-black overflow-hidden">


            {/* Grid pattern */}
            <div className="fixed inset-0 grid-pattern opacity-10 z-0"></div>

            {/* Logo */}
            <div className="absolute top-6 left-3/4 animate-float z-50">
                <div className="backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20 shadow-glow flex items-center">
                    <Dumbbell className="h-4 w-4 mr-2 text-gray-300" />
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