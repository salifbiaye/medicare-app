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
            key="medical-ready-step"
            className="h-full w-full bg-muted dark:bg-background flex flex-col"
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
        >
            <div className="flex flex-col lg:flex-row h-full">
                {/* Section médicale */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative order-2 lg:order-1 bg-muted dark:bg-background">
                    <motion.div
                        className="w-full max-w-md space-y-8"
                        initial="hidden"
                        animate="visible"
                        variants={contentVariants}
                        custom={0}
                    >
                        <div>
                            <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                                Prêt pour Votre Consultation
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Votre espace médical personnalisé vous attend.
                            </p>
                        </div>

                        <div className="space-y-6 mt-8">
                            <FeatureItem
                                custom={1}
                                icon="checkCircle"
                                title="Profil Médical Complet"
                                description="Vos informations de santé sont sécurisées et prêtes à l'emploi."
                            />

                            <FeatureItem
                                custom={2}
                                icon="clipboard"
                                title="Dossier Créé"
                                description="Accédez à votre historique médical et vos derniers examens."
                            />

                            <FeatureItem
                                custom={3}
                                icon="chart"
                                title="Prendre RDV"
                                description="Planifiez votre prochaine consultation en quelques clics."
                            />
                        </div>

                        <motion.div className="flex space-x-4 pt-8" variants={contentVariants} custom={4}>
                            <Button
                                onClick={goToPrevStep}
                                variant="outline"
                                className="w-1/3 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 h-14 rounded-lg"
                            >
                                <ChevronLeft className="mr-2 h-5 w-5" />
                                Retour
                            </Button>

                            <Button
                                onClick={onComplete}
                                className="w-2/3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white h-14 rounded-lg font-medium transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
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
                                    Accéder au Tableau de Bord
                                    <ArrowRight className="ml-2 h-5 w-5 opacity-70" />
                                </motion.span>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Section image médicale */}
                <div className="relative w-full lg:w-1/2 h-[40vh] lg:h-full overflow-hidden order-1 lg:order-2">
                    <motion.div
                        className="absolute rounded-[40px] m-4 inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage:'url("/onboarding/medicament.png")',
                        }}
                        initial={{y: 200, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        transition={{type: "spring", stiffness: 100}}
                    >
                        <Particles />
                    </motion.div>


                    <motion.div
                        className="absolute bottom-0 right-0 p-8 lg:p-16 max-w-lg"
                        initial="hidden"
                        animate="visible"
                        variants={contentVariants}
                        custom={1}
                    >
                        <div className="backdrop-blur-sm bg-black/30 p-6 rounded-xl border border-white/10 shadow-lg">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                                <h3 className="text-xl font-semibold text-white">Consultation Sécurisée</h3>
                            </div>
                            <p className="text-zinc-300">
                                Votre dossier médical est prêt. Accédez à vos documents et résultats d'analyses en toute sécurité.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}