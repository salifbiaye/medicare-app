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
import { AnimatedHeader, AnimatedLayout } from "@/components/animations/animated-layout"
import { ParticlesBackground } from "@/components/animations/particles-background"
import { toastAlert } from "@/components/ui/sonner-v2"
import { markAllAsReadAction, markAsReadAction, getUnreadCountAction, getLatestNotificationsAction } from "@/actions/notification.action"

type Notification = {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: Date
  type?: string
  priority?: string
  category?: string
  sender?: {
    id: string
    name: string
    image: string | null
  } | null
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
  const [isLoading, setIsLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Fetch notifications and settings
    fetchNotifications()
  }, [userId])

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      // Fetch unread count
      const countResponse = await getUnreadCountAction()
      // Vérifier la structure de la réponse et extraire le compte
      if (countResponse && typeof countResponse === 'object' && 'data' in countResponse) {
        setUnreadCount(countResponse.data || 0)
      } else {
        setUnreadCount(0)
      }

      // Récupérer les dernières notifications
      const notificationResponse = await getLatestNotificationsAction();
      
      if (notificationResponse?.success && notificationResponse.data) {
        // Transformer les données de l'API au format attendu par le composant
        const formattedNotifications = notificationResponse.data.map((notif: any) => ({
          id: notif.id,
          title: notif.title,
          message: notif.message,
          read: notif.read,
          createdAt: new Date(notif.createdAt),
          type: notif.type,
          priority: notif.priority,
          category: notif.category,
          sender: notif.sender
        }));
        
        setNotifications(formattedNotifications);
      } else {
        // Si l'API ne renvoie pas de données, afficher un tableau vide
        setNotifications([]);
        // Afficher une notification seulement si une erreur est retournée
        if (notificationResponse && !notificationResponse.success) {
          toastAlert.error({
            title: "Erreur de chargement",
            description: notificationResponse.error || "Impossible de charger vos notifications.",
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error)
      toastAlert.error({
        title: "Erreur de chargement",
        description: "Impossible de charger vos notifications.",
      })
      setNotifications([]);
    } finally {
      setIsLoading(false)
    }
  }

 

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await markAsReadAction(id)
      
      if (response?.success) {
        // Mettre à jour l'état local
        setNotifications(
          notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification))
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
        
        toastAlert.success({
          title: "Notification marquée comme lue",
          description: "La notification a été marquée comme lue.",
        })
      } else {
        toastAlert.error({
          title: "Erreur",
          description: response?.error || "Impossible de marquer la notification comme lue.",
        })
      }
    } catch (error) {
      console.error("Erreur lors du marquage de la notification:", error)
      toastAlert.error({
        title: "Erreur",
        description: "Impossible de marquer la notification comme lue.",
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await markAllAsReadAction()
      
      if (response?.success) {
        // Mettre à jour l'état local
        setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
        setUnreadCount(0)
        
        toastAlert.success({
          title: "Toutes lues",
          description: "Toutes les notifications ont été marquées comme lues.",
        })
      } else {
        toastAlert.error({
          title: "Erreur",
          description: response?.error || "Impossible de marquer toutes les notifications comme lues.",
        })
      }
    } catch (error) {
      console.error("Erreur lors du marquage des notifications:", error)
      toastAlert.error({
        title: "Erreur",
        description: "Impossible de marquer toutes les notifications comme lues.",
      })
    }
  }

  // Fonction pour rafraîchir les notifications
  const refreshNotifications = () => {
    fetchNotifications();
  }

  // Fonction pour obtenir la couleur de priorité
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "URGENT": return "bg-red-500";
      case "HIGH": return "bg-orange-500";
      case "MEDIUM": return "bg-amber-500";
      case "LOW": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  }

  return (
    <div className="w-full p-6">
      <AnimatedLayout>
        <ParticlesBackground />
        <AnimatedHeader>
          <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-full mr-4">
            <Bell className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl text-background dark:text-foreground font-bold mb-2">
              Notifications
            </h1>
            <p className="text-background/80 dark:text-foreground/40">
              Gérez vos préférences de notifications et consultez vos alertes
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="default" className="ml-auto bg-primary">
              {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
            </Badge>
          )}
        </AnimatedHeader>
      </AnimatedLayout>

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
            

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Notifications récentes</h3>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={refreshNotifications}>
                    Actualiser
                  </Button>
                  {notifications.length > 0 && unreadCount > 0 && (
                    <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                      Tout marquer comme lu
                    </Button>
                  )}
                </div>
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
                      {!notification.read && (
                        <div className={`absolute right-4 top-4 h-2 w-2 rounded-full ${getPriorityColor(notification.priority)}`} />
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{notification.title}</p>
                            {notification.category && (
                              <Badge variant="outline" className="text-xs">
                                {notification.category.toLowerCase()}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          {notification.sender && (
                            <p className="text-xs text-muted-foreground mt-1">
                              De: {notification.sender.name}
                            </p>
                          )}
                        </div>

                        <div className="mt-2 flex items-center gap-4 sm:mt-0">
                          <p className="text-xs text-muted-foreground">
                            {format(notification.createdAt, "PPP 'à' HH:mm", { locale: fr })}
                          </p>

                          {!notification.read && (
                            <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
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
