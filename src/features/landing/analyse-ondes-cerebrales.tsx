"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function AnalyseOndesCerebrales() {
  const [showMore, setShowMore] = useState(false)

  return (
      <div id={"teleconsultation"} className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="relative">
            {/* Cartes empilées en arrière-plan */}
            <motion.div className="absolute -top-2 -left-2 w-full h-full bg-background rounded-xl shadow-sm border border-border -z-10"></motion.div>
            <motion.div className="absolute -top-1 -left-1 w-full h-full bg-background rounded-xl shadow-sm border border-border -z-10"></motion.div>

            {/* Carte principale */}
            <motion.div className="bg-muted/50 rounded-xl shadow-sm border border-border overflow-hidden relative z-10 transition-colors duration-300">
              <div className="p-3 border-b border-border bg-muted/80 transition-colors duration-300">
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="bg-primary/15 dark:bg-muted/10 rounded-lg flex justify-center items-center w-full h-86 transition-colors duration-300">
                  <Image
                      src="/landing/brain.png"
                      alt="Cerveau"
                      width={300}
                      height={300}
                      className=" dark:hidden rounded-lg"
                  />
                  <Image
                      src="/landing/brain-dark.png"
                      alt="Cerveau"
                      width={300}
                      height={300}
                      className="hidden dark:block  rounded-lg"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Pourcentage de diagnostic:</div>
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">98%</div>
                </div>

                <div className="border-t border-border pt-4 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-medium text-foreground">Plaintes du patient</div>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>

                  <div className="font-medium mb-3 text-foreground">Résultats EEG</div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-border rounded-lg p-3 bg-background transition-colors duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-muted-foreground">Signal Alpha</div>
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                      <div className="h-6 bg-muted rounded-md overflow-hidden">
                        <svg viewBox="0 0 100 20" className="w-full h-full">
                          <path
                              d="M0,10 Q5,5 10,10 T20,10 T30,10 T40,10 T50,10 T60,10 T70,10 T80,10 T90,10 T100,10"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1"
                              className="text-muted-foreground"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="border border-border rounded-lg p-3 bg-background transition-colors duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-muted-foreground">Signal Beta</div>
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                      <div className="h-6 bg-muted rounded-md overflow-hidden">
                        <svg viewBox="0 0 100 20" className="w-full h-full">
                          <path
                              d="M0,10 Q2.5,7 5,10 T10,10 T15,10 T20,10 T25,10 T30,10 T35,10 T40,10"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1"
                              className="text-muted-foreground"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Téléconsultation et Suivi Médical</h2>
            <p className="text-muted-foreground leading-relaxed">
              Notre plateforme de téléconsultation fournit des mesures détaillées et un suivi précis pour les patients à
              distance. Notre logiciel facilite le diagnostic et la surveillance des conditions médicales telles que le
              diabète, les maladies cardiovasculaires et plus encore, offrant des données fiables qui aident à planifier
              un traitement efficace même dans les zones les plus reculées du Sénégal.
            </p>

            <button
                onClick={() => setShowMore(!showMore)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full flex items-center font-medium transition-colors duration-300"
            >
              {showMore ? "Voir moins" : "En savoir plus"}
              <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 ${showMore ? "rotate-90" : ""}`} />
            </button>

            {showMore && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 bg-card p-6 rounded-xl border border-border"
                >
                  <h3 className="text-xl font-bold mb-3 text-card-foreground">Avantages de la téléconsultation</h3>
                  <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                    <li>Réduction des déplacements pour les patients des zones rurales</li>
                    <li>Accès à des spécialistes sans contrainte géographique</li>
                    <li>Suivi régulier des maladies chroniques sans déplacement</li>
                    <li>Consultation vidéo HD sécurisée avec partage de documents médicaux</li>
                    <li>Messagerie sécurisée entre médecins et patients</li>
                    <li>Possibilité de consultation en mode déconnecté avec synchronisation différée</li>
                  </ul>

                  <h3 className="text-xl font-bold mt-6 mb-3 text-card-foreground">Fonctionnalités techniques</h3>
                  <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                    <li>Visioconférence optimisée pour les connexions à faible débit</li>
                    <li>Chiffrement de bout en bout des communications</li>
                    <li>Intégration avec les dossiers médicaux électroniques</li>
                    <li>Compatibilité avec les appareils mobiles et ordinateurs</li>
                    <li>Prise de rendez-vous et rappels automatiques</li>
                  </ul>
                </motion.div>
            )}
          </div>
        </div>
      </div>
  )
}