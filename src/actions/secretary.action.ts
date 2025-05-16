"use server"

import { CreateSecretaryFormValues, SecretaryImport } from "@/schemas/user.schema"
import { SecretaryService } from "@/services/secretary.service"
import { revalidatePath } from "next/cache"

export async function createSecretaryAction(data: CreateSecretaryFormValues) {
    return await SecretaryService.createSecretary(data)
}

export async function importSecretariesAction(data: SecretaryImport[]) {
    return await SecretaryService.importSecretaries(data)
}

export async function updateSecretaryAction(userId: string, data: CreateSecretaryFormValues) {
    const result = await SecretaryService.updateSecretary(userId, data)
    revalidatePath("/admin/users")
    return result
} 