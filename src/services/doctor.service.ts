import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { CreateDoctorFormValues, DoctorImport } from "@/schemas/user.schema"
import { DoctorRepository } from "@/repository/doctor.repository"
import {SecretaryRepository} from "@/repository/secretary.repository";

export class DoctorService {
    static async getSession() {
        const headersValue = await headers()
        return await auth.api.getSession({ headers: headersValue })
    }

    static async createDoctor(data: CreateDoctorFormValues) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const result = await DoctorRepository.createDoctor(data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la création du médecin:", error)
            return {
                success: false,
                error: "Échec de la création du médecin"
            }
        }
    }

    static async importDoctors(data: DoctorImport[]) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const existingUsers = await DoctorRepository.getAllDoctors()
            const existingEmails = existingUsers.map(user => user.user.email)
            const existingEmailSet = new Set(existingEmails)
            const newDoctors = data.filter(doctor => !existingEmailSet.has(doctor.email))

            if (newDoctors.length !== data.length) {
                const existingCount = data.length - newDoctors.length
                const plural = existingCount > 1 ? 's' : ''

                if (newDoctors.length === 0) {
                    return {
                        success: false,
                        message: `Tous les médecins existent déjà !`
                    }
                }

                return {
                    success: "partial" as const,
                    message: `${existingCount} médecin${plural} existe${plural} déjà, création des autres en cours...`,
                    data: {
                        total: data.length,
                        existing: existingCount,
                        toCreate: newDoctors.length
                    }
                }
            }

            const result = await DoctorRepository.createManyDoctors(data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de l'import des médecins:", error)
            return {
                success: false,
                error: "Échec de l'import des médecins"
            }
        }
    }

    static async updateDoctor(userId: string, data: CreateDoctorFormValues) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const result = await DoctorRepository.updateDoctor(userId, data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du médecin:", error)
            return {
                success: false,
                error: "Échec de la mise à jour du médecin"
            }
        }
    }
    static async findDoctor(){
        try{
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }
            const userId = session?.user?.id

            const result = await DoctorRepository.findDoctorByUserId(userId)
            return {
                success: true,
                data: result
            }


        }catch{
            return {
                success: false,
                error: "Échec lors de la recherche d'un secrétaire"
            }
        }

    }
}