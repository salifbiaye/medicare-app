"use client"

import * as React from "react"
import { getHospitalStatsAction } from "@/actions/hospital.action"
import { Building2, Hospital } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function HospitalStats() {
    const [stats, setStats] = React.useState<any>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true)
            try {
                const result = await getHospitalStatsAction()
                if (result.success && result.data) {
                    setStats(result.data)
                }
            } catch (error) {
                console.error("Erreur lors du chargement des statistiques:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (isLoading) {
        return (
            <div className="w-full">
                <Skeleton className="h-40 w-full rounded-xl" />
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="relative overflow-hidden bg-gradient-to-br from-primary to-indigo-700 rounded-xl shadow-lg">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="hospital-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#hospital-grid)" />
                    </svg>
                </div>

                {/* Hospital icons background */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-5 left-10">
                        <Hospital className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute bottom-5 right-10">
                        <Hospital className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Hospital className="h-20 w-20 text-white" />
                    </div>
                </div>

                <div className="relative p-8 flex flex-col items-center text-white">
                    <div className="flex items-center justify-center mb-4">
                        <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
                            <Building2 className="h-8 w-8 text-white" />
                        </div>
                    </div>

                    <h3 className="text-lg font-medium mb-2 text-white/80">Total Hôpitaux</h3>

                    <div className="text-6xl font-bold mb-2 flex items-center">
            <span className="relative">
              {stats?.totalHospitals || 0}
                <span className="absolute -top-1 -right-4 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
            </span>
                    </div>

                    <p className="text-sm text-white/70">Établissements de santé enregistrés</p>

                    {/* Bottom decorative element */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/50 to-white/0"></div>
                </div>
            </div>
        </div>
    )
}
