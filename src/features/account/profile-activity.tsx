"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar, Clock, LogIn, FileEdit, UserCog, ShieldCheck, Loader2 } from "lucide-react"

type ActivityItem = {
  id: string
  type: "login" | "update" | "security" | "appointment" | "prescription"
  description: string
  timestamp: Date
  details?: string
  ip?: string
}

type ProfileActivityProps = {
  userId: string
}

export function ProfileActivity({ userId }: ProfileActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data fetch
    const fetchActivities = async () => {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock data
      const mockActivities: ActivityItem[] = [
        {
          id: "1",
          type: "login",
          description: "Connexion réussie",
          timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
          ip: "192.168.1.1",
        },
        {
          id: "2",
          type: "update",
          description: "Mise à jour du profil",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          details: "Numéro de téléphone mis à jour",
        },
        {
          id: "3",
          type: "security",
          description: "Mot de passe modifié",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        },
        {
          id: "4",
          type: "appointment",
          description: "Rendez-vous planifié",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
          details: "Consultation avec Dr. Martin",
        },
        {
          id: "5",
          type: "prescription",
          description: "Nouvelle prescription",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
          details: "Prescription pour traitement d'hypertension",
        },
      ]

      setActivities(mockActivities)
      setIsLoading(false)
    }

    fetchActivities()
  }, [userId])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <LogIn className="h-5 w-5 text-blue-500" />
      case "update":
        return <FileEdit className="h-5 w-5 text-green-500" />
      case "security":
        return <ShieldCheck className="h-5 w-5 text-purple-500" />
      case "appointment":
        return <Calendar className="h-5 w-5 text-orange-500" />
      case "prescription":
        return <UserCog className="h-5 w-5 text-red-500" />
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div>
      <div className="border-b px-6 py-5">
        <h3 className="text-lg font-medium">Activité Récente</h3>
        <p className="text-sm text-muted-foreground">Historique de vos activités récentes sur la plateforme</p>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Chargement de l'activité...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {activities.map((activity) => (
              <div key={activity.id} className="relative pl-8">
                <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  {getActivityIcon(activity.type)}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    {activity.details && <p className="text-sm text-muted-foreground">{activity.details}</p>}
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground sm:mt-0">
                    <Clock className="h-4 w-4" />
                    <span>{format(activity.timestamp, "PPP 'à' HH:mm", { locale: fr })}</span>
                  </div>
                </div>

                {activity.ip && <p className="mt-1 text-xs text-muted-foreground">IP: {activity.ip}</p>}

                <div className="absolute bottom-0 left-4 top-8 w-px bg-border" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
