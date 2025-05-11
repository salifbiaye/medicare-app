import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Particles from "@/components/ui/particles";
import { contentVariants } from "@/lib/animation-variants";
import { GenderCard } from "@/features/auth/onboarding/gender-card";

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
            key="medical-gender-step"
            className="h-full  w-full flex flex-col"
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
        >
            <div className="flex flex-col bg-muted dark:bg-background lg:flex-row h-full">
                {/* Section médicale illustrative */}
                <div className="relative w-full lg:w-1/2 h-[40vh] lg:h-full overflow-hidden">
                    <motion.div
                        className="absolute rounded-[40px] m-4 inset-0 bg-cover bg-center"
                        style={{backgroundImage: 'url("/onboarding/homme_femme.png")'}}
                        initial={{y: 200, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        transition={{type: "spring", stiffness: 100}}
                    >
                        <Particles/>
                        <div
                            className="quote-container absolute bottom-0 m-10 bg-black/20 p-6 rounded-xl border border-white/10 shadow-glow transition-all duration-500"
                        >
                            <p className="text-2xl text-gray-200  font-bold mb-3 leading-tight"> Cette information nous permet
                                d'adapter
                                vos diagnostics et traitements selon les
                                recommandations spécifiques à chaque genre.</p>
                            <p className="text-lg text-gray-300 flex items-center">
                                <span className="inline-block w-10 h-[1px] bg-gray-400 mr-3"></span>

                            </p>
                        </div>
                    </motion.div>


                </div>

                {/* Section de sélection */}
                <div
                    className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative bg-white dark:bg-background">
                    <motion.div
                        className="w-full max-w-md space-y-10"
                        initial="hidden"
                        animate="visible"
                        variants={contentVariants}
                        custom={1}
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                            Sélectionnez Votre Genre
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Essentiel pour personnaliser votre suivi médical et vos analyses biologiques.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <GenderCard
                                type="male"
                                selected={gender === "male"}
                                onSelect={() => setGender("male")}
                                imageUrl="/onboarding/male.png"
                            />

                            <GenderCard
                                type="female"
                                selected={gender === "female"}
                                onSelect={() => setGender("female")}
                                imageUrl="/onboarding/female.png"
                            />
                        </div>

                        <motion.div
                            className="pt-8"
                            initial="hidden"
                            animate="visible"
                            variants={contentVariants}
                            custom={2}
                        >
                            <Button
                                onClick={goToNextStep}
                                disabled={!gender}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white h-14 rounded-lg font-medium transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                            >
                                <span className="flex items-center justify-center">
                                    Continuer vers le dossier médical
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