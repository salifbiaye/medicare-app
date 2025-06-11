"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import { Syringe, User, HeartPulse } from "lucide-react"
import { pageVariants } from "@/lib/animation-variants"
import GenderSelectionStep from "@/features/auth/onboarding/gender-selection-step";
import ReadyToStartStep from "@/features/auth/onboarding/ready-to-start-step";
import { completeProfileAction } from "@/actions/auth.action";
import { toastAlert } from "@/components/ui/sonner-v2";
import { DataForm } from "@/components/data-form";
import { PatientOnboardingFormValues, patientOnboardingSchema } from "@/schemas/patient-onboarding.schema";
import { patientOnboardingFields } from "@/fields/patient-onboarding.field";
import { patientOnboardingGroups } from "@/groups/patient-onboarding.groups";
import { createPatientFromExistingUserAction } from "@/actions/patient.action";
import { getCurrentUserAction } from "@/actions/user.action";
import { User as UserType } from "@prisma/client";

// Define user interface with optional fields for safety
interface UserWithOptionalFields extends Partial<UserType> {
    id?: string;
    name?: string;
    email?: string;
    gender?: "MALE" | "FEMALE";
    profileCompleted?: boolean;
}

export default function OnboardingPage() {
    const [currentUser, setCurrentUser] = useState<UserWithOptionalFields | null>(null)
    const [currentStep, setCurrentStep] = useState(0)
    const [gender, setGender] = useState<"male" | "female">("male")
    const [direction, setDirection] = useState(0) // -1 for left, 1 for right
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingUser, setIsLoadingUser] = useState(true)
    const router = useRouter()

    // Fetch current user details
    useEffect(() => {
        async function fetchUserData() {
            setIsLoadingUser(true)
            try {
                const result = await getCurrentUserAction()
                if (result.success && result.data) {
                    setCurrentUser(result.data)
                    
                    // Set gender from user data if available
                    if (result.data.gender) {
                        setGender(result.data.gender === "MALE" ? "male" : "female")
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error)
            } finally {
                setIsLoadingUser(false)
            }
        }

        fetchUserData()
    }, [])

    // Navigation between steps
    const goToNextStep = () => {
        if (currentStep < 1) {
            setDirection(1)
            setCurrentStep((prev) => prev + 1)
        } else {
            handleCompleteGender()
        }
    }

    const goToPrevStep = () => {
        if (currentStep > 0) {
            setDirection(-1)
            setCurrentStep((prev) => prev - 1)
        }
    }

    // Handle gender selection completion and proceed to patient form
    const handleCompleteGender = async () => {
        setIsLoading(true)
        const result = await completeProfileAction(gender)
        setIsLoading(false)
        
        if (result.error) {
            toastAlert.error({
                title: "Error",
                description: result.error,
                duration: 2000,
            });
            return
        }
        
        // Update user in state with gender
        setCurrentUser((prev: UserWithOptionalFields | null) => ({
            ...prev,
            gender: gender === "male" ? "MALE" : "FEMALE",
            profileCompleted: true
        }))
        
        // Show patient form
        setCurrentStep(2)
    }

    // Handle patient data submission using the new action for existing users
    const handleSubmitPatientData = async (values: PatientOnboardingFormValues) => {
        setIsLoading(true)
        try {
            // Utiliser la nouvelle action pour les utilisateurs existants
            const result = await createPatientFromExistingUserAction(values)
            
            if (result.error) {
                toastAlert.error({
                    title: "Erreur",
                    description: result.error,
                    duration: 3000,
                });
                setIsLoading(false)
                return
            }
            
            toastAlert.success({
                title: "Succès",
                description: "Votre profil patient a été créé avec succès",
                duration: 2000,
            });
            
            // Redirect to dashboard
            router.push("/dashboard")
        } catch (error) {
            console.error("Error during patient creation:", error)
            toastAlert.error({
                title: "Erreur",
                description: "Une erreur est survenue lors de la création de votre profil",
                duration: 3000,
            });
        } finally {
            setIsLoading(false)
        }
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
        <ReadyToStartStep
            key="ready-to-start"
            gender={gender}
            goToPrevStep={goToPrevStep}
            onComplete={handleCompleteGender}
            direction={direction}
            pageVariants={pageVariants}
        />,
    ]

    // Prepare initial data for the patient form
    const getInitialData = (): Partial<PatientOnboardingFormValues> => {
        if (!currentUser) return { gender: gender === "male" ? "MALE" : "FEMALE" as "MALE" | "FEMALE" }
        
        return {
            name: currentUser.name || "",
            email: currentUser.email || "",
            gender: currentUser.gender || (gender === "male" ? "MALE" as const : "FEMALE" as const),
            role: "PATIENT" as const,
            emailVerified: true,
            profileCompleted: true
        }
    }

    // Show loading state
    if (isLoadingUser) {
        return (
            <div className="h-screen overflow-hidden flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <User className="h-10 w-10 text-primary mb-4" />
                    <p className="text-lg text-muted-foreground">Chargement de vos informations...</p>
                </div>
            </div>
        )
    }

    // Use dynamic import for DataForm to avoid type issues
    const renderPatientForm = () => {
        return (
            <div className="h-full overflow-auto px-4 py-12">
                <DataForm
                    schema={patientOnboardingSchema}
                    // @ts-ignore - The actual fields structure matches what DataForm expects
                    fields={patientOnboardingFields}
                    submitButtonText="Compléter mon profil patient"
                    isLoading={isLoading}
                    onSubmit={handleSubmitPatientData}
                    initialData={getInitialData()}
                    title="Complétez votre profil patient"
                    description="Veuillez compléter vos informations médicales pour accéder à tous les services Medicare"
                    layout="wizard"
                    theme="glassmorphism"
                    groups={patientOnboardingGroups}
                    showProgressBar={true}
                    iconHeader={<HeartPulse className="h-6 w-6 text-primary" />}
                    rounded="lg"
                    elevation="md"
                    animation="fade"
                />
            </div>
        )
    }

    return (
        <div className="h-screen overflow-hidden">
            {/* Logo */}
            <div className="absolute top-6 left-3/4 animate-float z-50">
                <div className="backdrop-blur-md bg-primary/10 px-4 py-2 rounded-full border border-white/20 shadow-glow flex items-center">
                    <Syringe className="h-4 w-4 mr-2 text-gray-300" />
                    <span className="text-primary font-medium">Medicare</span>
                </div>
            </div>

            {currentStep < 2 ? (
                <>
                    {/* Step indicators */}
                    <div className="absolute top-8 right-8 z-50 flex space-x-2">
                        {[0, 1].map((index) => (
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
                </>
            ) : (
                renderPatientForm()
            )}
        </div>
    )
}