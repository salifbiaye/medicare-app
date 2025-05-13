import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { NotificationRepository } from "@/repository/notification.repository"
import { Notification, NotificationCategory, NotificationPriority, NotificationType } from "@prisma/client"
import { paramsSchema, ParamsSchemaFormValues } from "@/schemas/index.schema"

export type NotificationFilterSchema = {
    type?: string[]
    priority?: string[]
    category?: string[]
    read?: string[]
    actionRequired?: string[]
}

export class NotificationService {
    static async getSession() {
        const headersValue = await headers()
        return await auth.api.getSession({ headers: headersValue })
    }

    static async createNotification(data: {
        title: string
        message: string
        type: NotificationType
        priority?: NotificationPriority
        category: NotificationCategory
        recipientId: string
        senderId?: string
        actionRequired?: boolean
        expiresAt?: Date
    }) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const notification = await NotificationRepository.createNotification(data)
            
            return {
                success: true,
                data: notification
            }
        } catch (error) {
            console.error("Erreur lors de la création de la notification:", error)
            return {
                success: false,
                error: "Échec de la création de la notification"
            }
        }
    }

    static async markAsRead(notificationId: string) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const notification = await NotificationRepository.getNotificationById(notificationId)
            
            if (!notification) {
                return { success: false, error: "Notification non trouvée" }
            }

            if (notification.recipientId !== session.user.id) {
                return { success: false, error: "Non autorisé" }
            }

            const updatedNotification = await NotificationRepository.markAsRead(notificationId)
            
            return {
                success: true,
                data: updatedNotification
            }
        } catch (error) {
            console.error("Erreur lors du marquage de la notification comme lue:", error)
            return {
                success: false,
                error: "Échec du marquage de la notification comme lue"
            }
        }
    }

    static async markAllAsRead() {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            await NotificationRepository.markAllAsRead(session.user.id)
            
            return {
                success: true,
                message: "Toutes les notifications ont été marquées comme lues"
            }
        } catch (error) {
            console.error("Erreur lors du marquage de toutes les notifications comme lues:", error)
            return {
                success: false,
                error: "Échec du marquage de toutes les notifications comme lues"
            }
        }
    }

    static async deleteNotification(notificationId: string) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const notification = await NotificationRepository.getNotificationById(notificationId)
            
            if (!notification) {
                return { success: false, error: "Notification non trouvée" }
            }

            if (notification.recipientId !== session.user.id) {
                return { success: false, error: "Non autorisé" }
            }

            await NotificationRepository.deleteNotification(notificationId)
            
            return {
                success: true,
                message: "Notification supprimée avec succès"
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de la notification:", error)
            return {
                success: false,
                error: "Échec de la suppression de la notification"
            }
        }
    }

    static async getNotificationsWithPagination(params: ParamsSchemaFormValues) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }



            const result = await NotificationRepository.getNotificationsWithPagination({
                ...params,
                filters: params.filters as NotificationFilterSchema,
                userId: session.user.id
            })
            
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des notifications:", error)
            return {
                success: false,
                error: "Échec de la récupération des notifications"
            }
        }
    }

    static async getUnreadCount() {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const count = await NotificationRepository.getUnreadCount(session.user.id)
            
            return {
                success: true,
                data: count
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du nombre de notifications non lues:", error)
            return {
                success: false,
                error: "Échec de la récupération du nombre de notifications non lues"
            }
        }
    }

    static async getNotificationStats() {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const stats = await NotificationRepository.getNotificationStats(session.user.id)
            
            return {
                success: true,
                data: stats
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des statistiques des notifications:", error)
            return {
                success: false,
                error: "Échec de la récupération des statistiques des notifications"
            }
        }
    }
} 