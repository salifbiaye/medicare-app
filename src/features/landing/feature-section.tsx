import {Dumbbell, LineChart, Shield, Trophy, Zap} from "lucide-react";
import React from "react";

export default function FeatureSection() {
    return (
        <section id="features" className="w-full py-12 md:py-24 border-b border-zinc-800">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center justify-center gap-4 text-center md:pb-16">
                    <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20 mb-2">Ce que ShadowFit
                        t&apos;apporte</Badge>
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                        Ton évolution, à ta manière
                    </h2>
                    <p className="max-w-[700px] text-zinc-400 md:text-xl/relaxed">
                        ShadowFit, c’est pas juste une appli de sport. C’est ton espace pour suivre ton corps,
                        progresser à ton
                        rythme, et kiffer chaque étape.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {/* Feature 1 */}
                    <div className="flex flex-col gap-2 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
                        <div
                            className="bg-gray-500/10 text-gray-500 p-2 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                            <Dumbbell className="h-5 w-5"/>
                        </div>
                        <h3 className="text-xl font-bold">Ton corps en visuel</h3>
                        <p className="text-zinc-400">
                            Suis l’évolution de ton corps avec une vue 3D stylée. Les muscles que tu bosses s’illuminent
                            en fonction
                            de tes efforts.
                        </p>
                    </div>
                    {/* Feature 2 */}
                    <div className="flex flex-col gap-2 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
                        <div
                            className="bg-gray-500/10 text-gray-500 p-2 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                            <LineChart className="h-5 w-5"/>
                        </div>
                        <h3 className="text-xl font-bold">Analyse auto, tranquille</h3>
                        <p className="text-zinc-400">
                            L’IA capte ce que tu fais et t’aide à progresser sans te casser la tête. Elle ajuste tes
                            séances au bon
                            moment.
                        </p>
                    </div>
                    {/* Feature 3 */}
                    <div className="flex flex-col gap-2 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
                        <div
                            className="bg-gray-500/10 text-gray-500 p-2 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                            <Zap className="h-5 w-5"/>
                        </div>
                        <h3 className="text-xl font-bold">Des séances à ton rythme</h3>
                        <p className="text-zinc-400">
                            Pas de plan imposé. Tu choisis ton niveau, ton style, ton temps. L’app s’adapte, pas toi.
                        </p>
                    </div>
                    {/* Feature 4 */}
                    <div className="flex flex-col gap-2 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
                        <div
                            className="bg-gray-500/10 text-gray-500 p-2 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                            <Trophy className="h-5 w-5"/>
                        </div>
                        <h3 className="text-xl font-bold">Des p’tits défis cool</h3>
                        <p className="text-zinc-400">
                            Gagne des badges, monte de niveau, débloque des récompenses… tout en t’entraînant. Simple et
                            motivant.
                        </p>
                    </div>
                    {/* Feature 5 */}
                    <div className="flex flex-col gap-2 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
                        <div
                            className="bg-gray-500/10 text-gray-500 p-2 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                            <Shield className="h-5 w-5"/>
                        </div>
                        <h3 className="text-xl font-bold">On évite les galères</h3>
                        <p className="text-zinc-400">
                            ShadowFit te signale si tu tires trop ou si t’as un déséquilibre. Tu progresses sans te
                            blesser.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
