"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { getLatestUsersAction } from "@/actions/user.action"
import { Skeleton } from "@/components/ui/skeleton"

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

                                {/* Avatar skeleton */}
                                <div className="h-9 w-9 rounded-full bg-gray-300 dark:bg-gray-700/50 flex items-center justify-center overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 animate-pulse"></div>
                                </div>

                                <div className="ml-4 space-y-2 flex-1">
                                    <Skeleton className="h-4 w-32 bg-gray-300/50 dark:bg-gray-700/50" />
                                    <Skeleton className="h-3 w-40 bg-gray-200/50 dark:bg-gray-800/30" />
                                </div>

                                <div className="ml-auto flex items-center gap-2">
                                    {/* Badge skeleton */}
                                    <Skeleton className="h-5 w-16 rounded-full bg-gray-300/50 dark:bg-gray-700/50" />
                                    {/* Date skeleton */}
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
                <CardTitle>Derniers Utilisateurs</CardTitle>
                <CardDescription>Les 5 derniers utilisateurs inscrits</CardDescription>
            </CardHeader>
            <CardContent className="py-3">
                <div className="space-y-4">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center border-2 border-gray-300 dark:border-border border-dotted bg-muted p-3 rounded-lg"
                        >
                            <Avatar className="h-9 w-9 ">
                                <AvatarImage src={user.image || ""} alt={user.name} />
                                <AvatarFallback className={"bg-gray-500 text-white dark:bg-background/50"}>
                                    {user.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
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
