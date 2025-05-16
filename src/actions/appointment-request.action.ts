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

export async function updateAppointmentRequestStatusAction(
  requestId: string,
  status: RequestStatus,
  data?: {
    doctorId?: string
    note?: string
    serviceId?: string
  }
) {
  const result = await AppointmentRequestService.updateAppointmentRequestStatus(requestId, status, data)
  revalidatePath("/secretary/appointment-requests")
  return result
}

export async function getAppointmentRequestsWithPaginationAction(params: ParamsSchemaFormValues) {
  return await AppointmentRequestService.getAppointmentRequestsWithPagination(params)
}

export async function getRequestStatsAction() {
  return await AppointmentRequestService.getRequestStats()
} 