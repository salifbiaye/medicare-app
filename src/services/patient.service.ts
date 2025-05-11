import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { CreatePatientFormValues, PatientImport } from "@/schemas/user.schema"
import { PatientRepository } from "@/repository/patient.repository"

export class PatientService {
    static async getSession() {
        const headersValue = await headers()
        return await auth.api.getSession({ headers: headersValue })
    }

    static async createPatient(data: CreatePatientFormValues) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const result = await PatientRepository.createPatient(data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la création du patient:", error)
            return {
                success: false,
                error: "Échec de la création du patient"
            }
        }
    }

    static async importPatients(data: PatientImport[]) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const existingUsers = await PatientRepository.getAllPatients()
            const existingEmails = existingUsers.map(user => user.user.email)
            const existingEmailSet = new Set(existingEmails)
            const newPatients = data.filter(patient => !existingEmailSet.has(patient.email))

            if (newPatients.length !== data.length) {
                const existingCount = data.length - newPatients.length
                const plural = existingCount > 1 ? 's' : ''

                if (newPatients.length === 0) {
                    return {
                        success: false,
                        message: `Tous les patients existent déjà !`
                    }
                }

                return {
                    success: "partial" as const,
                    message: `${existingCount} patient${plural} existe${plural} déjà, création des autres en cours...`,
                    data: {
                        total: data.length,
                        existing: existingCount,
                        toCreate: newPatients.length
                    }
                }
            }

            const result = await PatientRepository.createManyPatients(data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de l'import des patients:", error)
            return {
                success: false,
                error: "Échec de l'import des patients"
            }
        }
    }
} 