import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Particles from "@/components/ui/particles";
import { contentVariants } from "@/lib/animation-variants";
import FeatureItem from "@/features/auth/onboarding/feature-item";

interface TrainingProgramStepProps {
    gender: "male" | "female" | null;
    goToPrevStep: () => void;
    goToNextStep: () => void;
    direction: number;
    pageVariants: any;
}

export default function TrainingProgramStep({
                                                gender,
                                                goToPrevStep,
                                                goToNextStep,
                                                direction,
                                                pageVariants,
                                            }: TrainingProgramStepProps) {
    return (
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
                            <FeatureItem
                                custom={1}
                                icon="checkCircle"
                                title="Tailored Exercises"
                                description="Specifically selected for your body type and goals, ensuring optimal results."
                            />

                            <FeatureItem
                                custom={2}
                                icon="chart"
                                title="Intelligent Progression"
                                description="Automatic evolution based on your performance and progress, keeping you challenged."
                            />

                            <FeatureItem
                                custom={3}
                                icon="stats"
                                title="Detailed Tracking"
                                description="Visualize your results and track your evolution with precise statistics and insights."
                            />
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
                                className="w-2/3  text-foreground h-14 rounded-lg font-medium transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] shadow-button"
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
                                gender === "female" ? 'url("/auth/female-director.png")' : 'url("/auth/male-director.png")',
                        }}
                        initial={{ scale: 1.1, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        <Particles />
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
        </motion.div>
    );
}