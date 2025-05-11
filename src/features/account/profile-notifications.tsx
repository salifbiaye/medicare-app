"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Bell, Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Notification = {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: Date
}

type NotificationSetting = {
  id: string
  name: string
  description: string
  enabled: boolean
}

type ProfileNotificationsProps = {
  userId: string
}

export function ProfileNotifications({ userId }: ProfileNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSetting[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data fetch
    const fetchNotifications = async () => {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock notifications
      const mockNotifications: Notification[] = [
        {
          id: "1",
          title: "Rappel de rendez-vous",
          message: "Vous avez un rendez-vous demain à 14h00 avec Dr. Martin",
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        },
        {
          id: "2",
          title: "Nouvelle prescription",
          message: "Une nouvelle prescription a été ajoutée à votre dossier",
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        },
        {
          id: "3",
          title: "Résultats disponibles",
          message: "Vos résultats d'analyse sont maintenant disponibles",
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        },
      ]

      // Mock settings
      const mockSettings: NotificationSetting[] = [
        {
          id: "1",
          name: "Rappels de rendez-vous",
          description: "Recevez des notifications pour vos rendez-vous à venir",
          enabled: true,
        },
        {
          id: "2",
          name: "Nouvelles prescriptions",
          description: "Soyez notifié lorsqu'une nouvelle prescription est ajoutée",
          enabled: true,
        },
        {
          id: "3",
          name: "Résultats d'analyses",
          description: "Recevez une alerte lorsque vos résultats sont disponibles",
          enabled: false,
        },
        {
          id: "4",
          name: "Activité du compte",
          description: "Notifications concernant la sécurité et l'activité de votre compte",
          enabled: true,
        },
      ]

      setNotifications(mockNotifications)
      setSettings(mockSettings)
      setIsLoading(false)
    }

    fetchNotifications()
  }, [userId])

  const toggleSetting = (id: string) => {
    setSettings(settings.map((setting) => (setting.id === id ? { ...setting, enabled: !setting.enabled } : setting)))
  }

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <div>
      <div className="border-b px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Gérez vos préférences de notifications et consultez vos alertes
            </p>
          </div>

          {unreadCount > 0 && (
            <Badge variant="default" className="bg-primary">
              {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Chargement des notifications...</p>
            </div>
          </div>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Préférences de notifications</CardTitle>
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>Configurez les types de notifications que vous souhaitez recevoir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between space-x-2">
                      <div className="flex-1">
                        <Label htmlFor={`setting-${setting.id}`} className="font-medium">
                          {setting.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                      <Switch
                        id={`setting-${setting.id}`}
                        checked={setting.enabled}
                        onCheckedChange={() => toggleSetting(setting.id)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Notifications récentes</h3>

                {notifications.length > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    Tout marquer comme lu
                  </Button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Aucune notification</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Vous n'avez pas encore reçu de notifications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`relative rounded-lg border p-4 ${
                        !notification.read ? "bg-primary/5 border-primary/20" : ""
                      }`}
                    >
                      {!notification.read && <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-primary" />}

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>

                        <div className="mt-2 flex items-center gap-4 sm:mt-0">
                          <p className="text-xs text-muted-foreground">
                            {format(notification.createdAt, "PPP 'à' HH:mm", { locale: fr })}
                          </p>

                          {!notification.read && (
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                              Marquer comme lu
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
