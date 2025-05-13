"use client"

import {
    Bell,
    Calendar,
    CheckCircle2,
    ClipboardList,
    FileText,
    HeartPulse,
    Info,
    MessageSquare,
    Pill,
    Shield,
    AlertTriangle,
    X,
} from "lucide-react"
import { ReactNode } from "react"
import { format, isToday, isYesterday, isThisWeek, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { Notification } from "@prisma/client"

// Define enums locally since they're not exported from @prisma/client
export enum NotificationType {
    INFO = "INFO",
    WARNING = "WARNING",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    MESSAGE = "MESSAGE",
    APPOINTMENT = "APPOINTMENT",
    DOCUMENT = "DOCUMENT",
    SYSTEM = "SYSTEM",
    PRESCRIPTION = "PRESCRIPTION",
    LAB = "LAB",
    VITAL = "VITAL"
}

export enum NotificationPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
}

export enum NotificationCategory {
    MEDICAL = "MEDICAL",
    ADMINISTRATIVE = "ADMINISTRATIVE",
    SYSTEM = "SYSTEM"
}

export function getNotificationIcon(type: NotificationType): ReactNode {
    switch (type) {
        case NotificationType.INFO:
            return <Info className="h-5 w-5 text-blue-500" />
        case NotificationType.WARNING:
            return <AlertTriangle className="h-5 w-5 text-amber-500" />
        case NotificationType.SUCCESS:
            return <CheckCircle2 className="h-5 w-5 text-green-500" />
        case NotificationType.ERROR:
            return <X className="h-5 w-5 text-red-500" />
        case NotificationType.MESSAGE:
            return <MessageSquare className="h-5 w-5 text-indigo-500" />
        case NotificationType.APPOINTMENT:
            return <Calendar className="h-5 w-5 text-purple-500" />
        case NotificationType.DOCUMENT:
            return <FileText className="h-5 w-5 text-cyan-500" />
        case NotificationType.SYSTEM:
            return <Shield className="h-5 w-5 text-gray-500" />
        case NotificationType.PRESCRIPTION:
            return <Pill className="h-5 w-5 text-emerald-500" />
        case NotificationType.LAB:
            return <ClipboardList className="h-5 w-5 text-amber-500" />
        case NotificationType.VITAL:
            return <HeartPulse className="h-5 w-5 text-red-500" />
        default:
            return <Bell className="h-5 w-5 text-gray-500" />
    }
}

export function formatNotificationDate(dateInput: string | Date): string {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;

    if (isToday(date)) {
        return `Aujourd'hui, ${format(date, "HH:mm", { locale: fr })}`
    } else if (isYesterday(date)) {
        return `Hier, ${format(date, "HH:mm", { locale: fr })}`
    } else if (isThisWeek(date)) {
        return format(date, "EEEE, HH:mm", { locale: fr })
    } else {
        return format(date, "d MMMM yyyy, HH:mm", { locale: fr })
    }
}

