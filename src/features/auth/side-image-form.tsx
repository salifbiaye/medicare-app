import {Dumbbell} from "lucide-react";
import type React from "react";
import Particles from "@/components/ui/particles";

export default function SideImageForm( {   backgroundImage , motivationalQuotes, currentQuote } : {  backgroundImage: string , motivationalQuotes: { text: string, author: string }[], currentQuote: number }) {

    return (
        <div
            className="hidden rounded-tr-[40px] rounded-br-[40px] lg:block lg:w-1/2 relative bg-zinc-900 overflow-hidden">


            {/* Motif de grille */}
            <div className="absolute inset-0 grid-pattern opacity-10 z-0"></div>

            {/* Image de fond */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
                style={{backgroundImage: backgroundImage}}
            >
                <Particles/>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 z-0"></div>
            </div>

            {/* Section des citations motivantes */}
            <div className="absolute bottom-0 left-0 right-0 p-10 text-white z-20">
                <div
                    className="quote-container backdrop-blur-sm bg-black/20 p-6 rounded-xl border border-white/10 shadow-glow transition-all duration-500"
                >
                    <p className="text-2xl font-bold mb-3 leading-tight">&#34;{motivationalQuotes[currentQuote].text}&#34;</p>
                    <p className="text-lg text-gray-300 flex items-center">
                        <span className="inline-block w-10 h-[1px] bg-gray-400 mr-3"></span>
                        {motivationalQuotes[currentQuote].author}
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

            {/* Badge flottant */}
            <div className="absolute top-10 right-10 z-20 animate-float">
                <div
                    className="backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20 shadow-glow flex items-center">
                    <Dumbbell className="h-4 w-4 mr-2 text-gray-300"/>
                    <span className="text-white font-medium">Premium Experience</span>
                </div>
            </div>
        </div>
    );

}