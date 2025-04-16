import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ArrowRight } from "lucide-react";
import Particles from "@/components/ui/particles";
import { contentVariants } from "@/lib/animation-variants";
import FeatureItem from "./feature-item";

interface ReadyToStartStepProps {
    gender: "male" | "female" | null;
    goToPrevStep: () => void;
    onComplete: () => void;
    direction: number;
    pageVariants: any;
}

export default function ReadyToStartStep({
                                             gender,
                                             goToPrevStep,
                                             onComplete,
                                             direction,
                                             pageVariants,
                                         }: ReadyToStartStepProps) {
    return (
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
                            <FeatureItem
                                custom={1}
                                icon="check"
                                title="Profile Configured"
                                description="Your personal profile has been set up based on your selections."
                            />

                            <FeatureItem
                                custom={2}
                                icon="clipboard"
                                title="Program Created"
                                description="Your personalized training program is ready and waiting for you."
                            />

                            <FeatureItem
                                custom={3}
                                icon="clock"
                                title="Start Now"
                                description="Access your dashboard to begin your transformation journey today."
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
                                onClick={onComplete}
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
        </motion.div>
    );
}
