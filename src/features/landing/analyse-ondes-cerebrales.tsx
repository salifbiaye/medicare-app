import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AnalyseOndesCerebrales() {
  return (
    <div className="py-8 border-b border-gray-200 dark:border-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Téléconsultation"
              width={300}
              height={200}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Amélioration de l'accès: <span className="text-green-500">68%</span>
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">+</div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
            <div className="text-sm font-medium mb-2">Comparaison des patients</div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">Zones urbaines</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">→</div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">Zones rurales</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">→</div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Téléconsultation et Suivi Médical</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Notre plateforme offre des consultations en ligne sécurisées avec des médecins spécialistes, disponibles
            24/7. Les patients des zones rurales peuvent consulter sans parcourir de longues distances, avec un accès
            complet à leur dossier médical partagé entre professionnels de santé. Une messagerie sécurisée facilite la
            communication entre médecins et patients pour un suivi optimal des maladies chroniques comme le diabète et
            les pathologies cardiovasculaires.
          </p>
          <Button className="rounded-full">
            En savoir plus
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
