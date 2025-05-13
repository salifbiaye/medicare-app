import prisma from "@/lib/prisma"
import { Notification, NotificationCategory, NotificationPriority, NotificationType } from "@prisma/client"

export class NotificationRepository {
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
        return await prisma.notification.create({
            data: {
                title: data.title,
                message: data.message,
                type: data.type,
                priority: data.priority || "LOW",
                category: data.category,
                recipientId: data.recipientId,
                senderId: data.senderId,
                actionRequired: data.actionRequired || false,
                expiresAt: data.expiresAt,
            },
            include: {
                recipient: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        })
    }

    static async updateNotification(id: string, data: Partial<Notification>) {
        return await prisma.notification.update({
            where: { id },
            data,
            include: {
                recipient: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        })
    }

    static async markAsRead(id: string) {
        return await prisma.notification.update({
            where: { id },
            data: { read: true },
        })
    }

    static async markAllAsRead(userId: string) {
        return await prisma.notification.updateMany({
            where: { 
                recipientId: userId,
                read: false
            },
            data: { read: true },
        })
    }

    static async deleteNotification(id: string) {
        return await prisma.notification.delete({
            where: { id },
        })
    }

    static async getNotificationById(id: string) {
        return await prisma.notification.findUnique({
            where: { id },
            include: {
                recipient: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        })
    }

    static async getNotificationsWithPagination(params: {
        page: number
        perPage: number
        sort?: string
        search?: string
        filters?: {
            type?: string[]
            priority?: string[]
            category?: string[]
            read?: string[]
            actionRequired?: string[]
        }
        userId: string
    }) {
        const { page, perPage, sort, search, filters, userId } = params
        const skip = (page - 1) * perPage

        // Build where clause
        const where: any = {
            recipientId: userId
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { message: { contains: search, mode: "insensitive" } },
            ]
        }

        if (filters?.type?.length) {
            where.type = { in: filters.type }
        }

        if (filters?.priority?.length) {
            where.priority = { in: filters.priority }
        }

        if (filters?.category?.length) {
            const categories = filters.category.map(c => c.toUpperCase());
            where.category = { in: categories };
        }

        if (filters?.read?.length) {
            const booleanValues = filters.read.map(v => v === "true")
            // If both true and false are selected, don't apply the filter
            if (!(booleanValues.includes(true) && booleanValues.includes(false))) {
                where.read = booleanValues[0]
            }
        }

        if (filters?.actionRequired?.length) {
            const booleanValues = filters.actionRequired.map(v => v === "true")
            // If both true and false are selected, don't apply the filter
            if (!(booleanValues.includes(true) && booleanValues.includes(false))) {
                where.actionRequired = booleanValues[0]
            }
        }

        // Build orderBy
        let orderBy: any = { createdAt: "desc" }
        if (sort) {
            const [column, order] = sort.split(".")
            orderBy = { [column]: order }
        }

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                orderBy,
                skip,
                take: perPage,
                include: {
                    sender: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
            }),
            prisma.notification.count({ where }),
        ])

        return { notifications, total }
    }

    static async getUnreadCount(userId: string) {
        return await prisma.notification.count({
            where: {
                recipientId: userId,
                read: false,
            },
        })
    }

    static async getNotificationStats(userId: string) {
        const [
            total,
            unread,
            medical,
            administrative,
            system,
            highPriority,
            actionRequired
        ] = await Promise.all([
            prisma.notification.count({ where: { recipientId: userId } }),
            prisma.notification.count({ where: { recipientId: userId, read: false } }),
            prisma.notification.count({ where: { recipientId: userId, category: "MEDICAL" } }),
            prisma.notification.count({ where: { recipientId: userId, category: "ADMINISTRATIVE" } }),
            prisma.notification.count({ where: { recipientId: userId, category: "SYSTEM" } }),
            prisma.notification.count({ where: { recipientId: userId, priority: { in: ["HIGH", "URGENT"] } } }),
            prisma.notification.count({ where: { recipientId: userId, actionRequired: true } })
        ])

        return {
            total,
            unread,
            medical,
            administrative,
            system,
            highPriority,
            actionRequired
        }
    }
} 