import {Dumbbell, Syringe} from "lucide-react";
import React, {useEffect} from "react";
import Particles from "@/components/ui/particles";
import { motion } from "framer-motion";

export default function SideImageForm( {   backgroundImage , motivationalQuotes, currentQuote,setCurrentQuote } : {  backgroundImage: string , motivationalQuotes: { text: string, author: string }[], currentQuote: number  , setCurrentQuote: React.Dispatch<React.SetStateAction<number>> }) {
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
        }, 5000); // toutes les 6 secondes

        return () => clearInterval(interval); // nettoyage
    }, [motivationalQuotes.length]);
    return (
        <motion.div
            initial={{x: 200,opacity:0}}
            animate={{x: 0,opacity:1}}
            transition={{type: "spring", stiffness: 100}}
            className="hidden rounded-[40px] m-4 lg:block lg:w-1/2 relative  overflow-hidden">


            {/* Motif de grille */}

            <div className="absolute inset-0 grid-pattern opacity-10 z-0"></div>
            {/* Image de fond */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
                style={{backgroundImage: backgroundImage}}
            >
                <Particles/>
                {/* Overlay gradient */}
            </div>

            {/* Section des citations motivantes */}
            <div className="absolute bottom-0 left-0 right-0 p-10 text-white z-20">
                <div
                    className="quote-container bg-black/20 p-6 rounded-xl border border-white/10 shadow-glow transition-all duration-500"
                >
                    <p className="text-2xl font-bold mb-3 leading-tight">{motivationalQuotes[currentQuote].text}</p>
                    <p className="text-lg text-gray-300 flex items-center">
                        <span className="inline-block w-10 h-[1px] bg-gray-400 mr-3"></span>
                        {/*{motivationalQuotes[currentQuote].author}*/}
                    </p>
                </div>

                <div className="flex mt-6 space-x-2">
                    {motivationalQuotes.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1 rounded-full transition-all duration-500 ${
                                index === currentQuote ? "w-10 bg-white shadow-glow" : "w-2 bg-gray-500/50"
                            }`}
                        />
                    ))}
                </div>
            </div>


        </motion.div>
    );

}