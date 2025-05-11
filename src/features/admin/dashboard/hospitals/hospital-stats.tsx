"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getHospitalStatsAction } from "@/actions/hospital.action"
import { Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
                <Card className="bg-background pb-6 overflow-hidden relative">
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse-slow"></div>

                    <CardHeader className="flex flex-row items-center bg-gray-600 dark:bg-muted justify-between space-y-4">
                        <CardTitle className="text-sm font-medium p-2 pt-4">
                            <Skeleton className="h-8 w-32 bg-gray-500/30 dark:bg-gray-700/30" />
                        </CardTitle>
                        <div className="p-4 rounded-full bg-gray-700/50 dark:bg-background/50 mr-4">
                            <Building2 className="h-4 w-4 text-gray-400 dark:text-muted-foreground/50" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex flex-row gap-4 items-center">
                            <div className="relative">
                                <Skeleton className="h-8 w-16 bg-primary/10" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-primary animate-ping"></div>
                                </div>
                            </div>
                            <Skeleton className="h-4 w-40 bg-gray-200/30 dark:bg-gray-700/30" />
                        </div>

                        {/* Animated dots */}
                        <div className="flex mt-6 space-x-1 justify-center">
                            <div
                                className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
                                style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                                className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
                                style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                                className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
                                style={{ animationDelay: "300ms" }}
                            ></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="w-full">
            <Card className="bg-background pb-6">
                <CardHeader className="flex flex-row items-center bg-gray-600 dark:bg-muted justify-between space-y-4">
                    <CardTitle className="text-sm font-medium p-2 pt-4">
                        <Badge variant="accent" className="p-2">
                            Total Hôpitaux
                        </Badge>
                    </CardTitle>
                    <div className="p-4 rounded-full dark:bg-background bg-gray-700">
                        <Building2 className="h-4 w-4 text-white dark:text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-row gap-4 items-center">
                        <div className="text-2xl font-bold">{stats?.totalHospitals || 0}</div>
                        <p className="text-xs text-muted-foreground">Nombre total d'hôpitaux</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
