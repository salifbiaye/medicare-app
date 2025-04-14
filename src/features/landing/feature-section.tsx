import {Dumbbell, LineChart, Shield, Trophy, Zap} from "lucide-react";
import React from "react";
import {Badge} from "@/components/ui/badge";

export default function FeatureSection() {
    return (
        <section id="features" className="w-full py-12 md:py-24 border-b border-zinc-800">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center justify-center gap-4 text-center md:pb-16">
                    <Badge className="bg-muted/10 text-muted border-muted/20 mb-2">What ShadowFit offers you</Badge>
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                        Your evolution, your way
                    </h2>
                    <p className="max-w-[700px] text-zinc-400 md:text-xl/relaxed">
                        ShadowFit isn&apos;t just a fitness app. It&apos;s your space to track your body, progress at your own pace, and enjoy every step of the journey.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {/* Feature 1 */}
                    <div className="flex flex-col gap-2 p-6 bg-muted rounded-xl border border-zinc-800">
                        <div
                            className="bg-muted/10 text-foreground p-2 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                            <Dumbbell className="h-5 w-5"/>
                        </div>
                        <h3 className="text-xl font-bold">Visualize your body</h3>
                        <p className="text-zinc-400">
                            Track your body&apos;s evolution with a cool 3D view. The muscles you work light up based on your efforts.
                        </p>
                    </div>
                    {/* Feature 2 */}
                    <div className="flex flex-col gap-2 p-6 bg-muted rounded-xl border border-zinc-800">
                        <div
                            className="bg-gray-500/10 text-foreground p-2 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                            <LineChart className="h-5 w-5"/>
                        </div>
                        <h3 className="text-xl font-bold">Automatic analysis, no stress</h3>
                        <p className="text-zinc-400">
                            AI detects what you&apos;re doing and helps you progress without overcomplicating things. It adjusts your workouts at the right time.
                        </p>
                    </div>
                    {/* Feature 3 */}
                    <div className="flex flex-col gap-2 p-6 bg-muted rounded-xl border border-zinc-800">
                        <div
                            className="bg-gray-500/10 text-foreground p-2 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                            <Zap className="h-5 w-5"/>
                        </div>
                        <h3 className="text-xl font-bold">Workouts at your pace</h3>
                        <p className="text-zinc-400">
                            No rigid plans. You choose your level, your style, your time. The app adapts to you, not the other way around.
                        </p>
                    </div>
                    {/* Feature 4 */}
                    <div className="flex flex-col gap-2 p-6 bg-muted rounded-xl border border-zinc-800">
                        <div
                            className="bg-gray-500/10 text-foreground p-2 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                            <Trophy className="h-5 w-5"/>
                        </div>
                        <h3 className="text-xl font-bold">Cool little challenges</h3>
                        <p className="text-zinc-400">
                            Earn badges, level up, unlock rewards... all while training. Simple and motivating.
                        </p>
                    </div>
                    {/* Feature 5 */}
                    <div className="flex flex-col gap-2 p-6 bg-muted rounded-xl border border-zinc-800">
                        <div
                            className="bg-gray-500/10 text-foreground p-2 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                            <Shield className="h-5 w-5"/>
                        </div>
                        <h3 className="text-xl font-bold">Avoid the pitfalls</h3>
                        <p className="text-zinc-400">
                            ShadowFit alerts you if you&apos;re pushing too hard or have imbalances. You progress without getting injured.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}