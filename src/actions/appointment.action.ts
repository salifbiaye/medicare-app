"use server"

import { AppointmentService } from "@/services/appointment.service"
import { revalidatePath } from "next/cache"

export async function getDoctorAppointmentsAction() {
  const result = await AppointmentService.getDoctorAppointments()
  return result
}

export async function getPatientAppointmentsAction(patientId: string) {
  const result = await AppointmentService.getPatientAppointments(patientId)

  return result
}

export async function getAppointmentByIdAction(appointmentId: string) {
  return await AppointmentService.getAppointmentById(appointmentId)
}

export async function getPatientsAction() {
  return await AppointmentService.getPatients()
}

export async function createAppointmentAction(data: {
  patientId: string
  date: string
  status: string
  notes?: string
  id?: string
}) {
  const result = await AppointmentService.createAppointment(data)
  revalidatePath("/doctor/appointment")
  return result
}

export async function deleteAppointmentAction(id: string) {
  const result = await AppointmentService.deleteAppointment(id)
  revalidatePath("/doctor/appointment")
  return result
}

export async function getCompletedAppointmentsAction() {
  return await AppointmentService.getCompletedAppointments()
}

export async function updateAppointmentStatusAction(appointmentId: string, status: string) {
  const result = await AppointmentService.updateAppointmentStatus(appointmentId, status)
  revalidatePath("/doctor/appointment")
  return result
} 