import Particles from "@/components/ui/particles"
import type React from "react";

export default function WhyUsSection() {
    return (
        <section id={"why-us"} className="py-24 w-full ">
            <div className="container mx-auto">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-4xl font-bold text-white">Why ShadowFit?</h2>
                    <p className="text-xl text-gray-400">
                        ShadowFit helps you push your physical and mental limits with a modern interface and unique experience.
                    </p>
                </div>

                {/* Hero Showcase */}
                <div className=" gap-10 flex justify-center items-center">
                    {/* Left: Image */}
                    <div className="relative ">
                        <div className="absolute  inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/10 rounded-3xl blur-3xl transform -rotate-3 scale-95 opacity-30" />
                        <div className="relative border border-2 rounded-3xl p-4 border-gray-800 overflow-hidden">
                            <div className="h-8 bg-[#050510] rounded-t-xl flex items-center px-4 mb-4">
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                            </div>
                            <div className="relative w-full bg-[#050510]  rounded-xl flex  items-center justify-center">
                                <img src="/landing/hero.png" alt="ShadowFit Interface"
                                     className="aspect-16/9 w-full h-full object-cover rounded-xl"/>
                                <div className="absolute inset-0 z-20">
                                    <Particles/>
                                </div>
                                <div
                                    className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 z-0"></div>

                                <div className="absolute bottom-0 left-0 right-0 p-10 text-white z-20">
                                    <div
                                        className="quote-container backdrop-blur-sm bg-black/20 p-6 rounded-xl border border-white/10 shadow-glow transition-all duration-500">
                                        <h3 className="text-3xl font-bold mb-4">Become your own rival</h3>
                                        <p className="text-gray-400 text-lg mb-6">
                                            ShadowFit is more than a fitness app. It&#39;s an intelligent personal coach that pushes you to surpass yesterday&apos;s version of yourself.
                                        </p>
                                        <ul className="space-y-2 text-gray-300 text-sm">
                                            <li>✓ Body tracking and visual progress</li>
                                            <li>✓ Compete against your &#34;ghost trainer&#34;</li>
                                            <li>✓ Personalized goals & real-time evolution</li>
                                        </ul>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}