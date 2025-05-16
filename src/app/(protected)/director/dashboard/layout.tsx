// src/app/(protected)/admin/dashboard/layout.tsx


import {AnimatedHeader, AnimatedLayout} from "@/components/animations/animated-layout";
import {ParticlesBackground} from "@/components/animations/particles-background";
import {Calculator} from "lucide-react";

export default function DashboardLayout({
                                            children,
                                            personnels,
                                            services,
                                        }: {
    children: React.ReactNode
    personnels: React.ReactNode
    services: React.ReactNode
}) {
    return (
        <div className="w-full h-full">
            <AnimatedLayout>
                <ParticlesBackground />

                <AnimatedHeader>
                    <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-full mr-4">
                        <Calculator className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl text-background dark:text-foreground font-bold">dashboard</h1>
                        <p className="text-muted/80 dark:text-muted-foreground mt-1">
                            Visualisez et gérez tous les utilisateurs  et hopitaux du système
                        </p>
                    </div>
                </AnimatedHeader>
            </AnimatedLayout>
            <div className="flex-1 flex flex-col overflow-hidden">

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    <div className="space-y-6">
                        {personnels}
                        {services}
                        {children}

                    </div>
                </main>
            </div>
        </div>
    )
}