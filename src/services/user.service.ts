// services/user.service.ts
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

import { AccountRepository } from "@/repository/account.repository"
import { UserRepository } from "@/repository/user.repository"
import bcrypt from "bcryptjs"
import { User } from "@prisma/client"
import { paramsSchema, ParamsSchemaFormValues } from "@/schemas/index.schema"
import {CreateUserFormValues, PasswordFormValues, UserFilterSchema} from "@/schemas/user.schema"
import { ActionResult } from "@/lib/action-result"


export class UserService {

    static async getSession() {
        const headersValue = await headers()
        return await auth.api.getSession({ headers: headersValue })
    }

    static async updatePassword( data: PasswordFormValues) {
        const session = await this.getSession()

        if (!session?.user) {
            return { success: false, message: "Utilisateur non authentifié !" }
        }
        const account = await AccountRepository.findAccountByUserId(session.user.id)

        if (!account) {
            return { success: false, message: "Compte non trouvé !" }
        }

        if (!account.password) {
            return { success: false, message: "Aucun mot de passe défini pour ce compte !" }
        }

        const isPasswordCorrect = await bcrypt.compare(data.currentPassword, account.password)

        if (!isPasswordCorrect) {
            return { success: false, message: "Le mot de passe actuel est incorrect !" }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.newPassword, salt);
        const result = await AccountRepository.updatePassword(account.id, hashedPassword)

        if (!result) {
            return { success: false, message: "Échec de la mise à jour du mot de passe !" }
        }

        return { success: true, message: "Mot de passe mis à jour avec succès !" }
    }

