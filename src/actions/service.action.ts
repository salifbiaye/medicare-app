"use server"

import { Service } from "@prisma/client"
import { ServiceService } from "@/services/service.service"
import { revalidatePath } from "next/cache"
import { ParamsSchemaFormValues } from "@/schemas/index.schema"
import { CreateServiceFormValues } from "@/schemas/service.schema"
import { ActionResult } from "@/lib/action-result"

export async function createServiceAction(data: CreateServiceFormValues) {
    return await ServiceService.createService(data)
}

export async function createServicesAction(data: CreateServiceFormValues[]) {
    return await ServiceService.createServices(data)
}

export async function getServicesWithPaginationAction(params: ParamsSchemaFormValues) {
    return await ServiceService.getServicesWithPagination(params)
}

export async function deleteServiceAction(serviceId: string) {
    const result = await ServiceService.deleteService(serviceId)
    revalidatePath("/director/services")
    return result
}

export async function deleteMultipleServicesAction(serviceIds: string[]) {
    const result = await ServiceService.deleteMultipleServices(serviceIds)
    revalidatePath("/director/services")
    return result
}

export async function updateServiceAction(serviceId: string, data: Partial<Service>) {
    return await ServiceService.updateService(serviceId, data)
}

export async function getAllServicesForSelectAction() {
    return await ServiceService.getAllServicesForSelect()
}

export async function getServicesByHospitalIdAction(hospitalId: string) {
    return await ServiceService.getServicesByHospitalId(hospitalId)
}

// Director dashboard actions
export async function getLatestServicesAction(limit: number = 5): Promise<ActionResult<any[]>> {
    return await ServiceService.getLatestServices(limit)
}

export async function getServicesByDateRangeAction(params: {
    startDate: Date;
    endDate: Date;
}): Promise<ActionResult<any[]>> {
    return await ServiceService.getServicesByDateRange(params)
}

export async function getServiceStatsAction(): Promise<ActionResult<any>> {
    return await ServiceService.getServiceStats()
} 