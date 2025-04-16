import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Particles from "@/components/ui/particles";
import { contentVariants } from "@/lib/animation-variants";
import {GenderCard} from "@/features/auth/onboarding/gender-card";

interface GenderSelectionStepProps {
    gender: "male" | "female" | null;
    setGender: (gender: "male" | "female") => void;
    goToNextStep: () => void;
    direction: number;
    pageVariants: any;
}

export default function GenderSelectionStep({
                                                gender,
                                                setGender,
                                                goToNextStep,
                                                direction,
                                                pageVariants,
                                            }: GenderSelectionStepProps) {
    return (
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
                        className="absolute rounded-tr-[40px] rounded-br-[40px] inset-0 bg-cover bg-center"
                        style={{ backgroundImage: 'url("/auth/gender_selection.png")' }}
                        initial={{ scale: 1.1, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        <Particles />
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
                            <GenderCard
                                type="male"
                                selected={gender === "male"}
                                onSelect={() => setGender("male")}
                                imageUrl="/auth/male-training.png"
                            />

                            <GenderCard
                                type="female"
                                selected={gender === "female"}
                                onSelect={() => setGender("female")}
                                imageUrl="/auth/female-training.png"
                            />
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
        </motion.div>
    );
}