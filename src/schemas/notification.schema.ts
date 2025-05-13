import { z } from "zod"
import { NotificationCategory, NotificationPriority, NotificationType } from "@prisma/client"

export const notificationFilterSchema = z.object({
    type: z.array(z.string()).optional(),
    priority: z.array(z.string()).optional(),
    category: z.array(z.string()).optional(),
    read: z.array(z.string()).optional(),
    actionRequired: z.array(z.string()).optional(),
})

export const createNotificationSchema = z.object({
    title: z.string().min(1, { message: "Le titre est requis" }),
    message: z.string().min(1, { message: "Le message est requis" }),
    type: z.nativeEnum(NotificationType, {
        errorMap: () => ({ message: "Type de notification invalide" }),
    }),
    priority: z.nativeEnum(NotificationPriority, {
        errorMap: () => ({ message: "Priorité invalide" }),
    }).optional(),
    category: z.nativeEnum(NotificationCategory, {
        errorMap: () => ({ message: "Catégorie invalide" }),
    }),
    recipientId: z.string().min(1, { message: "L'identifiant du destinataire est requis" }),
    senderId: z.string().optional(),
    actionRequired: z.boolean().optional(),
    expiresAt: z.date().optional(),
})

export type NotificationFilterSchema = z.infer<typeof notificationFilterSchema>
export type CreateNotificationSchema = z.infer<typeof createNotificationSchema> 