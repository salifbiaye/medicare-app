"use server"

import { AppointmentService } from "@/services/appointment.service"

export async function getDoctorAppointmentsAction() {
  return await AppointmentService.getDoctorAppointments()
}

export async function getCompletedAppointmentsAction() {
  return await AppointmentService.getCompletedAppointments()
}

export async function getAppointmentByIdAction(appointmentId: string) {
  return await AppointmentService.getAppointmentById(appointmentId)
}

export async function updateAppointmentStatusAction(appointmentId: string, status: string) {
  return await AppointmentService.updateAppointmentStatus(appointmentId, status)
} 