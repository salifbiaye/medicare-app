"use client"

import { useEffect, useState } from "react"
import type { User } from "@prisma/client"

import { Shield, Loader2, LogOut, Computer, Calendar, Clock, MapPin } from "lucide-react"

import { toastAlert } from "@/components/ui/sonner-v2"
import { DataForm } from "@/components/data-form"
import { PasswordFormValues, passwordSchema } from "@/schemas/user.schema"
import { securityFields } from "@/fields/user.field"
import { securityGroups } from "@/groups/user.groups"
import { updatePasswordAction } from "@/actions/user.action"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format, formatDistance } from "date-fns"
import { fr } from "date-fns/locale"
import { getUserSessionsAction, getCurrentSessionAction, deleteSessionAction, deleteOtherSessionsAction } from "@/actions/session.action"

interface Session {
  id: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
  expiresAt: Date
  isCurrentSession?: boolean
}

type ProfileSecurityProps = {
  onUpdateSuccess?: () => void
  onUpdateError?: () => void
}

export function ProfileSecurity({
  onUpdateSuccess,
  onUpdateError,
}: ProfileSecurityProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSessionId, setCurrentSessionId] = useState<string>("")

  const initialData = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  }

  // Chargement des sessions au montage du composant
  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    setLoading(true)
    try {
      // Récupérer la session actuelle
      const currentSessionResponse = await getCurrentSessionAction()
      if (currentSessionResponse.success && currentSessionResponse.data) {
        setCurrentSessionId(currentSessionResponse.data.id)
      }

      // Récupérer toutes les sessions
      const sessionsResponse = await getUserSessionsAction()
      if (sessionsResponse.success && sessionsResponse.data) {
        // Transformer les sessions
        const formattedSessions = sessionsResponse.data.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          expiresAt: new Date(session.expiresAt),
          isCurrentSession: session.id === (currentSessionResponse.success && currentSessionResponse.data ? currentSessionResponse.data.id : null)
        }))
        
        setSessions(formattedSessions)
      } else {
        setSessions([])
        if (!sessionsResponse.success) {
          toastAlert.error({
            title: "Erreur de chargement",
            description: sessionsResponse.error || "Impossible de charger vos sessions."
          })
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des sessions:", error)
      toastAlert.error({
        title: "Erreur de chargement",
        description: "Impossible de charger vos sessions."
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (data: PasswordFormValues) => {
    setIsUpdating(true)
    try {
      const result = await updatePasswordAction(data)

      if (result.success === false) {
        toastAlert.error({
          title: "Échec de la mise à jour",
          description: result.message || "Une erreur est survenue lors de la mise à jour de votre mot de passe.",
        })
      } else {
        toastAlert.success({
          title: "Mot de passe mis à jour",
          description: "Votre mot de passe a été mis à jour avec succès.",
        })
      }

      if (onUpdateSuccess) onUpdateSuccess()
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error)
      toastAlert.error({
        title: "Échec de la mise à jour",
        description: "Une erreur est survenue lors de la mise à jour de votre mot de passe.",
      })
      
      if (onUpdateError) onUpdateError()
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const result = await deleteSessionAction(sessionId)
      
      if (result.success) {
        toastAlert.success({
          title: "Session supprimée",
          description: "La session a été déconnectée avec succès."
        })
        // Actualiser la liste des sessions
        fetchSessions()
      } else {
        toastAlert.error({
          title: "Erreur",
          description: result.error || "Impossible de supprimer cette session."
        })
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la session:", error)
      toastAlert.error({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la session."
      })
    }
  }

  const handleDeleteOtherSessions = async () => {
    try {
      const result = await deleteOtherSessionsAction()
      
      if (result.success) {
        toastAlert.success({
          title: "Sessions déconnectées",
          description: result.data?.message || "Toutes les autres sessions ont été déconnectées."
        })
        // Actualiser la liste des sessions
        fetchSessions()
      } else {
        toastAlert.error({
          title: "Erreur",
          description: result.error || "Impossible de déconnecter les autres sessions."
        })
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion des autres sessions:", error)
      toastAlert.error({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion des autres sessions."
      })
    }
  }

  // Fonction pour extraire et formater les informations du user agent
  const formatUserAgent = (userAgent: string | null) => {
    if (!userAgent) return "Appareil inconnu"
    
    // Version simplifiée, pour une version plus avancée, utilisez des bibliothèques comme ua-parser-js
    if (userAgent.includes("Windows")) return "Windows"
    if (userAgent.includes("Mac")) return "MacOS"
    if (userAgent.includes("iPhone")) return "iPhone"
    if (userAgent.includes("iPad")) return "iPad"
    if (userAgent.includes("Android")) return "Android"
    if (userAgent.includes("Linux")) return "Linux"
    
    return "Autre appareil"
  }

  return (
    <div className="w-full p-6 space-y-6">
      <DataForm
        schema={passwordSchema}
        fields={securityFields}
        initialData={initialData}
        submitButtonText="Mettre à jour le mot de passe"
        isLoading={isUpdating}
        onSubmit={handleUpdatePassword}
        title="Sécurité"
        description="Gérez vos paramètres de sécurité et mots de passe"
        layout="standard"
        theme="modern"
        iconHeader={<Shield className="h-8 w-8 text-primary" />}
        groups={securityGroups}
        rounded="md"
        animation="fade"
      />

      <Card className="">
        <CardHeader className="pb-3 ">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Sessions actives</CardTitle>
            <Shield className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardDescription>
            Gérez vos sessions actives sur différents appareils. Vous pouvez déconnecter les sessions que vous ne reconnaissez pas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Aucune session active trouvée
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div 
                  key={session.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    session.isCurrentSession ? "bg-primary/5 border-primary/20" : ""
                  }`}
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
                        {session.isCurrentSession && (
                          <Badge variant="outline" className="text-xs">
                            Session Actuelle
                          </Badge>
                        )}
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
                    </div>
                  </div>
                  
                  {!session.isCurrentSession && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteSession(session.id)}
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Déconnecter
                    </Button>
                  )}
                </div>
              ))}

              {sessions.length > 1 && (
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleDeleteOtherSessions}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnecter toutes les autres sessions
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
