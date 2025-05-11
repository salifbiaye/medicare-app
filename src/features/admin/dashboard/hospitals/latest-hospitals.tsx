"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getLatestHospitalsAction } from "@/actions/hospital.action"
import LoaderComponent from "@/components/animations/loader-component"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Building2 } from "lucide-react"

export function LatestHospitals() {
    const [hospitals, setHospitals] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchHospitals = async () => {
            setIsLoading(true)
            try {
                const result = await getLatestHospitalsAction(5)
                if (result.success && result.data) {
                    setHospitals(result.data)
                }
            } catch (error) {
                console.error("Erreur lors du chargement des hôpitaux:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchHospitals()
    }, [])

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle><LoaderComponent /></CardTitle>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className="bg-background dark:bg-muted/30">
            <CardHeader className="bg-gray-600 py-6 text-white dark:bg-muted">
                <CardTitle>Derniers Hôpitaux</CardTitle>
                <CardDescription>
                    Les 5 derniers hôpitaux ajoutés
                </CardDescription>
            </CardHeader>
            <CardContent className="py-3">
                <div className="space-y-4">
                    {hospitals.map((hospital) => (
                        <div key={hospital.id} className="flex items-center border-2 border-gray-300 dark:border-border border-dotted bg-muted p-3 rounded-lg">
                            <div className="p-2 rounded-full bg-gray-700 dark:bg-background/50">
                                <Building2 className="h-6 w-6 text-white dark:text-muted-foreground" />
                            </div>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{hospital.name}</p>
                                <p className="text-sm text-muted-foreground">{hospital.email}</p>
                                <p className="text-xs text-muted-foreground">{hospital.address}</p>
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(hospital.createdAt), "dd MMM yyyy", { locale: fr })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
} 