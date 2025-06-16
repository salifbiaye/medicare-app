import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { CreateDirectorFormValues, DirectorImport } from "@/schemas/user.schema"
import { DirectorRepository } from "@/repository/director.repository"
import { UserRepository } from "@/repository/user.repository"

export class DirectorService {
    static async getSession() {
        const headersValue = await headers()
        return await auth.api.getSession({ headers: headersValue })
    }

    static async createDirector(data: CreateDirectorFormValues) {
        const session = await this.getSession()
        if (!session?.user) {
            throw new Error("Unauthorized")
        }

        return await DirectorRepository.createDirector(data)
    }
    static async findDirector() {
        const session = await this.getSession()
        if (!session?.user) {
            throw new Error("Unauthorized")
        }
        return await DirectorRepository.findDirector(session.user.id)
    }

    static async getDirectorHospitalId() {
        try {
            const session = await this.getSession()
            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            // Vérifier si l'utilisateur est un directeur
            const user = await UserRepository.getUserById(session.user.id)
            if (!user || user.role !== "DIRECTOR") {
                return { success: false, error: "Seuls les directeurs peuvent accéder à cette fonctionnalité" }
            }

            // Récupérer le directeur et son hôpital associé
            const director = await UserRepository.getDirectorByUserId(session.user.id)
            if (!director) {
                return { success: false, error: "Directeur non trouvé" }
            }

            return {
                success: true,
                data: director.hospitalId
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de l'hôpital du directeur:", error)
            return {
                success: false,
                error: "Échec de la récupération de l'hôpital du directeur"
            }
        }
    }

    static async importDirectors(data: DirectorImport[]) {
        const session = await this.getSession()
        if (!session?.user) {
            throw new Error("Non autorisé")
        }

        try {
            // Get existing directors
            const existingDirectors = await DirectorRepository.getAllDirectors()
            const existingEmails = new Set(existingDirectors.map(d => d.user.email))
            const existingHospitalIds = new Set(existingDirectors.map(d => d.hospitalId))

            // Vérifier les hospitalIds en double dans les données d'import et ceux qui existent déjà
            const hospitalIds = new Set<string>()
            const duplicateHospitalIds = new Set<string>()
            const existingHospitalIdsFound = new Set<string>()

            data.forEach(director => {
                // Vérifier les doublons dans les données d'import
                if (hospitalIds.has(director.hospitalId)) {
                    duplicateHospitalIds.add(director.hospitalId)
                }
                hospitalIds.add(director.hospitalId)

                // Vérifier si l'hospitalId existe déjà dans la base de données
                if (existingHospitalIds.has(director.hospitalId)) {
                    existingHospitalIdsFound.add(director.hospitalId)
                }
            })

            if (duplicateHospitalIds.size > 0) {
                return {
                    success: false,
                    message: `L'identifiant de l'hôpital doit être unique. Les identifiants suivants sont en double : ${Array.from(duplicateHospitalIds).join(', ')}`,
                    data: null
                }
            }

            if (existingHospitalIdsFound.size > 0) {
                return {
                    success: false,
                    message: `Les identifiants d'hôpital suivants sont déjà utilisés : ${Array.from(existingHospitalIdsFound).join(', ')}`,
                    data: null
                }
            }

            // Filter out directors that already exist
            const newDirectors = data.filter(director => !existingEmails.has(director.email))

            if (newDirectors.length === 0) {
                return {
                    success: true,
                    message: "Tous les directeurs existent déjà",
                    data: []
                }
            }

            if (newDirectors.length < data.length) {
                const created = await DirectorRepository.createManyDirectors(newDirectors)
                return {
                    success: true,
                    message: `${data.length - newDirectors.length} directeur(s) existe(nt) déjà, ${newDirectors.length} nouveau(x) directeur(s) créé(s)`,
                    data: created
                }
            }

            const created = await DirectorRepository.createManyDirectors(data)
            return {
                success: true,
                message: `${data.length} directeur(s) créé(s) avec succès`,
                data: created
            }
        } catch (error) {
            console.error("Erreur lors de l'import des directeurs:", error)
            throw new Error("Échec de l'import des directeurs")
        }
    }

    static async updateDirector(userId: string, data: CreateDirectorFormValues) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const result = await DirectorRepository.updateDirector(userId, data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du directeur:", error)
            return {
                success: false,
                error: "Échec de la mise à jour du directeur"
            }
        }
    }
} 