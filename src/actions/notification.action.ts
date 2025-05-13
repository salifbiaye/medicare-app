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
    console.log("getNotificationsWithPaginationAction", params, "params")
    return await NotificationService.getNotificationsWithPagination(params)
}

export async function getUnreadCountAction() {
    return await NotificationService.getUnreadCount()
}

export async function getNotificationStatsAction() {
    return await NotificationService.getNotificationStats()
} 