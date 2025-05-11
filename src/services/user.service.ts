import { PasswordFormData, ProfileFormData } from "@/features/space/profile/types"
import { AccountRepository } from "@/repository/account.repository"
import { UserRepository } from "@/repository/user.repository"
import bcrypt from "bcryptjs"
import { User } from "@prisma/client"
import { paramsSchema, ParamsSchemaFormValues } from "@/schemas/index.schema"

export class UserService {

    static async updatePassword(userId: string, data: PasswordFormData) {
        const account = await AccountRepository.findAccountByUserId(userId)

        if (!account) {
            return { success: false, message: "Account not found !" }
        }

        if (!account.password) {
            return { success: false, message: "No password set for this account !" }
        }

        const isPasswordCorrect = await bcrypt.compare(data.currentPassword, account.password)

        if (!isPasswordCorrect) {
            return { success: false, message: "Current password is incorrect !" }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.newPassword, salt);
        const result = await AccountRepository.updatePassword(account.id, hashedPassword)

        if (!result) {
            return { success: false, message: "Failed to update password !" }
        }

        return { success: true, message: "Password updated successfully !" }
    }

    static async updateProfile(userId: string, data: ProfileFormData) {
        const result = await UserRepository.updateUser(userId, {
            name: data.name,
            goals: data.goals,
            gender: data.gender,
        })

        if (!result) {
            return { success: false, message: "Failed to update profile !" }
        }

        return { success: true, message: "Profile updated successfully !" }
    }

    static async getUsersWithPagination(params: ParamsSchemaFormValues) {
        try {
            const validatedParams = paramsSchema.parse(params)

            const result = await UserRepository.getUsersWithPagination(validatedParams)

            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Error fetching users:", error)
            return {
                success: false,
                error: "Failed to fetch users"
            }
        }
    }

    static async deleteUser(userId: string) {
        try {
            const result = await UserRepository.deleteUser(userId)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Error deleting user:", error)
            return {
                success: false,
                error: "Failed to delete user"
            }
        }
    }

    static async updateUser(userId: string, data: Partial<User>) {
        try {
            const result = await UserRepository.updateUser(userId, data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Error updating user:", error)
            return {
                success: false,
                error: "Failed to update user"
            }
        }
    }
}

