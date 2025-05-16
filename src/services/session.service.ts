import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { SessionRepository } from "@/repository/session.repository"
import { cookies } from "next/headers"
import { UserService } from "./user.service"

export class SessionService {
    static async getSession() {
        const headersValue = await headers()
        return await auth.api.getSession({ headers: headersValue })
    }

    /**
     * Récupère toutes les sessions d'un utilisateur
     * @returns Les sessions de l'utilisateur connecté
     */
    static async getUserSessions() {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const userSessions = await SessionRepository.getUserSessions(session.user.id)
            
            return {
                success: true,
                data: userSessions
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des sessions de l'utilisateur:", error)
            return {
                success: false,
                error: "Échec de la récupération des sessions de l'utilisateur"
            }
        }
    }

    /**
     * Récupère toutes les sessions d'un utilisateur spécifique par son ID
     * Réservé aux administrateurs et directeurs
     * @param userId ID de l'utilisateur dont on veut récupérer les sessions
     * @returns Les sessions de l'utilisateur
     */
    static async getSessionsByUserId(userId: string) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            // Vérifier que l'utilisateur connecté est un administrateur ou un directeur
            const hasAccess = await UserService.checkIsAdminOrDirector(session.user.id)
            if (!hasAccess) {
                return { success: false, error: "Non autorisé. Seuls les administrateurs et directeurs peuvent accéder à cette fonctionnalité." }
            }

            // Récupérer les sessions de l'utilisateur spécifié
            const userSessions = await SessionRepository.getUserSessions(userId)
            
            return {
                success: true,
                data: userSessions
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des sessions de l'utilisateur:", error)
            return {
                success: false,
                error: "Échec de la récupération des sessions de l'utilisateur"
            }
        }
    }

    /**
     * Récupère la session courante
     * @returns La session courante
     */
    static async getCurrentSession() {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            // Récupération du token de session depuis les cookies
            const cookieStore = await cookies()
            const authToken = cookieStore.get("authjs.session-token")

            if (!authToken?.value) {
                return { success: false, error: "Token de session introuvable" }
            }

            const currentSession = await SessionRepository.getCurrentSession(authToken.value)
            
            if (!currentSession) {
                return { success: false, error: "Session actuelle introuvable" }
            }

            return {
                success: true,
                data: currentSession
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de la session courante:", error)
            return {
                success: false,
                error: "Échec de la récupération de la session courante"
            }
        }
    }

    /**
     * Supprime une session spécifique
     * @param sessionId ID de la session à supprimer
     * @returns Résultat de l'opération
     */
    static async deleteSession(sessionId: string) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            // Vérifier que la session appartient bien à l'utilisateur
            const sessionToDelete = await SessionRepository.getSessionById(sessionId)
            
            if (!sessionToDelete) {
                return { success: false, error: "Session introuvable" }
            }

            // if (sessionToDelete.userId !== session.user.id) {
            //     return { success: false, error: "Vous n'êtes pas autorisé à supprimer cette session" }
            // }

            // Récupérer la session courante pour éviter de la supprimer
            const currentSession = await this.getCurrentSession()
            console.log("currentSession", currentSession)
            if (currentSession.success && currentSession.data && currentSession.data.id === sessionId) {
                return { success: false, error: "Vous ne pouvez pas supprimer votre session actuelle" }
            }

            await SessionRepository.deleteSession(sessionId)
            
            return {
                success: true,
                message: "Session supprimée avec succès"
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de la session:", error)
            return {
                success: false,
                error: "Échec de la suppression de la session"
            }
        }
    }

    /**
     * Supprime toutes les autres sessions de l'utilisateur (sauf la session courante)
     * @returns Résultat de l'opération
     */
    static async deleteOtherSessions() {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            // Récupérer la session courante
            const currentSession = await this.getCurrentSession()
            
            if (!currentSession.success || !currentSession.data) {
                return { success: false, error: "Session courante introuvable" }
            }

            const result = await SessionRepository.deleteOtherSessions(
                session.user.id,
                currentSession.data.id
            )
            
            return {
                success: true,
                data: {
                    count: result.count,
                    message: `${result.count} session(s) supprimée(s) avec succès`
                }
            }
        } catch (error) {
            console.error("Erreur lors de la suppression des autres sessions:", error)
            return {
                success: false,
                error: "Échec de la suppression des autres sessions"
            }
        }
    }
} 