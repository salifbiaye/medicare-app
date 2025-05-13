"use client"

import React from "react"
import { motion } from "framer-motion"
import { CheckCircle2, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Notification } from "@prisma/client"
import {
    getBackgroundColor,
    getBorderColor,
    getNotificationIcon,
    formatNotificationDate,
    getPriorityColor,
    getTranslatedPriority,
    NotificationType,
    NotificationPriority,
    NotificationCategory
} from "../lib/notification-utils"
import { markAsReadAction, deleteNotificationAction } from "@/actions/notification.action"
import { toast } from "sonner"

interface NotificationItemProps {
    notification: Notification & {
        sender?: {
            id: string
            name: string
            image?: string | null
        } | null
    }
}

export function NotificationItem({ notification }: NotificationItemProps) {
    const handleMarkAsRead = async () => {
        if (notification.read) return
        
        try {
            const result = await markAsReadAction(notification.id)
            
            if (!result.success) {
                throw new Error(result.error || "Erreur lors du marquage de la notification comme lue")
            }
            
            toast.success("Notification marquée comme lue")
        } catch (error) {
            console.error(error)
            toast.error("Erreur lors du marquage de la notification comme lue")
        }
    }
    
    const handleDelete = async () => {
        try {
            const result = await deleteNotificationAction(notification.id)
            
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la suppression de la notification")
            }
            
            toast.success("Notification supprimée avec succès")
        } catch (error) {
            console.error(error)
            toast.error("Erreur lors de la suppression de la notification")
        }
    }

    // Convert Prisma enum strings to our local enum types
    const notificationType = notification.type as unknown as NotificationType;
    const notificationPriority = notification.priority as unknown as NotificationPriority;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`group relative overflow-hidden rounded-xl border ${getBorderColor(notificationType, notification.read)} ${getBackgroundColor(notificationType, notification.read)} p-4 shadow-sm backdrop-blur-sm transition-all hover:shadow-md`}
        >
            <div className="flex items-start gap-4">
                <div
                    className={`mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${notification.read ? "bg-muted/50" : "bg-primary/10"}`}
                >
                    {getNotificationIcon(notificationType)}
                </div>

                <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                        <h3 className={`font-medium ${notification.read ? "" : "font-semibold"}`}>
                            {notification.title}
                            {!notification.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary"></span>}
                        </h3>
                        <div className="flex items-center gap-1">
                            {notification.priority !== "LOW" && (
                                <Badge variant="outline" className={`${getPriorityColor(notificationPriority)}`}>
                                    {getTranslatedPriority(notificationPriority)}
                                </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">{formatNotificationDate(notification.createdAt)}</span>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{notification.message}</p>

                    {notification.sender && (
                        <div className="mt-2 flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={notification.sender.image || "/placeholder.svg"} alt={notification.sender.name} />
                                <AvatarFallback className="text-xs">{notification.sender.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">{notification.sender.name}</span>
                        </div>
                    )}

                    <div className="mt-3 flex items-center gap-2">
                        {notification.actionRequired && (
                            <Badge variant="outline" className="bg-primary/10 text-primary dark:bg-primary/20">
                                Action requise
                            </Badge>
                        )}

                        {!notification.read ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleMarkAsRead}
                                className="h-8 px-3 text-xs"
                            >
                                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                                Marquer comme lu
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDelete}
                                className="h-8 px-3 text-xs text-muted-foreground hover:text-destructive"
                            >
                                <X className="mr-1.5 h-3.5 w-3.5" />
                                Supprimer
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Indicateur de type sur le côté */}
            <div
                className={`absolute bottom-0 left-0 top-0 w-1 ${
                    notification.type === "INFO"
                        ? "bg-blue-500"
                        : notification.type === "WARNING"
                            ? "bg-amber-500"
                            : notification.type === "SUCCESS"
                                ? "bg-green-500"
                                : notification.type === "ERROR"
                                    ? "bg-red-500"
                                    : notification.type === "MESSAGE"
                                        ? "bg-indigo-500"
                                        : notification.type === "APPOINTMENT"
                                            ? "bg-purple-500"
                                            : notification.type === "DOCUMENT"
                                                ? "bg-cyan-500"
                                                : notification.type === "SYSTEM"
                                                    ? "bg-gray-500"
                                                    : notification.type === "PRESCRIPTION"
                                                        ? "bg-emerald-500"
                                                        : notification.type === "LAB"
                                                            ? "bg-amber-500"
                                                            : notification.type === "VITAL"
                                                                ? "bg-red-500"
                                                                : "bg-primary"
                }`}
            />
        </motion.div>
    )
} 