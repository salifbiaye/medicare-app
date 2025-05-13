"use client"

import React from "react"
import { motion } from "framer-motion"
import { Bell, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { markAllAsReadAction } from "@/actions/notification.action"
import { toast } from "sonner"

interface NotificationHeaderProps {
    unreadCount: number
}

export function NotificationHeader({ unreadCount }: NotificationHeaderProps) {


    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <div className="flex items-center text-white dark:text-muted-foreground gap-4 p-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent dark:bg-primary/10 text-primary">
                    <Bell className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                    <p className="text-muted/80 dark:text-muted-foreground">
                        {unreadCount > 0
                            ? `Vous avez ${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`
                            : "Toutes les notifications ont été lues"}
                    </p>
                </div>
            </div>


        </motion.div>
    )
} 