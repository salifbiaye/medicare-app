"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { getLatestUsersAction } from "@/actions/user.action"
import LoaderComponent from "@/components/animations/loader-component"

export function LatestUsers() {
    const [users, setUsers] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true)
            try {
                const result = await getLatestUsersAction(5) // Récupérer les 5 derniers utilisateurs
                if (result.success && result.data) {
                    setUsers(result.data)
                }
            } catch (error) {
                console.error("Erreur lors du chargement des utilisateurs:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUsers()
    }, [])

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle><LoaderComponent/></CardTitle>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className="bg-background dark:bg-muted/30">
            <CardHeader className="bg-gray-600 py-6 text-white dark:bg-muted">
                <CardTitle>Derniers Utilisateurs</CardTitle>
                <CardDescription>
                    Les 5 derniers utilisateurs inscrits
                </CardDescription>
            </CardHeader>
            <CardContent className="py-3">
                <div className="space-y-4">
                    {users.map((user) => (
                        <div key={user.id} className="flex items-center border-2 border-gray-300 dark:border-border border-dotted bg-muted p-3 rounded-lg">

                                <Avatar className="h-9 w-9 ">
                                    <AvatarImage src={user.image || ""} alt={user.name} />
                                    <AvatarFallback className={"bg-gray-500 text-white dark:bg-background/50"}>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>

                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                                <Badge variant={user.profileCompleted ? "success" : "warning"}>
                                    {user.profileCompleted ? "Complet" : "Incomplet"}
                                </Badge>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(user.createdAt), "dd MMM yyyy", { locale: fr })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
} 