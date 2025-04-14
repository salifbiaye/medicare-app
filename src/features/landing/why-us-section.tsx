import { BarChart3, Calendar, Dumbbell } from "lucide-react"
import Particles from "@/components/particles"
import type React from "react";

export default function WhyUsSection() {
    return (
        <section className="py-24 bg-black">
            <div className="container mx-auto">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-4xl font-bold text-white">Pourquoi ShadowFit ?</h2>
                    <p className="text-xl text-gray-400">
                        ShadowFit vous aide à repousser vos limites physiques et mentales grâce à une interface moderne et une expérience unique.
                    </p>
                </div>

                {/* Hero Showcase */}
                <div className=" gap-10 items-center">
                    {/* Left: Image */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/10 rounded-3xl blur-3xl transform -rotate-3 scale-95 opacity-30" />
                        <div className="relative border border-2 rounded-3xl p-4 border-gray-800 overflow-hidden">
                            <div className="h-8 bg-[#050510] rounded-t-xl flex items-center px-4 mb-4">
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                            </div>
                            <div className="relative w-full bg-[#050510]  rounded-xl flex  items-center justify-center">
                                <img src="/landing/hero.png" alt="Interface ShadowFit"
                                     className="aspect-video w-full h-full object-cover rounded-xl"/>
                                <div className="absolute inset-0 z-20">
                                    <Particles/>
                                </div>
                                <div
                                    className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 z-0"></div>

                                <div className="absolute bottom-0 left-0 right-0 p-10 text-white z-20">
                                    <div
                                        className="quote-container backdrop-blur-sm bg-black/20 p-6 rounded-xl border border-white/10 shadow-glow transition-all duration-500">
                                        <h3 className="text-3xl font-bold mb-4">Devenez votre propre rival</h3>
                                        <p className="text-gray-400 text-lg mb-6">
                                            ShadowFit est plus qu&apos;une application de fitness. C&apos;est un coach personnel
                                            intelligent qui vous pousse à dépasser votre version d’hier.
                                        </p>
                                        <ul className="space-y-2 text-gray-300 text-sm">
                                            <li>✓ Suivi de votre corps et progression visuelle</li>
                                            <li>✓ Affrontement contre votre &#34;ghost trainer&#34;</li>
                                            <li>✓ Objectifs personnalisés & évolution en temps réel</li>
                                        </ul>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                {/* Bottom Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                    <FeatureItem
                        icon={<BarChart3 className="h-6 w-6 text-blue-400"/>}
                        title="Analyse de performance"
                        description="Suivez vos progrès avec des graphiques précis et une IA qui vous guide."
                        color="blue"
                    />
                    <FeatureItem
                        icon={<Dumbbell className="h-6 w-6 text-purple-400"/>}
                        title="Programmes intelligents"
                        description="Adaptés à votre niveau, vos objectifs, et votre style d'entraînement."
                        color="purple"
                    />
                    <FeatureItem
                        icon={<Calendar className="h-6 w-6 text-green-400"/>}
                        title="Planification intelligente"
                        description="Rappels, flexibilité, intensité ajustée : vous ne ratez plus vos séances."
                        color="green"
                    />
                </div>
            </div>
        </section>
    )
}

function FeatureItem({
                         icon,
                         title,
                         description,
                         color,
                     }: {
    icon: React.ReactNode
    title: string
    description: string
    color: "blue" | "purple" | "green"
}) {
    return (
        <div className="border border-2 p-6 rounded-xl border-gray-800">
            <div className={`p-3 rounded-lg bg-${color}-500/10 w-fit mb-4`}>{icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    )
}
