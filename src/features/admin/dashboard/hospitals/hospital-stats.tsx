"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getHospitalStatsAction } from "@/actions/hospital.action"
import LoaderComponent from "@/components/animations/loader-component"
import { Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            <LoaderComponent />
                        </CardTitle>
                    </CardHeader>
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
                        <p className="text-xs text-muted-foreground">
                            Nombre total d'hôpitaux
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 