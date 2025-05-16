"use client"

import { useState, useEffect } from "react"
import { format, formatDistance } from "date-fns"
import { fr } from "date-fns/locale"
import { Shield, Loader2, LogOut, Computer, Calendar, Clock, MapPin, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getSessionsAction, deleteSessionAction } from "@/actions/session.action"
import { toast } from "@/hooks/use-toast"
import {toastAlert} from "@/components/ui/sonner-v2";

interface Session {
  id: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
  expiresAt: Date
}

interface UserSessionsManagerProps {
  userId: string
  userName: string
}

export function UserSessionsManager({ userId, userName }: UserSessionsManagerProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingSession, setDeletingSession] = useState<string | null>(null)

  useEffect(() => {
    fetchSessions()
  }, [userId])

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const response = await getSessionsAction(userId)
      
      if (response.success && response.data) {
        // Transformer les dates
        const formattedSessions = response.data.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          expiresAt: new Date(session.expiresAt)
        }))
        
        setSessions(formattedSessions)
      } else {
        setSessions([])
        
        if (!response.success) {
          toast({
            variant: "destructive",
            title: "Erreur de chargement",
            description: response.error || "Impossible de charger les sessions."
          })
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des sessions:", error)
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Impossible de charger les sessions."
      })
      setSessions([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    setDeletingSession(sessionId)
    
    try {
      const response = await deleteSessionAction(sessionId)
      
      if (response.success) {
        toastAlert.success({
          title: "Session supprimée",
          description: "La session a été déconnectée avec succès."
        })
        
        // Mettre à jour la liste des sessions
        setSessions(sessions.filter(session => session.id !== sessionId))
      } else{
        toastAlert.error({
          title: "Erreur",
          description: response.error || "Impossible de supprimer cette session."
        })
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la session:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la session."
      })
    } finally {
      setDeletingSession(null)
    }
  }

  // Fonction pour extraire et formater les informations du user agent
  const formatUserAgent = (userAgent: string | null) => {
    if (!userAgent) return "Appareil inconnu"
    
    // Extraction simplifiée, peut être améliorée avec une bibliothèque
    if (userAgent.includes("Windows")) return "Windows"
    if (userAgent.includes("Mac")) return "MacOS"
    if (userAgent.includes("iPhone")) return "iPhone"
    if (userAgent.includes("iPad")) return "iPad"
    if (userAgent.includes("Android")) return "Android"
    if (userAgent.includes("Linux")) return "Linux"
    
    return "Autre appareil"
  }

  return (
    <Card className="  w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Sessions de {userName}</CardTitle>
            <CardDescription className={"text-gray-400"}>Gérez les sessions actives de cet utilisateur</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchSessions}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Aucune session active trouvée pour cet utilisateur
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div 
                key={session.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Computer className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {formatUserAgent(session.userAgent)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{session.ipAddress || "IP inconnue"}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{format(session.createdAt, "dd/MM/yyyy")}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {formatDistance(new Date(session.createdAt), new Date(), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 text-xs">
                      <span className="text-muted-foreground">Expire : </span>
                      <span>
                        {format(session.expiresAt, "dd/MM/yyyy HH:mm", { locale: fr })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteSession(session.id)}
                  disabled={deletingSession === session.id}
                >
                  {deletingSession === session.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <LogOut className="h-4 w-4 mr-1" />
                      Déconnecter
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 