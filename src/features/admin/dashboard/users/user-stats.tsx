"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserStatsAction } from "@/actions/user.action"
import LoaderComponent from "@/components/animations/loader-component"
import { Users, UserPlus, Stethoscope, UserCog, UserCheck, UserRound } from "lucide-react"
import {Badge} from "@/components/ui/badge";

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

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                <LoaderComponent />
                            </CardTitle>
                        </CardHeader>
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
                            <Badge variant={stat.variant} className=" p-2 ">
                                {stat.title}
                            </Badge>
                        </CardTitle>
                        <div className={"p-4 rounded-full dark:bg-background bg-gray-700 "}>
                            <stat.icon className="h-4 w-4 text-white  dark:text-muted-foreground"/>
                        </div>

                    </CardHeader>
                    <CardContent>
                        <div className={"flex flex-row gap-4 items-center"}>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
} 