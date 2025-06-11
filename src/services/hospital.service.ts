import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { Hospital } from "@prisma/client"
import { HospitalRepository } from "@/repository/hospital.repository"
import { paramsSchema, ParamsSchemaFormValues } from "@/schemas/index.schema"
import { CreateHospitalFormValues, HospitalFilterSchema } from "@/schemas/hospital.schema"

export class HospitalService {
    static async getSession() {
        const headersValue = await headers()
        return await auth.api.getSession({ headers: headersValue })
    }

    static async createHospital(data: CreateHospitalFormValues) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const isAdmin = await this.checkUserIsAdmin(session.user.id)
            if (!isAdmin) {
                return { success: false, error: "Non autorisé" }
            }

            const result = await HospitalRepository.createHospital(data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la création de l'hôpital:", error)
            return {
                success: false,
                error: "Échec de la création de l'hôpital"
            }
        }
    }

    static async createHospitals(data: CreateHospitalFormValues[]) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const isAdmin = await this.checkUserIsAdmin(session.user.id)
            if (!isAdmin) {
                return { success: false, error: "Non autorisé" }
            }

            const existingHospitals = await HospitalRepository.getAllHospitals()
            const existingEmails = existingHospitals.map(hospital => hospital.email)
            const existingEmailSet = new Set(existingEmails)
            const newHospitals = data.filter(hospital => !existingEmailSet.has(hospital.email))

            if (newHospitals.length !== data.length) {
                const existingCount = data.length - newHospitals.length
                const plural = existingCount > 1 ? 's' : ''

                if (newHospitals.length === 0) {
                    return {
                        success: false,
                        message: `Tous les hôpitaux existent déjà !`
                    }
                }

                return {
                    success: "partial" as const,
                    message: `${existingCount} hôpital${plural} existe${plural} déjà, création des autres en cours...`,
                    data: {
                        total: data.length,
                        existing: existingCount,
                        toCreate: newHospitals.length
                    }
                }
            }

            const result = await HospitalRepository.createManyHospitals(data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la création des hôpitaux:", error)
            return {
                success: false,
                error: "Échec de la création des hôpitaux"
            }
        }
    }

    static async getHospitalsWithPagination(params: ParamsSchemaFormValues) {
        const session = await this.getSession()

        if (!session?.user) {
            return { success: false, error: "Utilisateur non authentifié" }
        }



        try {
            const validatedParams = paramsSchema.parse(params)
            const result = await HospitalRepository.getHospitalsWithPagination({
                ...validatedParams,
                filters: validatedParams.filters as HospitalFilterSchema
            })

            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des hôpitaux:", error)
            return {
                success: false,
                error: "Échec de la récupération des hôpitaux"
            }
        }
    }

    static async deleteHospital(hospitalId: string) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const isAdmin = await this.checkUserIsAdmin(session.user.id)
            if (!isAdmin) {
                return { success: false, error: "Non autorisé" }
            }

            const result = await HospitalRepository.deleteHospital(hospitalId)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de l'hôpital:", error)
            return {
                success: false,
                error: "Échec de la suppression de l'hôpital"
            }
        }
    }

    static async deleteMultipleHospitals(hospitalIds: string[]) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            if (!hospitalIds || hospitalIds.length === 0) {
                return {
                    success: false,
                    error: "Aucun hôpital à supprimer"
                }
            }

            await HospitalRepository.deleteManyHospitals(hospitalIds)

            return {
                success: true,
                message: `${hospitalIds.length} hôpital(aux) supprimé(s) avec succès`,
                data: {
                    totalProcessed: hospitalIds.length,
                    succeeded: hospitalIds.length
                }
            }
        } catch (error) {
            console.error("Erreur lors de la suppression multiple d'hôpitaux:", error)
            return {
                success: false,
                error: error instanceof Error
                    ? error.message
                    : "Échec de la suppression des hôpitaux"
            }
        }
    }

    static async updateHospital(hospitalId: string, data: Partial<Hospital>) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const isAdmin = await this.checkUserIsAdmin(session.user.id)
            if (!isAdmin) {
                return { success: false, error: "Non autorisé" }
            }

            const result = await HospitalRepository.updateHospital(hospitalId, data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'hôpital:", error)
            return {
                success: false,
                error: "Échec de la mise à jour de l'hôpital"
            }
        }
    }

    static async checkUserIsAdmin(userId: string) {
        const user = await HospitalRepository.getUserById(userId)
        return user && user.role === "ADMIN"
    }

    static async getHospitalStats() {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const isAdmin = await this.checkUserIsAdmin(session.user.id)
            if (!isAdmin) {
                return { success: false, error: "Non autorisé" }
            }

            const stats = await HospitalRepository.getHospitalStats()
            return {
                success: true,
                data: stats
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des statistiques:", error)
            return {
                success: false,
                error: "Échec de la récupération des statistiques"
            }
        }
    }

    static async getLatestHospitals(limit: number = 5) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const isAdmin = await this.checkUserIsAdmin(session.user.id)
            if (!isAdmin) {
                return { success: false, error: "Non autorisé" }
            }

            const hospitals = await HospitalRepository.getLatestHospitals(limit)
            return {
                success: true,
                data: hospitals
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des derniers hôpitaux:", error)
            return {
                success: false,
                error: "Échec de la récupération des hôpitaux"
            }
        }
    }

    static async getHospitalsByDateRange(params: {
        startDate: Date;
        endDate: Date;
    }) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const isAdmin = await this.checkUserIsAdmin(session.user.id)
            if (!isAdmin) {
                return { success: false, error: "Non autorisé" }
            }

            const hospitals = await HospitalRepository.getHospitalsByDateRange(params)
            return {
                success: true,
                data: hospitals
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des hôpitaux par période:", error)
            return {
                success: false,
                error: "Échec de la récupération des hôpitaux"
            }
        }
    }

    static async getAllHospitalsForSelect() {
        try {
            // Pas besoin de vérifier l'authentification ici car cette méthode est utilisée
            // pour remplir des listes déroulantes dans les formulaires accessibles aux utilisateurs
            const hospitals = await HospitalRepository.getAllHospitals()
            
            // Formatter les données pour les listes déroulantes
            const formattedHospitals = hospitals.map(hospital => ({
                value: hospital.id,
                label: hospital.name
            }))
            
            return {
                success: true,
                data: formattedHospitals
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des hôpitaux pour la liste:", error)
            return {
                success: false,
                error: "Échec de la récupération des hôpitaux"
            }
        }
    }

    static async getHospitalById(id: string) {
        try {
            const hospital = await HospitalRepository.getHospitalById(id)
            if (!hospital) {
                return {
                    success: false,
                    error: "Hôpital non trouvé"
                }
            }
            
            return {
                success: true,
                data: hospital
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de l'hôpital:", error)
            return {
                success: false,
                error: "Échec de la récupération de l'hôpital"
            }
        }
    }
} 