"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Stethoscope, Heart, Home, ArrowLeft, Activity, Cross, Pill, Thermometer } from "lucide-react"

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 flex items-center justify-center p-4">
      {/* Floating medical icons background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-primary/10 animate-float">
          <Heart className="w-8 h-8" />
        </div>
        <div className="absolute top-40 right-20 text-accent/10 animate-float-delayed">
          <Stethoscope className="w-12 h-12" />
        </div>
        <div className="absolute bottom-32 left-20 text-primary/10 animate-pulse">
          <Cross className="w-6 h-6" />
        </div>
        <div className="absolute bottom-20 right-10 text-accent/10 animate-bounce">
          <Pill className="w-8 h-8" />
        </div>
        <div className="absolute top-60 left-1/3 text-primary/10 animate-float">
          <Thermometer className="w-10 h-10" />
        </div>
        <div className="absolute top-32 right-1/3 text-accent/10 animate-pulse">
          <Activity className="w-8 h-8" />
        </div>
      </div>

      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          {/* Main 404 illustration */}
          <div className="relative mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                {/* Stethoscope forming "404" */}
                <div className="flex items-center gap-4">
                  <div className="text-8xl font-bold text-primary/20 select-none">4</div>
                  <div className="relative">
                    <Stethoscope className="w-20 h-20 text-primary animate-pulse" />
                    <div className="absolute -top-2 -right-2">
                      <Heart className="w-6 h-6 text-destructive animate-heartbeat" />
                    </div>
                  </div>
                  <div className="text-8xl font-bold text-primary/20 select-none">4</div>
                </div>
              </div>
            </div>

            {/* Pulse line animation */}
            <div className="relative h-16 mb-6 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 400 60">
                <path
                  d="M0,30 L80,30 L90,10 L100,50 L110,20 L120,40 L130,30 L400,30"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-primary animate-pulse-line"
                />
              </svg>
            </div>
          </div>

          {/* Error message */}
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl font-bold text-foreground">Diagnostic : Page Introuvable</h1>
            <p className="text-xl text-muted-foreground">
              Oups ! Il semble que cette page ait été transférée dans un autre service.
            </p>
            <p className="text-muted-foreground max-w-md mx-auto">
              Notre équipe médicale recommande de retourner à l'accueil pour une consultation appropriée.
            </p>
          </div>

          {/* Medical prescription card */}
          <Card className="mb-8 bg-accent/10 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Cross className="w-8 h-8 text-primary mt-1" />
                <div className="text-left">
                  <h3 className="font-semibold text-foreground mb-2">Ordonnance Medicare</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>✓ Retourner à l'accueil : 1 fois</p>
                    <p>✓ Vérifier l'URL : Si nécessaire</p>
                    <p>✓ Contacter le support : En cas de persistance</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Home className="w-5 h-5" />
              Retour à l'Accueil
            </Button>

            <Button onClick={() => router.back()} variant="outline" className="flex items-center gap-2" size="lg">
              <ArrowLeft className="w-5 h-5" />
              Page Précédente
            </Button>
          </div>

          {/* Emergency contact */}
          <div className="mt-8 pt-6 border-t border-border/50">
           
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
