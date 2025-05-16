"use server"

import { CreateDirectorFormValues, DirectorImport } from "@/schemas/user.schema"
import { DirectorService } from "@/services/director.service"
import { revalidatePath } from "next/cache"

export async function createDirectorAction(data: CreateDirectorFormValues) {
    return await DirectorService.createDirector(data)
}

export async function importDirectorsAction(data: DirectorImport[]) {
    return await DirectorService.importDirectors(data)
}

export async function updateDirectorAction(userId: string, data: CreateDirectorFormValues) {
    const result = await DirectorService.updateDirector(userId, data)
    revalidatePath("/admin/users")
    return result
}

export async function getDirectorHospitalIdAction() {
    return await DirectorService.getDirectorHospitalId()
} 