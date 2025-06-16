import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { UserRepository } from "@/repository/user.repository";
import { Gender } from "@prisma/client";

export class AuthService {
    static async getSession() {
        const headersValue = await headers()
        return await auth.api.getSession({ headers: headersValue })
    }

    static async updateEmailVerified(email: string) {
        try {

            const result = await UserRepository.updateUserByEmail(email, {
                emailVerified: true,
            })

            return { success: true, data: result }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error
                    ? error.message
                    : "Échec de la vérification de l'email"
            }
        }
    }

    static async verifyEmail(email: string) {
        try {
            const user = await UserRepository.getUserByEmail(email)
            if (!user) {
                return { success: false, error: "Utilisateur non trouvé" }
            }
            if (!user.emailVerified) {
                return { success: false, error: "Email non vérifié" }
            }
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: "Échec de la vérification de l'email"
            }
        }
    }

    static async addGenderAndCompleteProfile(gender: "male" | "female") {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            // Get user to check role
            const user = await UserRepository.getUserById(session.user.id)
            if (!user) {
                return { success: false, error: "Utilisateur non trouvé" }
            }

            const result = await UserRepository.updateUser(session.user.id, {
                profileCompleted: user.role !== "PATIENT", // Only complete profile for non-patients
                gender: gender === "male" ? Gender.MALE : Gender.FEMALE
            })

            return { success: true, data: result }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error
                    ? error.message
                    : "Échec de la mise à jour du profil utilisateur. Veuillez réessayer plus tard."
            }
        }
    }
}