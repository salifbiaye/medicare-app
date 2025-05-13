import { io, Socket } from "socket.io-client"
import { Notification } from "@prisma/client"

let socket: Socket | null = null

export function initializeSocket(userId: string) {
    if (socket) return socket

    // Initialize socket connection
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
        auth: {
            userId,
        },
        transports: ["websocket"],
    })

    // Connection events
    socket.on("connect", () => {
        console.log("Socket connected")
        socket?.emit("join", { userId })
    })

    socket.on("disconnect", () => {
        console.log("Socket disconnected")
    })

    socket.on("error", (error) => {
        console.error("Socket error:", error)
    })

    return socket
}

export function getSocket() {
    return socket
}

export function closeSocket() {
    if (socket) {
        socket.disconnect()
        socket = null
    }
}

// Notification specific events
export function subscribeToNotifications(callback: (notification: Notification) => void) {
    if (!socket) return () => {}

    const handler = (notification: Notification) => {
        callback(notification)
    }

    socket.on("notification", handler)

    return () => {
        socket.off("notification", handler)
    }
}

export function subscribeToNotificationRead(callback: (notificationId: string) => void) {
    if (!socket) return () => {}

    const handler = (notificationId: string) => {
        callback(notificationId)
    }

    socket.on("notification_read", handler)

    return () => {
        socket.off("notification_read", handler)
    }
}

export function subscribeToNotificationDeleted(callback: (notificationId: string) => void) {
    if (!socket) return () => {}

    const handler = (notificationId: string) => {
        callback(notificationId)
    }

    socket.on("notification_deleted", handler)

    return () => {
        socket.off("notification_deleted", handler)
    }
}

export function subscribeToAllNotificationsRead(callback: (userId: string) => void) {
    if (!socket) return () => {}

    const handler = (userId: string) => {
        callback(userId)
    }

    socket.on("all_notifications_read", handler)

    return () => {
        socket.off("all_notifications_read", handler)
    }
} 