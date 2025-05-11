import Image from "next/image"
import { ArrowRight, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RejoignezNousSection() {
  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-bold">TéléSanté Sénégal</span>
          </div>
          <h2 className="text-3xl font-bold">Rejoignez-nous dans notre Aventure</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Rejoignez-nous dans notre mission de révolutionner l'accès aux soins spécialisés au Sénégal grâce à notre
            solution de télémédecine et de téléradiologie sécurisée et interopérable. En intégrant Orthanc et en
            assurant une interconnexion efficace entre les établissements de santé, notre plateforme contribuera à
            réduire les déplacements des patients, optimiser la gestion des données médicales et améliorer la qualité
            des soins.
          </p>
          <Button className="rounded-full">
            Télécharger l'application
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Dashboard TéléSanté"
              width={800}
              height={600}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
