"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Activity, Brain, Heart, Hospital, Shield, Stethoscope, Users } from "lucide-react"

export function AnalyticsSection() {
    const [activeTab, setActiveTab] = useState("réseau")

    const tabs = [
        { id: "réseau", label: "Réseau", icon: <Hospital className="h-5 w-5" /> },
    ]

    return (
        <div id={"vision-globale"} className="py-16 ">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 mb-4">
            <Activity className="mr-1 h-3.5 w-3.5" />
            Vision Globale
          </span>
                    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl   mb-4">
                        Écosystème de Santé Connecté
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Une plateforme unifiée reliant patients, médecins et établissements à travers tout le Sénégal
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex bg-gray-100 dark:bg-muted rounded-full p-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                                    activeTab === tab.id
                                        ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="relative">
                    {/* Réseau Tab */}
                    {activeTab === "réseau" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {/* Carte du Sénégal stylisée */}
                            <div className="md:col-span-2 bg-white dark:bg-card/20 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-900 p-6">
                                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Réseau National</h3>
                                <div className="relative h-80 bg-blue-50 dark:bg-muted/40 rounded-xl overflow-hidden">
                                    {/* Carte stylisée du Sénégal */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg
                                            viewBox="0 0 500 400"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-full h-full p-8"
                                        >
                                            <path
                                                d="M120,40 L180,20 L240,30 L300,10 L350,40 L380,90 L400,150 L380,200 L350,250 L300,280 L240,300 L180,280 L120,250 L100,200 L80,150 L100,90 L120,40Z"
                                                fill="url(#map-gradient)"
                                                stroke="#4F46E5"
                                                strokeWidth="2"
                                            />
                                            <defs>
                                                <linearGradient id="map-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#C7D2FE" />
                                                    <stop offset="100%" stopColor="#818CF8" />
                                                </linearGradient>
                                            </defs>

                                            {/* Points représentant les hôpitaux */}
                                            <circle cx="200" cy="100" r="8" fill="#4F46E5" />
                                            <circle cx="200" cy="100" r="12" fill="#4F46E5" fillOpacity="0.3" />

                                            <circle cx="300" cy="150" r="8" fill="#4F46E5" />
                                            <circle cx="300" cy="150" r="12" fill="#4F46E5" fillOpacity="0.3" />

                                            <circle cx="150" cy="200" r="8" fill="#4F46E5" />
                                            <circle cx="150" cy="200" r="12" fill="#4F46E5" fillOpacity="0.3" />

                                            <circle cx="250" cy="220" r="8" fill="#4F46E5" />
                                            <circle cx="250" cy="220" r="12" fill="#4F46E5" fillOpacity="0.3" />

                                            <circle cx="350" cy="80" r="8" fill="#4F46E5" />
                                            <circle cx="350" cy="80" r="12" fill="#4F46E5" fillOpacity="0.3" />

                                            {/* Lignes de connexion */}
                                            <path d="M200,100 L300,150" stroke="#4F46E5" strokeWidth="2" strokeDasharray="4 4" />
                                            <path d="M300,150 L250,220" stroke="#4F46E5" strokeWidth="2" strokeDasharray="4 4" />
                                            <path d="M250,220 L150,200" stroke="#4F46E5" strokeWidth="2" strokeDasharray="4 4" />
                                            <path d="M200,100 L150,200" stroke="#4F46E5" strokeWidth="2" strokeDasharray="4 4" />
                                            <path d="M200,100 L350,80" stroke="#4F46E5" strokeWidth="2" strokeDasharray="4 4" />
                                        </svg>
                                    </div>

                                    {/* Légende */}
                                    <div className="absolute bottom-4 left-4 bg-white dark:bg-card/20 rounded-lg shadow-md p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                            <span className="text-xs text-gray-600 dark:text-gray-300">Hôpitaux connectés</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 border border-dashed border-blue-600 rounded-full"></div>
                                            <span className="text-xs text-gray-600 dark:text-gray-300">Connexion sécurisée</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Statistiques visuelles */}
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-card/20 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-900 p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                                            <Hospital className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">Établissements</h3>
                                            <div className="flex items-center mt-2">
                                                {Array(5)
                                                    .fill(0)
                                                    .map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-8 h-2 rounded-full mr-1 ${i < 4 ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"}`}
                                                        ></div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-card/20 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-900 p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl">
                                            <Stethoscope className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">Spécialités</h3>
                                            <div className="flex items-center mt-2">
                                                {Array(5)
                                                    .fill(0)
                                                    .map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-8 h-2 rounded-full mr-1 ${i < 3 ? "bg-purple-500" : "bg-gray-200 dark:bg-gray-700"}`}
                                                        ></div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-card/20 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-900 p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                                            <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">Sécurité</h3>
                                            <div className="flex items-center mt-2">
                                                {Array(5)
                                                    .fill(0)
                                                    .map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-8 h-2 rounded-full mr-1 ${i < 5 ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}`}
                                                        ></div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}




                </div>
            </div>
        </div>
    )
}
