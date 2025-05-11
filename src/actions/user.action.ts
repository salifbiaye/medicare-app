"use server"

import { PasswordFormData, ProfileFormData } from "@/features/space/profile/types"
import { UserService } from "@/services/user.service"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { UserRepository } from "@/repository/user.repository"
import { User } from "@prisma/client"
import { ParamsSchemaFormValues } from "@/schemas/index.schema"

export async function updatePassword(data: PasswordFormData) {
    const headersValue = await headers()
    const session = await auth.api.getSession({ headers: headersValue })

    if (!session?.user) {
        return { success: false, message: "User not authenticated !" }
    }
    const result = await UserService.updatePassword(session.user.id, data)
    return result
}

export async function updateProfile(data: ProfileFormData) {
    const headersValue = await headers()
    const session = await auth.api.getSession({ headers: headersValue })

    if (!session?.user) {
        return { success: false, message: "User not authenticated !" }
    }
    const result = await UserService.updateProfile(session.user.id, data)

    revalidatePath("/space")
    return result
}

export async function getUsersWithPagination(params: ParamsSchemaFormValues) {
    const headersValue = await headers()
    const session = await auth.api.getSession({ headers: headersValue })

    if (!session?.user) {
        return { success: false, error: "User not authenticated" }
    }

    // Get full user data to check role
    const user = await UserRepository.getUserById(session.user.id)
    if (!user || user.role !== "ADMIN") {
        return { success: false, error: "Unauthorized" }
    }

    return await UserService.getUsersWithPagination(params)
}

export async function deleteUser(userId: string) {
    const headersValue = await headers()
    const session = await auth.api.getSession({ headers: headersValue })

    if (!session?.user) {
        return { success: false, error: "User not authenticated" }
    }

    // Get full user data to check role
    const user = await UserRepository.getUserById(session.user.id)
    if (!user || user.role !== "ADMIN") {
        return { success: false, error: "Unauthorized" }
    }

    return await UserService.deleteUser(userId)
}

export async function updateUser(userId: string, data: Partial<User>) {
    const headersValue = await headers()
    const session = await auth.api.getSession({ headers: headersValue })

    if (!session?.user) {
        return { success: false, error: "User not authenticated" }
    }

    // Get full user data to check role
    const user = await UserRepository.getUserById(session.user.id)
    if (!user || user.role !== "ADMIN") {
        return { success: false, error: "Unauthorized" }
    }

    return await UserService.updateUser(userId, data)
}

