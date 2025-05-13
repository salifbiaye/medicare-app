"use client"

import { useState, useEffect, useCallback } from "react"
import { Notification } from "@prisma/client"
import { 
    initializeSocket, 
    subscribeToNotifications, 
    subscribeToNotificationRead, 
    subscribeToNotificationDeleted, 
    subscribeToAllNotificationsRead,
    closeSocket
} from "@/lib/socket"
import { getNotificationsWithPaginationAction, getNotificationStatsAction } from "@/actions/notification.action"

export function useNotifications(userId: string) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [stats, setStats] = useState({
        total: 0,
        unread: 0,
        medical: 0,
        administrative: 0,
        system: 0,
        highPriority: 0,
        actionRequired: 0
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch notifications
    const fetchNotifications = useCallback(async (params: {
        page: number
        perPage: number
        sort?: string
        search?: string
        filters?: Record<string, string[]>
    }) => {
        setLoading(true)
        try {
            const result = await getNotificationsWithPaginationAction(params)
            
            if (result.success && result.data) {
                setNotifications(result.data.notifications)
                return result.data
            } else {
                throw new Error(result.error || "Failed to fetch notifications")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred")
            return { notifications: [], total: 0 }
        } finally {
            setLoading(false)
        }
    }, [])

    // Fetch notification stats
    const fetchStats = useCallback(async () => {
        try {
            const result = await getNotificationStatsAction()
            
            if (result.success && result.data) {
                setStats(result.data)
                return result.data
            } else {
                throw new Error(result.error || "Failed to fetch notification stats")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred")
            return stats
        }
    }, [stats])

    // Initialize socket and subscribe to events
    useEffect(() => {
        if (!userId) return

        // Initialize socket
        initializeSocket(userId)

        // Subscribe to notification events
        const unsubscribeNew = subscribeToNotifications((notification) => {
            setNotifications((prev) => [notification, ...prev])
            fetchStats()
        })

        const unsubscribeRead = subscribeToNotificationRead((notificationId) => {
            setNotifications((prev) => 
                prev.map((n) => 
                    n.id === notificationId ? { ...n, read: true } : n
                )
            )
            fetchStats()
        })

        const unsubscribeDeleted = subscribeToNotificationDeleted((notificationId) => {
            setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
            fetchStats()
        })

        const unsubscribeAllRead = subscribeToAllNotificationsRead(() => {
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
            fetchStats()
        })

        // Initial fetch
        fetchNotifications({ page: 1, perPage: 20 })
        fetchStats()

        // Cleanup
        return () => {
            unsubscribeNew()
            unsubscribeRead()
            unsubscribeDeleted()
            unsubscribeAllRead()
            closeSocket()
        }
    }, [userId, fetchNotifications, fetchStats])

    return {
        notifications,
        stats,
        loading,
        error,
        fetchNotifications,
        fetchStats
    }
} 