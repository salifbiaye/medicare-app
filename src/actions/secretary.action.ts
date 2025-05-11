"use server"

import { CreateSecretaryFormValues, SecretaryImport } from "@/schemas/user.schema"
import { SecretaryService } from "@/services/secretary.service"

export async function createSecretaryAction(data: CreateSecretaryFormValues) {
    return await SecretaryService.createSecretary(data)
}

export async function importSecretariesAction(data: SecretaryImport[]) {
    return await SecretaryService.importSecretaries(data)
} 