"use server"

import { NotificationService } from "@/services/notification.service"
import { revalidatePath } from "next/cache"
import { NotificationCategory, NotificationPriority, NotificationType } from "@prisma/client"
import { ParamsSchemaFormValues } from "@/schemas/index.schema"

export async function createNotificationAction(data: {
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
    const result = await NotificationService.createNotification(data)
    revalidatePath("/notifications")
    return result
}

export async function markAsReadAction(notificationId: string) {
    const result = await NotificationService.markAsRead(notificationId)
    revalidatePath("/notifications")
    return result
}

export async function markAllAsReadAction() {
    const result = await NotificationService.markAllAsRead()
    revalidatePath("/notifications")
    return result
}

export async function deleteNotificationAction(notificationId: string) {
    const result = await NotificationService.deleteNotification(notificationId)
    revalidatePath("/notifications")
    return result
}

export async function getNotificationsWithPaginationAction(params: ParamsSchemaFormValues) {

    return await NotificationService.getNotificationsWithPagination(params)
}

export async function getUnreadCountAction() {
    return await NotificationService.getUnreadCount()
}

export async function getNotificationStatsAction() {
    return await NotificationService.getNotificationStats()
}

/**
 * Récupère les 5 dernières notifications de l'utilisateur connecté
 * @returns Les 5 dernières notifications
 */
export async function getLatestNotificationsAction() {
    return await NotificationService.getLatestNotifications(5)
}

/**
 * Créé une notification pour un utilisateur spécifique concernant une demande de rendez-vous
 * @param data Les données de la notification
 * @returns Le résultat de la création de la notification
 */
export async function createAppointmentRequestNotificationAction(data: {
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
    const result = await NotificationService.createNotification(data)
    revalidatePath("/notifications")
    return result
} 