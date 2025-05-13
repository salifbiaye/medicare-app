"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface NotificationTabsProps {
    activeTab: string
    setActiveTab: (tab: string) => void
    totalCount: number
    unreadCount: number
    medicalCount: number
    administrativeCount: number
    systemCount: number
    children: React.ReactNode
}

export function NotificationTabs({
    activeTab,
    setActiveTab,
    totalCount,
    unreadCount,
    medicalCount,
    administrativeCount,
    systemCount,
    children,
}: NotificationTabsProps) {
    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="bg-gray-700 dark:bg-muted  grid w-full grid-cols-2 md:grid-cols-5">
                <TabsTrigger value="all" className="relative text-white data-[state=active]:bg-gray-600">
                    Toutes
                    <Badge className="ml-1.5 bg-primary/10 text-primary dark:bg-primary/20">{totalCount}</Badge>
                </TabsTrigger>
                <TabsTrigger value="unread" className="relative text-white data-[state=active]:bg-gray-600">
                    Non lues
                    <Badge className="ml-1.5 bg-primary/10 text-primary dark:bg-primary/20">{unreadCount}</Badge>
                </TabsTrigger>
                <TabsTrigger value="medical" className="relative text-white data-[state=active]:bg-gray-600">
                    Médicales
                    <Badge className="ml-1.5 bg-primary/10 text-primary dark:bg-primary/20">{medicalCount}</Badge>
                </TabsTrigger>
                <TabsTrigger value="administrative" className="relative text-white data-[state=active]:bg-gray-600">
                    Admin
                    <Badge className="ml-1.5 bg-primary/10 text-primary dark:bg-primary/20">{administrativeCount}</Badge>
                </TabsTrigger>
                <TabsTrigger value="system" className="relative text-white data-[state=active]:bg-gray-600">
                    Système
                    <Badge className="ml-1.5 bg-primary/10 text-primary dark:bg-primary/20">{systemCount}</Badge>
                </TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-6">
                {children}
            </TabsContent>
        </Tabs>
    )
} 