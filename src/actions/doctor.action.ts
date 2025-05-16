"use server"

import { CreateDoctorFormValues, DoctorImport } from "@/schemas/user.schema"
import { DoctorService } from "@/services/doctor.service"
import { revalidatePath } from "next/cache"

export async function createDoctorAction(data: CreateDoctorFormValues) {
    return await DoctorService.createDoctor(data)
}

export async function importDoctorsAction(data: DoctorImport[]) {
    return await DoctorService.importDoctors(data)
}

export async function updateDoctorAction(userId: string, data: CreateDoctorFormValues) {
    const result = await DoctorService.updateDoctor(userId, data)
    revalidatePath("/admin/users")
    return result
} 