import React from 'react'
import { HospitalList } from '@/features/patient/hospital-list'
import { getHospitalsWithPaginationAction } from '@/actions/hospital.action'
import { Building2, Clock } from "lucide-react"
import { AnimatedHeader, AnimatedLayout } from "@/components/animations/animated-layout"
import { ParticlesBackground } from "@/components/animations/particles-background"

export default async function RequestsPage() {
  // Récupérer les données initiales des hôpitaux
  const response = await getHospitalsWithPaginationAction({
    page: 1,
    perPage: 8,
    sort: "name.asc",
  })
  console.log("response", response)

  const initialHospitals = response.success ? response.data.hospitals : []

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-12 pt-6 dark:from-background dark:to-background/95">
      <div className="px-4">
        <AnimatedLayout>
          <ParticlesBackground />
          <AnimatedHeader>
            <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-full mr-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl text-background dark:text-foreground font-bold tracking-tight">Demande de Rendez-vous</h1>
              <p className="text-background/80 dark:text-foreground/50">Sélectionnez un hôpital pour prendre rendez-vous</p>
            </div>
          </AnimatedHeader>
        </AnimatedLayout>

        <div className="mt-8">
          <HospitalList initialHospitals={initialHospitals} />
        </div>
      </div>
    </div>
  )
}