export function getPriorityColor(priority: NotificationPriority): string {
    switch (priority) {
        case NotificationPriority.LOW:
            return "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
        case NotificationPriority.MEDIUM:
            return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
        case NotificationPriority.HIGH:
            return "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400"
        case NotificationPriority.URGENT:
            return "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
        default:
            return "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    }
}

export function getBackgroundColor(type: NotificationType, read: boolean): string {
    if (read) return "bg-white/50 dark:bg-card/40"

    switch (type) {
        case NotificationType.INFO:
            return "bg-blue-50/80 dark:bg-blue-950/20"
        case NotificationType.WARNING:
            return "bg-amber-50/80 dark:bg-amber-950/20"
        case NotificationType.SUCCESS:
            return "bg-green-50/80 dark:bg-green-950/20"
        case NotificationType.ERROR:
            return "bg-red-50/80 dark:bg-red-950/20"
        case NotificationType.MESSAGE:
            return "bg-indigo-50/80 dark:bg-indigo-950/20"
        case NotificationType.APPOINTMENT:
            return "bg-purple-50/80 dark:bg-purple-950/20"
        case NotificationType.DOCUMENT:
            return "bg-cyan-50/80 dark:bg-cyan-950/20"
        case NotificationType.PRESCRIPTION:
            return "bg-emerald-50/80 dark:bg-emerald-950/20"
        case NotificationType.LAB:
            return "bg-amber-50/80 dark:bg-amber-950/20"
        case NotificationType.VITAL:
            return "bg-red-50/80 dark:bg-red-950/20"
        default:
            return "bg-white/80 dark:bg-card/60"
    }
}

export function getBorderColor(type: NotificationType, read: boolean): string {
    if (read) return "border-border/40"

    switch (type) {
        case NotificationType.INFO:
            return "border-blue-200 dark:border-blue-800/40"
        case NotificationType.WARNING:
            return "border-amber-200 dark:border-amber-800/40"
        case NotificationType.SUCCESS:
            return "border-green-200 dark:border-green-800/40"
        case NotificationType.ERROR:
            return "border-red-200 dark:border-red-800/40"
        case NotificationType.MESSAGE:
            return "border-indigo-200 dark:border-indigo-800/40"
        case NotificationType.APPOINTMENT:
            return "border-purple-200 dark:border-purple-800/40"
        case NotificationType.DOCUMENT:
            return "border-cyan-200 dark:border-cyan-800/40"
        case NotificationType.PRESCRIPTION:
            return "border-emerald-200 dark:border-emerald-800/40"
        case NotificationType.LAB:
            return "border-amber-200 dark:border-amber-800/40"
        case NotificationType.VITAL:
            return "border-red-200 dark:border-red-800/40"
        default:
            return "border-border"
    }
}

export function groupNotificationsByDate(notifications: any[]) {
    const groups: { [key: string]: any[] } = {
        today: [],
        yesterday: [],
        thisWeek: [],
        older: [],
    }

    notifications.forEach((notification) => {
        // Handle both Date objects and string dates
        const date = notification.createdAt instanceof Date 
            ? notification.createdAt 
            : typeof notification.createdAt === 'string' 
                ? parseISO(notification.createdAt) 
                : new Date();

        if (isToday(date)) {
            groups.today.push(notification)
        } else if (isYesterday(date)) {
            groups.yesterday.push(notification)
        } else if (isThisWeek(date)) {
            groups.thisWeek.push(notification)
        } else {
            groups.older.push(notification)
        }
    })

    return groups
}

export function getTranslatedPriority(priority: NotificationPriority): string {
    switch (priority) {
        case NotificationPriority.LOW:
            return "Basse"
        case NotificationPriority.MEDIUM:
            return "Moyenne"
        case NotificationPriority.HIGH:
            return "Haute"
        case NotificationPriority.URGENT:
            return "Urgente"
        default:
            return priority
    }
}

export function getTranslatedCategory(category: NotificationCategory): string {
    switch (category) {
        case NotificationCategory.MEDICAL:
            return "Médicale"
        case NotificationCategory.ADMINISTRATIVE:
            return "Administrative"
        case NotificationCategory.SYSTEM:
            return "Système"
        default:
            return category
    }
}

export function getTranslatedType(type: NotificationType): string {
    switch (type) {
        case NotificationType.INFO:
            return "Information"
        case NotificationType.WARNING:
            return "Avertissement"
        case NotificationType.SUCCESS:
            return "Succès"
        case NotificationType.ERROR:
            return "Erreur"
        case NotificationType.MESSAGE:
            return "Message"
        case NotificationType.APPOINTMENT:
            return "Rendez-vous"
        case NotificationType.DOCUMENT:
            return "Document"
        case NotificationType.PRESCRIPTION:
            return "Prescription"
        case NotificationType.LAB:
            return "Laboratoire"
        case NotificationType.VITAL:
            return "Signes vitaux"
        case NotificationType.SYSTEM:
            return "Système"
        default:
            return type
    }
} 