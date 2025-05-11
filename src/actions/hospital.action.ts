"use server"

import { Hospital } from "@prisma/client"
import { HospitalService } from "@/services/hospital.service"
import { revalidatePath } from "next/cache"
import { ParamsSchemaFormValues } from "@/schemas/index.schema"
import { CreateHospitalFormValues } from "@/schemas/hospital.schema"

export async function createHospitalAction(data: CreateHospitalFormValues) {
    return await HospitalService.createHospital(data)
}

export async function createHospitalsAction(data: CreateHospitalFormValues[]) {
    return await HospitalService.createHospitals(data)
}

export async function getHospitalsWithPaginationAction(params: ParamsSchemaFormValues) {
    return await HospitalService.getHospitalsWithPagination(params)
}

export async function deleteHospitalAction(hospitalId: string) {
    const result = await HospitalService.deleteHospital(hospitalId)
    revalidatePath("/admin/hospitals")
    return result
}

export async function deleteMultipleHospitalsAction(hospitalIds: string[]) {
    const result = await HospitalService.deleteMultipleHospitals(hospitalIds)
    revalidatePath("/admin/hospitals")
    return result
}

export async function updateHospitalAction(hospitalId: string, data: Partial<Hospital>) {
    return await HospitalService.updateHospital(hospitalId, data)
}

export async function getHospitalStatsAction() {
    return await HospitalService.getHospitalStats()
}

export async function getLatestHospitalsAction(limit: number = 5) {
    return await HospitalService.getLatestHospitals(limit)
}

export async function getHospitalsByDateRangeAction(params: {
    startDate: Date;
    endDate: Date;
}) {
    return await HospitalService.getHospitalsByDateRange(params)
} 