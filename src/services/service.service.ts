import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { Service } from "@prisma/client"
import { ServiceRepository } from "@/repository/service.repository"
import { paramsSchema, ParamsSchemaFormValues } from "@/schemas/index.schema"
import { CreateServiceFormValues, ServiceFilterSchema } from "@/schemas/service.schema"

export class ServiceService {
    static async getSession() {
        const headersValue = await headers()
        return await auth.api.getSession({ headers: headersValue })
    }

    static async createService(data: CreateServiceFormValues) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const isDirector = await this.checkUserIsDirector(session.user.id)
            if (!isDirector) {
                return { success: false, error: "Non autorisé" }
            }

            const result = await ServiceRepository.createService(data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la création du service:", error)
            return {
                success: false,
                error: "Échec de la création du service"
            }
        }
    }

    static async createServices(data: CreateServiceFormValues[]) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const isDirector = await this.checkUserIsDirector(session.user.id)
            if (!isDirector) {
                return { success: false, error: "Non autorisé" }
            }

            const result = await ServiceRepository.createManyServices(data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la création des services:", error)
            return {
                success: false,
                error: "Échec de la création des services"
            }
        }
    }

    static async getServicesWithPagination(params: ParamsSchemaFormValues) {
        const session = await this.getSession()

        if (!session?.user) {
            return { success: false, error: "Utilisateur non authentifié" }
        }

        const isDirector = await this.checkUserIsDirector(session.user.id)
        if (!isDirector) {
            return { success: false, error: "Non autorisé" }
        }

        try {
            // Récupérer l'hôpital du directeur
            const director = await ServiceRepository.getDirectorByUserId(session.user.id)
            if (!director?.hospitalId) {
                return { success: false, error: "Aucun hôpital associé au directeur" }
            }

            // Ajouter l'hospitalId aux filtres
            const filters = {
                ...(params.filters as ServiceFilterSchema || {}),
                hospitalId: [director.hospitalId]
            }

            const result = await ServiceRepository.getServicesWithPagination({
                ...params,
                filters
            })

            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des services:", error)
            return {
                success: false,
                error: "Échec de la récupération des services"
            }
        }
    }

    static async deleteService(serviceId: string) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const isDirector = await this.checkUserIsDirector(session.user.id)
            if (!isDirector) {
                return { success: false, error: "Non autorisé" }
            }

            const result = await ServiceRepository.deleteService(serviceId)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la suppression du service:", error)
            return {
                success: false,
                error: "Échec de la suppression du service"
            }
        }
    }

    static async deleteMultipleServices(serviceIds: string[]) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            if (!serviceIds || serviceIds.length === 0) {
                return {
                    success: false,
                    error: "Aucun service à supprimer"
                }
            }

            // Récupérer l'hôpital du directeur
            const director = await ServiceRepository.getDirectorByUserId(session.user.id)
            if (!director?.hospitalId) {
                return { success: false, error: "Aucun hôpital associé au directeur" }
            }

            // Vérifier que tous les services appartiennent à l'hôpital du directeur
            const services = await ServiceRepository.getServicesByIds(serviceIds)
            const unauthorizedServices = services.filter((service: Service) => service.hospitalId !== director.hospitalId)
            
            if (unauthorizedServices.length > 0) {
                return {
                    success: false,
                    error: "Certains services n'appartiennent pas à votre hôpital"
                }
            }

            await ServiceRepository.deleteManyServices(serviceIds)

            return {
                success: true,
                message: `${serviceIds.length} service(s) supprimé(s) avec succès`,
                data: {
                    totalProcessed: serviceIds.length,
                    succeeded: serviceIds.length
                }
            }
        } catch (error) {
            console.error("Erreur lors de la suppression multiple de services:", error)
            return {
                success: false,
                error: error instanceof Error
                    ? error.message
                    : "Échec de la suppression des services"
            }
        }
    }

    static async updateService(serviceId: string, data: Partial<Service>) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const isDirector = await this.checkUserIsDirector(session.user.id)
            if (!isDirector) {
                return { success: false, error: "Non autorisé" }
            }

            const result = await ServiceRepository.updateService(serviceId, data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du service:", error)
            return {
                success: false,
                error: "Échec de la mise à jour du service"
            }
        }
    }

    static async checkUserIsDirector(userId: string) {
        const user = await ServiceRepository.getUserById(userId)
        return user && (user.role === "DIRECTOR" || user.role === "ADMIN")
    }

    static async getServiceStats() {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const isDirector = await this.checkUserIsDirector(session.user.id)
            if (!isDirector) {
                return { success: false, error: "Non autorisé" }
            }

            // Récupérer l'hôpital du directeur
            const director = await ServiceRepository.getDirectorByUserId(session.user.id)
            if (!director?.hospitalId) {
                return { success: false, error: "Aucun hôpital associé au directeur" }
            }

            const stats = await ServiceRepository.getServiceStats(director.hospitalId)
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

    static async getLatestServices(limit: number = 5) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const isDirector = await this.checkUserIsDirector(session.user.id)
            if (!isDirector) {
                return { success: false, error: "Non autorisé" }
            }

            // Récupérer l'hôpital du directeur
            const director = await ServiceRepository.getDirectorByUserId(session.user.id)
            if (!director?.hospitalId) {
                return { success: false, error: "Aucun hôpital associé au directeur" }
            }

            const services = await ServiceRepository.getLatestServices(limit, director.hospitalId)
            return {
                success: true,
                data: services
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des derniers services:", error)
            return {
                success: false,
                error: "Échec de la récupération des services"
            }
        }
    }

    static async getServicesByDateRange(params: {
        startDate: Date;
        endDate: Date;
    }) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const isDirector = await this.checkUserIsDirector(session.user.id)
            if (!isDirector) {
                return { success: false, error: "Non autorisé" }
            }

            // Récupérer l'hôpital du directeur
            const director = await ServiceRepository.getDirectorByUserId(session.user.id)
            if (!director?.hospitalId) {
                return { success: false, error: "Aucun hôpital associé au directeur" }
            }

            const services = await ServiceRepository.getServicesByDateRange({
                ...params,
                hospitalId: director.hospitalId
            })
            return {
                success: true,
                data: services
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des services par période:", error)
            return {
                success: false,
                error: "Échec de la récupération des services"
            }
        }
    }

    static async getAllServicesForSelect() {
        try {
            // Pas besoin de vérifier l'authentification ici car cette méthode est utilisée
            // pour remplir des listes déroulantes dans les formulaires accessibles aux utilisateurs
            const services = await ServiceRepository.getAllServices()
            
            // Formatter les données pour les listes déroulantes
            const formattedServices = services.map(service => ({
                value: service.id,
                label: service.name || service.type
            }))
            
            return {
                success: true,
                data: formattedServices
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des services pour la liste:", error)
            return {
                success: false,
                error: "Échec de la récupération des services"
            }
        }
    }

    static async getServicesByHospitalId(hospitalId: string) {
        try {
            const services = await ServiceRepository.getServicesByHospitalId(hospitalId)
            
            // Formatter les données pour les listes déroulantes
            const formattedServices = services.map(service => ({
                value: service.id,
                label: service.name || service.type
            }))
            
            return {
                success: true,
                data: formattedServices
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des services de l'hôpital:", error)
            return {
                success: false,
                error: "Échec de la récupération des services de l'hôpital"
            }
        }
    }
} 