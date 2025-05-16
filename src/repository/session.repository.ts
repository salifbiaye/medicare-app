import prisma from "@/lib/prisma"

export class SessionRepository {
    /**
     * Récupère toutes les sessions d'un utilisateur
     * @param userId ID de l'utilisateur
     * @returns Les sessions de l'utilisateur
     */
    static async getUserSessions(userId: string) {
        return await prisma.session.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                ipAddress: true,
                userAgent: true,
                createdAt: true,
                expiresAt: true,
                token: false // Ne pas inclure le token pour des raisons de sécurité
            }
        })
    }

    /**
     * Récupère une session par son ID
     * @param sessionId ID de la session
     * @returns La session trouvée
     */
    static async getSessionById(sessionId: string) {
        return await prisma.session.findUnique({
            where: {
                id: sessionId
            },
            select: {
                id: true,
                userId: true,
                ipAddress: true,
                userAgent: true,
                createdAt: true,
                expiresAt: true,
                token: false // Ne pas inclure le token pour des raisons de sécurité
            }
        })
    }

    /**
     * Supprime une session par son ID
     * @param sessionId ID de la session à supprimer
     * @returns La session supprimée
     */
    static async deleteSession(sessionId: string) {
        return await prisma.session.delete({
            where: {
                id: sessionId
            }
        })
    }

    /**
     * Supprime toutes les sessions d'un utilisateur sauf la session courante
     * @param userId ID de l'utilisateur
     * @param currentSessionId ID de la session actuelle à conserver
     * @returns Nombre de sessions supprimées
     */
    static async deleteOtherSessions(userId: string, currentSessionId: string) {
        return await prisma.session.deleteMany({
            where: {
                userId,
                NOT: {
                    id: currentSessionId
                }
            }
        })
    }

    /**
     * Obtient la session actuelle d'un utilisateur par son token
     * @param token Token de session
     * @returns La session trouvée
     */
    static async getCurrentSession(token: string) {
        return await prisma.session.findUnique({
            where: {
                token
            },
            select: {
                id: true,
                userId: true,
                ipAddress: true,
                userAgent: true,
                createdAt: true,
                expiresAt: true,
                token: false // Ne pas inclure le token pour des raisons de sécurité
            }
        })
    }
} 