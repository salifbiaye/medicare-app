import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AnalyseOrganes() {
  return (
    <div className="py-8 border-b border-gray-200 dark:border-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Analyse Complète des Organes et Téléradiologie</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Au-delà des consultations classiques, notre plateforme s'appuie sur Orthanc, un serveur DICOM open-source,
            pour la gestion et l'analyse des images médicales à distance. Les médecins peuvent transmettre et
            interpréter les examens radiologiques instantanément, permettant un diagnostic précis même dans les zones
            les plus reculées. Notre approche holistique garantit qu'aucun aspect de la santé du patient n'est négligé.
          </p>
          <Button className="rounded-full">
            En savoir plus
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="text-center mb-4 font-medium">Estomac</div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Téléradiologie"
                width={300}
                height={300}
                className="mx-auto"
              />
              <button className="absolute top-1/4 -left-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="h-5 w-5 text-blue-500">+</div>
              </button>
              <button className="absolute bottom-1/4 -right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="h-5 w-5 text-blue-500">+</div>
              </button>
            </div>
            <div className="text-center mt-4">
              <Button variant="outline" size="sm" className="rounded-full">
                Commencer le diagnostic
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
