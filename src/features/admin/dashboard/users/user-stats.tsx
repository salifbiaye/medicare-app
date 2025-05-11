"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserStatsAction } from "@/actions/user.action"
import { Users, UserPlus, Stethoscope, UserCog, UserCheck, UserRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function UserStats() {
    const [stats, setStats] = React.useState<any>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true)
            try {
                const result = await getUserStatsAction()
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

    const statIcons = [Users, UserPlus, Stethoscope, UserCog, UserCheck, UserRound]
    const statVariants = ["accent", "secondary", "success", "destructive", "warning", "default"]
    const statTitles = ["Total Utilisateurs", "Patients", "Médecins", "Médecins en Chef", "Secrétaires", "Directeurs"]

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="bg-background pb-6 overflow-hidden relative">
                        {/* Animated gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse-slow"></div>

                        <CardHeader className="flex flex-row items-center bg-gray-600 dark:bg-muted justify-between space-y-4 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                            <CardTitle className="text-sm font-medium p-2 pt-4">
                                <Skeleton className="h-8 w-32 bg-gray-500/30 dark:bg-gray-700/30" />
                            </CardTitle>
                            <div className="p-4 rounded-full bg-gray-700/50 dark:bg-background/50 mr-4">
                                {React.createElement(statIcons[i % statIcons.length], {
                                    className: "h-4 w-4 text-gray-400 dark:text-muted-foreground/50",
                                })}
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
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    const statCards = [
        {
            title: "Total Utilisateurs",
            value: stats?.totalUsers || 0,
            icon: Users,
            description: "Nombre total d'utilisateurs",
            variant: "accent",
        },
        {
            title: "Patients",
            value: stats?.totalPatients || 0,
            icon: UserPlus,
            description: "Nombre total de patients",
            variant: "secondary",
        },
        {
            title: "Médecins",
            value: stats?.totalDoctors || 0,
            icon: Stethoscope,
            description: "Nombre total de médecins",
            variant: "success",
        },
        {
            title: "Médecins en Chef",
            value: stats?.totalChiefDoctors || 0,
            icon: UserCog,
            description: "Nombre total de médecins en chef",
            variant: "destructive",
        },
        {
            title: "Secrétaires",
            value: stats?.totalSecretaries || 0,
            icon: UserCheck,
            description: "Nombre total de secrétaires",
            variant: "warning",
        },
        {
            title: "Directeurs",
            value: stats?.totalDirectors || 0,
            icon: UserRound,
            description: "Nombre total de directeurs",
            variant: "default",
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {statCards.map((stat, index) => (
                <Card key={index} className=" bg-background pb-6  ">
                    <CardHeader className="flex flex-row items-center bg-gray-600 dark:bg-muted justify-between space-y-4 ">
                        <CardTitle className="text-sm font-medium p-2 pt-4 ">
                            <Badge variant={stat.variant as any} className=" p-2 ">
                                {stat.title}
                            </Badge>
                        </CardTitle>
                        <div className={"p-4 rounded-full dark:bg-background bg-gray-700 "}>
                            <stat.icon className="h-4 w-4 text-white  dark:text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={"flex flex-row gap-4 items-center"}>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
