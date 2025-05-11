import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { CreateSecretaryFormValues, SecretaryImport } from "@/schemas/user.schema"
import { SecretaryRepository } from "@/repository/secretary.repository"

export class SecretaryService {
    static async getSession() {
        const headersValue = await headers()
        return await auth.api.getSession({ headers: headersValue })
    }

    static async createSecretary(data: CreateSecretaryFormValues) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const result = await SecretaryRepository.createSecretary(data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la création de la secrétaire:", error)
            return {
                success: false,
                error: "Échec de la création de la secrétaire"
            }
        }
    }

    static async importSecretaries(data: SecretaryImport[]) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const existingUsers = await SecretaryRepository.getAllSecretaries()
            const existingEmails = existingUsers.map(user => user.user.email)
            const existingEmailSet = new Set(existingEmails)
            const newSecretaries = data.filter(secretary => !existingEmailSet.has(secretary.email))

            if (newSecretaries.length !== data.length) {
                const existingCount = data.length - newSecretaries.length
                const plural = existingCount > 1 ? 's' : ''

                if (newSecretaries.length === 0) {
                    return {
                        success: false,
                        message: `Toutes les secrétaires existent déjà !`
                    }
                }

                return {
                    success: "partial" as const,
                    message: `${existingCount} secrétaire${plural} existe${plural} déjà, création des autres en cours...`,
                    data: {
                        total: data.length,
                        existing: existingCount,
                        toCreate: newSecretaries.length
                    }
                }
            }

            const result = await SecretaryRepository.createManySecretaries(data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de l'import des secrétaires:", error)
            return {
                success: false,
                error: "Échec de l'import des secrétaires"
            }
        }
    }
} 