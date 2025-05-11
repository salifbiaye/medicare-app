"use server"

import { CreateDirectorFormValues, DirectorImport } from "@/schemas/user.schema"
import { DirectorService } from "@/services/director.service"

export async function createDirectorAction(data: CreateDirectorFormValues) {
    return await DirectorService.createDirector(data)
}

export async function importDirectorsAction(data: DirectorImport[]) {
    return await DirectorService.importDirectors(data)
} 