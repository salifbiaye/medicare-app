"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationItem } from "./notification-item"
import { groupNotificationsByDate } from "../lib/notification-utils"
import { Notification } from "@prisma/client"

interface NotificationListProps {
    notifications: (Notification & {
        sender?: {
            id: string
            name: string
            image?: string | null
        } | null
    })[]
    clearFilters?: () => void
    searchQuery?: string
    hasFilters?: boolean
}

export function NotificationList({ notifications, clearFilters, searchQuery, hasFilters }: NotificationListProps) {
    if (notifications.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white/50 py-16 text-center backdrop-blur-sm dark:bg-card/40"
            >
                <Bell className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-xl font-medium">Aucune notification</h3>
                <p className="mt-2 text-muted-foreground">
                    {searchQuery || hasFilters
                        ? "Aucune notification ne correspond à vos critères de recherche."
                        : "Vous n'avez aucune notification pour le moment."}
                </p>
                {(searchQuery || hasFilters) && clearFilters && (
                    <Button variant="outline" onClick={clearFilters} className="mt-4">
                        Effacer les filtres
                    </Button>
                )}
            </motion.div>
        )
    }

    // Grouper les notifications par date
    const groupedNotifications = groupNotificationsByDate(notifications)

    return (
        <div className="space-y-8">
            {/* Aujourd'hui */}
            {groupedNotifications.today.length > 0 && (
                <div>
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        Aujourd'hui
                    </h2>
                    <div className="space-y-3">
                        <AnimatePresence>
                            {groupedNotifications.today.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Hier */}
            {groupedNotifications.yesterday.length > 0 && (
                <div>
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        Hier
                    </h2>
                    <div className="space-y-3">
                        <AnimatePresence>
                            {groupedNotifications.yesterday.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Cette semaine */}
            {groupedNotifications.thisWeek.length > 0 && (
                <div>
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        Cette semaine
                    </h2>
                    <div className="space-y-3">
                        <AnimatePresence>
                            {groupedNotifications.thisWeek.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Plus ancien */}
            {groupedNotifications.older.length > 0 && (
                <div>
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        Plus ancien
                    </h2>
                    <div className="space-y-3">
                        <AnimatePresence>
                            {groupedNotifications.older.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    )
} 