  static async getUserCurrent() {
        const session = await this.getSession()

        if (!session?.user) {
            return { success: false, error: "Utilisateur non authentifié" }
        }


        try {
            const user = await UserRepository.getUserById(session.user.id)
            return {
                success: true,
                data: user
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur:", error)
            return {
                success: false,
                error: "Échec de la récupération de l'utilisateur"
            }
        }
  }

  static async getUserWithRelations(userId: string) {
        const session = await this.getSession()

        if (!session?.user) {
            return { success: false, error: "Utilisateur non authentifié" }
        }

        const hasAccess = await this.checkIsAdminOrDirector(session.user.id)
        if (!hasAccess) {
            return { success: false, error: "Non autorisé" }
        }

        try {
            const user = await UserRepository.getUserWithRelations(userId)
            if (!user) {
                return { success: false, error: "Utilisateur non trouvé" }
            }
            
            return {
                success: true,
                data: user
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur:", error)
            return {
                success: false,
                error: "Échec de la récupération de l'utilisateur"
            }
        }
  }

    static async getUsersWithPagination(params: ParamsSchemaFormValues) {
        const session = await this.getSession()

        if (!session?.user) {
            return { success: false, error: "Utilisateur non authentifié" }
        }

        const hasAccess = await this.checkIsAdminOrDirector(session.user.id)
        if (!hasAccess) {
            return { success: false, error: "Non autorisé" }
        }

        try {
            const validatedParams = paramsSchema.parse(params)

            const result = await UserRepository.getUsersWithPagination({
                ...validatedParams,
                filters: validatedParams.filters as UserFilterSchema
            })
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs:", error)
            return {
                success: false,
                error: "Échec de la récupération des utilisateurs"
            }
        }
    }

    static async getUsersByHospital(params: ParamsSchemaFormValues) {
        const session = await this.getSession()

        if (!session?.user) {
            return { success: false, error: "Utilisateur non authentifié" }
        }

        // Vérifier si l'utilisateur est un directeur
        const user = await UserRepository.getUserById(session.user.id)
        if (!user || user.role !== "DIRECTOR") {
            return { success: false, error: "Seuls les directeurs peuvent accéder à cette fonctionnalité" }
        }

        try {
            // Récupérer le directeur et son hôpital associé
            const director = await UserRepository.getDirectorByUserId(session.user.id)
            if (!director) {
                return { success: false, error: "Directeur non trouvé" }
            }

            const hospitalId = director.hospitalId

            const validatedParams = paramsSchema.parse(params)

            // Récupérer les utilisateurs affiliés à l'hôpital
            const result = await UserRepository.getUsersByHospital({
                ...validatedParams,
                filters: validatedParams.filters as UserFilterSchema,
                hospitalId
            })
            
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs de l'hôpital:", error)
            return {
                success: false,
                error: "Échec de la récupération des utilisateurs de l'hôpital"
            }
        }
    }

    static async createUser(data: CreateUserFormValues) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }
            const result = await UserRepository.createUser(data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur:", error)
            return {
                success: false,
                error: "Échec de la création de l'utilisateur"
            }
        }
    }
    static async createUsers(data: CreateUserFormValues[]) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }
            const existingUsers = await UserRepository.getAllUsers()
            const existingEmails = existingUsers.map(user => user.email)
            const existingEmailSet = new Set(existingEmails);
            const newUsers = data.filter(user => !existingEmailSet.has(user.email));

            // Gestion fine des messages d'erreur
            if (newUsers.length !== data.length) {
                const existingCount = data.length - newUsers.length;
                const plural = existingCount > 1 ? 's' : '';

                if (newUsers.length === 0) {
                    return {
                        success: false,
                        message: `Tous les utilisateurs existent déjà !`
                    };
                }

                return {
                    success: "partial" as const,
                    message: `${existingCount} utilisateur${plural} existe${plural} déjà, création des autres en cours...`,
                    data: {
                        total: data.length,
                        existing: existingCount,
                        toCreate: newUsers.length
                    }
                };
            }

            const result = await UserRepository.createManyUser(data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur:", error)
            return {
                success: false,
                error: "Échec de la création de l'utilisateur"
            }
        }
    }

    static async deleteUser(userId: string) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const hasAccess = await this.checkIsAdminOrDirector(session.user.id)
            if (!hasAccess) {
                return { success: false, error: "Non autorisé" }
            }
            const result = await UserRepository.deleteUser(userId)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur:", error)
            return {
                success: false,
                error: "Échec de la suppression de l'utilisateur"
            }
        }
    }

    static async deleteMultipleUsers(userIds: string[]) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            if (!userIds || userIds.length === 0) {
                return {
                    success: false,
                    error: "Aucun utilisateur à supprimer"
                }
            }

            await UserRepository.deleteManyUsers(userIds)

            return {
                success: true,
                message: `${userIds.length} utilisateur(s) supprimé(s) avec succès`,
                data: {
                    totalProcessed: userIds.length,
                    succeeded: userIds.length
                }
            }
        } catch (error) {
            console.error("Erreur lors de la suppression multiple d'utilisateurs:", error)
            return {
                success: false,
                error: error instanceof Error
                    ? error.message
                    : "Échec de la suppression des utilisateurs"
            }
        }
    }

    static async updateUser(userId: string, data: Partial<User>) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const hasAccess = await this.checkIsAdminOrDirector(session.user.id)
            if (!hasAccess) {
                return { success: false, error: "Non autorisé" }
            }
            const result = await UserRepository.updateUser(userId, data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur:", error)
            return {
                success: false,
                error: "Échec de la mise à jour de l'utilisateur"
            }
        }
    }

    static async checkIsAdminOrDirector(userId: string) {
        const user = await UserRepository.getUserById(userId)
        return user && (user.role === "ADMIN" || user.role === "DIRECTOR")
    }

    static async getUsersByDateRange(params: {
        startDate: Date;
        endDate: Date;
        page?: number;
        perPage?: number;
    }) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const hasAccess = await this.checkIsAdminOrDirector(session.user.id)
            if (!hasAccess) {
                return { success: false, error: "Non autorisé" }
            }

            const result = await UserRepository.getUsersByDateRange(params)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs par période:", error)
            return {
                success: false,
                error: "Échec de la récupération des utilisateurs"
            }
        }
    }

    static async getLatestUsers(limit: number = 10) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const hasAccess = await this.checkIsAdminOrDirector(session.user.id)
            if (!hasAccess) {
                return { success: false, error: "Non autorisé" }
            }

            const users = await UserRepository.getLatestUsers(limit)
            return {
                success: true,
                data: users
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des derniers utilisateurs:", error)
            return {
                success: false,
                error: "Échec de la récupération des utilisateurs"
            }
        }
    }

    static async getUserStats() {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, error: "Utilisateur non authentifié" }
            }

            const hasAccess = await this.checkIsAdminOrDirector(session.user.id)
            if (!hasAccess) {
                return { success: false, error: "Non autorisé" }
            }

            const stats = await UserRepository.getUserStats()
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

    // Personnel methods for director dashboard
    static async getPersonnelStats(): Promise<ActionResult<any>> {
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

            const hospitalId = director.hospitalId
            const stats = await UserRepository.getPersonnelStatsByHospital(hospitalId)
            
            return {
                success: true,
                data: stats
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des statistiques du personnel:", error)
            return {
                success: false,
                error: "Échec de la récupération des statistiques du personnel"
            }
        }
    }

    static async getPersonnelsByDateRange(params: {
        startDate: Date;
        endDate: Date;
        page?: number;
        perPage?: number;
    }): Promise<ActionResult<any>> {
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

            const hospitalId = director.hospitalId
            const result = await UserRepository.getPersonnelByDateRangeAndHospital({
                ...params,
                hospitalId
            })
            
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du personnel par période:", error)
            return {
                success: false,
                error: "Échec de la récupération du personnel"
            }
        }
    }

    static async getLatestPersonnels(limit: number = 5): Promise<ActionResult<any[]>> {
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

            const hospitalId = director.hospitalId
            const personnel = await UserRepository.getLatestPersonnelByHospital(hospitalId, limit)
            
            return {
                success: true,
                data: personnel
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des derniers membres du personnel:", error)
            return {
                success: false,
                error: "Échec de la récupération du personnel"
            }
        }
    }
}
