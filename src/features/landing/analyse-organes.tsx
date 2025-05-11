"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import {motion} from "framer-motion";

export function AnalyseOrganes() {
  const [showMore, setShowMore] = useState(false)

  return (
      <div id={"teleradiologie"} className="py-12  border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Analyse
              Complète des Organes et Téléradiologie</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
              Au-delà de l'ECG et de l'EEG, notre logiciel s'étend à d'autres organes vitaux, notamment l'estomac, les
              reins et le foie. Nous fournissons également une analyse détaillée des niveaux sanguins, du taux de
              cholestérol, de la glycémie et d'autres métriques essentielles de santé. Cette approche holistique
              garantit
              qu'aucun aspect de la santé du patient n'est négligé.
            </p>

            <button
                onClick={() => setShowMore(!showMore)}
                className="bg-blue-600 text-white px-6 py-3 rounded-full flex items-center font-medium hover:bg-blue-700 transition-colors"
            >
              {showMore ? "Voir moins" : "En savoir plus"}
              <ArrowRight className={`ml-2 h-5 w-5 transition-transform ${showMore ? "rotate-90" : ""}`}/>
            </button>

            {showMore && (
                <div
                    className="mt-4 bg-gray-50 dark:bg-card p-6 rounded-xl border border-gray-200 dark:border-gray-800 transition-colors duration-300">
                  <h3 className="text-xl font-bold mb-3 dark:text-white transition-colors duration-300">Téléradiologie
                    avec Orthanc</h3>
                  <p className="mb-4 dark:text-gray-300 transition-colors duration-300">
                    Notre plateforme s'appuie sur Orthanc, un serveur DICOM open-source puissant, pour offrir des
                    services
                    de téléradiologie de pointe:
                  </p>
                  <ul className="space-y-2 list-disc pl-5 dark:text-gray-300 transition-colors duration-300">
                    <li>Transmission sécurisée d'images médicales (radiographies, IRM, scanners)</li>
                    <li>Interprétation à distance par des radiologues spécialistes</li>
                    <li>Stockage et archivage conformes aux normes médicales</li>
                    <li>Visualisation avancée avec outils de mesure et d'annotation</li>
                    <li>Intégration avec les systèmes d'information hospitaliers existants</li>
                  </ul>

                  <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white transition-colors duration-300">Types
                    d'analyses disponibles</h3>
                  <ul className="space-y-2 list-disc pl-5 dark:text-gray-300 transition-colors duration-300">
                    <li>Analyses sanguines complètes (NFS, glycémie, cholestérol)</li>
                    <li>Imagerie digestive (estomac, intestins, foie)</li>
                    <li>Imagerie cardiaque et vasculaire</li>
                    <li>Analyses rénales et urinaires</li>
                    <li>Suivi des paramètres vitaux en temps réel</li>
                    <li>Préparation pour l'intégration future d'IA diagnostique</li>
                  </ul>
                </div>
            )}
          </div>
          <div className="relative">
          <motion.div
              className="absolute -top-2 -left-2 w-full h-full bg-background rounded-xl shadow-sm border border-border -z-10"></motion.div>
          <motion.div
              className="absolute -top-1 -left-1 w-full h-full bg-background rounded-xl shadow-sm border border-border -z-10"></motion.div>

          <motion.div
              className="bg-muted/50 rounded-xl shadow-sm border border-border overflow-hidden relative z-10 transition-colors duration-300">
            <div className="p-3 border-b border-border bg-muted/80 transition-colors duration-300">
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div
                  className="bg-primary/15 dark:bg-muted/20 rounded-lg flex justify-center items-center w-full h-86 transition-colors duration-300">
                <Image
                    src="/landing/stomach.png"
                    alt="Cerveau"
                    width={300}
                    height={300}
                    className=" dark:hidden rounded-lg"
                />
                <Image
                    src="/landing/stomach-dark.png"
                    alt="Cerveau"
                    width={300}
                    height={300}
                    className="hidden dark:block  rounded-lg"
                />
              </div>


            </div>
          </motion.div>
          </div>


        </div>
      </div>
  )
}