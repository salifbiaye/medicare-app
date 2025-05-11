import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HomePage = () => {
    return (
        <div className="space-y-6 p-6">


            <Card className="border-none bg-gray-700 dark:bg-zinc-900 shadow-lg">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">Plateforme Medicare</h2>
                        <p className="text-gray-300 max-w-2xl">
                            Notre mission est de connecter les patients avec les meilleurs professionnels de santé 
                            et de fournir une expérience de soins de santé exceptionnelle. Ensemble, nous construisons 
                            l'avenir de la santé numérique.
                        </p>
                        <div className="mt-4 flex gap-2">
                            <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                                Innovation
                            </Badge>
                            <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                                Qualité
                            </Badge>
                            <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                                Accessibilité
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default HomePage;