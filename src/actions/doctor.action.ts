"use server"

import { CreateDoctorFormValues, DoctorImport } from "@/schemas/user.schema"
import { DoctorService } from "@/services/doctor.service"

export async function createDoctorAction(data: CreateDoctorFormValues) {
    return await DoctorService.createDoctor(data)
}

export async function importDoctorsAction(data: DoctorImport[]) {
    return await DoctorService.importDoctors(data)
} 