"use server"

import { AppointmentRequestService } from "@/services/appointment-request.service"
import { revalidatePath } from "next/cache"
import { RequestStatus, ServiceType } from "@prisma/client"
import { ParamsSchemaFormValues } from "@/schemas/index.schema"

export async function createAppointmentRequestAction(data: {
  description: string
  existingRecord: boolean
  patientId: string
  hospitalId: string
  serviceId?: string
  identifiedService?: ServiceType | null
}) {
  const result = await AppointmentRequestService.createAppointmentRequest(data)
  revalidatePath("/secretary/appointment-requests")
  return result
}

export async function updateAppointmentRequestStatusAction(patientId: string, status: RequestStatus) {
  try {
    const result = await AppointmentRequestService.updateAppointmentRequestStatus(patientId, status)
    revalidatePath("/doctor/appointment-requests")
    return { success: true, data: result }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error)
    return { success: false, error: "Échec de la mise à jour du statut" }
  }
}

export async function updateMultipleAppointmentRequestsStatusAction(patientIds: string[], status: RequestStatus) {
  try {
    const result = await AppointmentRequestService.updateMultipleAppointmentRequestsStatus(patientIds, status)
    revalidatePath("/doctor/appointment-requests")
    return { success: true, data: result }
  } catch (error) {
    console.error("Erreur lors de la mise à jour des statuts:", error)
    return { success: false, error: "Échec de la mise à jour des statuts" }
  }
}

export async function getAppointmentRequestsWithPaginationAction(params: ParamsSchemaFormValues) {
  return await AppointmentRequestService.getAppointmentRequestsWithPagination(params)
}

export async function getRequestStatsAction() {
  return await AppointmentRequestService.getRequestStats()
} 