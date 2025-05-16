"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getLatestServicesAction } from "@/actions/service.action"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Stethoscope } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function LatestServices() {
    const [services, setServices] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchServices = async () => {
            setIsLoading(true)
            try {
                const result = await getLatestServicesAction(5)
                if (result.success && result.data) {
                    setServices(result.data)
                }
            } catch (error) {
                console.error("Erreur lors du chargement des services:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchServices()
    }, [])

    if (isLoading) {
        return (
            <Card className="bg-background dark:bg-muted/30 overflow-hidden relative">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse-slow"></div>

                <CardHeader className="bg-gray-600 py-6 text-white dark:bg-muted relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                    <CardTitle>
                        <Skeleton className="h-6 w-48 bg-gray-500/30 dark:bg-gray-700/30" />
                    </CardTitle>
                    <CardDescription>
                        <Skeleton className="h-4 w-64 mt-2 bg-gray-500/20 dark:bg-gray-700/20" />
                    </CardDescription>
                </CardHeader>

                <CardContent className="py-6">
                    <div className="space-y-4">
                        {[...Array(5)].map((_, index) => (
                            <div
                                key={index}
                                className="flex items-center border-2 border-gray-200 dark:border-border/30 border-dotted bg-muted/50 p-3 rounded-lg relative overflow-hidden"
                            >
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer"
                                    style={{ animationDelay: `${index * 150}ms` }}
                                ></div>

                                <div className="p-2 rounded-full bg-gray-300 dark:bg-gray-700/50 flex items-center justify-center">
                                    <Stethoscope className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                                </div>

                                <div className="ml-4 space-y-2 flex-1">
                                    <Skeleton className="h-4 w-32 bg-gray-300/50 dark:bg-gray-700/50" />
                                    <Skeleton className="h-3 w-40 bg-gray-200/50 dark:bg-gray-800/30" />
                                    <Skeleton className="h-3 w-48 bg-gray-200/30 dark:bg-gray-800/20" />
                                </div>

                                <div className="ml-auto">
                                    <Skeleton className="h-3 w-20 bg-gray-200/50 dark:bg-gray-800/30" />
                                </div>

                                {/* Animated dot indicator */}
                                <div className="absolute bottom-2 right-2">
                                    <div
                                        className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-ping"
                                        style={{ animationDelay: `${index * 200}ms`, animationDuration: "1.5s" }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Animated loading indicator at bottom */}
                    <div className="flex justify-center mt-6 space-x-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
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
        )
    }

    return (
        <Card className="bg-background dark:bg-muted/30">
            <CardHeader className="bg-gray-600 py-6 text-white dark:bg-muted">
                <CardTitle>Derniers Services</CardTitle>
                <CardDescription>Les 5 derniers services ajoutés</CardDescription>
            </CardHeader>
            <CardContent className="py-3">
                <div className="space-y-4">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="flex items-center border-2 border-gray-300 dark:border-border border-dotted bg-muted p-3 rounded-lg"
                        >
                            <div className="p-2 rounded-full bg-green-600 dark:bg-green-700/50">
                                <Stethoscope className="h-6 w-6 text-white dark:text-green-300" />
                            </div>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{service.name}</p>
                                <p className="text-sm text-muted-foreground">{service.description}</p>
                                <p className="text-xs text-muted-foreground">Département: {service.department}</p>
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(service.createdAt), "dd MMM yyyy", { locale: fr })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
} 